"use client";

import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { DESCRIPTOR } from "@/lib/site";
import { worlds } from "@/lib/worlds";
import { MiniSite, PhoneFrame } from "./MiniSite";
import { PixelField } from "./PixelField";

/**
 * "One device, many worlds." The phone never moves; only the business on it changes. That one
 * image says the thing the rest of the page argues: we can take almost any business and make it
 * look like the business it actually is.
 *
 * Every world is rendered at once and cross-faded, so a switch never waits on layout. Reduced
 * motion stops the auto-advance and leaves the industry buttons as the only way to change it.
 */
const STEP_MS = 2200;

export function RevealHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % worlds.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  const world = worlds[active];

  return (
    <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 pb-24 pt-16 text-[var(--color-on-dark)] sm:pb-32 sm:pt-20">
      <div
        className="pointer-events-none absolute right-[-15%] top-1/2 h-[80vw] max-h-[900px] w-[80vw] max-w-[900px] -translate-y-1/2 rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow mb-6">+ {DESCRIPTOR}</p>
          <h1 className="max-w-3xl text-[clamp(2.4rem,6vw,4.75rem)] font-medium leading-[1.03] tracking-tight">
            <span className="block text-[var(--color-white)]">You built a great business.</span>
            <span className="block text-[var(--color-cherry)]">Does your marketing show it?</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-snug text-[var(--color-on-dark)]/80">
            A great business can still look forgettable online. We fix the part people see first.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <MagneticButton
              as={TransitionLink}
              href="/contact"
              radius={100}
              className="btn-hero-white inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest"
            >
              Start a Conversation
            </MagneticButton>
            <TransitionLink
              href="/work"
              className="text-sm font-semibold uppercase tracking-widest text-[var(--color-on-dark)] underline decoration-[var(--color-cherry)] underline-offset-4 transition-colors hover:text-[var(--color-cherry)]"
            >
              See What We&apos;ve Built →
            </TransitionLink>
          </div>
        </div>

        <div
          className="relative mx-auto flex w-full max-w-[22rem] flex-col items-center"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <PixelField className="-inset-[30%]" />
          <PhoneFrame className="relative w-[15.5rem] sm:w-[17.5rem]">
            {worlds.map((w, i) => (
              <div
                key={w.id}
                aria-hidden={i !== active}
                className="absolute inset-0 transition-opacity duration-500 ease-out"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                <MiniSite world={w} />
              </div>
            ))}
          </PhoneFrame>

          <p className="relative mt-6 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-on-dark)]/60">
            <span className="text-[var(--color-on-dark)]">{world.industry}</span>
            <span className="mx-2 text-[var(--color-cherry)]">/</span>
            {world.client ? "Client work" : "Concept study"}
          </p>
          <div className="relative mt-4 flex gap-2" role="group" aria-label="Choose a business">
            {worlds.map((w, i) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={w.industry}
                aria-pressed={i === active}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-[var(--color-cherry)]" : "w-1.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
