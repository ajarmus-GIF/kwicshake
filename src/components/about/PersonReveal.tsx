"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";

/**
 * Click the photo, the bio paragraph underneath expands. The paragraph is always in the DOM —
 * never conditionally rendered — so with JS disabled it's just permanently visible, matching
 * this app's rule that content never depends on JS to become readable. Only once `useGSAP`
 * confirms JS is actually running does the wrapper get collapsed to height 0, mirroring
 * TextReveal's "hide synchronously, but only after JS is confirmed" pattern.
 */
export function PersonReveal({ name, bio }: { name: string; bio: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = wrapperRef.current;
      if (!el) return;

      // First run just establishes the collapsed starting state (only now that JS is
      // confirmed running) — it must not animate, or every card visibly collapses on load.
      if (isFirstRun.current) {
        isFirstRun.current = false;
        gsap.set(el, { height: isOpen ? "auto" : 0 });
        return;
      }

      if (prefersReducedMotion) {
        gsap.set(el, { height: isOpen ? "auto" : 0 });
        return;
      }

      if (isOpen) {
        gsap.fromTo(
          el,
          { height: 0 },
          {
            height: el.scrollHeight,
            duration: 0.5,
            ease: "power3.out",
            onComplete: () => gsap.set(el, { height: "auto" }),
          }
        );
      } else {
        gsap.to(el, { height: 0, duration: 0.4, ease: "power3.in" });
      }
    },
    { dependencies: [isOpen, prefersReducedMotion] }
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="group relative block w-full text-center"
      >
        <PlaceholderMedia label={`TODO: ${name} photo`} aspect="aspect-[3/4]" className="h-full" />
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-4 text-[clamp(3rem,8vw,6rem)] font-bold uppercase tracking-wide text-[var(--color-bg)] mix-blend-difference">
          {name}
        </span>
      </button>
      <div ref={wrapperRef} className="overflow-hidden">
        <p className="py-8 text-center leading-relaxed text-[var(--color-muted)]">{bio}</p>
      </div>
    </div>
  );
}
