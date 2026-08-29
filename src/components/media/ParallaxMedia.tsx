"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Translates its child vertically on scroll at `rate` (a fraction of the container's height),
 * via a scrubbed ScrollTrigger tween rather than a manual scroll-event listener — scrub ties the
 * translate directly to scroll progress so there's no lag or missed-frame risk under fast flicks.
 *
 * "Clamped so it never leaves its container": the child is rendered oversized — its height is
 * `100% + rate * 200%` via an inline custom property consumed in CSS — so that even at the
 * maximum translate offset, the child's edge never reaches the container's edge and no gap
 * appears. `rate` itself is clamped to [0, 0.5] in JS; above ~0.5 the required oversize becomes
 * large enough to hurt image quality/perf for a subtlety that stops reading as "parallax" and
 * starts reading as "unrelated drift."
 *
 * `prefers-reduced-motion` renders the child at a static 100% size with no transform and no
 * ScrollTrigger at all — not just a frozen tween, since a mounted-but-inert ScrollTrigger still
 * costs a resize/scroll listener for no visual benefit once motion is off.
 *
 * Failure mode: forgetting `overflow-hidden` on the outer wrapper is the single most common bug
 * with this pattern — without it, the intentionally-oversized child spills out of the layout
 * instead of being clipped to the container's bounds.
 */
export function ParallaxMedia({
  children,
  rate = 0.2,
  className,
}: {
  children: ReactNode;
  rate?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const clampedRate = Math.min(Math.max(rate, 0), 0.5);

  useGSAP(
    () => {
      const container = containerRef.current;
      const media = mediaRef.current;
      if (!container || !media || prefersReducedMotion) return;

      // Pixel-based translate (not yPercent) so the animated range is a fraction of the
      // *container's* height, matching the static oversize/offset below exactly — mixing
      // yPercent (relative to the oversized child's own height) with a container-relative
      // static offset would make the two ranges disagree and let a gap slip through.
      const tween = gsap.fromTo(
        media,
        { y: () => -container.clientHeight * clampedRate * 0.5 },
        {
          y: () => container.clientHeight * clampedRate * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: containerRef, dependencies: [clampedRate, prefersReducedMotion] }
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <div
        ref={mediaRef}
        className="absolute inset-x-0"
        style={{
          top: prefersReducedMotion ? 0 : `${-clampedRate * 50}%`,
          height: prefersReducedMotion ? "100%" : `${100 + clampedRate * 100}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
