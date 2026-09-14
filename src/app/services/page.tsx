import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { Marquee } from "@/components/scroll/Marquee";
import { SiteHeader } from "@/components/SiteHeader";
import { serviceIcons } from "@/components/services/serviceIcons";
import { ServiceShowcase } from "@/components/services/ServiceShowcase";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { ConnectedSystem } from "@/components/services/ConnectedSystem";
import { MonologuePull } from "@/components/marketing/MonologuePull";
import { Tagline } from "@/components/marketing/Tagline";
import { ScrollDrift } from "@/components/scroll/ScrollDrift";
import { services } from "@/lib/services";

export const metadata = {
  title: "Services — Kwic Shake",
  description:
    "Web design, brand consulting, social strategy, digital advertising, real-world marketing, and SEO — built as one connected system rather than six separate line items.",
};

/**
 * ── This page explains. It does not sell. ───────────────────────────────────────────────────
 *
 * The home page does the emotional work; someone arriving here has already decided they want
 * something and is now working out what they'd actually be buying. So this page is allowed to be
 * the most concrete on the site — real deliverables, real disciplines, plainly named.
 *
 * What it still refuses to be is a menu. Every one of the six bands opens with an argument
 * before it opens with a capability (see the `hook` field in lib/services.ts), and the page
 * closes on ConnectedSystem, whose entire job is to say that buying one of these in isolation is
 * the least valuable way to buy any of them.
 *
 * The pull quote sits between the six services and that closing argument on purpose: it's the
 * moment the page stops describing itself and lets the reader hear their own reason for being
 * here, right before it asks them to think bigger than one line item.
 */
const beatWords = ["Presence", "Conversation", "Identity", "Reach", "Connection", "Discovery"];

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
            + Services
          </p>
          <TextReveal
            as="h1"
            className="max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-tight"
          >
            What we{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--color-cherry), var(--color-nova-secondary))",
              }}
            >
              actually do.
            </span>
          </TextReveal>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <TextReveal as="p" className="max-w-md text-[var(--color-on-dark)]/60">
              We build the pieces of your marketing so they work together. Six disciplines, one
              system — not six invoices that never speak to each other.
            </TextReveal>
            <div className="flex flex-wrap gap-4">
              <MagneticButton
                as={TransitionLink}
                href="/work"
                className="inline-flex items-center gap-2 border border-[var(--color-on-dark)] px-6 py-3 text-sm"
              >
                Explore the Work
              </MagneticButton>
              <MagneticButton
                as={TransitionLink}
                href="/contact"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm text-[var(--color-button-primary-text)]"
              >
                Start a Conversation
              </MagneticButton>
            </div>
          </div>
        </ScrollDrift>
      </section>

      {/* Beat — a marquee of what each discipline is FOR, not what it's called. The six words
          are the `kicker` values from lib/services.ts, which is what keeps this strip from
          drifting out of sync with the six bands below it. */}
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

      {/* Intro + index. Left column is sticky through the list on desktop: the claim stays put
          while the six titles scroll past it, so the argument and the evidence are on screen
          together rather than one after the other. */}
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
              Take the piece you came for, or read straight down and watch them connect. Either
              way, none of these are things you have to learn — they&apos;re things that get
              handled.
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

      {/* The reader's own reason for being on this page, placed right before the argument that
          they should be thinking about more than one line item. */}
      <MonologuePull where="services" />

      {/* The system. Deliberately last: it only lands once all six disciplines have been met
          individually, because its argument is that those six are one machine. */}
      <section className="relative overflow-hidden px-6 py-28 sm:py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[60vw] max-h-[720px] w-[60vw] max-w-[720px] -translate-x-1/2 rounded-full opacity-[0.22] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Why It Works Together
          </p>
          <TextReveal
            as="h2"
            className="display-face text-balance text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-tight tracking-tight"
          >
            Every piece of marketing should{" "}
            <span className="text-[var(--color-cherry)]">
              make the next piece stronger.
            </span>
          </TextReveal>
        </div>
        <div className="relative px-0 sm:px-6">
          <ConnectedSystem />
        </div>
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
          <Tagline size="lg" className="mb-10" />
          <MagneticButton
            as={TransitionLink}
            href="/contact"
            radius={100}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
          >
            Let&apos;s Figure It Out
          </MagneticButton>
        </div>
      </section>
    </>
  );
}
