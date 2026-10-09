import { SiteHeader } from "@/components/SiteHeader";
import { QuoteStartCta } from "@/components/home/QuoteStartCta";
import { Marquee } from "@/components/scroll/Marquee";
import { TextReveal } from "@/components/text/TextReveal";
import { FeaturedCaseStudy } from "@/components/work/FeaturedCaseStudy";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { ScrollThread } from "@/components/atmosphere/ScrollThread";
import { ToneShift } from "@/components/atmosphere/ToneShift";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { RevealHero } from "@/components/reveal/RevealHero";
import { PerceptionTest } from "@/components/reveal/PerceptionTest";
import { SceneQuotes } from "@/components/reveal/SceneQuotes";
import { BelieveMoments } from "@/components/reveal/BelieveMoments";
import { ImagineYours } from "@/components/reveal/ImagineYours";
import { DoThis } from "@/components/reveal/DoThis";
import { ServiceEngine } from "@/components/reveal/ServiceEngine";
import { ConceptStudies } from "@/components/concepts/ConceptStudies";
import { projects } from "@/lib/projects";
import { processSteps } from "@/lib/process";

/**
 * ── Home Concept 1: "people can finally see it" ──────────────────────────────────────────────
 *
 * Visual concept: real business → Kwic Shake lens → transformed perception. Purple is the frame
 * (the room, the light, the pixels); every business shown inside it keeps its own colours. The
 * page demonstrates instead of describing — the 50ms claim is a test the visitor takes, the
 * "your own look" claim is a phone they restyle themselves, the services are a loop they watch run.
 *
 * Order is the same argument as before — problem, psychology, recognition, possibility, relief,
 * mechanism, proof, process, action — with each beat now carried by a picture or an interaction.
 *
 * Every business except Revolt is fictional and labelled as a concept study where it appears.
 */
const marqueeWords = [
  "Web Design",
  "Brand Strategy",
  "Social",
  "SEO",
  "Digital Advertising",
  "Real-World Marketing",
];

const featured = projects[0];

// Unlisted concept: reachable by URL only, never linked from the site, and kept out of search.
export const metadata = {
  title: "Home Concept 1 — Kwic Shake",
  robots: { index: false, follow: false },
};

export default function HomeConceptOnePage() {
  return (
    <>
      <SiteHeader />

      {/* ── HOOK: one device, many worlds ─────────────────────────────────────────────── */}
      <RevealHero />

      {/* ── PROOF ON THEIR OWN BRAIN: the 50ms test ───────────────────────────────────── */}
      <PerceptionTest />

      {/* ── PROBLEM: their words, staged as businesses ────────────────────────────────── */}
      <ToneShift initial="night" className="section-y relative overflow-hidden px-6">
        <div
          className="tone-glow pointer-events-none absolute -top-1/4 left-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-60 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto mb-16 max-w-6xl">
          <p className="eyebrow mb-6">+ Sound Familiar</p>
          <TextReveal as="h2" className="section-title max-w-3xl">
            Good business. <span className="text-[var(--color-cherry)]">Wrong impression.</span>
          </TextReveal>
        </div>
        <SceneQuotes />
        <div className="relative mx-auto mt-16 max-w-3xl text-center">
          <ScrollThread arrow className="h-16 sm:h-24" />
          <TextReveal
            as="p"
            className="display-face mt-8 text-balance text-[clamp(1.5rem,3.6vw,2.5rem)] leading-snug"
          >
            That&apos;s where we come in.
          </TextReveal>
        </div>
      </ToneShift>

      {/* ── PSYCHOLOGY: belief, shown ─────────────────────────────────────────────────── */}
      <section data-tone="dusk" className="tone-section section-y relative overflow-hidden px-6">
        <div
          className="tone-glow pointer-events-none absolute right-[-10%] top-0 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] rounded-full opacity-50 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto mb-6 max-w-6xl">
          <p className="eyebrow mb-6">+ Why People Choose</p>
          <TextReveal as="h2" className="section-title">
            They buy because <span className="text-[var(--color-cherry)]">they believe.</span>
          </TextReveal>
          <p className="section-lede">Not because they understand.</p>
        </div>
        <BelieveMoments />
      </section>

      {/* ── POSSIBILITY: pick a business ──────────────────────────────────────────────── */}
      <section className="section-y relative overflow-hidden bg-[var(--color-paper)] px-6">
        <ImagineYours />
        {/* The same idea, art-directed: real studies of what eight different businesses could
            look like. Follows the toy directly so "you get your own world" has proof under it. */}
        <div className="relative mx-auto mt-24 max-w-6xl">
          <p className="eyebrow mb-4">+ More worlds</p>
          <p className="display-face mb-10 max-w-2xl text-balance text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
            Same phone. Same room.{" "}
            <span className="text-[var(--color-cherry)]">Eight different businesses.</span>
          </p>
          <ConceptStudies />
        </div>
      </section>

      {/* ── RELIEF ────────────────────────────────────────────────────────────────────── */}
      <section data-tone="lilac" className="tone-section section-y relative overflow-hidden px-6">
        <DoThis />
      </section>

      {/* ── MECHANISM: one engine ─────────────────────────────────────────────────────── */}
      <section className="section-y relative overflow-hidden bg-[var(--color-surface)] px-6">
        <ServiceEngine />
      </section>

      {/* ── PROOF: Revolt, plus the thinking behind it ────────────────────────────────── */}
      <section
        className="section-y relative overflow-hidden bg-[var(--color-raised)] px-6 text-[var(--color-on-dark)]"
        style={
          {
            "--color-fg": "var(--color-on-dark)",
            "--color-muted": "color-mix(in srgb, var(--color-on-dark) 65%, var(--color-raised))",
            "--color-border": "color-mix(in srgb, var(--color-on-dark) 15%, transparent)",
          } as React.CSSProperties
        }
      >
        <div className="relative mx-auto max-w-6xl">
          <p className="eyebrow mb-6">+ The Work</p>
          <TextReveal as="h2" className="section-title max-w-3xl">
            The business didn&apos;t suddenly become better.{" "}
            <span className="text-[var(--color-cherry)]">People can finally see it.</span>
          </TextReveal>
          <p className="section-lede">Revolt Lacrosse. The real site, running.</p>

          <div className="mt-14">
            <FeaturedCaseStudy project={featured} />
          </div>

          {/* The strategy, as an artifact. Visitors assume design is "making it look nicer";
              this shows the decision that came before any pixels. */}
          <div className="mt-20 grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
            {[
              { k: "What they were selling", v: "Summer lacrosse." },
              { k: "What parents were buying", v: "Their kid's future." },
              { k: "So the site leads with", v: "Visibility to college programs." },
            ].map((step, i) => (
              <div key={step.k} className="relative bg-[var(--color-raised)] p-8 sm:p-10">
                <p className="eyebrow">{step.k}</p>
                <p
                  className={`display-face mt-5 text-[clamp(1.4rem,2.6vw,2rem)] leading-tight ${
                    i === 2 ? "text-[var(--color-cherry)]" : ""
                  }`}
                >
                  {step.v}
                </p>
                {i < 2 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-6 top-8 text-[var(--color-cherry)]/60 md:right-8"
                  >
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────────────────── */}
      <section data-tone="night" className="tone-section section-y relative overflow-hidden px-6">
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-6">+ How It Goes</p>
          <TextReveal as="h2" className="section-title">
            First: <span className="text-[var(--color-cherry)]">what isn&apos;t working.</span>
          </TextReveal>
          <p className="section-lede mx-auto">
            Not what you think isn&apos;t working. What&apos;s actually getting in the way.
          </p>
          <ol className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-4 sm:gap-x-4">
            {processSteps.map((step, index) => (
              <li key={step.number} className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  <span className="mr-2 tabular-nums text-[var(--color-cherry)]">{step.number}</span>
                  {step.label}
                </span>
                {index < processSteps.length - 1 && (
                  <span aria-hidden="true" className="text-[var(--color-cherry)]/40">
                    &rarr;
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div className="mt-14">
            <MagneticButton
              as={TransitionLink}
              href="/process"
              radius={100}
              className="tone-fill inline-flex items-center gap-3 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-widest"
            >
              See How We Work
              <span aria-hidden="true">&rarr;</span>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ── The typographic band ──────────────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-[var(--color-cherry-dark)] py-7">
        <Marquee baseDuration={22} reverse>
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className="brand-wordmark flex shrink-0 items-center gap-7 px-7 text-[clamp(1.75rem,4.5vw,3rem)] uppercase leading-none tracking-[0.04em] text-[var(--color-white)]"
            >
              Kwic Shake
              <span aria-hidden="true" className="text-[var(--color-white)]/35">
                &bull;
              </span>
            </span>
          ))}
        </Marquee>
        <div className="mt-4">
          <Marquee baseDuration={16}>
            {marqueeWords.map((word, index) => (
              <span
                key={index}
                className="shrink-0 px-8 text-[clamp(1rem,2.4vw,1.5rem)] uppercase tracking-[0.12em] text-[var(--color-white)]/65"
              >
                {word}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ── ACTION ────────────────────────────────────────────────────────────────────── */}
      <section data-tone="nova" className="tone-section section-y-lg relative overflow-hidden px-6 text-center">
        <div
          className="tone-glow pointer-events-none absolute left-1/2 top-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="eyebrow mb-6">+ Your Move</p>
          <TextReveal as="h2" className="section-title text-[var(--color-white)]">
            Now imagine <span className="text-[var(--color-cherry)]">yours.</span>
          </TextReveal>
          <ScrollThread arrow className="mt-8 h-20 sm:h-28" />
          <figure className="mt-10 flex flex-col items-center gap-4">
            <blockquote className="text-balance text-[clamp(1.35rem,2.8vw,2rem)] leading-relaxed text-[var(--color-fg)]/85">
              The scariest moment is always just before you <QuoteStartCta />
            </blockquote>
            <figcaption className="eyebrow whitespace-nowrap">&mdash; Stephen King</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
