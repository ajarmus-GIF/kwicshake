"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { growthStages } from "@/lib/services";

/**
 * The payoff section at the end of /services: four bands narrowing down the page, with a
 * stream of motes falling through them and converging on the last one. It replaces a flat
 * 2x4 grid of four value words that stated the pillars without ever arguing for them.
 *
 * The argument is the shape. A visitor arriving here has just scrolled six service sections
 * and the open question is "why would I buy more than one of these?" — so this doesn't list
 * services again, it shows them as one machine: wide attention at the top, paying customers
 * at the bottom, and each band naming which of the six does that band's work.
 *
 * Built as HTML bands rather than an SVG funnel on purpose. Every stage label and paragraph
 * stays real, selectable, translatable text in the reading order a screen reader expects, and
 * the narrowing is `width` percentages that reflow at any viewport — an SVG would have frozen
 * the copy into a fixed coordinate space and needed a separate mobile drawing.
 *
 * Three animations, each with a different job:
 *
 * 1. Bands rise and widen into place on entry (once, not scrubbed) — a one-time reveal, the
 *    same convention TextReveal and ServiceIcon use on this page.
 * 2. The centre spine scales down from the top, so the funnel reads as being drawn rather
 *    than assembled. It's `transform-origin: top` scaleY, not a height tween, to stay on the
 *    compositor.
 * 3. The motes loop forever. This is the one continuous animation on the site, and it earns
 *    it: a funnel with nothing moving through it is a diagram, and the point being sold is
 *    that the thing keeps running after launch. Their start positions are randomised inside
 *    useGSAP — never during render — because random values in server-rendered markup are a
 *    hydration mismatch.
 *
 * `prefers-reduced-motion` renders the finished state with no loop mounted at all: bands
 * visible at their final widths, spine full height, and the motes never created. An idling
 * infinite timeline is exactly what that setting exists to prevent.
 */
const MOTE_COUNT = 16;
const MOTE_FALL_DURATION = 5.2;

export function GrowthFunnel() {
  const scope = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const moteLayerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const stack = stackRef.current;
      const spine = spineRef.current;
      const moteLayer = moteLayerRef.current;
      if (!stack || !spine || !moteLayer) return;

      if (prefersReducedMotion) return;

      const bands = gsap.utils.toArray<HTMLElement>("[data-funnel-band]", stack);

      gsap.set(bands, { autoAlpha: 0, y: 28, scaleX: 0.88 });
      gsap.set(spine, { scaleY: 0, transformOrigin: "50% 0%" });

      const trigger = ScrollTrigger.create({
        trigger: stack,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap
            .timeline()
            .to(spine, { scaleY: 1, duration: 0.9, ease: "power2.inOut" })
            .to(
              bands,
              {
                autoAlpha: 1,
                y: 0,
                scaleX: 1,
                duration: 0.85,
                ease: "power3.out",
                stagger: 0.14,
              },
              0.15
            );
        },
      });

      // Motes: created here rather than in JSX so their randomised start columns never reach
      // the server-rendered HTML.
      const motes: HTMLSpanElement[] = [];
      const tweens: gsap.core.Timeline[] = [];
      for (let i = 0; i < MOTE_COUNT; i += 1) {
        const mote = document.createElement("span");
        mote.className =
          "pointer-events-none absolute h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--color-cherry)]";
        moteLayer.appendChild(mote);
        motes.push(mote);

        const startLeft = 6 + Math.random() * 88;
        gsap.set(mote, { left: `${startLeft}%`, top: "0%", opacity: 0 });

        const tl = gsap.timeline({ repeat: -1, delay: (i * MOTE_FALL_DURATION) / MOTE_COUNT });
        // Converging on 50% is the whole visual: the horizontal travel IS the funnel.
        tl.to(mote, { top: "100%", left: "50%", duration: MOTE_FALL_DURATION, ease: "power1.in" }, 0)
          .to(mote, { opacity: 0.9, duration: 0.5 }, 0)
          .to(mote, { opacity: 0, duration: 0.8 }, MOTE_FALL_DURATION - 0.8);
        tweens.push(tl);
      }

      return () => {
        trigger.kill();
        tweens.forEach((t) => t.kill());
        motes.forEach((m) => m.remove());
      };
    },
    { scope, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={scope} className="relative mx-auto max-w-3xl">
      {/* Bands narrow by 11% a step. The stack is the funnel — there is no drawn outline,
          which keeps the shape readable at any width without a second mobile treatment. */}
      <div ref={stackRef} className="relative">
        <div
          ref={spineRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--color-cherry)]/45 to-[var(--color-cherry)]"
        />
        <div ref={moteLayerRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />

        <ol className="relative space-y-3 sm:space-y-4">
          {growthStages.map((stage, index) => (
            <li
              key={stage.number}
              data-funnel-band
              className="mx-auto rounded-2xl border border-[var(--color-cherry)]/25 px-5 py-6 backdrop-blur-[2px] sm:px-8 sm:py-7"
              style={{
                width: `${100 - index * 11}%`,
                // Each band is a little more saturated than the one above it, so depth in the
                // funnel reads as colour as well as width.
                background: `color-mix(in srgb, var(--color-cherry) ${5 + index * 4}%, transparent)`,
              }}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="tabular-nums text-xs tracking-[0.2em] text-[var(--color-cherry)]">
                  {stage.number}
                </span>
                <h3 className="display-face text-[clamp(1.25rem,2.6vw,1.75rem)] uppercase leading-none">
                  {stage.stage}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-cherry)]">
                  {stage.value}
                </span>
              </div>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
                {stage.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
