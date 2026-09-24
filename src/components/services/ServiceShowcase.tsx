"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { TextReveal } from "@/components/text/TextReveal";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import type { Service } from "@/lib/services";
import { serviceAnchorId } from "@/components/services/ServiceIndex";

/**
 * One full-bleed service band on /services. Was inline JSX in that page with only two moving
 * parts (TextReveal on the heading and body, ServiceIcon's stroke-draw); pulled into a client
 * component so the rest of the band — numeral, medallion, ring, kicker rule, bullet chips —
 * could animate too without dragging a GSAP scope into the page module.
 *
 * The animations split into two kinds, and the split is deliberate:
 *
 * SCRUBBED (tied to scroll position, run the whole time the band is on screen) — the ghost
 * numeral drifts vertically and outward, the glow drifts against it, and the dashed ring
 * turns. These are what make the band feel alive while you read it rather than only at the
 * moment it arrives. All three are `ease: "none"`, because a scrubbed tween with an ease
 * makes scrolling feel like it is fighting the page.
 *
 * ONE-SHOT (fire once on entry) — medallion pop, kicker rule, bullet stagger. Sequenced by
 * ScrollTrigger start percentages rather than one timeline so each piece answers to its own
 * position: the medallion leads at "top 88%", ServiceIcon draws its strokes at "top 85%" (see
 * that component), and the chips land last at "top 75%". Reading down the band, things arrive
 * in the order the eye reaches them.
 *
 * No infinite loops here on purpose. GrowthFunnel's falling motes are the page's one idling
 * timeline, and they earn it by being the literal subject of that section; a band that pulses
 * forever while you read its body copy just competes with the copy.
 *
 * `prefers-reduced-motion` mounts no ScrollTriggers at all and leaves every element exactly as
 * server-rendered — visible, in place, fully readable. Every hidden start state below is set
 * inside useGSAP for that reason: nothing is hidden in markup, so a no-JS visitor sees the
 * finished band too.
 */
export function ServiceShowcase({
  service,
  icon,
  index,
}: {
  service: Service;
  icon: ReactNode;
  index: number;
}) {
  const reversed = index % 2 === 1;
  const raised = index % 2 === 1;

  const sectionRef = useRef<HTMLElement>(null);
  const numeralRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const medallionRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const kickerRef = useRef<HTMLSpanElement>(null);
  const bulletsRef = useRef<HTMLUListElement>(null);

  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion) return;

      const scrub = {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true as const,
        invalidateOnRefresh: true,
      };

      // Numeral drifts up and further off its own edge; the glow drifts the other way. Two
      // rates in opposite directions is what reads as depth — matching rates would just look
      // like the whole band sliding.
      gsap.fromTo(
        numeralRef.current,
        { yPercent: 14, xPercent: reversed ? -6 : 6 },
        { yPercent: -14, xPercent: reversed ? 6 : -6, ease: "none", scrollTrigger: scrub }
      );
      gsap.fromTo(
        glowRef.current,
        { yPercent: -12 },
        { yPercent: 12, ease: "none", scrollTrigger: scrub }
      );
      gsap.fromTo(
        ringRef.current,
        { rotation: 0 },
        { rotation: 140, transformOrigin: "50% 50%", ease: "none", scrollTrigger: scrub }
      );

      // Medallion leads the entry, just ahead of ServiceIcon's own stroke-draw, so the disc is
      // already there for the icon to be drawn onto rather than both appearing at once.
      gsap.fromTo(
        medallionRef.current,
        { autoAlpha: 0, scale: 0.62, rotate: reversed ? 14 : -14 },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 1.05,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: section, start: "top 88%", once: true },
        }
      );

      // Rule wipes out from the kicker's first letter, then the word follows it.
      gsap.fromTo(
        ruleRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        }
      );
      gsap.fromTo(
        kickerRef.current,
        { autoAlpha: 0, x: -12 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        }
      );

      const chips = bulletsRef.current?.children;
      if (chips?.length) {
        gsap.fromTo(
          chips,
          { autoAlpha: 0, y: 18, scale: 0.9 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: "back.out(2)",
            stagger: 0.07,
            scrollTrigger: { trigger: bulletsRef.current, start: "top 88%", once: true },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === section || t.trigger === bulletsRef.current)
          .forEach((t) => t.kill());
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion, reversed] }
  );

  return (
    <section
      ref={sectionRef}
      id={serviceAnchorId(service.number)}
      /* scroll-mt clears the sticky SiteHeader on the native-anchor path (reduced motion,
         where Lenis never mounts). The Lenis path uses its own offset — see ServiceIndex. */
      className={`relative scroll-mt-24 overflow-hidden px-6 py-28 sm:py-36 ${
        raised ? "bg-[var(--color-raised)] text-[var(--color-on-dark)]" : ""
      }`}
    >
      <span
        ref={numeralRef}
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 select-none font-black leading-none text-[clamp(9rem,26vw,20rem)]"
        style={{
          fontFamily: "var(--font-display), sans-serif",
          color: "color-mix(in srgb, var(--color-cherry) 12%, transparent)",
          [reversed ? "left" : "right"]: "clamp(-2rem, -2vw, 1rem)",
        }}
        aria-hidden="true"
      >
        {service.number}
      </span>

      {/* Scrim over the numeral only. It sits between the numeral and everything else (the
          glow and the copy come after it in paint order), so it knocks the purple digits back
          behind the purple kicker and closer without dimming the glow or the text. Uses the
          band's own ground so it reads as depth, not as a tinted panel. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `color-mix(in srgb, ${
            raised ? "var(--color-raised)" : "var(--color-bg)"
          } 60%, transparent)`,
        }}
        aria-hidden="true"
      />

      <div
        ref={glowRef}
        className={`pointer-events-none absolute top-1/2 h-[45vw] max-h-[520px] w-[45vw] max-w-[520px] -translate-y-1/2 rounded-full opacity-[0.22] blur-3xl ${
          reversed ? "right-[-12%]" : "left-[-12%]"
        }`}
        style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
        aria-hidden="true"
      />

      <div
        className={`relative mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-center md:gap-16 ${
          reversed ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="shrink-0">
          <div ref={medallionRef} className="relative h-28 w-28 sm:h-36 sm:w-36">
            {/* Dashed ring, turning on scroll. It sits outside the filled disc so the rotation
                is legible — a dashed edge on the disc itself reads as a rendering artifact. */}
            <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <circle
                ref={ringRef}
                cx="60"
                cy="60"
                r="57"
                fill="none"
                stroke="var(--color-cherry)"
                strokeWidth="1"
                strokeDasharray="3 9"
                opacity="0.55"
              />
            </svg>
            <div
              className="flex h-full w-full items-center justify-center rounded-full"
              style={{
                background: "color-mix(in srgb, var(--color-cherry) 10%, transparent)",
                boxShadow: "0 0 40px var(--color-glow)",
              }}
            >
              <ServiceIcon className="h-16 w-16 text-[var(--color-cherry)] sm:h-20 sm:w-20">
                {icon}
              </ServiceIcon>
            </div>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            <span
              ref={ruleRef}
              aria-hidden="true"
              className="block h-px w-8 origin-left bg-[var(--color-cherry)]"
            />
            <span ref={kickerRef} className="block">
              {service.kicker}
            </span>
          </p>
          <TextReveal
            as="h2"
            className="mb-6 text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.05] tracking-tight"
          >
            {service.title}
          </TextReveal>
          {/* Three tiers of copy under the title, and the order is the site's whole
              ordering principle in miniature: provocation, then explanation, then the line
              you remember.

              `hook` is set larger and in the foreground colour because it has to be read —
              it argues with something the visitor already believes ("you don't need to post
              more"), and that argument is what makes the paragraph beneath it worth reading.
              Demote it to body size and the band reverts to a service listing.

              `description` sits muted underneath. It is the only part that describes what we
              actually do, and it is deliberately the least prominent of the three.

              `closer` is the punchline: every service has one, set bold in the display face
              and cherry so it's the line the eye lands on last and remembers. */}
          <TextReveal
            as="p"
            className="mb-5 text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-snug tracking-tight"
          >
            {service.hook}
          </TextReveal>
          <TextReveal
            as="p"
            className={`mb-6 text-base leading-relaxed ${
              raised ? "text-[var(--color-on-dark)]/60" : "text-[var(--color-muted)]"
            }`}
          >
            {service.description}
          </TextReveal>
          <TextReveal
            as="p"
            className="display-face mb-8 text-balance text-[clamp(1.35rem,2.6vw,1.9rem)] leading-tight text-[var(--color-cherry)]"
          >
            {service.closer}
          </TextReveal>
          <ul ref={bulletsRef} className="mt-2 flex flex-wrap gap-3">
            {service.bullets.map((bullet) => (
              <li
                key={bullet}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 hover:border-[var(--color-cherry)] hover:text-[var(--color-cherry)] ${
                  raised
                    ? "border-[var(--color-on-dark)]/20 text-[var(--color-on-dark)]/70"
                    : "border-[var(--color-border)] text-[var(--color-muted)]"
                }`}
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
