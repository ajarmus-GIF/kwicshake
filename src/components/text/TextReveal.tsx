"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Splits its text into lines (SplitText), masks each line with an overflow-hidden wrapper
 * (SplitText's `linesClass` + a CSS rule, not a second manual DOM pass), and animates each
 * line's y-translate in on ScrollTrigger enter. The masking wrapper is what makes it read as
 * lines "rising into place" instead of just fading — without the overflow-hidden clip, the
 * translate would visibly slide the text up from off-canvas rather than reveal it.
 *
 * Critically, the *initial* hidden state (`yPercent: 100`) is set with `gsap.set` inside
 * `useGSAP`, never with a server-rendered className or inline style. If JS never runs — disabled,
 * blocked, or fails to load — the real text SplitText would have split is exactly the plain
 * text this component rendered originally, fully visible and readable with no animation. Baking
 * the hidden state into SSR'd markup instead would mean a no-JS visitor never sees the words.
 *
 * `prefers-reduced-motion` skips the effect entirely — the text stays exactly as server-rendered,
 * fully visible with no animation at all, which is the simplest possible reduced-motion state.
 *
 * Failure mode: SplitText re-measures line breaks from the rendered font, so calling it before
 * the webfont has swapped in produces wrong line boundaries; `document.fonts.ready` is awaited
 * before splitting to avoid animating a stale split.
 */
export function TextReveal({
  as: Component = "p",
  children,
  delay = 0,
  stagger = 0.08,
  start = "top 85%",
  className,
}: {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  stagger?: number;
  start?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion) return;

      // Hide synchronously, only now that we know JS is actually running — never via a
      // server-rendered style, so a no-JS visitor never sees this at all.
      gsap.set(el, { autoAlpha: 0 });

      let split: InstanceType<typeof SplitText> | null = null;
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled || !el) return;

        split = SplitText.create(el, {
          type: "lines",
          linesClass: "reveal-line",
          mask: "lines",
        });

        gsap.set(split.lines, { yPercent: 100 });
        gsap.set(el, { autoAlpha: 1 });

        gsap.to(split.lines, {
          yPercent: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        });
      });

      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [prefersReducedMotion, delay, stagger, start] }
  );

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
