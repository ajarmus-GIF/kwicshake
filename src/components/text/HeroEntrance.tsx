"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * The home hero's load-in, shared so every page opens the same way.
 *
 * Every descendant tagged `data-hero-line` fades up in DOM order the moment the page mounts —
 * eyebrow, headline lines, supporting copy, CTAs — rather than waiting on a scroll trigger. The
 * hero is above the fold by definition, so it should assemble itself on arrival, not on the
 * reader's first flick of the wheel.
 *
 * `HERO_LINE_FROM` / `HERO_LINE_TO` are the single source for that motion; HomeHero runs the
 * same pair inside its own timeline (it also owns the wordmark drop and the image tilt), which
 * is what keeps home and every other page from drifting apart.
 *
 * Like HomeHero, the hidden state is only ever applied by GSAP on mount, never server-rendered,
 * so with JS off the copy is simply there. Reduced motion skips the tween entirely.
 */
export const HERO_LINE_FROM = { autoAlpha: 0, y: 24 };
export const HERO_LINE_TO = {
  autoAlpha: 1,
  y: 0,
  duration: 0.9,
  ease: "power3.out",
  stagger: 0.12,
  delay: 0.1,
};

export function HeroEntrance({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.fromTo("[data-hero-line]", HERO_LINE_FROM, HERO_LINE_TO);
    },
    { scope, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
