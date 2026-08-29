"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Lenis smooth-scroll provider, synced to GSAP's own ticker instead of running its own
 * requestAnimationFrame loop (`autoRaf: false`). Two things make pinning/scrub stay accurate:
 * (1) `gsap.ticker.add` drives `lenis.raf` so Lenis and every GSAP tween share one clock, and
 * (2) `lenis.on("scroll", ScrollTrigger.update)` tells ScrollTrigger a scroll happened, because
 * Lenis intercepts the native scroll event and ScrollTrigger otherwise never sees it. Skipping
 * either wire-up causes pinned sections to drift or jitter against the (visually) smoothed
 * scroll position. When the user prefers reduced motion, Lenis is never instantiated at all —
 * the page falls back to native, instant scrolling, which also means less JS work at rest.
 *
 * Failure mode: forgetting to `lenis.destroy()` and `gsap.ticker.remove(...)` on unmount leaks
 * a rAF callback per mount — harmless once, fatal after enough client-side navigations pile up
 * duplicate tickers. This provider lives once in the root layout specifically to avoid that;
 * it must never be mounted per-route.
 */
const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const instance = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenis(instance);

    const update = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(update);
    instance.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      instance.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
