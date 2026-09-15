"use client";

import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { serviceIcons } from "@/components/services/serviceIcons";
import { SystemLine } from "@/components/atmosphere/SystemLine";
import { EditorialMedia } from "@/components/media/EditorialMedia";
import { services } from "@/lib/services";

/**
 * The home page's one sticky split-screen, and its single signature interaction.
 *
 * Left column holds still — an oversized number, the discipline's icon, and its title — while
 * the right column's six blocks scroll past. As each block crosses the middle of the viewport
 * the left panel re-renders to match it. The effect is that the reader is moving through a list
 * while one thing watches them do it, which is why it belongs to the services beat: six
 * disciplines that are supposed to feel like one connected system rather than a menu.
 *
 * ── Why this replaced the card grid ─────────────────────────────────────────────────────────
 * This section used to be six identical cards in a 3x2 grid. Six identical cards communicate
 * "we offer six things"; they cannot communicate that any one of them matters more than the
 * others, because the layout gives them all exactly the same weight. Handing each service the
 * full left panel in turn is the same content making a different argument.
 *
 * ── Why exactly one of these on the page ────────────────────────────────────────────────────
 * A pinned column is the most attention-expensive pattern on the site: it takes roughly six
 * screens of scrolling and refuses to let the reader skim. Spend that budget twice and the page
 * stops being a narrative and becomes an obstacle course. Every other section on the home page
 * is deliberately skimmable so that this one reads as a change of gear.
 *
 * ── Why IntersectionObserver and not a scroll handler ───────────────────────────────────────
 * The only question being asked is "which block is currently crossing the centre line", which
 * is exactly what a rootMargin-collapsed observer answers, at zero main-thread cost per frame.
 * A scroll listener would recompute six getBoundingClientRect()s on every scroll event — six
 * forced layouts per frame, during the one interaction on the page that must not drop frames.
 *
 * ── Mobile ──────────────────────────────────────────────────────────────────────────────────
 * There is no split below `md`. The sticky panel is not rendered at all, and each block carries
 * its own number, icon and title inline — the ordinary vertical list this content would have
 * been if the split had never existed. Squeezing a two-column pin into 390px is the "broken
 * desktop experience" the brief calls out; the content survives the layout being dropped.
 */
export function ServiceSplitScroll() {
  const [active, setActive] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Collapsing the root box to a thin band across the vertical middle means "isIntersecting"
    // is true for exactly the block crossing the centre of the screen. No scroll maths, no
    // comparing ratios between entries.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = blockRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) setActive(index);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );

    const blocks = blockRefs.current.filter(Boolean) as HTMLDivElement[];
    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  const activeService = services[active];

  return (
    <section className="relative bg-[var(--color-surface)] px-6 py-24 sm:py-28">
      {/* NO overflow-hidden on the section itself. An overflow-hidden ancestor becomes the
          scroll container for any position:sticky descendant, and the left panel then never
          sticks — it scrolls away with the column and the whole interaction silently disappears.
          The glow gets its own clipping layer instead. Same rule, same reason, as the note in
          components/about/TeamMemberFlow.tsx. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-1/4 right-[-15%] h-[55vw] max-h-[700px] w-[55vw] max-w-[700px] rounded-full opacity-[0.15] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
              + What We Actually Do
            </p>
            <h2 className="max-w-2xl text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-tight">
              Pieces that{" "}
              <span className="text-[var(--color-cherry)]">work together.</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--color-muted)]">
              We build each part of your marketing to hold the others up.
            </p>
          </div>
          <TransitionLink
            href="/services"
            className="shrink-0 whitespace-nowrap text-sm text-[var(--color-fg)] underline decoration-[var(--color-cherry)] underline-offset-4 hover:text-[var(--color-cherry)]"
          >
            → See how they connect
          </TransitionLink>
        </div>

        <div className="grid grid-cols-1 gap-x-16 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          {/* ── The anchored half. Desktop only. ────────────────────────────────────────────
              aria-hidden because every word in it is also present, statically, in the blocks
              on the right — a screen reader following the list would otherwise hear each
              service's number and title twice, once from a panel whose changes it cannot
              perceive. The panel is a visual restatement, so it is exposed visually only. */}
          <div aria-hidden="true" className="hidden md:block">
            <div className="sticky top-28 self-start">
              <SystemLine label="Rendering Capability" settled={activeService.number} />

              <div className="mt-8 flex h-24 w-24 items-center justify-center rounded-full"
                style={{
                  background: "color-mix(in srgb, var(--color-cherry) 10%, transparent)",
                  boxShadow: "0 0 40px var(--color-glow)",
                }}
              >
                {/* Keyed on the active index so React swaps the element rather than mutating
                    it — that remount is what re-runs ServiceIcon's stroke-draw animation on
                    every change instead of only on first paint. */}
                <ServiceIcon key={active} className="h-12 w-12 text-[var(--color-cherry)]">
                  {serviceIcons[active]}
                </ServiceIcon>
              </div>

              {/* The panel's image slot. This is the "fixed side transitions as the moving
                  side scrolls" behaviour the split-screen exists for — keyed on the active
                  index so each service gets its own frame, and the aperture reveal re-runs on
                  every change rather than only on first paint.

                  Desktop only, inside the already-desktop-only panel: on mobile the six blocks
                  are a plain vertical list and six full-width images would triple its length
                  for no argument. */}
              <EditorialMedia
                key={`media-${active}`}
                src={activeService.image}
                alt={activeService.imageAlt}
                label={`${activeService.title} — 4:3`}
                aspect="aspect-[4/3]"
                className="mt-10"
                from={active % 2 === 0 ? "bottom" : "left"}
                sizes="(max-width: 1024px) 40vw, 360px"
              />

              {/* The oversized number is the part that makes the panel read as "position in a
                  sequence" rather than "a card that keeps changing". tabular-nums so 01 and 06
                  occupy identical width and the title beneath never shifts sideways. */}
              <p className="display-face mt-8 text-[clamp(2.75rem,6vw,5rem)] leading-[0.85] tabular-nums text-[var(--color-cherry)]">
                {activeService.number}
              </p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                {activeService.kicker}
              </p>
              <p className="display-face mt-2 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight">
                {activeService.title}
              </p>

              {/* Progress rail. Six segments, filled up to the active one — the reader's
                  answer to "how much of this is left", which a pinned section owes them. */}
              <div className="mt-10 flex gap-1.5">
                {services.map((service, index) => (
                  <span
                    key={service.number}
                    className="h-0.5 w-8 rounded-full transition-colors duration-500"
                    style={{
                      background:
                        index <= active
                          ? "var(--color-cherry)"
                          : "color-mix(in srgb, var(--color-muted) 30%, transparent)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── The moving half ─────────────────────────────────────────────────────────── */}
          <ol className="space-y-px">
            {services.map((service, index) => (
              <li key={service.number}>
                <div
                  ref={(el) => {
                    blockRefs.current[index] = el;
                  }}
                  className="border-t border-[var(--color-border)] py-14 md:min-h-[56vh] md:py-20"
                >
                  {/* Inline identity — the mobile layout's entire substitute for the sticky
                      panel, and harmless on desktop where it reads as a restatement of the
                      panel's current state. */}
                  <div className="mb-6 flex items-center gap-4 md:hidden">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--color-cherry) 10%, transparent)",
                        boxShadow: "0 0 24px var(--color-glow)",
                      }}
                    >
                      <ServiceIcon className="h-7 w-7 text-[var(--color-cherry)]">
                        {serviceIcons[index]}
                      </ServiceIcon>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
                        {service.number} — {service.kicker}
                      </p>
                      <p className="display-face mt-1 text-xl leading-tight">{service.title}</p>
                    </div>
                  </div>

                  {/* No desktop number/kicker line here: the sticky panel to the left is
                      already showing this service's number, kicker and title, and repeating
                      them a few inches away was the same label printed twice on one screen. */}
                  {/* The hook is set largest — the provocation is meant to be read before the
                      explanation, which is the ordering principle lib/services.ts documents. */}
                  <p
                    className="display-face text-balance text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] transition-opacity duration-500"
                    style={{ opacity: index === active ? 1 : 0.55 }}
                  >
                    {service.hook}
                  </p>

                  {/* `description` and `closer` are deliberately NOT rendered here. They are
                      the full explanation, they live on /services, and showing them made this
                      one section 396 words — 34% of the entire home page. A teaser's job is to
                      make six disciplines feel worth reading about, which the hook does in one
                      line; the explanation is one click away for the reader who wants it.

                      The bullets stay. They are two-word labels rather than prose, they read as
                      scannable specifics rather than paragraphs, and without them each block is
                      a single sentence floating in most of a screen. */}
                  <ul className="mt-8 flex flex-wrap gap-x-2 gap-y-2">
                    {service.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-xs tracking-wide text-[var(--color-muted)]"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
