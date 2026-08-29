"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * The "start" button that ends the home page's closing pull-quote. It is built to sit INSIDE a
 * line of prose rather than under it — see the comment at its call site in app/page.tsx for why
 * the padding is in `em`, why it's baseline-aligned, and why it's outlined at rest.
 *
 * On top of that: two seconds after the quote scrolls into view, the button plays its own
 * hover state once, unprompted, then releases. The point is a single "it's alive" beat for a
 * CTA quiet enough to be missed — so it is deliberately once-only (`once: true`), never a loop.
 *
 * Hover and flash drive the SAME visual state rather than two parallel sets of styles: the
 * `data-flash` attribute below is what the `group-data-[flash=true]:` variants key off, so the
 * filled-gradient look is declared once and both paths reach it. Adding a second, hand-copied
 * set of "flash" classes is how the two silently drift apart the next time one is edited.
 *
 * `prefers-reduced-motion` skips the flash entirely — no timer is ever set, no ScrollTrigger is
 * mounted, and the button is exactly the hover-only control it would otherwise be.
 */
const ENTER_DELAY_MS = 2000;
const FLASH_HOLD_MS = 850;

export function QuoteStartCta() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [flash, setFlash] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion) return;

      let delayId: number | undefined;
      let releaseId: number | undefined;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          delayId = window.setTimeout(() => {
            setFlash(true);
            releaseId = window.setTimeout(() => setFlash(false), FLASH_HOLD_MS);
          }, ENTER_DELAY_MS);
        },
      });

      return () => {
        trigger.kill();
        window.clearTimeout(delayId);
        window.clearTimeout(releaseId);
      };
    },
    { dependencies: [prefersReducedMotion] }
  );

  return (
    <TransitionLink
      ref={ref}
      href="/contact"
      aria-label="Start a project"
      data-flash={flash}
      className="group relative inline-block whitespace-nowrap rounded-full border border-[var(--color-cherry)]/45 px-[0.6em] py-[0.06em] align-baseline text-[var(--color-cherry)] transition-[color,border-color,box-shadow] duration-300 hover:border-transparent hover:text-[var(--color-button-primary-text)] hover:shadow-[0_0_28px_var(--color-glow)] data-[flash=true]:border-transparent data-[flash=true]:text-[var(--color-button-primary-text)] data-[flash=true]:shadow-[0_0_28px_var(--color-glow)]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-[flash=true]:opacity-100"
        style={{ backgroundImage: "var(--color-button-primary-bg)" }}
      />
      <span className="relative">start</span>
    </TransitionLink>
  );
}
