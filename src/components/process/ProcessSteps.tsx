"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { processSteps } from "@/lib/process";

/**
 * The six steps, as cards rather than a timeline.
 *
 * The emotional job here is RELIEF, and that shapes the layout as much as the copy. A long
 * vertical timeline reads as duration — as a thing that will take a while and involve you. Six
 * cards you can take in almost at once read as scope: this is the whole of it, it's short, and
 * it's already understood by the people doing it.
 *
 * Each card is deliberately three sizes of type — numeral, verb, sentence — so the page can be
 * read at three depths. Someone scanning gets six verbs. Someone reading gets the detail. The
 * verb is the thing that has to survive on its own, which is why every one of them is a plain
 * word a client would use.
 *
 * The ghost numeral sits behind the text at low opacity rather than beside it. It gives each
 * card weight without adding a column, which is what keeps the cards from collapsing into a
 * cramped two-column table at tablet widths.
 *
 * Cards reveal in sequence but with a short stagger — long enough to read as ordered, short
 * enough that the set never feels like it's being doled out.
 */
export function ProcessSteps() {
  const listRef = useRef<HTMLOListElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list || prefersReducedMotion) return;

      const cards = gsap.utils.toArray<HTMLElement>("li", list);
      gsap.set(cards, { autoAlpha: 0, y: 24 });

      const trigger = ScrollTrigger.create({
        trigger: list,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: listRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <ol
      ref={listRef}
      className="mx-auto grid max-w-5xl grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3"
    >
      {processSteps.map((step) => (
        <li
          key={step.number}
          className="group relative overflow-hidden bg-[var(--color-bg)] px-8 py-10 transition-colors duration-300 hover:bg-[var(--color-surface)]"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-4 select-none font-black leading-none text-[var(--color-cherry)]/[0.09] transition-transform duration-500 group-hover:-translate-y-1"
            style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(5rem,9vw,7rem)" }}
          >
            {step.number}
          </span>

          <div className="relative">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-cherry)]">
              {step.number} &mdash; {step.label}
            </p>
            <p className="display-face mb-4 text-[clamp(1.15rem,2.2vw,1.5rem)] leading-snug tracking-tight">
              {step.summary}
            </p>
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
