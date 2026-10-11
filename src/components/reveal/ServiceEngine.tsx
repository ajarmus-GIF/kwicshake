"use client";

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { systemLoop } from "@/lib/services";

/**
 * The six services as one engine instead of a menu: THE BUSINESS in the middle, six nodes on a
 * ring, and the light travelling ad → website → brand → social → search → real world → back to
 * the ad. The sentence beside it is the same loop copy /services ends on (lib/services
 * systemLoop), so the two pages agree.
 *
 * What stops the loop, per input. Three separate reasons, so one ending never cancels another:
 *   - hovered (mouse only): resting on a node shows it; leaving the diagram lets the loop run.
 *   - focused (keyboard only, i.e. :focus-visible): Tab in, arrows walk the ring, Home/End jump
 *     to the ends; tabbing out lets the loop run.
 *   - pinned (a real tap or click): the node stays put and a "Resume the loop" button appears
 *     under the diagram. Pinning happens on `click`, never on pointerdown, because a click only
 *     fires for a deliberate tap: a scroll that happens to start on a node fires pointerdown and
 *     then cancels, so flicking past the diagram never selects anything.
 *
 * Reduced motion: no auto-advance (so no Resume button either); the nodes still respond.
 */
const labels = ["Advertising", "Website", "Brand", "Social", "Search", "Real world"];
const STEP_MS = 1600;

// Node positions on the ring, rounded so server and client markup match exactly.
const nodes = labels.map((label, i) => {
  const a = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
  return {
    label,
    x: Math.round((50 + Math.cos(a) * 42) * 100) / 100,
    y: Math.round((50 + Math.sin(a) * 42) * 100) / 100,
  };
});

export function ServiceEngine() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const reduced = useReducedMotion();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const hold = hovered || focused || pinned;

  useEffect(() => {
    if (reduced || hold) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % nodes.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [reduced, hold]);

  const onRingKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = nodes.length;
    const next = {
      ArrowRight: (active + 1) % n,
      ArrowDown: (active + 1) % n,
      ArrowLeft: (active + n - 1) % n,
      ArrowUp: (active + n - 1) % n,
      Home: 0,
      End: n - 1,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  };

  const onRingBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  const resume = () => {
    setPinned(false);
    setHovered(false);
  };

  const link = systemLoop[active];
  const prev = nodes[(active + nodes.length - 1) % nodes.length];
  const cur = nodes[active];

  return (
    <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <p className="eyebrow mb-6">+ What We Actually Do</p>
        <h2 className="section-title">
          Six pieces. <span className="text-[var(--color-cherry)]">One engine.</span>
        </h2>
        <p className="section-lede">
          Every piece strengthens the next, and the last one sends people back to the first.
          Hover or tap a piece to stop the loop on it.
        </p>
        <p className="display-face mt-12 min-h-[4.5em] text-[clamp(1.4rem,2.6vw,2rem)] leading-snug" aria-live="polite">
          <span className="text-[var(--color-cherry)]">{link.piece}</span> {link.does}
        </p>
      </div>

      <div className="mx-auto w-full max-w-[34rem]">
        <div
          className="relative aspect-square w-full"
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setHovered(false);
          }}
          onKeyDown={onRingKeyDown}
          onBlur={onRingBlur}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-ash-22)" strokeWidth="0.3" strokeDasharray="0.8 1.2" />
            {nodes.map((n) => (
              <line key={n.label} x1="50" y1="50" x2={n.x} y2={n.y} stroke="var(--color-ash-22)" strokeWidth="0.2" />
            ))}
            <line
              x1={prev.x}
              y1={prev.y}
              x2={cur.x}
              y2={cur.y}
              stroke="var(--color-cherry)"
              strokeWidth="0.5"
              className="transition-all duration-700"
            />
            <line x1="50" y1="50" x2={cur.x} y2={cur.y} stroke="var(--color-cherry)" strokeWidth="0.35" className="transition-all duration-700" />
          </svg>

          <div className="absolute left-1/2 top-1/2 grid h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-cherry)]/50 bg-[var(--color-raised)] text-center shadow-[0_0_60px_-10px_var(--color-glow)]">
            <span className="eyebrow px-2 text-[0.6rem] leading-relaxed text-[var(--color-ink)] sm:text-[0.7rem]">
              The
              <br />
              Business
            </span>
          </div>

          {nodes.map((n, i) => {
            const on = i === active;
            return (
              <button
                key={n.label}
                type="button"
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  setHovered(true);
                  setActive(i);
                }}
                onFocus={(e) => {
                  // Only keyboard focus holds; a tap can also focus a button on some phones, and
                  // that is handled (as a pin) by onClick instead.
                  if (!e.currentTarget.matches(":focus-visible")) return;
                  setFocused(true);
                  setActive(i);
                }}
                onClick={() => {
                  setActive(i);
                  setPinned(true);
                }}
                tabIndex={on ? 0 : -1}
                aria-pressed={on}
                className={`absolute -translate-x-1/2 -translate-y-1/2 touch-manipulation rounded-full border px-3.5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] outline-none transition-all duration-500 before:absolute before:-inset-2 before:content-[''] focus-visible:ring-[3px] focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)] sm:px-4 sm:text-xs ${
                  on
                    ? "scale-110 border-[var(--color-cherry)] bg-[var(--color-cherry)] text-[var(--color-paper)] shadow-[0_0_30px_var(--color-glow)]"
                    : "border-[var(--color-ash-40)] bg-[var(--color-paper)] text-[var(--color-ink)]/80"
                }`}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                {n.label}
              </button>
            );
          })}
        </div>

        {/* Always takes its height, so the page doesn't jump when the button appears. */}
        <div className="mt-6 flex h-11 items-center justify-center">
          {pinned && !reduced && (
            <button
              type="button"
              onClick={resume}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--color-ash-40)] px-5 font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-cherry)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5 fill-current">
                <path d="M2 1l9 5-9 5z" />
              </svg>
              Resume the loop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
