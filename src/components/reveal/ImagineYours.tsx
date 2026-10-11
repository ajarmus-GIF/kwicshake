"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { worlds } from "@/lib/worlds";
import { MiniSite, PhoneFrame } from "./MiniSite";

/**
 * "Pick a business. Now make them remember it." The visitor chooses an industry; the phone shows
 * that business as a template would build it, and a drag handle wipes it into its own designed
 * world. Same physical phone, same Kwic Shake room around it, completely different businesses —
 * the argument that we build each client its own look instead of ours.
 *
 * The handle is a role="slider" with its own drag code rather than an invisible <input type="range">
 * stretched over the phone: on iOS a native range only moves when you grab its thumb, and an
 * invisible thumb can't be found, so touch was effectively broken. Now:
 *   - mouse: press anywhere on the phone and drag; the line jumps to the cursor and follows it.
 *   - touch/pen: nothing happens on touch-down, so a scroll that starts on the phone never moves
 *     the line. Only a sideways swipe past SWIPE_PX takes over, and then the line moves *by* the
 *     swipe rather than jumping to the finger. `touch-action: pan-y` hands vertical moves to the
 *     page (the browser cancels our pointer), so scrolling through the phone just scrolls.
 *   - keyboard: Tab to the handle, then arrows (5%), Page Up/Down (25%), Home/End.
 *   - screen readers: it announces as a slider with its percentage.
 */
const STEP = 5;
const BIG_STEP = 25;
const SWIPE_PX = 10;
const clamp = (v: number) => Math.min(100, Math.max(0, v));
export function ImagineYours() {
  const [active, setActive] = useState(0);
  const [reveal, setReveal] = useState(55);
  const world = worlds[active];
  const stage = useRef<HTMLDivElement>(null);
  // The gesture in progress: where it started, the reveal then, and whether it has become a drag.
  const drag = useRef<{ id: number; x: number; from: number; live: boolean } | null>(null);

  const revealAt = (clientX: number) => {
    const box = stage.current?.getBoundingClientRect();
    if (box && box.width) setReveal(Math.round(clamp(((clientX - box.left) / box.width) * 100)));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const mouse = e.pointerType === "mouse";
    drag.current = { id: e.pointerId, x: e.clientX, from: reveal, live: mouse };
    if (mouse) {
      e.currentTarget.setPointerCapture(e.pointerId);
      revealAt(e.clientX);
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = drag.current;
    if (!g || g.id !== e.pointerId) return;
    if (g.live && e.pointerType === "mouse") return revealAt(e.clientX);
    const dx = e.clientX - g.x;
    if (!g.live) {
      if (Math.abs(dx) < SWIPE_PX) return;
      g.live = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const width = stage.current?.getBoundingClientRect().width;
    if (width) setReveal(Math.round(clamp(g.from + (dx / width) * 100)));
  };

  const endDrag = () => {
    drag.current = null;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    const next = {
      ArrowLeft: reveal - STEP,
      ArrowDown: reveal - STEP,
      ArrowRight: reveal + STEP,
      ArrowUp: reveal + STEP,
      PageDown: reveal - BIG_STEP,
      PageUp: reveal + BIG_STEP,
      Home: 0,
      End: 100,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setReveal(clamp(next));
  };

  const pick = (i: number) => {
    setActive(i);
    setReveal(55);
  };

  return (
    <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="eyebrow mb-6">+ Pick a business</p>
        <h2 className="section-title">
          The version <span className="text-[var(--color-cherry)]">you&apos;ve always pictured.</span>
        </h2>
        <p className="section-lede">
          Choose one. Slide the handle. Same phone, same business, and a completely different
          impression.
        </p>

        <div className="mt-10 flex flex-wrap gap-2.5" role="group" aria-label="Choose a business">
          {worlds.map((w, i) => (
            <button
              key={w.id}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={i === active}
              className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                i === active
                  ? "border-[var(--color-cherry)] bg-[var(--color-cherry)] text-[var(--color-paper)]"
                  : "border-[var(--color-ash-40)] text-[var(--color-ink)] hover:border-[var(--color-cherry)]"
              }`}
            >
              {w.industry}
            </button>
          ))}
        </div>

        <p className="mt-10 max-w-md text-base leading-relaxed text-[var(--color-muted)]">
          Purple is our frame, not your brand. A sushi bar gets black and gold, a salon gets pink,
          a fishing outfitter gets olive and blaze orange.{" "}
          <span className="text-[var(--color-ink)]">You get your own world.</span>
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-sm">
        <div
          className="pointer-events-none absolute inset-[-25%] rounded-full opacity-40 blur-3xl"
          style={{ background: `radial-gradient(circle, ${world.accent}55, transparent 65%)` }}
          aria-hidden="true"
        />
        <PhoneFrame className="relative mx-auto w-[17rem] sm:w-[19rem]">
          <div
            ref={stage}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="absolute inset-0 cursor-ew-resize touch-pan-y select-none"
          >
            <MiniSite world={world} />
            {/* The template version on top, clipped away from the left as the handle moves. */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 0 0 ${reveal}%)` }}
              aria-hidden="true"
            >
              <MiniSite world={world} generic />
            </div>
            <span
              className="pointer-events-none absolute inset-y-0 w-0.5 bg-[var(--color-cherry)] shadow-[0_0_14px_var(--color-glow)]"
              style={{ left: `${reveal}%` }}
            >
              <span
                role="slider"
                tabIndex={0}
                aria-label={`Reveal the designed ${world.industry.toLowerCase()} site`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={reveal}
                aria-valuetext={`${100 - reveal}% designed`}
                onKeyDown={onKeyDown}
                className="pointer-events-auto absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--color-cherry)] text-sm text-[var(--color-paper)] shadow-[0_4px_18px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-[3px] focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cherry)]"
              >
                <span aria-hidden="true">⟷</span>
              </span>
            </span>
          </div>
        </PhoneFrame>
        <p className="mt-6 text-center font-mono text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">
          <span className="text-[var(--color-ink)]">{world.name}</span>
          <span className="mx-2 text-[var(--color-cherry)]">/</span>
          {world.client ? "Client work" : "Concept study, not a client"}
        </p>
      </div>
    </div>
  );
}
