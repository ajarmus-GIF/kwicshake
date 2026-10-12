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
// swings shrinking and slowing as it settles. Partway through that settle the background glitches
// away square by square, bursting open in several random spots at once, and the text glitches
// out with the last squares. Gone in about 1.5s.
const MARK_START = 40;
const MARK_DECODE = 460;
const TAG_START = 40; // with the wordmark, not after it
const TAG_DECODE = 480;
const DISSOLVE_AT = 900; // while the shake is in its slow tail
/** Squares nearest a burst point go first; the farthest go this much later… */
const DISSOLVE_SPREAD = 260;
/** …plus up to this much random scatter, so the bursts have ragged, glitchy edges. */
const DISSOLVE_JITTER = 70;
/** Each square's own glitch-out, matching the `intro-tile-out-*` keyframes in globals.css. */
const TILE_OUT = 160;
/** When the text glitches out, relative to DISSOLVE_AT: as the last squares go. */
const TEXT_OUT = 230;
const GONE_AT = DISSOLVE_AT + DISSOLVE_SPREAD + DISSOLVE_JITTER + TILE_OUT + 40;

type Tiles = { size: number; cols: number; rows: number; delays: number[]; looks: number[] };

/**
 * The squares the background breaks into, sized to the layer (about a fourteenth of its short
 * side, 36–80px). A handful of random burst points open at once and each spreads outward, so the
 * page shows through in several places at the same time rather than in one sweep; every
 * square's delay is its distance to the nearest burst. Each square also gets one of three
 * glitch looks so they don't all break the same way.
 */
function makeTiles(width: number, height: number): Tiles {
  const size = Math.max(36, Math.min(80, Math.round(Math.min(width, height) / 14)));
  const cols = Math.ceil(width / size);
  const rows = Math.ceil(height / size);
  const bursts = Array.from({ length: 5 + Math.floor(Math.random() * 3) }, () => [
    Math.random() * cols,
    Math.random() * rows,
  ]);
  const nearest: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nearest.push(Math.min(...bursts.map(([bx, by]) => Math.hypot(c - bx, r - by))));
    }
  }
  const farthest = Math.max(...nearest) || 1;
  return {
    size,
    cols,
    rows,
    delays: nearest.map((d) => Math.round((d / farthest) * DISSOLVE_SPREAD + Math.random() * DISSOLVE_JITTER)),
    looks: nearest.map(() => Math.floor(Math.random() * 3)),
  };
}

export function IntroLoader({ replayKey }: { replayKey?: number } = {}) {
  const [phase, setPhase] = useState<"play" | "dissolve" | "gone">("play");
  // Held in state (not added to the element by hand) so a re-render can never strip it.
  const [live, setLive] = useState(false);
  const [tiles, setTiles] = useState<Tiles | null>(null);
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
    const box = layer.current?.getBoundingClientRect();
    if (box) setTiles(makeTiles(box.width, box.height));
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
    const dissolve = window.setTimeout(() => setPhase("dissolve"), DISSOLVE_AT);
    const gone = window.setTimeout(() => setPhase("gone"), GONE_AT);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(dissolve);
      window.clearTimeout(gone);
    };
  }, [replayKey]);

  if (phase === "gone") return null;

  const classes = [
    "intro-loader",
    replayKey !== undefined && "is-replay",
    live && "is-live",
    tiles && "has-tiles",
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
      {/* The background, as squares. Before these exist (server render, first frame) the layer
          paints its own solid background, so nothing changes visually when they arrive. */}
      {tiles && (
        <div
          className="intro-tiles"
          style={{
            gridTemplateColumns: `repeat(${tiles.cols}, ${tiles.size}px)`,
            gridAutoRows: `${tiles.size}px`,
          }}
        >
          {tiles.delays.map((d, i) => (
            <span
              key={i}
              className={`intro-tile intro-tile-${tiles.looks[i]}`}
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
      )}
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
