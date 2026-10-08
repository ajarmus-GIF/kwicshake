"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { systemLoop } from "@/lib/services";

/**
 * The six services as one engine instead of a menu: THE BUSINESS in the middle, six nodes on a
 * ring, and the light travelling ad → website → brand → social → search → real world → back to
 * the ad. Hovering or focusing a node starts the loop from there. The sentence in the middle is
 * the same loop copy /services ends on (lib/services systemLoop), so the two pages agree.
 *
 * Reduced motion: no auto-advance; the nodes still respond to hover/focus/click.
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
  const [hold, setHold] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || hold) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % nodes.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [reduced, hold]);

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
          Hover a piece to start the loop there.
        </p>
        <p className="display-face mt-12 min-h-[4.5em] text-[clamp(1.4rem,2.6vw,2rem)] leading-snug" aria-live="polite">
          <span className="text-[var(--color-cherry)]">{link.piece}</span> {link.does}
        </p>
      </div>

      <div
        className="relative mx-auto aspect-square w-full max-w-[34rem]"
        onPointerLeave={() => setHold(false)}
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
              onPointerEnter={() => {
                setHold(true);
                setActive(i);
              }}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={on}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3.5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] transition-all duration-500 sm:px-4 sm:text-xs ${
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
    </div>
  );
}
