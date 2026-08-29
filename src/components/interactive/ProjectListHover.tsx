import { TransitionLink } from "@/components/transition/TransitionProvider";
import type { Project } from "@/lib/projects";

/**
 * Plain, always-visible text list of project links (real `<a>` elements via TransitionLink —
 * no onClick-only rows, so it works with JS disabled or a screen reader). No hover preview,
 * no cursor tracking — just a title/category/year row that dims on hover.
 */
export function ProjectListHover({ projects }: { projects: Project[] }) {
  return (
    <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {projects.map((project) => (
        <li key={project.slug}>
          <TransitionLink
            href={`/work/${project.slug}`}
            className="group flex items-baseline justify-between gap-4 py-6 md:py-8"
          >
            <span className="text-[clamp(1.5rem,4vw,3rem)] leading-none transition-opacity group-hover:opacity-60">
              {project.title}
            </span>
            <span className="shrink-0 text-sm text-[var(--color-muted)]">
              {project.category} — {project.year}
            </span>
          </TransitionLink>
        </li>
      ))}
    </ul>
  );
}
