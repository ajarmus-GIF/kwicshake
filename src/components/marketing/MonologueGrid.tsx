"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { ScrollThread } from "@/components/atmosphere/ScrollThread";
import type { MonologueLine } from "@/lib/monologue";
import type { WinTone } from "@/lib/wins";

/**
 * The PROBLEM beat: five sentences in the visitor's own voice, arriving one after another.
 *
 * Laid out the way the Kwic Wins feed is: one card at a time, zigzagging left and right down the
 * page, each in its own tone, with the dotted thread (atmosphere/ScrollThread) drawing from one
 * card to the next. Each card is a `data-tone-step`, so the surrounding ToneShift section takes
 * on its colour as it comes into view — five separate voices, each with its own room.
 *
 * Why not a grid: a tidy block of equal cards reads as "objections we handle", a comparison
 * table. One at a time, the reader gets a beat to recognise themselves in a line before the next
 * one arrives — and the thread makes the set read as one train of thought rather than five.
 *
 * Each card swings in from its own side as it's scrolled to (scrubbed, transform + opacity
 * only). The quotation mark is decoration: `aria-hidden`, while the sentence is a real
 * <blockquote>. Reduced motion gets every card in place, laid out identically.
 */
export const monologueTones: WinTone[] = ["night", "dusk", "nova", "lilac", "cherry"];

export function MonologueGrid({ lines }: { lines: MonologueLine[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.utils.toArray<HTMLElement>("[data-monologue-card]").forEach((card) => {
        const dir = card.dataset.side === "right" ? 1 : -1;
        gsap.fromTo(
          card,
          { autoAlpha: 0, xPercent: 18 * dir, rotate: 5 * dir },
          {
            autoAlpha: 1,
            xPercent: 0,
            rotate: 0,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 95%", end: "top 55%", scrub: 0.6 },
          }
        );
      });
    },
    { scope: listRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <ol ref={listRef} className="mx-auto max-w-5xl">
      {lines.map((line, index) => {
        const tone = monologueTones[index % monologueTones.length];
        const side = index % 2 === 0 ? "left" : "right";
        const next = lines[index + 1];
        return (
          <li key={line.id} data-tone-step={tone}>
            <div className={`flex ${side === "right" ? "justify-end" : ""}`}>
              <blockquote
                data-monologue-card
                data-side={side}
                data-tone={tone}
                className="tone-frame relative w-full overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--tone-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--tone-bg)_70%,black)] px-7 pb-9 pt-16 sm:w-[64%] sm:px-10"
              >
                <span
                  aria-hidden="true"
                  className="display-face tone-outline pointer-events-none absolute -top-3 right-6 select-none text-[7rem] leading-none"
                >
                  &ldquo;
                </span>
                <p className="tone-text mb-4 font-mono text-[0.7rem] uppercase tracking-[0.25em]">
                  {String(index + 1).padStart(2, "0")} / {String(lines.length).padStart(2, "0")}
                </p>
                <p className="display-face relative text-balance text-[clamp(1.35rem,2.8vw,2rem)] leading-snug text-[var(--color-white)]">
                  {line.text}
                </p>
              </blockquote>
            </div>
            {next && (
              <div data-tone={monologueTones[(index + 1) % monologueTones.length]}>
                <ScrollThread
                  from={side === "left" ? 320 : 680}
                  to={side === "left" ? 680 : 320}
                  className="h-16 sm:h-24"
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
