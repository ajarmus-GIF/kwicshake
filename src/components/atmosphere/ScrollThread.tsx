"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * The dotted thread that draws itself down the page as you scroll, leading the eye from one
 * beat to the next. Born on the Kwic Wins feed (between posts) and reused on the home page
 * between lines that should read as one continuous run.
 *
 * `from` / `to` are horizontal positions across the thread's own box, on a 0–1000 scale
 * (500 is centre). Equal values draw a straight drop; different values draw an S-curve, which
 * is how the feed's zigzag gets literally drawn. `arrow` adds a chevron at the bottom end that
 * arrives as the line finishes, pointing into whatever comes next.
 *
 * Stroke is `--tone-accent` when the thread sits inside a `[data-tone]` section, otherwise the
 * site accent. The reveal is a scrubbed top-to-bottom clip — the line grows downward with the
 * scroll, never ahead of it. Reduced motion: drawn in full from the start, chevron included.
 */
export function ScrollThread({
  from = 500,
  to = 500,
  arrow = false,
  className = "h-24 sm:h-32",
}: {
  from?: number;
  to?: number;
  arrow?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 50%", scrub: 0.4 },
      });
      timeline.fromTo(
        "[data-thread-line]",
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }
      );
      if (arrow) {
        timeline.fromTo(
          "[data-thread-head]",
          { autoAlpha: 0, y: -10 },
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.2 }
        );
      }
    },
    { scope: ref, dependencies: [prefersReducedMotion, arrow] }
  );

  const d =
    from === to ? `M${from} 0 L${to} 100` : `M${from} 0 C${from} 70, ${to} 30, ${to} 100`;

  return (
    <div ref={ref} aria-hidden="true" className={`relative w-full ${className}`}>
      <svg
        data-thread-line
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <path
          d={d}
          fill="none"
          stroke="var(--tone-accent, var(--color-cherry))"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {arrow && (
        <svg
          data-thread-head
          viewBox="0 0 18 11"
          className="absolute top-full mt-1 h-[11px] w-[18px] -translate-x-1/2"
          style={{ left: `${to / 10}%` }}
        >
          <path
            d="M1.5 1.5 L9 9 L16.5 1.5"
            fill="none"
            stroke="var(--tone-accent, var(--color-cherry))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
