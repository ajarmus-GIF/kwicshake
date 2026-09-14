import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { ScrollDrift } from "@/components/scroll/ScrollDrift";

export const metadata = {
  title: "Process — Kwic Shake",
  description:
    "How the work actually runs: understand, strategize, create, launch, learn, improve. Six steps, and none of them are yours to manage.",
};

/**
 * ── The page that exists to lower someone's heart rate ──────────────────────────────────────
 *
 * This is a new page, and the reason it earns one rather than living as a section on /services
 * is that it does a different emotional job from every other page on the site. /services makes
 * someone want the outcome. This one removes the last thing standing between wanting it and
 * asking for it: the suspicion that saying yes means signing up for months of meetings, jargon,
 * and homework.
 *
 * So the page is short, and it is short on purpose. Six steps, one page, no methodology
 * diagrams, no phase gates, no invented framework with a name. The entire argument is "this is
 * smaller and more understood than you're afraid it is", and a long page arguing that would
 * contradict itself.
 *
 * The closing line is the one that matters: good marketing isn't one brilliant idea, it's
 * knowing what to do next. It reframes the relationship from a purchase (you buy a website) to
 * a partnership (someone is watching what happens afterward), which is the honest description of
 * the work and also the more valuable one.
 */
export default function ProcessPage() {
  return (
    <>
      <SiteHeader />

      <section className="relative flex min-h-[55vh] flex-col justify-center overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-[var(--color-on-dark)]">
        <ScrollDrift
          from={-14}
          to={14}
          className="pointer-events-none absolute -top-1/3 left-[-10%] h-[65vw] max-h-[850px] w-[65vw] max-w-[850px]"
        >
          <div
            className="h-full w-full rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
            aria-hidden="true"
          />
        </ScrollDrift>

        <div className="relative mx-auto w-full max-w-5xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Process
          </p>
          <TextReveal
            as="h1"
            className="max-w-4xl text-[clamp(2.25rem,6vw,4.75rem)] font-medium leading-[1.04] tracking-tight"
          >
            First, we figure out{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--color-cherry), var(--color-nova-secondary))",
              }}
            >
              what isn&apos;t working.
            </span>
          </TextReveal>
          <TextReveal
            as="p"
            className="mt-8 max-w-xl text-base leading-relaxed text-[var(--color-on-dark)]/65 sm:text-lg"
          >
            Not what you think isn&apos;t working. What&apos;s actually getting in the way — which
            is often somewhere nobody was looking.
          </TextReveal>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24 sm:py-28">
        <div
          className="pointer-events-none absolute -top-1/4 right-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative">
          <ProcessSteps />
        </div>
      </section>

      {/* The reframe, and the reason steps 05 and 06 exist. Set as a two-line statement rather
          than a paragraph so the second line — the one carrying the actual idea — lands on its
          own. */}
      <section className="relative overflow-hidden bg-[var(--color-surface)] px-6 py-28 text-center sm:py-32">
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
            <span className="block">Because good marketing isn&apos;t one brilliant idea.</span>
            <span className="mt-3 block text-[var(--color-cherry)]">
              It&apos;s knowing what to do next.
            </span>
          </TextReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-center text-[var(--color-on-dark)] sm:py-36">
        <div
          className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <TextReveal
            as="h2"
            className="mb-10 text-balance text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[1.06] tracking-tight"
          >
            You don&apos;t have to know which step you&apos;re on.
          </TextReveal>
          <MagneticButton
            as={TransitionLink}
            href="/contact"
            radius={100}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
          >
            Let&apos;s Talk
          </MagneticButton>
        </div>
      </section>
    </>
  );
}
