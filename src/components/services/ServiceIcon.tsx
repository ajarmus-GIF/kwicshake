"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Wraps a set of plain stroke shapes (rect/line/circle/polygon/path — anything DrawSVGPlugin
 * can measure) and draws them in on scroll, same "hide only once JS is confirmed running, once
 * per scroll entry" convention as TextReveal/EyeCloudReveal: the shapes are ordinary, fully
 * visible SVG markup on the server, and only get their DrawSVG "0%" start state applied inside
 * useGSAP, so a no-JS visitor just sees the finished icon.
 *
 * `prefers-reduced-motion` skips straight to the finished, fully-drawn icon with no ScrollTrigger
 * mounted at all.
 */
export function ServiceIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg || prefersReducedMotion) return;

      const shapes = svg.querySelectorAll("circle, line, rect, polygon, path");
      gsap.set(shapes, { drawSVG: "0%" });

      const trigger = ScrollTrigger.create({
        trigger: svg,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(shapes, {
            drawSVG: "100%",
            duration: 1.1,
            ease: "power2.inOut",
            stagger: 0.1,
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: svgRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
