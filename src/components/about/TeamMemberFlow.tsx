"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import type { TeamMember } from "@/lib/team";

/**
 * One founder, presented as a scroll rather than a bio block: a sticky identity panel holds his
 * name, role, and portrait in place on one side while his beats stream past on the other. The
 * two halves of the pair mirror each other (`align`), so the page alternates instead of running
 * the same column twice.
 *
 * Why sticky and not a pinned/scrubbed ScrollTrigger: two of these sit back to back on /about,
 * and stacking two pinned sections is exactly the fragile arrangement HorizontalScroll's own
 * docstring warns about. `position: sticky` costs nothing, never jacks the scroll, and degrades
 * to a normal stacked block below `md` with no JS involved.
 *
 * The reading aid is the counter: each beat owns a ScrollTrigger that reports itself as active
 * while it sits in the middle of the viewport, driving both "03 / 08" in the panel and the
 * highlight on that beat's index. Progress is always visible, which is what keeps sixteen facts
 * from feeling like a wall — the reader can see how short the list actually is. That counter is
 * position readout, not motion, so it runs even under `prefers-reduced-motion`; only the reveals
 * and the scrubbed progress bar are gated on it.
 *
 * Every beat is server-rendered visible. The entrance state is applied by `gsap.from` inside
 * `useGSAP` — never a server-rendered class — so a visitor without JS gets the full list as
 * plain text, matching TextReveal's rule everywhere else in this app.
 */
export function TeamMemberFlow({
  member,
  align,
}: {
  member: TeamMember;
  align: "left" | "right";
}) {
  const scope = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [activeBeat, setActiveBeat] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const beats = gsap.utils.toArray<HTMLElement>("[data-beat]");

      beats.forEach((beat, index) => {
        // Position readout — deliberately outside the reduced-motion guard.
        ScrollTrigger.create({
          trigger: beat,
          start: "top 65%",
          end: "bottom 65%",
          onToggle: (self) => {
            if (self.isActive) setActiveBeat(index);
          },
        });

        if (prefersReducedMotion) return;

        gsap.from(beat, {
          autoAlpha: 0,
          y: 28,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: beat, start: "top 88%", once: true },
        });
      });

      if (prefersReducedMotion || !barRef.current || !listRef.current) return;

      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.3,
          },
        }
      );
    },
    { scope, dependencies: [prefersReducedMotion] }
  );

  const panelIsRight = align === "right";

  return (
    <section
      ref={scope}
      className={`relative px-6 py-16 sm:py-24 ${
        panelIsRight ? "bg-[var(--color-surface)]" : "bg-[var(--color-bg)]"
      }`}
      aria-labelledby={`member-${member.number}`}
    >
      {/* The glow gets its own clipping layer instead of `overflow-hidden` on the section. An
          overflow-hidden ancestor becomes the scroll container for anything sticky inside it, and
          the identity panel then never sticks — it just scrolls away with the rest of the column.
          Clipping here keeps the blob off the page edges and leaves the panel sticking to the
          viewport where it belongs. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className={`absolute top-1/4 h-[55vw] max-h-[620px] w-[55vw] max-w-[620px] rounded-full opacity-20 blur-3xl ${
            panelIsRight ? "left-[-15%]" : "right-[-15%]"
          }`}
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
        />
      </div>

      <div
        className={`relative mx-auto grid max-w-6xl gap-y-10 md:gap-x-16 ${
          panelIsRight
            ? "md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]"
            : "md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]"
        }`}
      >
        {/* Identity panel — sticks through the beats on md+, plain block below that. */}
        <div className={`md:sticky md:top-24 md:self-start ${panelIsRight ? "md:order-2" : ""}`}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + {member.role}
          </p>
          <h3
            id={`member-${member.number}`}
            className="text-[clamp(2.5rem,6vw,3.75rem)] font-medium uppercase leading-[0.92] tracking-tight"
          >
            <span className="block">{member.firstName}</span>
            <span className="name-outline block">{member.lastName}</span>
          </h3>

          <PlaceholderMedia
            label={`TODO: ${member.firstName} photo`}
            aspect="aspect-[4/5]"
            className="mt-8 max-w-[15rem]"
          />

          {/* Progress readout: how far through this founder the reader is. */}
          <div className="mt-6 max-w-[15rem]" aria-hidden="true">
            <div className="flex items-baseline justify-between text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              <span className="tabular-nums text-[var(--color-fg)]">
                {String(activeBeat + 1).padStart(2, "0")}
              </span>
              <span className="tabular-nums">
                {String(member.beats.length).padStart(2, "0")}
              </span>
            </div>
            <span className="mt-2 block h-px w-full bg-[var(--color-border)]">
              <span
                ref={barRef}
                className="block h-px w-full origin-left bg-[var(--color-cherry)]"
              />
            </span>
          </div>
        </div>

        {/* The beats */}
        <ol ref={listRef} className={panelIsRight ? "md:order-1" : ""}>
          {member.beats.map((beat, index) => (
            <li
              key={beat.headline}
              data-beat
              className="relative border-t border-[var(--color-border)] py-7 pl-10 sm:py-9 sm:pl-14"
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-7 text-xs tabular-nums tracking-[0.2em] transition-colors duration-500 sm:top-9 ${
                  index === activeBeat
                    ? "text-[var(--color-cherry)]"
                    : "text-[var(--color-muted)]/50"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-[clamp(1.25rem,2.4vw,1.85rem)] font-medium leading-[1.15] tracking-tight">
                {beat.headline}
              </p>
              <p className="mt-3 max-w-[48ch] leading-relaxed text-[var(--color-muted)]">
                {beat.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
