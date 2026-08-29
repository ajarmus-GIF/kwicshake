import { HorizontalScroll } from "@/components/scroll/HorizontalScroll";
import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { projects } from "@/lib/projects";

export const metadata = { title: "Work — Kwic Shake" };

export default function WorkPage() {
  return (
    <>
      <SiteHeader />

      <div className="relative overflow-hidden px-6 pt-16">
        <div
          className="pointer-events-none absolute -top-1/4 right-[-10%] h-[50vw] max-h-[650px] w-[50vw] max-w-[650px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Selected Work
          </p>
          <TextReveal as="h1" className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight">
            Case studies, not just a portfolio.
          </TextReveal>
        </div>
      </div>

      <div className="mt-16">
        <HorizontalScroll>
          {projects.map((project, index) => (
            <TransitionLink
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group block w-[70vw] shrink-0 md:w-[38vw]"
            >
              <div className="relative">
                <PlaceholderMedia label={`TODO: ${project.title} cover`} aspect="aspect-[4/5]" className="relative" />
                <span
                  className="pointer-events-none absolute left-3 top-3 select-none font-black leading-none opacity-30"
                  style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(2.5rem,6vw,3.5rem)", color: "var(--color-cherry)" }}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-lg transition-opacity group-hover:opacity-60">{project.title}</span>
                <span className="text-sm text-[var(--color-muted)]">{project.year}</span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
                {project.category}
              </p>
            </TransitionLink>
          ))}
        </HorizontalScroll>
      </div>

      {/* Close — same bookend as /services and /about. */}
      <section className="relative mt-16 overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-center text-[var(--color-on-dark)] sm:py-36">
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
            Want your name on this list?
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
    </>
  );
}
