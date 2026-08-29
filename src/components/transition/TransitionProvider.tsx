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
  const isCoveredRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const cover = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return Promise.resolve();

    if (prefersReducedMotion) {
      isCoveredRef.current = true;
      gsap.set(el, { autoAlpha: 1, pointerEvents: "auto" });
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      gsap.killTweensOf(el);
      gsap.set(el, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.fromTo(
        el,
        { scaleY: 0, transformOrigin: "bottom" },
        {
          scaleY: 1,
          duration: 0.5,
          ease: "power3.inOut",
          onStart: () => {
            isCoveredRef.current = true;
          },
          onComplete: resolve,
        }
      );
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
    gsap.fromTo(
      el,
      { scaleY: 1, transformOrigin: "top" },
      {
        scaleY: 0,
        duration: 0.5,
        ease: "power3.inOut",
        delay: 0.05,
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
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] bg-[var(--color-fg)] opacity-0"
        style={{ visibility: "hidden" }}
      />
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
