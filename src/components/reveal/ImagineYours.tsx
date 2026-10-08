"use client";

import { useState } from "react";
import { worlds } from "@/lib/worlds";
import { MiniSite, PhoneFrame } from "./MiniSite";

/**
 * "Pick a business. Now make them remember it." The visitor chooses an industry; the phone shows
 * that business as a template would build it, and a drag handle wipes it into its own designed
 * world. Same physical phone, same Kwic Shake room around it, completely different businesses —
 * the argument that we build each client its own look instead of ours.
 *
 * The handle is a real <input type="range"> laid over the phone, so it works with a keyboard and a
 * screen reader without any custom drag code.
 */
export function ImagineYours() {
  const [active, setActive] = useState(0);
  const [reveal, setReveal] = useState(55);
  const world = worlds[active];

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
          Choose one. Drag the handle. Same phone, same business, and a completely different
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
            aria-hidden="true"
          >
            <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--color-cherry)] text-xs text-[var(--color-paper)]">
              ⟷
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={reveal}
            onChange={(e) => setReveal(Number(e.target.value))}
            aria-label={`Reveal the designed ${world.industry.toLowerCase()} site`}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
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
