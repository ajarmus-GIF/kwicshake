"use client";

import { useRef } from "react";
import { getImageProps } from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { HeroHeader } from "@/components/home/HeroHeader";
import { SparkField } from "@/components/atmosphere/SparkField";
import { BuildText } from "@/components/text/BuildText";
import { HERO_LINE_FROM, HERO_LINE_TO } from "@/components/text/HeroEntrance";
import { DESCRIPTOR } from "@/lib/site";

/**
 * The hero entrance timeline fires on mount. Heading text is always in the DOM (server-rendered,
 * real text) — only its opacity/y are animated, and only once JS confirms it's running, so the
 * copy is still readable with JS off. The "Kwic Shake" wordmark runs its own timeline (letters
 * falling in, then a damped wobble) instead of the shared line stagger.
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

const heroImageShared = { alt: "", fill: true, priority: true, sizes: "100vw" } as const;
const { props: desktopHero } = getImageProps({
  ...heroImageShared,
  src: "/images/hero-bg-desktop.jpg",
});
const { props: mobileHero } = getImageProps({
  ...heroImageShared,
  src: "/images/hero-bg-mobile.jpg",
});

export function HomeHero() {
  const scope = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!prefersReducedMotion) {
        gsap.fromTo("[data-hero-line]", HERO_LINE_FROM, HERO_LINE_TO);

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
    { scope, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={scope}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-24 pt-44 text-[var(--color-on-dark)] sm:pt-28"
      style={{ perspective: "1200px" }}
    >
      <div ref={imageWrapRef} className="absolute inset-0">
        {/* Art-directed: a portrait phone shot below `sm`, the landscape laptop shot above it.
            A <picture> rather than two <Image>s toggled with `hidden`, so each device only
            downloads the one it shows. The breakpoint matches Tailwind's `sm` (640px). */}
        <picture>
          <source media="(max-width: 639px)" srcSet={mobileHero.srcSet} sizes={mobileHero.sizes} />
          <img {...desktopHero} alt="" className="object-cover" />
        </picture>
      </div>
      {/* Legibility scrim, weighted toward the text column rather than flat across the frame.
          A flat 20% wash was enough for the old three-word slogan, which sat on a quiet corner
          of the photo; the headline is now a full question crossing the brightest part of the
          image, and the text-shadow classes alone were not carrying it — least of all on mobile,
          where the copy spans nearly the whole frame.

          Angled at 100deg and released to fully transparent by the right edge, so the photograph
          still reads as a photograph rather than as a tinted panel with type on it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, color-mix(in srgb, var(--color-paper) 88%, transparent) 0%, color-mix(in srgb, var(--color-paper) 66%, transparent) 42%, color-mix(in srgb, var(--color-paper) 22%, transparent) 74%, transparent 100%)",
        }}
      />

      {/* Spark layer. Deliberately a sibling of the image wrapper rather than a child: the
          hero image is scrubbed through a 3D rotateX as the section scrolls, and parenting the
          sparks to it would tilt their travel paths along with the photo. Sitting above the
          scrim means they read as light in front of the image rather than light buried under a
          purple wash. `streak` is the home page's variant and is used nowhere else. */}
      <SparkField variant="streak" />

      {/* Nav bar. Lives inside the hero rather than in page.tsx because it has to sit on top
          of the photo, and as `imageWrapRef`'s sibling rather than its child so the scroll
          tilt doesn't take it along. First in DOM order so it leads the `[data-hero-line]`
          stagger — and so tabbing into the page reaches the links before the hero CTAs. */}
      <HeroHeader />

      <div className="relative max-w-3xl">
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
            {/* "Kwic" white, "Shake" the brand gradient via .brand-shake (see globals.css)
                — split into two colored groups but still one flat character stream for the
                fall/wobble timeline, which targets [data-hero-char] by attribute regardless
                of which group each letter sits in. */}
            <span className="text-[var(--color-white)]">
              {"Kwic ".split("").map((char, index) => (
                <span key={`kwic-${index}`} data-hero-char className="inline-block whitespace-pre">
                  {char}
                </span>
              ))}
            </span>
            {/* .brand-shake goes on EACH LETTER, not on this wrapper.

                background-clip:text clips the gradient to the glyphs of the element that owns
                the background. These letters are inline-block AND transformed by the hero's
                drop/wobble timeline, and a transformed inline-block child establishes its own
                paint context — so a gradient clipped on this wrapper never reaches them. They
                inherited `color: transparent` with nothing painting behind it and rendered
                invisible, which is why the lockup read as "KWIC" with a gap after it.

                Per-letter clipping is visually identical here because --gradient-shake runs
                180deg (top to bottom): every letter gets the same vertical ramp whether the
                gradient is clipped across the word or per glyph. It would NOT be identical for
                a horizontal gradient — that would restart on each letter. If the gradient's
                angle ever changes, this needs revisiting. */}
            <span className="hero-gradient-shadow">
              {"Shake".split("").map((char, index) => (
                <span
                  key={`shake-${index}`}
                  data-hero-char
                  className="brand-shake inline-block whitespace-pre"
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        </p>
        {/* Eyebrow + oversized gradient-split headline: the same treatment /services uses on
            its hero (see services/page.tsx), ported here so the two hero styles match. */}
        {/* The descriptor resolves character by character on load — the site's first and
            quietest "this thing is being built in front of you" moment, and the only one above
            the fold. It sits on the eyebrow rather than the H1 on purpose: the headline is the
            emotional hook and has to be readable the instant it appears, whereas a category
            label can afford half a second of theatre. The "+" stays static so the line has a
            fixed left edge to resolve away from. */}
        <p
          data-hero-line
          className="hero-text-shadow mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]"
        >
          + <BuildText text={DESCRIPTOR} delay={700} />
        </p>
        {/* The hook. A question, not a claim: it hands the reader the judgement instead of
            making it for them, and the honest answer for most visitors is "no" — which is the
            entire reason they keep scrolling.

            Sized down from the old three-word slogan's clamp (max 6rem) because this is a full
            sentence; at that size the second line wrapped on a laptop and the colour change
            landed mid-phrase. The two lines are the two halves of the question, so the break
            between them is meaningful and `block` keeps it fixed. */}
        <h1 className="hero-text-shadow max-w-4xl text-[clamp(2.25rem,5.6vw,4.5rem)] font-medium leading-[1.05] tracking-tight">
          <span data-hero-line className="block text-[var(--color-white)]">
            You built a great business.
          </span>
          {/* Solid --color-cherry, not a gradient into --color-nova-secondary — see the
              contrast note on that token in globals.css: it's a background/button color only,
              ~2.4:1 as text, so fading into it here was the illegible part. --color-cherry is
              the one purple in this palette proven at 4.5:1+ for text. */}
          <span data-hero-line className="block text-[var(--color-cherry)]">
            Does your marketing show it?
          </span>
        </h1>
        <p
          data-hero-line
          className="hero-text-shadow mt-6 max-w-md text-base text-[var(--color-on-dark)]/85 sm:text-lg"
        >
          A great business can still look forgettable online. We fix the part people see
          first.
        </p>

        {/* Two CTAs, both deliberately low-pressure. The primary asks for a conversation
            rather than a project or a quote, because the visitor this page is written for has
            been sold to before and is scanning for the trap. The secondary sends people to the
            proof instead — someone who isn't ready to talk should have somewhere to go that
            isn't a form. */}
        <div data-hero-line className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <MagneticButton
            as={TransitionLink}
            href="/contact"
            radius={100}
            className="btn-hero-white inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest"
          >
            Start a Conversation
          </MagneticButton>
          <TransitionLink
            href="/work"
            className="hero-text-shadow text-sm font-semibold uppercase tracking-widest text-[var(--color-on-dark)] underline decoration-[var(--color-cherry)] underline-offset-4 transition-colors hover:text-[var(--color-cherry)]"
          >
            See What We&apos;ve Built →
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
