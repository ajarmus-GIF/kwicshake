import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import type { Project } from "@/lib/projects";

/**
 * One case study, given the room a single real project deserves.
 *
 * This replaced a horizontal-scrolling rail of three cards, two of which were placeholders with
 * invented client names. A rail is the right pattern for a deep portfolio and the wrong one for
 * a studio with one project: it makes the single genuine piece of work look like the first of
 * several that are missing. Presented on its own, at size, with its actual mission stated, the
 * same project reads as a considered piece of work rather than as a thin gallery.
 *
 * `status` is surfaced rather than hidden. Saying "In progress" out loud costs nothing and buys
 * the credibility that every other claim on the site then borrows — a visitor who catches you
 * implying unfinished work is finished stops believing the finished parts too.
 *
 * The mission line is the client's, not ours. It's the reason the project is interesting, and
 * leading with it rather than with our deliverables is the same reordering the whole site runs
 * on: what it was for, before what we made.
 */
export function FeaturedCaseStudy({ project }: { project: Project }) {
  return (
    <article className="grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-14">
      <TransitionLink href={`/work/${project.slug}`} className="group block">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full border border-[var(--color-cherry)]/40"
          />
          <ParallaxMedia rate={0.12} className="aspect-[4/3]">
            <PlaceholderMedia
              label={`TODO: ${project.title} cover`}
              aspect="aspect-auto"
              className="h-full"
            />
          </ParallaxMedia>
        </div>
      </TransitionLink>

      <div>
        <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
          <span>{project.category}</span>
          <span aria-hidden="true" className="opacity-40">
            /
          </span>
          <span>{project.year}</span>
          {project.status === "in-progress" && (
            <span className="rounded-full border border-[var(--color-cherry)]/40 px-3 py-1 text-[0.65rem] tracking-[0.16em]">
              In Progress
            </span>
          )}
        </p>

        <TextReveal
          as="h3"
          className="display-face text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight"
        >
          {project.title}
        </TextReveal>

        <TextReveal as="p" className="mt-5 text-lg leading-snug">
          {project.mission}
        </TextReveal>

        <TextReveal as="p" className="mt-4 leading-relaxed text-[var(--color-muted)]">
          {project.summary}
        </TextReveal>

        <MagneticButton
          as={TransitionLink}
          href={`/work/${project.slug}`}
          radius={100}
          className="btn-primary mt-8 inline-flex items-center gap-2 px-7 py-3.5 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
        >
          View Case Study
        </MagneticButton>
      </div>
    </article>
  );
}
