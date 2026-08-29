"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Scrubbed vertical drift for ordinary content — the text counterpart to ParallaxMedia.
 *
 * ParallaxMedia can't do this job: it oversizes its child to `100% + rate*200%` and absolutely
 * positions it so an image never exposes a gap at the container edge. That is exactly wrong for
 * a paragraph, which would be stretched and clipped. This translates the element as-is and
 * leaves layout alone, so it's safe to wrap around live text.
 *
 * `from`/`to` are yPercent of the element's OWN height, so the travel scales with the content
 * instead of needing a per-use pixel value. Keep them small — past about 12 the drift stops
 * reading as depth and starts reading as the section failing to keep up with the scroll.
 *
 * `fade` additionally dips opacity at both ends of the range, for content that should feel like
 * it surfaces and recedes rather than merely sliding.
 *
 * `ease: "none"` is not a style choice: a scrubbed tween with an ease decouples the element from
 * the scrollbar, and the page feels like it is resisting the wheel.
 *
 * `prefers-reduced-motion` mounts no ScrollTrigger at all and renders the child untransformed.
 */
export function ScrollDrift({
  children,
  from = 8,
  to = -8,
  fade = false,
  className,
}: {
  children: ReactNode;
  from?: number;
  to?: number;
  fade?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion) return;

      const scrollTrigger = {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true as const,
        invalidateOnRefresh: true,
      };

      const tween = gsap.fromTo(
        el,
        { yPercent: from },
        { yPercent: to, ease: "none", scrollTrigger }
      );

      let fadeTween: gsap.core.Tween | null = null;
      if (fade) {
        // Keyframed rather than a second fromTo: opacity has to rise AND fall across one
        // scroll range, which a single from/to pair cannot express.
        fadeTween = gsap.fromTo(
          el,
          { opacity: 0.35 },
          {
            keyframes: [{ opacity: 1, duration: 0.35 }, { opacity: 1, duration: 0.3 }, { opacity: 0.35, duration: 0.35 }],
            ease: "none",
            scrollTrigger,
          }
        );
      }

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        fadeTween?.scrollTrigger?.kill();
        fadeTween?.kill();
      };
    },
    { scope: ref, dependencies: [prefersReducedMotion, from, to, fade] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
