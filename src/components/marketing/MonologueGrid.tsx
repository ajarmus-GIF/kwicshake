"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import type { MonologueLine } from "@/lib/monologue";

/**
 * The PROBLEM beat: five sentences in the visitor's own voice, arriving one after another.
 *
 * Three decisions carry this, and all of them are about making it read as thought rather than
 * as copy:
 *
 * 1. **They are staggered, not gridded.** A tidy 2x3 of equal cards reads as "objections we
 *    handle" — a comparison table. Alternating vertical offsets and letting each card size to
 *    its own text makes the set read as scattered, which is how these thoughts actually arrive.
 *
 * 2. **They fade up in sequence on scroll.** The rhythm is the point: each line lands, then the
 *    next one. Shown all at once they are a wall of quotes; shown in sequence the reader gets a
 *    beat to recognise themselves in one before the next arrives.
 *
 * 3. **The quotation mark is decoration, not punctuation.** It's `aria-hidden` and oversized
 *    behind the text. The sentences are marked up as real <blockquote> elements, so a screen
 *    reader announces them as quotations without hearing a stray glyph.
 *
 * Reduced motion gets the full set immediately, laid out identically. The stagger is emphasis,
 * never the difference between readable and not.
 */
export function MonologueGrid({ lines }: { lines: MonologueLine[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list || prefersReducedMotion) return;

      const cards = gsap.utils.toArray<HTMLElement>("li", list);
      gsap.set(cards, { autoAlpha: 0, y: 28 });

      const trigger = ScrollTrigger.create({
        trigger: list,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.14,
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: listRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <ul
      ref={listRef}
      className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
    >
      {lines.map((line, index) => (
        <li
          key={line.id}
          /* Every other card drops half a step on desktop, and the last one centers itself
             when it would otherwise sit alone in a half-width column. Both are what stop the
             set from resolving into a table. */
          className={`${index % 2 === 1 ? "sm:mt-12" : ""} ${
            index === lines.length - 1 && lines.length % 2 === 1
              ? "sm:col-span-2 sm:mx-auto sm:max-w-md"
              : ""
          }`}
        >
          <blockquote className="relative h-full border border-[var(--color-border)] bg-[var(--color-surface)] px-7 pb-8 pt-14 transition-colors duration-300 hover:border-[var(--color-cherry)]/40">
            {/* Sits ABOVE the text, not behind it. Overlapping the first line made the
                opening word look broken rather than decorated, so the card carries extra top
                padding (pt-14) and the glyph occupies that space on its own. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-6 top-3 select-none font-black leading-none text-[var(--color-cherry)]/25"
              style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "3rem" }}
            >
              &ldquo;
            </span>
            <p className="relative text-[clamp(1.05rem,2.1vw,1.35rem)] leading-snug">
              {line.text}
            </p>
          </blockquote>
        </li>
      ))}
    </ul>
  );
}
