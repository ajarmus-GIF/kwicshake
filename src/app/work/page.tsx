import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { FeaturedCaseStudy } from "@/components/work/FeaturedCaseStudy";
import { MonologuePull } from "@/components/marketing/MonologuePull";
import { Tagline } from "@/components/marketing/Tagline";
import { projects, caseStudyChapters } from "@/lib/projects";

export const metadata = {
  title: "Work — Kwic Shake",
  description:
    "Case studies built around what changed and why we chose it — not a gallery of screenshots.",
};

/**
 * ── Proof, not portfolio ────────────────────────────────────────────────────────────────────
 *
 * The reader this page is written for has seen a hundred agency galleries and learned nothing
 * from any of them, because a screenshot proves someone can produce a screenshot. What they are
 * actually trying to find out is whether anyone here THINKS — and that can only be shown by
 * explaining a decision.
 *
 * So the page leads with the promise ("we want to show you what changed"), then immediately
 * shows the structure every case study follows, before showing a single project. Publishing the
 * structure up front is itself the argument: a studio that can name the six questions it answers
 * about a project is a studio that answers them.
 *
 * ── One project, said plainly ───────────────────────────────────────────────────────────────
 * There is one case study here and the page does not dress that up. The horizontal rail this
 * replaced showed three cards, two of which were invented placeholder clients — which is exactly
 * the thing a sceptical reader is scanning for. "We're building Kwic Shake one project at a
 * time" is both true and, to someone tired of agencies, more reassuring than a padded grid.
 */
export default function WorkPage() {
  return (
    <>
      <SiteHeader />

      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-[var(--color-on-dark)] sm:py-32">
        <div
          className="pointer-events-none absolute -top-1/4 right-[-10%] h-[55vw] max-h-[700px] w-[55vw] max-w-[700px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + The Work
          </p>
          <TextReveal
            as="h1"
            className="max-w-4xl text-[clamp(2rem,5.5vw,4.25rem)] font-medium leading-[1.05] tracking-tight"
          >
            <span className="block">We don&apos;t want to show you pretty websites.</span>
            <span className="block text-[var(--color-cherry)]">
              We want to show you what changed.
            </span>
          </TextReveal>
        </div>
      </section>

      {/* The structure, published before any project. Someone deciding whether to trust this
          studio learns more from the six questions we commit to answering than from any single
          answer — and it sets the expectation the case study below then meets. */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-28">
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
              + How We Tell It
            </p>
            <TextReveal
              as="h2"
              className="display-face text-[clamp(1.5rem,3.5vw,2.5rem)] font-medium leading-tight tracking-tight"
            >
              Every project answers{" "}
              <span className="text-[var(--color-cherry)]">the same six questions.</span>
            </TextReveal>
          </div>

          <ol className="grid grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
            {caseStudyChapters.map((chapter, index) => (
              <li key={chapter.key} className="bg-[var(--color-bg)] px-7 py-8">
                <p className="mb-3 text-xs tabular-nums tracking-[0.2em] text-[var(--color-cherry)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="display-face mb-2 text-lg leading-tight tracking-tight">
                  {chapter.label}
                </p>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                  {chapter.prompt}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-surface)] px-6 py-24 sm:py-28">
        <div
          className="pointer-events-none absolute -bottom-1/4 left-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl">
          {projects.map((project) => (
            <FeaturedCaseStudy key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <MonologuePull where="work" />

      {/* The honest state of the portfolio, stated rather than disguised. */}
      <section className="relative overflow-hidden px-6 py-28 text-center sm:py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55vw] max-h-[640px] w-[55vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <TextReveal
            as="h2"
            className="display-face text-balance text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-tight tracking-tight"
          >
            Your business could be{" "}
            <span className="text-[var(--color-cherry)]">next.</span>
          </TextReveal>
          <TextReveal
            as="p"
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
          >
            We&apos;re building Kwic Shake one project at a time. That means the businesses we
            take on now get more of us than they would in a year.
          </TextReveal>
          <MagneticButton
            as={TransitionLink}
            href="/contact"
            radius={100}
            className="btn-primary mt-10 inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
          >
            Start a Project
          </MagneticButton>
        </div>
      </section>

      {/* Close — the philosophy behind the work rather than another CTA. The button above is
          the ask; this is what the work is for. */}
      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-center text-[var(--color-on-dark)] sm:py-36">
        <div
          className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <Tagline size="lg" />
        </div>
      </section>
    </>
  );
}
