import { notFound } from "next/navigation";
import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { CaseStudyNarrative } from "@/components/work/CaseStudyNarrative";
import { Tagline } from "@/components/marketing/Tagline";
import { getProject, projects } from "@/lib/projects";
import { SiteHeader } from "@/components/SiteHeader";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return {
    title: `${project.title} — Kwic Shake`,
    description: project.summary,
  };
}

/**
 * A single case study, told as a story.
 *
 * The page opens on the CLIENT'S mission rather than on our deliverables, and that ordering is
 * the argument the whole Work section rests on: this project is interesting because of what the
 * business was trying to do, and our work is only interesting insofar as it served that. Lead
 * with "Positioning, Brand & Web" and it becomes a receipt.
 *
 * `status` is printed in the header where nobody can miss it. Every persuasive sentence on this
 * site is borrowing credibility from the fact that we don't overstate the things that are easy
 * to overstate, and a project still in progress saying so is the cheapest possible place to
 * demonstrate that.
 */
export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article>
      <SiteHeader />

      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-24 text-[var(--color-on-dark)] sm:py-28">
        <div
          className="pointer-events-none absolute -top-1/4 right-[-10%] h-[50vw] max-h-[620px] w-[50vw] max-w-[620px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
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
            as="h1"
            className="max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight"
          >
            {project.title}
          </TextReveal>

          {/* The client's mission, not our scope. It is the reason the project matters and the
              thing every chapter below is measured against. */}
          <TextReveal
            as="p"
            className="mt-8 max-w-2xl text-[clamp(1.15rem,2.6vw,1.6rem)] leading-snug"
          >
            {project.mission}
          </TextReveal>
        </div>
      </section>

      <ParallaxMedia rate={0.25} className="h-[55vh]">
        <PlaceholderMedia
          label={`TODO: ${project.title} hero image`}
          aspect="aspect-auto"
          className="h-full"
        />
      </ParallaxMedia>

      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <dt className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Client
            </dt>
            <dd className="text-lg">{project.client}</dd>
          </div>
          <div>
            <dt className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              What We Did
            </dt>
            <dd className="text-lg">{project.role}</dd>
          </div>
          <div>
            <dt className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Disciplines
            </dt>
            <dd className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      <CaseStudyNarrative project={project} />

      <section className="relative overflow-hidden px-6 py-28 text-center sm:py-36">
        <div
          className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 rounded-full opacity-[0.2] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <Tagline size="lg" className="mb-10" />
          <MagneticButton
            as={TransitionLink}
            href="/contact"
            radius={100}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
          >
            Start a Project
          </MagneticButton>
        </div>
      </section>
    </article>
  );
}
