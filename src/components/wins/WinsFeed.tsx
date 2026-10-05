"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ScrollThread } from "@/components/atmosphere/ScrollThread";
import type { Win } from "@/lib/wins";

export type FeedWin = Pick<
  Win,
  "slug" | "title" | "hook" | "format" | "minutes" | "image" | "tone"
>;

/**
 * The Kwic Wins feed: one post per screen, zigzagging left and right down the page, built to be
 * scrolled the way a reel is — each post fills the view, and the next one is always pulling.
 *
 * Three things carry the reader from post to post:
 *
 *   colour  — the whole feed's background shifts to the tone of the post in view (CSS transition
 *             on `data-tone`, see globals.css), so arriving at a new post FEELS like arriving.
 *   motion  — each image frame wipes open from its own side and swings level as it lands, then
 *             tilts away and shrinks as it leaves, while the photo inside drifts on a parallax.
 *   thread  — a dotted line draws itself between posts, from one frame's side to the next, so
 *             the zigzag is literally drawn as you scroll (atmosphere/ScrollThread).
 *
 * Which post is "in view" is tracked in React state, which also drives the counter in the
 * corner. Everything else is scrubbed GSAP on transform / opacity / clip-path only.
 *
 * Like every other reveal on this site, hidden states are applied by GSAP on mount, never
 * server-rendered: with JS off this is a plain, fully visible list of posts. Reduced motion
 * keeps the colour tracking (it is a state change, not movement — and the transition itself is
 * disabled in CSS) and drops every tween.
 */
export function WinsFeed({
  wins,
  intro,
  outro,
}: {
  wins: FeedWin[];
  intro?: ReactNode;
  outro?: ReactNode;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [inFeed, setInFeed] = useState(false);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-win-card]");

      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });

      // The counter only belongs on screen while posts are.
      if (cards.length) {
        ScrollTrigger.create({
          trigger: cards[0],
          endTrigger: cards[cards.length - 1],
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => setInFeed(self.isActive),
        });
      }

      if (prefersReducedMotion) return;

      cards.forEach((card) => {
        // +1 when the image sits on the right, -1 on the left: everything mirrors with it.
        const dir = card.dataset.side === "right" ? 1 : -1;
        const tilt = card.querySelector("[data-win-tilt]");
        const frame = card.querySelector("[data-win-frame]");
        const photo = card.querySelector("[data-win-photo]");
        const number = card.querySelector("[data-win-number]");
        const lines = card.querySelectorAll("[data-win-line]");

        // Arrival: the frame wipes open from its outer edge and swings level.
        gsap.fromTo(
          frame,
          {
            clipPath: dir === 1 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
            rotate: 7 * dir,
            xPercent: 14 * dir,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            rotate: 0,
            xPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 95%", end: "top 25%", scrub: 0.6 },
          }
        );

        // Departure, on a separate wrapper so it never fights the arrival tween for `rotate`.
        gsap.to(tilt, {
          rotate: -5 * dir,
          scale: 0.86,
          autoAlpha: 0.35,
          ease: "none",
          scrollTrigger: { trigger: card, start: "bottom 75%", end: "bottom top", scrub: 0.6 },
        });

        // The photo drifts inside its frame for the whole pass.
        gsap.fromTo(
          photo,
          // Never below 1.2: at that scale the photo overhangs the frame by 10% each way, which
          // is what keeps a ±6% drift from ever showing the frame's edge.
          { scale: 1.32, yPercent: -6 },
          {
            scale: 1.2,
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          }
        );

        // The giant number slides the opposite way to the frame — two layers, felt as depth.
        gsap.fromTo(
          number,
          { xPercent: 25 * dir },
          {
            xPercent: -25 * dir,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          }
        );

        gsap.from(lines, {
          autoAlpha: 0,
          y: 48,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: card, start: "top 60%", toggleActions: "play none none reverse" },
        });
      });
    },
    { scope, dependencies: [prefersReducedMotion] }
  );

  const total = String(wins.length).padStart(2, "0");

  return (
    <div
      ref={scope}
      data-tone={wins[active]?.tone ?? "violet"}
      className="wins-tone relative overflow-hidden text-[var(--color-fg)]"
    >
      {intro}

      {wins.map((win, index) => {
        const side = index % 2 === 0 ? "left" : "right";
        const number = String(index + 1).padStart(2, "0");
        const href = `/wins/${win.slug}`;
        const isLast = index === wins.length - 1;

        return (
          <div key={win.slug}>
            <article data-win-card data-side={side} data-tone={win.tone} className="relative">
              <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:py-20">
                <div className={`relative lg:col-span-7 ${side === "right" ? "lg:order-2" : ""}`}>
                  <div
                    className="tone-glow pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    aria-hidden="true"
                  />
                  <span
                    data-win-number
                    aria-hidden="true"
                    className={`display-face tone-outline pointer-events-none absolute -top-[0.42em] z-0 select-none text-[clamp(8rem,24vw,22rem)] leading-none ${
                      side === "right" ? "-right-2 lg:-right-10" : "-left-2 lg:-left-10"
                    }`}
                  >
                    {number}
                  </span>

                  <div data-win-tilt className="relative z-10">
                    <TransitionLink
                      href={href}
                      data-win-frame
                      tabIndex={-1}
                      aria-hidden="true"
                      className="tone-frame relative block aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] lg:aspect-auto lg:h-[78svh]"
                    >
                      <div data-win-photo className="absolute inset-0">
                        <Image
                          src={win.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 58vw, 100vw"
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                      <div
                        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent"
                        aria-hidden="true"
                      />
                      <span className="absolute bottom-5 left-5 rounded-full bg-black/45 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-white)] backdrop-blur-sm">
                        Free · {win.format}
                      </span>
                    </TransitionLink>
                  </div>
                </div>

                <div className="relative z-10 lg:col-span-5">
                  <p
                    data-win-line
                    className="tone-text font-mono text-xs uppercase tracking-[0.25em]"
                  >
                    {number} / {total} · {win.format} · {win.minutes} min
                  </p>
                  <h2
                    data-win-line
                    className="mt-5 text-balance text-[clamp(2.1rem,4.8vw,4.25rem)] leading-[1.02] text-[var(--color-white)]"
                  >
                    <TransitionLink href={href} className="hover:underline hover:underline-offset-8">
                      {win.title}
                    </TransitionLink>
                  </h2>
                  <p
                    data-win-line
                    className="mt-6 max-w-md text-lg leading-relaxed text-[var(--color-fg)]/80"
                  >
                    {win.hook}
                  </p>
                  <div data-win-line className="mt-9">
                    <TransitionLink
                      href={href}
                      aria-label={`Get it free: ${win.title}`}
                      className="tone-fill inline-flex items-center gap-3 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-widest"
                    >
                      Get it free
                      <span aria-hidden="true">→</span>
                    </TransitionLink>
                  </div>
                </div>
              </div>
            </article>

            {!isLast && (
              <div data-tone={wins[index + 1].tone} className="mx-auto max-w-6xl px-6">
                <ScrollThread
                  from={side === "left" ? 250 : 750}
                  to={side === "left" ? 750 : 250}
                  className="h-24 sm:h-36"
                />
              </div>
            )}
          </div>
        );
      })}

      {outro}

      {/* Position counter — like the dots on a carousel, it tells a scroller how deep they are and
          that more is coming. Hidden from assistive tech: each post already says "02 / 05". */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-full border border-[var(--color-white)]/15 bg-black/35 px-4 py-2.5 font-mono text-[0.7rem] tracking-[0.2em] text-[var(--color-white)] backdrop-blur-md transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
          inFeed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <span className="tone-text tabular-nums">
          {String(active + 1).padStart(2, "0")}
        </span>
        <span className="flex gap-1">
          {wins.map((win, index) => (
            <span
              key={win.slug}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === active ? "tone-fill w-5" : "w-1.5 bg-[var(--color-white)]/30"
              }`}
            />
          ))}
        </span>
        <span className="tabular-nums opacity-60">{total}</span>
      </div>
    </div>
  );
}
