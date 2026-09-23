import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import { EditorialMedia } from "@/components/media/EditorialMedia";
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
 *
 * ── Why the media is stacked above the copy, not beside it ──────────────────────────────────
 * This was a two-column card: a 4:3 crop of the cover on the left, everything else on the right.
 * That layout is fine for a photograph, which can be cropped to any shape and still say what it
 * says, and wrong for a recording of a website, where the thing being shown IS the full frame.
 * Cropping a 16:10 page into a 4:3 box cuts both margins off the client's work and leaves the
 * reader looking at the middle third of a layout we are asking them to judge. So a cover with
 * motion gets the container's full width at its own ratio, and the copy moves underneath it.
 *
 * Two consequences, both deliberate:
 *
 *   No parallax on the moving variant. ParallaxMedia works by rendering its child oversized and
 *   sliding it — which is a vertical crop, i.e. the exact thing this layout exists to stop. It
 *   also has nothing to add: parallax is how a still image earns some motion, and this one moves
 *   on its own. Stills keep it.
 *
 *   The frame is capped against the viewport, not just the column. A 1152px-wide 16:9 frame is
 *   648px tall, which runs off the bottom of a 13" laptop — and a frame you have to scroll to
 *   finish is the same crop arriving by another route. The width cap is expressed as a height
 *   budget converted back into width through the frame's own ratio, so the whole thing lands on
 *   screen at once and simply gets smaller on short displays instead of getting cut.
 */
export function FeaturedCaseStudy({ project }: { project: Project }) {
  const hasMotion = Boolean(project.coverVideo);

  // Literal class strings, not interpolated — Tailwind only sees what it can read in the source.
  const frameWidth = hasMotion
    ? "max-w-[min(100%,calc(74svh*640/351))]"
    : "max-w-[min(100%,calc(74svh*3/2))]";

  return (
    <article>
      <TransitionLink href={`/work/${project.slug}`} className="group block">
        <div className={`relative mx-auto w-full ${frameWidth}`}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full border border-[var(--color-cherry)]/40"
          />
          {hasMotion ? (
            // 640/351 is the clip's own pixel ratio (1280x702). Stating it exactly is what makes
            // object-cover a no-op here: the frame and the footage are the same shape, so there
            // is no crop to choose.
            <EditorialMedia
              src={project.cover}
              video={project.coverVideo}
              alt={`${project.title} — ${project.summary}`}
              label={`${project.title} — home page, wide`}
              aspect="aspect-[640/351]"
              sizes="(max-width: 768px) 100vw, 1150px"
            />
          ) : (
            <ParallaxMedia rate={0.12} className="aspect-[3/2]">
              <EditorialMedia
                src={project.cover}
                alt={project.cover ? `${project.title} — ${project.summary}` : undefined}
                label={`${project.title} — cover, 3:2`}
                aspect="aspect-auto"
                className="h-full"
                sizes="(max-width: 768px) 100vw, 1150px"
              />
            </ParallaxMedia>
          )}
        </div>
      </TransitionLink>

      {/* Caption. A recording with no label makes the reader do the work of identifying what
          they are looking at, and the answer — this is the client's live site, not a mockup —
          is the entire reason the recording is here. Mono and small: a plate under a picture,
          not another line of argument. */}
      {project.coverCaption && (
        <p
          className={`mx-auto mt-5 w-full ${frameWidth} font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.2em] text-[var(--color-muted)]`}
        >
          {project.coverCaption}
        </p>
      )}

      {/* The copy, in two columns under the frame: identity on the left, argument on the right.
          Full-width prose under a full-width frame would set a ~1150px measure — roughly twice
          the length a reader can track without losing the line. */}
      <div className="mt-14 grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
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
        </div>

        <div>
          <TextReveal as="p" className="text-lg leading-snug">
            {project.mission}
          </TextReveal>

          <TextReveal as="p" className="mt-4 leading-relaxed text-[var(--color-muted)]">
            {project.summary}
          </TextReveal>
        </div>
      </div>

      {/* CTA below everything rather than tucked beside the copy: in a stacked layout it is the
          one thing the reader is being asked to do, and it should be the last thing they pass. */}
      <MagneticButton
        as={TransitionLink}
        href={`/work/${project.slug}`}
        radius={100}
        className="btn-primary mt-12 inline-flex items-center gap-2 px-7 py-3.5 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
      >
        View Case Study
      </MagneticButton>
    </article>
  );
}
