"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePreloader } from "@/components/preloader/Preloader";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { HeroHeader } from "@/components/home/HeroHeader";

/**
 * The preloader "hands off to the hero animation" concretely: this component reads
 * `usePreloader()` and only fires its entrance timeline once `ready` flips true — either
 * because the counter finished, or immediately if this session already saw the preloader (see
 * Preloader.tsx's sessionStorage check) or if it's not the very first client-rendered route.
 * Heading text itself is always in the DOM (server-rendered, real text) — only its opacity/y
 * are animated, and only once JS confirms it's running. The "Kwic Shake" wordmark rides the same
 * gate but runs its own timeline (letters falling in, then a damped wobble) instead of the shared
 * line stagger.
 *
 * The hero image itself isn't a standard vertical-drift parallax — it's a scrubbed 3D tilt:
 * as the section scrolls past, the image wrapper rotates back on its top edge (`rotateX`, with
 * `transformOrigin: "50% 0%"` and a `perspective` on the section giving it somewhere to rotate
 * into), scales up, and drifts down slightly, so it reads as the photo tipping away/falling
 * back into the page rather than just sliding at a different speed than the scroll. The extra
 * scale (`1 -> 1.22`) exists specifically to keep the rotated, drifted image covering the
 * section's `overflow-hidden` bounds with no gap at the edges — cutting that margin closer
 * reveals the section background peeking through at the top as it tilts.
 */
const BRAND = "Kwic Shake";

export function HomeHero() {
  const ready = usePreloader();
  const scope = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (ready && !prefersReducedMotion) {
        gsap.fromTo(
          "[data-hero-line]",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.1 }
        );

        // Wordmark drops in per letter, then the whole lockup wobbles on its baseline. The
        // fall and the tilt are separate tweens at the same timeline position on purpose:
        // `bounce.out` on y is what sells "landed", but running rotation through the same
        // ease makes each letter judder at every bounce contact instead of settling once.
        gsap.set(wordmarkRef.current, { transformOrigin: "0% 100%" });
        const tl = gsap.timeline({ delay: 0.15 });

        tl.fromTo(
          "[data-hero-char]",
          { yPercent: -240 },
          { yPercent: 0, duration: 0.9, ease: "bounce.out", stagger: 0.05 }
        )
          .fromTo(
            "[data-hero-char]",
            { autoAlpha: 0, rotate: -18 },
            { autoAlpha: 1, rotate: 0, duration: 0.45, ease: "power2.out", stagger: 0.05 },
            "<"
          )
          // Damped wiggle on the lockup as a whole — pivoting at its bottom-left so it reads
          // as the sign rocking on the letter it landed on, not spinning about its middle.
          .to(wordmarkRef.current, { rotate: 3, duration: 0.13, ease: "power1.inOut" }, "-=0.1")
          .to(wordmarkRef.current, { rotate: -2.2, duration: 0.13, ease: "power1.inOut" })
          .to(wordmarkRef.current, { rotate: 1.4, duration: 0.11, ease: "power1.inOut" })
          .to(wordmarkRef.current, { rotate: -0.8, duration: 0.11, ease: "power1.inOut" })
          .to(wordmarkRef.current, { rotate: 0, duration: 0.16, ease: "power2.out" });
      }

      const section = scope.current;
      const imageWrap = imageWrapRef.current;
      if (!section || !imageWrap || prefersReducedMotion) return;

      gsap.set(imageWrap, { transformOrigin: "50% 0%", transformPerspective: 1200 });

      const tween = gsap.to(imageWrap, {
        rotateX: -10,
        scale: 1.22,
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope, dependencies: [ready, prefersReducedMotion] }
  );

  return (
    <section
      ref={scope}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-24 text-[var(--color-on-dark)]"
      style={{ perspective: "1200px" }}
    >
      <div ref={imageWrapRef} className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* Light scrim, just enough to keep text legible without hiding the photo — the rest of
          the legibility work rides on the layered text-shadow classes below (see globals.css),
          not a background panel. */}
      <div aria-hidden="true" className="absolute inset-0 bg-[var(--color-raised)]/20" />

      {/* Nav bar. Lives inside the hero rather than in page.tsx because it has to sit on top
          of the photo, and as `imageWrapRef`'s sibling rather than its child so the scroll
          tilt doesn't take it along. First in DOM order so it leads the `[data-hero-line]`
          stagger — and so tabbing into the page reaches the links before the hero CTAs. */}
      <HeroHeader />

      <div className="relative max-w-xl">
        {/* Brand lockup, not an eyebrow — deliberately NOT tagged `data-hero-line`, since it
            gets its own drop-and-wobble timeline above rather than the shared line stagger.
            Letters are split in JSX (no SplitText) because the split is fixed, known text; the
            per-letter spans carry `aria-hidden` with the real string in an `sr-only` sibling so
            a screen reader hears "Kwic Shake" rather than ten separate letters. */}
        <p className="hero-text-shadow mb-4">
          <span className="sr-only">{BRAND}</span>
          <span
            ref={wordmarkRef}
            aria-hidden="true"
            className="brand-wordmark inline-block text-[clamp(1.75rem,4.5vw,3rem)] uppercase leading-none tracking-[0.06em]"
          >
            {/* "Kwic" white, "Shake" the sampled brand gradient (--gradient-shake, see
                globals.css) — split into two colored groups but still one flat character
                stream for the fall/wobble timeline, which targets [data-hero-char] by
                attribute regardless of which group each letter sits in. */}
            <span className="text-[var(--color-white)]">
              {"Kwic ".split("").map((char, index) => (
                <span key={`kwic-${index}`} data-hero-char className="inline-block whitespace-pre">
                  {char}
                </span>
              ))}
            </span>
            <span
              className="hero-gradient-shadow bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-shake)" }}
            >
              {"Shake".split("").map((char, index) => (
                <span key={`shake-${index}`} data-hero-char className="inline-block whitespace-pre">
                  {char}
                </span>
              ))}
            </span>
          </span>
        </p>
        {/* Eyebrow + oversized gradient-split headline: the same treatment /services uses on
            its hero (see services/page.tsx), ported here so the two hero styles match. */}
        <p
          data-hero-line
          className="hero-text-shadow mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]"
        >
          + A Digital Marketing Agency
        </p>
        <h1 className="hero-text-shadow max-w-3xl text-[clamp(2.75rem,7.5vw,6rem)] font-medium leading-[1.02] tracking-tight">
          <span data-hero-line className="block text-[var(--color-white)]">
            Let&apos;s Go
          </span>
          {/* Solid --color-cherry, not a gradient into --color-nova-secondary — see the
              contrast note on that token in globals.css: it's a background/button color only,
              ~2.4:1 as text, so fading into it here was the illegible part. --color-cherry is
              the one purple in this palette proven at 4.5:1+ for text. */}
          <span data-hero-line className="block text-[var(--color-cherry)]">
            Beyond A Website
          </span>
        </h1>
        <p
          data-hero-line
          className="hero-text-shadow mt-6 max-w-md text-base text-[var(--color-on-dark)]/85 sm:text-lg"
        >
          Web design, social strategy, and brand consulting — built to turn attention into
          actual customers.
        </p>

        {/* CTA lives in the text column now, not floated off to the frame's opposite edge —
            a primary button paired with a lighter secondary link, same pairing pattern the
            hero on /services uses. */}
        <div data-hero-line className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <MagneticButton
            as={TransitionLink}
            href="/contact"
            radius={100}
            className="btn-hero-white inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest"
          >
            Let&apos;s Chat
          </MagneticButton>
          <TransitionLink
            href="/work"
            className="hero-text-shadow text-sm font-semibold uppercase tracking-widest text-[var(--color-on-dark)] underline decoration-[var(--color-cherry)] underline-offset-4 transition-colors hover:text-[var(--color-cherry)]"
          >
            View Our Work →
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
