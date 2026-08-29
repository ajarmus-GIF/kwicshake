"use client";

import { useRef, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useLenis } from "@/components/scroll/SmoothScroll";
import { services } from "@/lib/services";

/** Kept in step with the `id` ServiceShowcase puts on each band. */
export const serviceAnchorId = (number: string) => `service-${number}`;

/**
 * The six services as a jump list, sitting between the marquee and the bands themselves.
 *
 * These are real links, not a decorative preview. /services runs past six full-bleed bands
 * before it reaches its close, and a visitor who arrived for one of them shouldn't have to
 * scroll through the other five to find it — the index is the page's table of contents.
 *
 * Navigation goes through Lenis rather than the browser. Lenis keeps its own virtual scroll
 * position, so a native anchor jump teleports the real scrollTop out from under it and the
 * next wheel event snaps back to where Lenis still thinks the page is. `lenis.scrollTo` moves
 * both together. The `href` stays on the element regardless: it is what makes this a link for
 * middle-click, "open in new tab", and the keyboard, and it is the fallback path when
 * `useLenis()` returns null — which it does under prefers-reduced-motion, where Lenis is never
 * instantiated at all and an instant native jump is exactly the right behaviour.
 *
 * The -96 offset clears the sticky SiteHeader; `scroll-mt-24` on the bands themselves covers
 * the native path, since that route never sees this offset.
 */
export function ServiceIndex() {
  const listRef = useRef<HTMLOListElement>(null);
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list || prefersReducedMotion) return;

      const rows = gsap.utils.toArray<HTMLElement>("li", list);
      gsap.set(rows, { autoAlpha: 0, x: -20 });

      const trigger = ScrollTrigger.create({
        trigger: list,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(rows, {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: listRef, dependencies: [prefersReducedMotion] }
  );

  const handleJump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!lenis) return; // reduced motion: let the browser do its native jump
    event.preventDefault();
    lenis.scrollTo(`#${id}`, { offset: -96 });
  };

  return (
    <ol ref={listRef} className="border-b border-[var(--color-border)]">
      {services.map((service) => {
        const id = serviceAnchorId(service.number);
        return (
          <li key={service.number}>
            <a
              href={`#${id}`}
              onClick={(event) => handleJump(event, id)}
              className="group flex items-center gap-4 border-t border-[var(--color-border)] py-5 transition-colors duration-300 sm:gap-6"
            >
              <span className="tabular-nums text-xs tracking-[0.2em] text-[var(--color-cherry)]">
                {service.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="display-face block text-[clamp(1.15rem,2.4vw,1.6rem)] leading-tight transition-colors duration-300 group-hover:text-[var(--color-cherry)]">
                  {service.title}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {service.kicker}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-[var(--color-cherry)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              >
                &rarr;
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
