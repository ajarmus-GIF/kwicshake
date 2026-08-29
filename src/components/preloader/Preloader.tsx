"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * One-time entry animation — two hands reaching in from opposite edges and shaking — that
 * plays only on the very first load of a session, then hands off to whatever the hero wants
 * to do next via `usePreloader().ready`. "First load of a session" is tracked with
 * sessionStorage rather than localStorage on purpose: a returning visitor tomorrow should see
 * it again, but a visitor clicking between routes (or refreshing) inside the same tab should
 * not sit through it twice. Lives once in the root layout — never in template.tsx — since it
 * must not re-run on client-side navigation.
 *
 * Both hands are the same `Hand` SVG — the right one is just mirrored with `-scale-x-100`
 * rather than a second hand-drawn path — animated in from opposite sides to meet in the
 * center, then given a quick synchronized up/down jiggle (both hands move together, like an
 * actual handshake grip) before the whole overlay wipes away.
 *
 * Failure mode: this overlay could deadlock the page if its "hide" step depended on something
 * that never resolves (an image load, a font load that fails). Keep the animation duration-
 * driven (a fixed GSAP timeline), not dependent on external async resources, so it always
 * finishes and always hands off `ready`.
 */
const STORAGE_KEY = "portfolio:preloaded";

const PreloaderContext = createContext(false);

export function usePreloader() {
  return useContext(PreloaderContext);
}

export function Preloader({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const alreadyPreloaded = sessionStorage.getItem(STORAGE_KEY) === "1";
    if (alreadyPreloaded) {
      setReady(true);
    } else {
      setShouldAnimate(true);
    }
  }, []);

  useGSAP(
    () => {
      if (!shouldAnimate) return;

      if (prefersReducedMotion) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setReady(true);
        return;
      }

      const leftHand = leftHandRef.current;
      const rightHand = rightHandRef.current;
      if (!leftHand || !rightHand) return;

      gsap.set(leftHand, { x: -140, opacity: 0 });
      gsap.set(rightHand, { x: 140, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setReady(true);
        },
      });

      tl.to([leftHand, rightHand], { opacity: 1, duration: 0.25, ease: "power1.out" })
        .to(leftHand, { x: 0, duration: 0.6, ease: "power3.out" }, "<")
        .to(rightHand, { x: 0, duration: 0.6, ease: "power3.out" }, "<")
        .to([leftHand, rightHand], { y: 7, duration: 0.09, ease: "power1.inOut" })
        .to([leftHand, rightHand], { y: -7, duration: 0.09, ease: "power1.inOut" })
        .to([leftHand, rightHand], { y: 5, duration: 0.08, ease: "power1.inOut" })
        .to([leftHand, rightHand], { y: -5, duration: 0.08, ease: "power1.inOut" })
        .to([leftHand, rightHand], { y: 0, duration: 0.1, ease: "power1.out" })
        .to({}, { duration: 0.25 }) // brief hold on the shake before wiping away
        .to(containerRef.current, { yPercent: -100, duration: 0.6, ease: "power3.inOut" });
    },
    { scope: containerRef, dependencies: [shouldAnimate, prefersReducedMotion] }
  );

  return (
    <PreloaderContext.Provider value={ready}>
      {shouldAnimate && !ready && (
        <div
          ref={containerRef}
          aria-hidden="true"
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[var(--color-bg)]"
        >
          <div className="relative flex h-24 w-full max-w-xs items-center justify-center">
            <div ref={leftHandRef} className="absolute right-1/2">
              <Hand className="h-16 w-24 text-[var(--color-fg)]" />
            </div>
            <div ref={rightHandRef} className="absolute left-1/2">
              <Hand className="h-16 w-24 -scale-x-100 text-[var(--color-fg)]" />
            </div>
          </div>
        </div>
      )}
      {children}
    </PreloaderContext.Provider>
  );
}

/** A simple fist-and-forearm silhouette. Facing right by default; mirror with `-scale-x-100`. */
function Hand({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="currentColor">
      <rect x="0" y="28" width="58" height="24" rx="10" />
      <path
        d="M50,26
           Q50,16 60,16
           Q63,8 71,11
           Q75,5 83,9
           Q90,6 94,13
           Q100,12 100,22
           L100,54
           Q100,68 86,68
           L58,68
           Q50,68 50,56
           Z"
      />
    </svg>
  );
}
