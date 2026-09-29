import { TextReveal } from "@/components/text/TextReveal";
import { SiteComparison } from "@/components/work/SiteComparison";
import type { Project } from "@/lib/projects";

/**
 * The redesign, shown rather than described: the client's old site and the new one in the same
 * browser window, with the three things that changed underneath. Sits directly under the case
 * study's title and mission, so the first thing a reader does on the page is see the work.
 *
 * Wider than the rest of the page (max-w-6xl against 5xl) on purpose — at desktop the
 * screenshots should read as a real site, not a thumbnail of one.
 */
export function CaseStudyRedesign({
  title,
  redesign,
}: {
  title: string;
  redesign: NonNullable<Project["redesign"]>;
}) {
  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl sm:mb-14">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + {redesign.eyebrow}
          </p>
          <TextReveal
            as="h2"
            className="display-face text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.06] tracking-tight"
          >
            <span className="block">{redesign.heading[0]}</span>
            <span className="block text-[var(--color-cherry)]">{redesign.heading[1]}</span>
          </TextReveal>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            {redesign.intro}
          </p>
        </div>

        <SiteComparison
          before={redesign.before}
          after={redesign.after}
          width={redesign.width}
          height={redesign.height}
          url={redesign.url}
          title={title}
        />

        <ul className="mt-14 grid grid-cols-1 gap-8 border-t border-[var(--color-border)] pt-10 sm:mt-16 sm:grid-cols-3 sm:gap-10">
          {redesign.shifts.map((shift) => (
            <li key={shift.label}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-cherry)]">
                {shift.label}
              </p>
              <p className="text-lg leading-snug">{shift.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
