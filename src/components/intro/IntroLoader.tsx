"use client";

import { useEffect, useRef, useState } from "react";
import { TAGLINE } from "@/lib/site";

/**
 * The first-visit intro: "Kwic Shake" decodes out of scrambled glyphs, "Shake" shakes, the
 * tagline decodes under it behind a blinking cursor, then the panel lifts off the page.
 *
 * ── Who sees it ─────────────────────────────────────────────────────────────────────────────
 * Once per browser session, on whatever page they land on. The inline script in the root layout
 * (INTRO_BOOT_SCRIPT) runs before first paint and marks <html> `intro-seen` when the session
 * has already had it or the visitor prefers reduced motion; CSS then never paints the layer at
 * all, so a repeat visit doesn't even flash it. The check has to happen before paint, which is
 * why it isn't in a useEffect here: by the time React runs, the layer would already be on screen.
 *
 * ── Never stuck ─────────────────────────────────────────────────────────────────────────────
 * The boot script also marks <html> `intro-js`, which hands the timeline to this component. If
 * this component never runs (no JS, a failed chunk), the CSS falls back to lifting the layer on
 * its own after a moment, and a safety animation hides it at 5s whatever else happens. The page
 * underneath is fully rendered and usable throughout; the layer only covers it.
 *
 * Decorative: aria-hidden, since the page content is already there for assistive tech.
 */

/** Key in sessionStorage marking that this session has had the intro. */
export const INTRO_KEY = "ks-intro-seen";

/**
 * Runs in <head> before first paint. Kept tiny and dependency-free on purpose. A storage
 * exception (private mode, blocked cookies) counts as "not seen": the intro plays, it just
 * can't remember that it did.
 */
export const INTRO_BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("intro-js");try{if(sessionStorage.getItem("${INTRO_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("intro-seen")}catch(e){}})();`;

const GLYPHS = "01<>/\\[]{}=+*#%&$@!?_-";

// Timeline, in ms from when this component starts. The wordmark and the tagline decode together,
// both resolving by ~520ms; then "Shake" shakes (0.52s in, for 0.8s, set in globals.css), its
// swings shrinking and slowing as it settles. Partway through that settle the background breaks
// into holes: random squares blink out all over the screen, the holes widen and new ones keep
// appearing, until the page shows through everywhere. Gone in about 1.7s.
const MARK_START = 40;
const MARK_DECODE = 460;
const TAG_START = 40; // with the wordmark, not after it
const TAG_DECODE = 480;
const DISSOLVE_AT = 900; // while the shake is in its slow tail
/** The break-up runs as this many stepped rounds… */
const HOLE_STEPS = 14;
/** …this far apart: quick, but slow enough to watch the holes open, widen and merge. */
const HOLE_STEP_MS = 50;
/** When the text glitches out, relative to DISSOLVE_AT: in the last few rounds. */
const TEXT_OUT = HOLE_STEPS * HOLE_STEP_MS * 0.75;
const GONE_AT = DISSOLVE_AT + (HOLE_STEPS + 1) * HOLE_STEP_MS + 60;

/** Flash colours a square may show for one round before it drops out (or none). */
// Two brand purples (a deep one and a brighter one), and none: no green in the intro.
const FLASHES = ["#5a2f86", "#7a3fb0", null] as const;

type Tiles = { size: number; cols: number; rows: number; round: number[]; flash: number[] };

/**
 * The squares the background breaks into (about a 28th of the layer's short side, 18–40px, in
 * device pixels so edges stay crisp), and the round each one drops out in. The break-up is
 * holes, not a wave: every round a few new squares go at random anywhere on screen (a few at
 * first, more each round), and every existing hole eats some of its neighbours, so holes keep
 * appearing in new places while the old ones widen raggedly and merge. Nothing travels across
 * the screen and nothing slides: a square is either there or gone.
 */
function makeTiles(width: number, height: number): Tiles {
  const size = Math.max(18, Math.min(40, Math.round(Math.min(width, height) / 28)));
  const cols = Math.ceil(width / size);
  const rows = Math.ceil(height / size);
  const total = cols * rows;
  const round = new Array<number>(total).fill(-1);
  let alive = total;
  const kill = (i: number, r: number) => {
    if (round[i] === -1) {
      round[i] = r;
      alive--;
    }
  };
  for (let r = 0; r < HOLE_STEPS && alive > 0; r++) {
    if (r === HOLE_STEPS - 1) {
      for (let i = 0; i < total; i++) kill(i, r);
      break;
    }
    // Existing holes widen into some of their still-standing neighbours.
    for (let i = 0; i < total; i++) {
      if (round[i] === -1 || round[i] >= r) continue;
      const c = i % cols;
      const neighbours = [i - cols, i + cols, c > 0 ? i - 1 : -1, c < cols - 1 ? i + 1 : -1];
      for (const n of neighbours) {
        if (n >= 0 && n < total && round[n] === -1 && Math.random() < 0.28) kill(n, r);
      }
    }
    // New holes open at random spots: 1.5% of the screen in the first round, rising each round.
    let fresh = Math.ceil(total * (0.015 + r * 0.01));
    while (fresh-- > 0 && alive > 0) {
      const i = Math.floor(Math.random() * total);
      if (round[i] === -1) kill(i, r);
    }
  }
  return {
    size,
    cols,
    rows,
    round,
    flash: round.map(() => Math.floor(Math.random() * FLASHES.length)),
  };
}

export function IntroLoader({ replayKey }: { replayKey?: number } = {}) {
  const [phase, setPhase] = useState<"play" | "dissolve" | "gone">("play");
  // Held in state (not added to the element by hand) so a re-render can never strip it.
  const [live, setLive] = useState(false);
  // True once the canvas below has painted the background, so the layer's own can go.
  const [painted, setPainted] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const tiles = useRef<Tiles | null>(null);
  const layer = useRef<HTMLDivElement>(null);
  const kwic = useRef<HTMLSpanElement>(null);
  const shake = useRef<HTMLSpanElement>(null);
  const tag = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    // A replay (the /loaders gallery) always plays; the real intro respects the session flag.
    if (replayKey === undefined && root.classList.contains("intro-seen")) {
      setPhase("gone");
      return;
    }
    setPhase("play");
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}

    // Blank the lines, then show them: until this point the text is hidden by CSS, so the
    // server-rendered final words never flash before the scramble starts.
    decode(kwic.current, "Kwic ", -1);
    decode(shake.current, "Shake", -1);
    decode(tag.current, TAGLINE, -1);
    // Paint the background onto the canvas at device resolution, then hand it over.
    const cv = canvas.current;
    const box = layer.current?.getBoundingClientRect();
    const ctx = cv?.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const paper = getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim() || "#100a1f";
    if (cv && box && ctx) {
      cv.width = Math.ceil(box.width * dpr);
      cv.height = Math.ceil(box.height * dpr);
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, cv.width, cv.height);
      tiles.current = makeTiles(box.width, box.height);
      setPainted(true);
    }
    setLive(true);

    const start = performance.now();
    let raf = 0;
    let lastSwap = 0;
    const tick = (now: number) => {
      const t = now - start;
      // Swap the scrambled glyphs at ~25fps: every frame reads as noise, not as decoding.
      if (now - lastSwap > 40) {
        lastSwap = now;
        decode(kwic.current, "Kwic ", (t - MARK_START) / (MARK_DECODE * 0.45));
        decode(shake.current, "Shake", (t - MARK_START - MARK_DECODE * 0.35) / (MARK_DECODE * 0.65));
        decode(tag.current, TAGLINE, (t - TAG_START) / TAG_DECODE);
      }
      if (t < TAG_START + TAG_DECODE + 80) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // The break-up, drawn on the canvas: each frame works out which round it is; squares whose
    // round has passed are cleared (a hole), and squares in the current round show their flash
    // colour, if they have one, for that one round first.
    let holesRaf = 0;
    const dissolve = window.setTimeout(() => {
      setPhase("dissolve");
      const t = tiles.current;
      if (!cv || !ctx || !t) return;
      const px = t.size * dpr;
      const cleared = new Uint8Array(t.round.length);
      const flashed = new Uint8Array(t.round.length);
      const holesStart = performance.now();
      const draw = (now: number) => {
        const k = Math.floor((now - holesStart) / HOLE_STEP_MS);
        for (let i = 0; i < t.round.length; i++) {
          if (cleared[i]) continue;
          const x = Math.floor((i % t.cols) * px);
          const y = Math.floor(Math.floor(i / t.cols) * px);
          const w = Math.ceil(px) + 1;
          if (t.round[i] < k) {
            ctx.clearRect(x, y, w, w);
            cleared[i] = 1;
          } else if (t.round[i] === k && !flashed[i]) {
            const colour = FLASHES[t.flash[i]];
            if (colour) {
              ctx.fillStyle = colour;
              ctx.fillRect(x, y, w, w);
            }
            flashed[i] = 1;
          }
        }
        if (k <= HOLE_STEPS) holesRaf = requestAnimationFrame(draw);
      };
      holesRaf = requestAnimationFrame(draw);
    }, DISSOLVE_AT);
    const gone = window.setTimeout(() => setPhase("gone"), GONE_AT);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(holesRaf);
      window.clearTimeout(dissolve);
      window.clearTimeout(gone);
    };
  }, [replayKey]);

  if (phase === "gone") return null;

  const classes = [
    "intro-loader",
    replayKey !== undefined && "is-replay",
    live && "is-live",
    painted && "has-tiles",
    phase === "dissolve" && "is-dissolving",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={layer}
      className={classes}
      style={{ ["--text-out" as string]: `${TEXT_OUT}ms` }}
      aria-hidden="true"
    >
      {/* The background, as a canvas the break-up punches holes in. Before it has painted
          (server render, first frame) the layer paints its own solid background, so nothing
          changes visually when it takes over. One canvas rather than hundreds of elements keeps
          it smooth on phones and the square edges crisp. */}
      <canvas ref={canvas} className="intro-canvas" aria-hidden="true" />
      <div className="intro-inner">
        <p className="brand-wordmark intro-mark">
          <span ref={kwic} className="text-[var(--color-white)]">Kwic </span>
          <span className="intro-shake">
            <span ref={shake} className="brand-shake">Shake</span>
          </span>
        </p>
        <p className="intro-tag">
          <span ref={tag}>{TAGLINE}</span>
          <span className="intro-cursor" />
        </p>
      </div>
    </div>
  );
}

/**
 * Writes `text` into `el` with the first `progress` share of characters resolved and the rest
 * scrambled. Below 0 the whole line is blank (not started); at 1 or above it is the real text.
 * Spaces stay spaces so the line keeps its word shapes while it scrambles.
 */
function decode(el: HTMLElement | null, text: string, progress: number) {
  if (!el) return;
  if (progress >= 1) {
    if (el.textContent !== text) el.textContent = text;
    return;
  }
  if (progress <= 0) {
    el.textContent = text.replace(/\S/g, " ");
    return;
  }
  const resolved = Math.floor(progress * text.length);
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (i < resolved || c === " ") out += c;
    // Characters just ahead of the resolved edge scramble; the far tail stays blank, so the
    // line appears to be written left to right rather than all flickering at once.
    else if (i < resolved + 6) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    else out += " ";
  }
  el.textContent = out;
}
