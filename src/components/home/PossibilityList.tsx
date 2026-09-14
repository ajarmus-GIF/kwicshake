"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * The POSSIBILITY beat: the reader picturing the better version of their own business.
 *
 * Each line names one discipline by its OUTCOME rather than its name — "Social media that
 * actually sounds like you", not "Social Media Strategy". That is the whole difference between
 * this section and the services page. Here the reader is imagining; there they are evaluating.
 * The moment a line reads like a deliverable, the daydream stops.
 *
 * The lines arrive one at a time on scroll, and the rhythm is doing real work: it's the pace of
 * someone picturing each thing in turn. All five at once is a feature list.
 *
 * The closing couplet is separated from the list because it is a rhetorical turn, not a sixth
 * item — "Marketing that doesn't just exist." only means something once the five concrete lines
 * above have been read.
 */
const possibilities = [
  "A website that represents the business you've built.",
  "Social media that actually sounds like you.",
  "A brand people recognize.",
  "Advertising with a purpose.",
  "Search visibility that brings the right people to your door.",
];

export function PossibilityList() {
  const listRef = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list || prefersReducedMotion) return;

      const rows = gsap.utils.toArray<HTMLElement>("li", list);
      gsap.set(rows, { autoAlpha: 0, x: -18 });

      const trigger = ScrollTrigger.create({
        trigger: list,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(rows, {
            autoAlpha: 1,
            x: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.12,
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: listRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <ul ref={listRef} className="border-t border-[var(--color-border)]">
      {possibilities.map((line) => (
        <li
          key={line}
          className="group flex items-baseline gap-5 border-b border-[var(--color-border)] py-6 sm:gap-7 sm:py-7"
        >
          <span
            aria-hidden="true"
            className="shrink-0 text-[var(--color-cherry)] transition-transform duration-300 group-hover:translate-x-1"
          >
            &rarr;
          </span>
          <span className="text-[clamp(1.15rem,2.8vw,1.75rem)] leading-snug">{line}</span>
        </li>
      ))}
    </ul>
  );
}
