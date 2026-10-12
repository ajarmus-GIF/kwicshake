"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { TAGLINE } from "@/lib/site";

/**
 * PageTransition, part 1: the persistent overlay + the context that coordinates it.
 *
 * The technique: the overlay element lives once in the root layout (never remounts), while
 * `app/template.tsx` remounts on every navigation (that's the one guarantee App Router gives
 * us — layout persists, template doesn't). So "cover" and "reveal" are two separate, loosely
 * coupled steps: `cover()` runs *before* navigation, triggered by clicking a `<TransitionLink>`;
 * `reveal()` runs *after*, triggered by the new template.tsx instance mounting. A ref
 * (`isCoveredRef`), not React state, tracks whether the overlay is currently covering — state
 * would cause the provider (and everything below it) to re-render on every transition tick,
 * which is exactly what we don't want from something that only GSAP needs to read.
 *
 * Browser back/forward (popstate) never calls cover() — it doesn't go through TransitionLink —
 * so `isCoveredRef` is already false when the new template mounts, reveal() no-ops, and the
 * browser's native back/forward + scroll restoration behavior is completely untouched. This is
 * the deliberate trade-off: transitions only dress up same-tab, left-click, internal
 * navigations; every other navigation path (back/forward, middle-click, external links) is left
 * alone on purpose rather than fought.
 *
 * Failure mode: firing cover() twice in quick succession (double-click, or a second link click
 * before the first navigation lands) would previously fight the first tween; we guard with a
 * ref check and `gsap.killTweensOf` so the second call always wins cleanly instead of glitching.
 */
type TransitionContextValue = {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  cover: () => Promise<void>;
  reveal: () => void;
  isCoveredRef: React.RefObject<boolean>;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition must be used within TransitionProvider");
  return ctx;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const isCoveredRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const cover = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return Promise.resolve();

    const tag = tagRef.current;

    if (prefersReducedMotion) {
      isCoveredRef.current = true;
      gsap.set(el, { autoAlpha: 1, yPercent: 0, pointerEvents: "auto" });
      if (tag) gsap.set(tag, { autoAlpha: 1 });
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      gsap.killTweensOf([el, tag]);
      gsap.set(el, { autoAlpha: 1, pointerEvents: "auto" });
      // The panel slides rather than scales, so the line on it isn't squashed in transit.
      gsap.fromTo(
        el,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.42,
          ease: "power3.inOut",
          onStart: () => {
            isCoveredRef.current = true;
          },
          onComplete: resolve,
        }
      );
      // The tagline flashes on as the panel lands: a stepped ease reads as a digital flicker
      // (on, off, on) rather than a fade, matching the first-visit intro's decode.
      if (tag) {
        gsap.fromTo(
          tag,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.16, delay: 0.26, ease: "steps(3)" }
        );
      }
    });
  }, [prefersReducedMotion]);

  const reveal = useCallback(() => {
    const el = overlayRef.current;
    if (!el || !isCoveredRef.current) return;

    if (prefersReducedMotion) {
      isCoveredRef.current = false;
      gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
      return;
    }

    gsap.killTweensOf(el);
    // A beat on the line before the panel lifts away, so the flash actually registers.
    gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent: -100,
        duration: 0.45,
        ease: "power3.inOut",
        delay: 0.12,
        onComplete: () => {
          isCoveredRef.current = false;
          gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
        },
      }
    );
  }, [prefersReducedMotion]);

  return (
    <TransitionContext.Provider value={{ overlayRef, cover, reveal, isCoveredRef }}>
      {children}
      {/* The panel between pages: brand purple with the tagline flashing on it. */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] grid place-items-center bg-[var(--color-paper)] bg-[radial-gradient(ellipse_60%_45%_at_50%_50%,var(--color-glow),transparent_70%)] px-6 opacity-0"
        style={{ visibility: "hidden" }}
      >
        <p ref={tagRef} className="intro-tag text-center" style={{ visibility: "hidden" }}>
          {TAGLINE}
          <span className="intro-cursor" />
        </p>
      </div>
    </TransitionContext.Provider>
  );
}

/**
 * PageTransition, part 2: the link that actually triggers `cover()`.
 *
 * Only intercepts the case we can safely animate: plain left-click, no modifier keys, same-tab,
 * internal href. Everything else (middle-click to open in a new tab, ctrl/cmd-click, download
 * links, external URLs) falls through to the browser's default anchor behavior untouched —
 * intercepting those would break "open in new tab" and similar expectations, which is worse
 * than skipping the animation.
 */
type TransitionLinkProps = { href: string } & Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "onClick"
>;

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(function TransitionLink(
  { href, children, className, ...rest },
  ref
) {
  const router = useRouter();
  const { cover } = useTransition();

  const handleClick = useCallback(
    async (event: MouseEvent<HTMLAnchorElement>) => {
      const isModifiedClick =
        event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (isModifiedClick) return;

      event.preventDefault();
      await cover();
      router.push(href);
    },
    [cover, href, router]
  );

  return (
    <a ref={ref} href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
});
