import { TextReveal } from "@/components/text/TextReveal";
import { BuildText } from "@/components/text/BuildText";
import { HeroEntrance } from "@/components/text/HeroEntrance";
import { ContactForm } from "@/components/contact/ContactForm";
import { MonologuePull } from "@/components/marketing/MonologuePull";
import { Tagline } from "@/components/marketing/Tagline";
import { CONTACT_EMAIL } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Contact — Kwic Shake",
  description:
    "You don't need to have everything figured out. Tell us what's happening and we'll help you work out what happens next.",
};

/**
 * ── The page that has to feel like relief, not a lead form ──────────────────────────────────
 *
 * Every other page has been building desire. This one has a single job: remove the reasons
 * someone talks themselves out of sending the message. In practice that means fighting three
 * specific hesitations, and each one has a piece of this page assigned to it:
 *
 *   "I don't know what I need."      → the headline, and the "I'm not sure yet" option in the
 *                                      form's service select.
 *   "I should have done this ages
 *    ago and I'm embarrassed."       → the pull quote, which says the quiet part first.
 *   "This is going to become a
 *    sales process."                 → the line under the form, and the fact that the CTA asks
 *                                      for a conversation rather than a project or a budget.
 *
 * The four "maybe" lines are deliberately the same rhetorical shape as the ones on the home
 * page's problem beat — someone who arrives here from that section should feel like the site is
 * still talking to them rather than switching into intake mode.
 *
 * The direct email address stays prominent. Some people will never fill in a form, and the point
 * of this page is starting a conversation, not capturing it through a preferred channel.
 */
const maybes = [
  "Maybe your website is outdated.",
  "Maybe your branding doesn't feel like you anymore.",
  "Maybe customers aren't finding you.",
  "Maybe you've been putting off your marketing because you don't know where to start.",
];

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-[var(--color-on-dark)] sm:py-32">
        <div
          className="pointer-events-none absolute -top-1/4 right-[-10%] h-[55vw] max-h-[700px] w-[55vw] max-w-[700px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <HeroEntrance className="relative mx-auto max-w-4xl">
          <p
            data-hero-line
            className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]"
          >
            + <BuildText text="Let's Talk" delay={700} />
          </p>
          <h1 className="max-w-3xl text-balance text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[1.06] tracking-tight">
            <span data-hero-line className="block text-[var(--color-white)]">
              You don&apos;t need to have everything figured out.
            </span>
            <span data-hero-line className="block text-[var(--color-cherry)]">
              You just need to know something could be better.
            </span>
          </h1>

          <ul className="mt-12 space-y-3">
            {maybes.map((line) => (
              <li
                key={line}
                data-hero-line
                className="max-w-2xl text-base leading-relaxed text-[var(--color-on-dark)]/70 sm:text-lg"
              >
                {line}
              </li>
            ))}
          </ul>

          <p
            data-hero-line
            className="mt-10 text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-none text-[var(--color-cherry)]"
          >
            That&apos;s okay.
          </p>
        </HeroEntrance>
      </section>

      {/* Said before the form rather than after it: the hesitation this addresses is the one
          that stops people from starting, not the one that stops them from finishing. */}
      <MonologuePull where="contact" />

      <section className="relative overflow-hidden px-6 py-24 sm:py-28">
        <div
          className="pointer-events-none absolute -bottom-1/4 left-[-12%] h-[50vw] max-h-[600px] w-[50vw] max-w-[600px] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <TextReveal
            as="h2"
            className="display-face text-[clamp(1.5rem,3.5vw,2.5rem)] font-medium leading-tight tracking-tight"
          >
            Tell us what&apos;s happening.
          </TextReveal>
          <TextReveal
            as="p"
            className="mb-16 mt-4 max-w-lg text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
          >
            We&apos;ll help you figure out what happens next. No deck, no discovery fee, no
            pressure to decide anything on the call.
          </TextReveal>

          <ContactForm />

          {/* The reassurance goes under the submit button, where the last flicker of doubt
              actually happens. */}
          <div className="mt-20 border-t border-[var(--color-border)] pt-14">
            <TextReveal
              as="p"
              className="display-face max-w-2xl text-balance text-[clamp(1.35rem,3vw,2rem)] font-medium leading-snug tracking-tight"
            >
              We&apos;d rather have a conversation than{" "}
              <span className="text-[var(--color-cherry)]">
                sell you something you don&apos;t need.
              </span>
            </TextReveal>

            <p className="mt-10 text-sm text-[var(--color-muted)]">
              Prefer email? Reach us directly at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[var(--color-fg)] underline decoration-[var(--color-cherry)] underline-offset-4 hover:text-[var(--color-cherry)]"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-24 text-center text-[var(--color-on-dark)] sm:py-28">
        <div
          className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[55vw] max-h-[640px] w-[55vw] max-w-[640px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
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
