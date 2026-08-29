import { notFound } from "next/navigation";
import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { getProject, projects } from "@/lib/projects";
import { SiteHeader } from "@/components/SiteHeader";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.title} — Kwic Shake` : "Not found" };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article>
      <SiteHeader />

      <div className="relative overflow-hidden px-6 pt-16">
        <div
          className="pointer-events-none absolute -top-1/4 right-[-10%] h-[45vw] max-h-[550px] w-[45vw] max-w-[550px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + {project.category}
          </p>
          <TextReveal as="h1" className="max-w-3xl text-[clamp(2rem,6vw,4rem)] font-medium leading-tight">
            {project.title}
          </TextReveal>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {project.client} — {project.year}
          </p>
        </div>
      </div>

      <ParallaxMedia rate={0.25} className="mt-12 h-[60vh]">
        <PlaceholderMedia label={`TODO: ${project.title} hero image`} aspect="aspect-auto" className="h-full" />
      </ParallaxMedia>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[1fr_2fr]">
        <dl className="space-y-6 text-sm">
          <div>
            <dt className="text-[var(--color-muted)]">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-muted)]">Category</dt>
            <dd>{project.category}</dd>
          </div>
          <div>
            <dt className="mb-2 text-[var(--color-muted)]">Tags</dt>
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
        <TextReveal as="p" className="text-lg leading-relaxed">
          {project.description}
        </TextReveal>
      </div>

      {/* Close — same bookend as /work, /services, /about. */}
      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-center text-[var(--color-on-dark)] sm:py-36">
        <div
          className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <TextReveal
            as="h2"
            className="mb-10 text-[clamp(2.25rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight"
          >
            Want a project like this one?
          </TextReveal>
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
