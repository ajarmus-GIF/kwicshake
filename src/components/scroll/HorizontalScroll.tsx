"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Pins the section for the duration of a vertical scroll and translates the inner track
 * horizontally in lockstep, via `ScrollTrigger.pin` + `scrub`. `scrub: true` (not a fixed
 * duration) ties the track's x position directly to scroll position rather than to time, so it
 * can never drift out of sync with the scrollbar even under variable frame rates. The pinned
 * distance (`end`) is derived from the track's actual scrollWidth minus one viewport width,
 * recalculated in a `ScrollTrigger.refresh` on resize (registered automatically by ScrollTrigger
 * when `invalidateOnRefresh: true` is set) so it stays correct if fonts/images change layout.
 *
 * `prefers-reduced-motion` skips pinning entirely and lets the track lay out as a normal
 * horizontally-scrolling (native overflow-x) row — content order and reachability are identical,
 * only the scroll-jacking is removed.
 *
 * Failure mode: pinning is one of the more expensive ScrollTrigger features — it forces the
 * browser to keep repainting a fixed-position layer for the whole pinned distance, and nested
 * pins or a pinned section inside `position: sticky` ancestors can produce jumpy, incorrect
 * pinning. Keep pinned sections shallow in the DOM and avoid nesting them.
 */
export function HorizontalScroll({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track || prefersReducedMotion) return;

      const scrollDistance = () => track.scrollWidth - section.clientWidth;

      const tween = gsap.to(track, {
        x: () => -scrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div
      ref={sectionRef}
      className={
        prefersReducedMotion
          ? "overflow-x-auto"
          : "relative h-screen overflow-hidden"
      }
    >
      <div
        ref={trackRef}
        className={
          prefersReducedMotion
            ? "flex w-max gap-8 px-6"
            : "flex h-full w-max items-center gap-8 px-6"
        }
      >
        {children}
      </div>
    </div>
  );
}
