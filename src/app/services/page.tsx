import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { Marquee } from "@/components/scroll/Marquee";
import { SiteHeader } from "@/components/SiteHeader";
import { serviceIcons } from "@/components/services/serviceIcons";
import { ServiceShowcase } from "@/components/services/ServiceShowcase";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { ScrollDrift } from "@/components/scroll/ScrollDrift";
import { services } from "@/lib/services";
import { GrowthFunnel } from "@/components/services/GrowthFunnel";

export const metadata = { title: "Services — Kwic Shake" };

const beatWords = ["Strategy", "Story", "Design", "Growth", "Connection", "Craft"];

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero — full-bleed dark band, oversized display type with a gradient hero word.
          The glow and the copy drift in opposite directions on scroll: matching directions
          would read as the whole band sliding, opposing ones read as depth. The copy takes the
          smaller of the two so the headline never lags noticeably behind the scroll. */}
      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-[var(--color-on-dark)] sm:py-36">
        <ScrollDrift
          from={-14}
          to={14}
          className="pointer-events-none absolute -top-1/3 right-[-10%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px]"
        >
          <div
            className="h-full w-full rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
            aria-hidden="true"
          />
        </ScrollDrift>
        <ScrollDrift from={5} to={-5} className="relative mx-auto max-w-5xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Internet Marketing
          </p>
          <TextReveal
            as="h1"
            className="max-w-4xl text-[clamp(2.75rem,7.5vw,6rem)] font-medium leading-[1.02] tracking-tight"
          >
            We don&apos;t market brands.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--color-cherry), var(--color-nova-secondary))" }}
            >
              We make them unforgettable.
            </span>
          </TextReveal>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <TextReveal as="p" className="max-w-md text-[var(--color-on-dark)]/60">
              Web design, social, brand, paid ads, real-world touchpoints, and search —
              built as one connected discipline, not six separate line items. Every pixel,
              post, and positioning decision pulling in the same direction.
            </TextReveal>
            <div className="flex flex-wrap gap-4">
              <MagneticButton
                as={TransitionLink}
                href="/work"
                className="inline-flex items-center gap-2 border border-[var(--color-on-dark)] px-6 py-3 text-sm"
              >
                View Work
              </MagneticButton>
              <MagneticButton
                as={TransitionLink}
                href="/contact"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm text-[var(--color-button-primary-text)]"
              >
                Start a Project
              </MagneticButton>
            </div>
          </div>
        </ScrollDrift>
      </section>

      {/* Beat — a marquee of the words that actually describe the work, not fake logos. */}
      <section className="bg-[var(--color-cherry-dark)] py-6">
        <Marquee baseDuration={20}>
          {beatWords.map((word, index) => (
            <span
              key={index}
              className="px-8 font-medium text-[clamp(1.5rem,4vw,2.5rem)] text-[var(--color-white)]/80"
            >
              {word}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Intro — replaces a white band that held one centred aphorism and nothing else. That
          band said something true and then made you scroll past six long sections to find out
          what any of it meant; this does the setup AND gives you a way in.

          The aphorism survives as the second half of the standing copy, where it now argues for
          something instead of floating alone.

          Left column is sticky through the list on desktop: the statement stays put while the
          six titles scroll past it, so the claim and the evidence are on screen together rather
          than one after the other. */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-28">
        <ScrollDrift
          from={-10}
          to={10}
          className="pointer-events-none absolute left-[-14%] top-0 h-[55vw] max-h-[640px] w-[55vw] max-w-[640px]"
        >
          <div
            className="h-full w-full rounded-full opacity-[0.2] blur-3xl"
            style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
            aria-hidden="true"
          />
        </ScrollDrift>

        <div className="relative mx-auto grid max-w-5xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <div className="md:sticky md:top-28 md:self-start">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
              + The Short Version
            </p>
            <TextReveal
              as="h2"
              className="display-face text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-tight tracking-tight"
            >
              Six ways in.{" "}
              <span className="text-[var(--color-cherry)]">One way through.</span>
            </TextReveal>
            <TextReveal
              as="p"
              className="mt-6 max-w-sm text-base leading-relaxed text-[var(--color-muted)]"
            >
              The internet doesn&apos;t need more content. It needs a reason to stop scrolling.
              Everything below is built for that one job — take the piece you came for, or read
              straight down and watch them connect.
            </TextReveal>
          </div>

          <ServiceIndex />
        </div>
      </section>

      {/* Services — one full-bleed band per entry in `services`, alternating tone and layout.
          All of the motion lives in ServiceShowcase; this stays a list. */}
      {services.map((service, index) => (
        <ServiceShowcase
          key={service.number}
          service={service}
          icon={serviceIcons[index]}
          index={index}
        />
      ))}

      {/* Growth — the argument the six sections above have been building toward, and the last
          thing before the close. Someone who has scrolled this far knows what the studio sells;
          the open question is why they'd buy more than one line of it. So this doesn't restate
          the services, it shows them as one machine: attention at the top, customers at the
          bottom, each band naming which services do its work.

          It replaced a flat 2x4 grid of the four value words — "Full-Funnel Thinking" and the
          rest — which stated the pillars without ever arguing for them. The same four values
          survive inside the bands (see growthStages in lib/services.ts); the funnel is what
          gives each one a job. */}
      <section className="relative overflow-hidden px-6 py-28 sm:py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[60vw] max-h-[720px] w-[60vw] max-w-[720px] -translate-x-1/2 rounded-full opacity-[0.22] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Why It Works Together
          </p>
          <TextReveal
            as="h2"
            className="display-face text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-tight tracking-tight"
          >
            Six services. One job:{" "}
            <span className="text-[var(--color-cherry)]">grow the business.</span>
          </TextReveal>
          <TextReveal
            as="p"
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
          >
            Hire any one of them and you get a deliverable. Hire the studio and you get a
            funnel that keeps working after the invoice clears.
          </TextReveal>
        </div>
        <GrowthFunnel />
      </section>

      {/* Close — full-bleed dark band, mirrors the hero's gradient treatment for a bookend. */}
      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-center text-[var(--color-on-dark)] sm:py-36">
        <ScrollDrift
          from={-16}
          to={10}
          className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2"
        >
          <div
            className="h-full w-full rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
            aria-hidden="true"
          />
        </ScrollDrift>
        <div className="relative mx-auto max-w-3xl">
          <TextReveal
            as="h2"
            className="mb-10 text-[clamp(2.25rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight"
          >
            Let&apos;s build something worth remembering.
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
