"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "./SmoothScroll";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Infinite horizontal loop built from two identical copies of `children` placed side by side
 * inside a track animated with `xPercent: -50`, `repeat: -1`, `ease: "none"` — a seamless loop
 * because at xPercent -50 the second copy is exactly where the first one started, so the wrap
 * is invisible. (Duplicating content in the DOM for a visual loop like this is the standard
 * trade-off; the duplicate is `aria-hidden` so it doesn't double up for screen readers.)
 *
 * Speed reacts to scroll velocity by reading Lenis's `scroll` event payload (`event.velocity`)
 * and retargeting the marquee timeline's `timeScale` toward `1 + |velocity| * factor` — scrubbed
 * with a quickTo-style ease rather than set instantly, so a single fast scroll tick doesn't snap
 * the marquee to a jarring speed. Direction flips by driving `timeScale` negative when velocity's
 * sign flips (scrolling up vs down), which runs the same timeline backward rather than swapping
 * to a second timeline.
 *
 * Failure mode: this only reacts to scroll while `SmoothScroll` (Lenis) is mounted and active;
 * under `prefers-reduced-motion` Lenis is never instantiated (see SmoothScroll.tsx), so the
 * velocity reactivity is skipped and the marquee runs at a constant, slow base speed instead —
 * still motion, but not scroll-jacked, matching "opacity/rate-only" rather than fully static
 * since a completely frozen marquee would hide its own content from a scanning reader.
 */
export function Marquee({
  children,
  baseDuration = 20,
  reverse = false,
}: {
  children: ReactNode;
  baseDuration?: number;
  /**
   * Runs the loop right-to-left instead of left-to-right. Exists so two stacked bands can move
   * against each other — opposed motion reads as a mechanism, where two rows sliding the same
   * way just read as one thick row. Pair it with a different `baseDuration` on each row; equal
   * speeds in opposite directions produce a distracting mirror symmetry.
   */
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      // fromTo rather than to, because the reversed row has to START already shifted by half
      // the track. Both directions are seamless for the same reason: at xPercent -50 the second
      // (duplicate) copy sits exactly where the first began, so either endpoint is a valid wrap
      // point.
      const tl = gsap.timeline({ repeat: -1 }).fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        {
          xPercent: reverse ? 0 : -50,
          duration: baseDuration,
          ease: "none",
        }
      );

      if (prefersReducedMotion || !lenis) return () => tl.kill();

      const setTimeScale = gsap.quickTo(tl, "timeScale", { duration: 0.4, ease: "power2.out" });

      const handleScroll = (event: { velocity: number }) => {
        const magnitude = Math.min(Math.abs(event.velocity) * 0.05, 4);
        const direction = event.velocity < 0 ? -1 : 1;
        setTimeScale(direction * Math.max(magnitude, 0.3));
      };

      lenis.on("scroll", handleScroll);

      return () => {
        lenis.off("scroll", handleScroll);
        tl.kill();
      };
    },
    { scope: trackRef, dependencies: [baseDuration, reverse, prefersReducedMotion, lenis] }
  );

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex w-max">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
