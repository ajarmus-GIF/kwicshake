"use client";

import { useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { ScrollThread } from "@/components/atmosphere/ScrollThread";
import type { WinTone } from "@/lib/wins";

/**
 * The Kwic Wins feed mechanics (components/wins/WinsFeed.tsx), generalised so any page can be
 * told as a feed of "beats" — one per screen, zigzagging, the whole background shifting to the
 * beat in view, a giant outlined number sliding behind each frame, and a dotted thread drawn
 * between beats. Home Concept 2 is the first user.
 *
 * A beat is either:
 *   split  — text on one side, a framed `visual` on the other (frame wipes in, tilts away)
 *   stage  — text above, a full-width interactive `stage` below (no wipe/tilt: it has to stay
 *            usable, so it only fades its text in)
 *
 * Hidden states are applied by GSAP on mount, never server-rendered, so with JS off this is a
 * plain visible page. Reduced motion keeps the colour tracking and drops every tween.
 */
export interface Beat {
  id: string;
  tone: WinTone;
  /** Short name for the counter and the eyebrow. */
  label: string;
  title: ReactNode;
  body?: ReactNode;
  /** Framed visual for a split beat. Elements marked `data-beat-photo` get a parallax drift. */
  visual?: ReactNode;
  /** Full-width interactive area for a stage beat. */
  stage?: ReactNode;
}

export function BeatFeed({
  beats,
  intro,
  outro,
}: {
  beats: Beat[];
  intro?: ReactNode;
  outro?: ReactNode;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(-1);
  const [inFeed, setInFeed] = useState(false);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-beat]");

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

      if (cards.length) {
        ScrollTrigger.create({
          trigger: cards[0],
          endTrigger: cards[cards.length - 1],
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => setInFeed(self.isActive),
        });
      }

      if (reduced) return;

      cards.forEach((card) => {
        const dir = card.dataset.side === "right" ? 1 : -1;
        const lines = card.querySelectorAll("[data-beat-line]");
        const number = card.querySelector("[data-beat-number]");

        gsap.from(lines, {
          autoAlpha: 0,
          y: 48,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: card, start: "top 65%", toggleActions: "play none none reverse" },
        });

        if (number) {
          gsap.fromTo(
            number,
            { xPercent: 25 * dir },
            {
              xPercent: -25 * dir,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }

        if (card.dataset.kind !== "split") return;
        const frame = card.querySelector("[data-beat-frame]");
        const tilt = card.querySelector("[data-beat-tilt]");
        const photos = card.querySelectorAll("[data-beat-photo]");

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

        gsap.to(tilt, {
          rotate: -5 * dir,
          scale: 0.86,
          autoAlpha: 0.35,
          ease: "none",
          scrollTrigger: { trigger: card, start: "bottom 75%", end: "bottom top", scrub: 0.6 },
        });

        if (photos.length) {
          gsap.fromTo(
            photos,
            { scale: 1.32, yPercent: -6 },
            {
              scale: 1.2,
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }
      });
    },
    { scope, dependencies: [reduced] }
  );

  const total = String(beats.length).padStart(2, "0");
  // Before the first beat the intro wears the first beat's tone.
  const tone = beats[Math.max(0, active)]?.tone ?? "night";

  return (
    <div ref={scope} data-tone={tone} className="tone-section wins-tone relative overflow-hidden">
      {intro}

      {beats.map((beat, index) => {
        const side = index % 2 === 0 ? "left" : "right";
        const number = String(index + 1).padStart(2, "0");
        const isLast = index === beats.length - 1;
        const kind = beat.stage ? "stage" : "split";

        return (
          <div key={beat.id}>
            <article data-beat data-side={side} data-kind={kind} data-tone={beat.tone} className="relative">
              {kind === "split" ? (
                <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:py-20">
                  <div className={`relative lg:col-span-7 ${side === "right" ? "lg:order-2" : ""}`}>
                    <div
                      className="tone-glow pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                      aria-hidden="true"
                    />
                    <BigNumber number={number} side={side} />
                    <div data-beat-tilt className="relative z-10">
                      <div
                        data-beat-frame
                        className="tone-frame relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] lg:aspect-auto lg:h-[74svh]"
                      >
                        {beat.visual}
                      </div>
                    </div>
                  </div>
                  <BeatText beat={beat} number={number} total={total} />
                </div>
              ) : (
                <div className="relative mx-auto min-h-[100svh] max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
                  <BigNumber number={number} side={side} />
                  <div className="relative z-10 mx-auto max-w-3xl text-center">
                    <BeatText beat={beat} number={number} total={total} center />
                  </div>
                  <div className="relative z-10 mt-4">{beat.stage}</div>
                </div>
              )}
            </article>

            {!isLast && (
              <div data-tone={beats[index + 1].tone} className="mx-auto max-w-6xl px-6">
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

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-full border border-[var(--color-white)]/15 bg-black/35 px-4 py-2.5 font-mono text-[0.7rem] tracking-[0.2em] text-[var(--color-white)] backdrop-blur-md transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
          inFeed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <span className="tone-text tabular-nums">{String(Math.max(0, active) + 1).padStart(2, "0")}</span>
        <span className="hidden uppercase sm:inline">{beats[Math.max(0, active)]?.label}</span>
        <span className="flex gap-1">
          {beats.map((b, index) => (
            <span
              key={b.id}
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

function BigNumber({ number, side }: { number: string; side: "left" | "right" }) {
  return (
    <span
      data-beat-number
      aria-hidden="true"
      className={`display-face tone-outline pointer-events-none absolute -top-[0.42em] z-0 select-none text-[clamp(8rem,24vw,22rem)] leading-none ${
        side === "right" ? "-right-2 lg:-right-10" : "-left-2 lg:-left-10"
      }`}
    >
      {number}
    </span>
  );
}

function BeatText({
  beat,
  number,
  total,
  center = false,
}: {
  beat: Beat;
  number: string;
  total: string;
  center?: boolean;
}) {
  return (
    <div className={`relative z-10 ${center ? "" : "lg:col-span-5"}`}>
      <p data-beat-line className="eyebrow tone-text">
        {number} / {total} · {beat.label}
      </p>
      <h2
        data-beat-line
        className={`mt-5 text-balance text-[clamp(2.1rem,4.8vw,4.25rem)] leading-[1.02] text-[var(--color-white)] ${
          center ? "mx-auto" : ""
        }`}
      >
        {beat.title}
      </h2>
      {beat.body && (
        <div
          data-beat-line
          className={`mt-6 max-w-md text-lg leading-relaxed text-[var(--color-fg)]/80 ${center ? "mx-auto" : ""}`}
        >
          {beat.body}
        </div>
      )}
    </div>
  );
}
