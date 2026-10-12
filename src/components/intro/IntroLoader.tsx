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

// Timeline, in ms from when this component starts.
// The tagline decodes during the shake (SHAKE_AT, set in globals.css as the shake's delay), so
// the two beats land together and the whole thing is over in about 1.8s.
const MARK_START = 40;
const MARK_DECODE = 420;
const TAG_START = 460; // = SHAKE_AT
const TAG_DECODE = 500; // = the shake's length
const LEAVE_AT = 1250; // a beat to read the finished line
const GONE_AT = 1800;

export function IntroLoader({ replayKey }: { replayKey?: number } = {}) {
  const [phase, setPhase] = useState<"play" | "leave" | "gone">("play");
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
    layer.current?.classList.add("is-live");

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
    const leave = window.setTimeout(() => setPhase("leave"), LEAVE_AT);
    const gone = window.setTimeout(() => setPhase("gone"), GONE_AT);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(leave);
      window.clearTimeout(gone);
    };
  }, [replayKey]);

  if (phase === "gone") return null;

  return (
    <div
      ref={layer}
      className={`intro-loader ${replayKey !== undefined ? "is-replay" : ""} ${phase === "leave" ? "is-leaving" : ""}`}
      aria-hidden="true"
    >
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
