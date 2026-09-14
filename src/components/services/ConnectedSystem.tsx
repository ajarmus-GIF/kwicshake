"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { TextReveal } from "@/components/text/TextReveal";
import { systemLoop } from "@/lib/services";

/**
 * The argument that six disciplines are one machine.
 *
 * ── Why a loop and not a funnel ─────────────────────────────────────────────────────────────
 * The section this replaced drew a funnel: attention at the top narrowing to customers at the
 * bottom. A funnel can't say the thing this section exists to say, because a funnel ENDS. The
 * copy's last link — real-world marketing sending people back into the system — is what turns a
 * sequence of campaigns into something self-feeding, and that only reads if the diagram closes.
 * So the spine runs down through all six links and then returns, dashed, to the top.
 *
 * ── Why it isn't a corporate infographic ────────────────────────────────────────────────────
 * No boxes, no arrows between boxes, no isometric anything. It's a single hairline spine with
 * numbers sitting on it and sentences hanging off it, which reads as a chain of consequences —
 * each line finishing the one above it — rather than as a process chart. The spine draws itself
 * downward on scroll so the connection is something the reader watches happen.
 *
 * Each link is one sentence split across two colours: the piece of marketing in the foreground
 * colour, the job it does in muted. Read down the strong words alone and you get the inventory;
 * read the full lines and you get the argument. Both readings are correct, which is what lets a
 * skimmer and a reader take the same thing away.
 *
 * Under reduced motion the spine is simply drawn at full height from the start. Nothing here is
 * legible only in motion.
 */
export function ConnectedSystem() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const returnRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const spine = spineRef.current;
      const list = listRef.current;
      const back = returnRef.current;
      if (!spine || !list || !back) return;

      if (prefersReducedMotion) {
        gsap.set(spine, { scaleY: 1 });
        return;
      }

      const rows = gsap.utils.toArray<HTMLElement>("li", list);
      gsap.set(spine, { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.set(rows, { autoAlpha: 0, y: 20 });
      gsap.set(back, { autoAlpha: 0 });

      const trigger = ScrollTrigger.create({
        trigger: list,
        start: "top 76%",
        once: true,
        onEnter: () => {
          gsap
            .timeline()
            .to(spine, { scaleY: 1, duration: 1.5, ease: "power2.inOut" })
            .to(
              rows,
              { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.16 },
              0.15
            )
            .to(back, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "-=0.2");
        },
      });

      return () => trigger.kill();
    },
    { scope: scopeRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={scopeRef} className="relative mx-auto max-w-3xl">
      {/* The spine runs through the centre of the numeral column (2.5rem wide, so 1.25rem
          from the left edge) and is inset top/bottom by half a numeral, so it begins and ends
          inside the first and last markers rather than poking past them.

          It is positioned against a wrapper holding ONLY the list. Against the outer container
          — which also carries the return row and the closing paragraph — `bottom-6` measured
          from the bottom of all of that, and the line ran on down through the closing sentence. */}
      <div className="relative">
        <span
          ref={spineRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-5 top-6 w-px bg-[var(--color-cherry)]/45"
        />

        <ol ref={listRef} className="relative space-y-9 sm:space-y-11">
        {systemLoop.map((link) => (
          <li key={link.number} className="flex items-start gap-5 sm:gap-7">
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-cherry)]/50 bg-[var(--color-bg)] text-xs tabular-nums tracking-[0.1em] text-[var(--color-cherry)]">
              {link.number}
            </span>
            <p className="pt-1.5 text-[clamp(1.15rem,2.6vw,1.6rem)] leading-snug">
              <span className="font-medium">{link.piece}</span>{" "}
              <span className="text-[var(--color-muted)]">{link.does}</span>
            </p>
            </li>
          ))}
        </ol>
      </div>

      {/* The return. Dashed rather than solid so it reads as "and round again" instead of as a
          seventh step, and it carries the arrow that closes the ring. */}
      <div ref={returnRef} className="relative mt-9 flex items-center gap-5 sm:gap-7">
        <span
          aria-hidden="true"
          className="absolute bottom-5 left-5 top-[-2.25rem] w-px border-l border-dashed border-[var(--color-cherry)]/45"
        />
        <span
          aria-hidden="true"
          className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--color-cherry)]/50 bg-[var(--color-bg)] text-base text-[var(--color-cherry)]"
        >
          &uarr;
        </span>
        <p className="pt-2 text-sm uppercase tracking-[0.18em] text-[var(--color-cherry)]">
          And it feeds the top again
        </p>
      </div>

      <TextReveal
        as="p"
        className="mt-16 text-balance text-[clamp(1.25rem,3vw,1.9rem)] leading-snug"
      >
        That&apos;s when marketing stops being a collection of projects
        <span className="text-[var(--color-muted)]">&hellip;</span> and starts becoming{" "}
        <span className="text-[var(--color-cherry)]">an engine.</span>
      </TextReveal>
    </div>
  );
}
