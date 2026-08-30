import { HomeHero } from "@/components/home/HomeHero";
import { SiteHeader } from "@/components/SiteHeader";
import { EyeCloudReveal } from "@/components/home/EyeCloudReveal";
import { PurposeSection } from "@/components/home/PurposeSection";
import { ServicesTeaser } from "@/components/home/ServicesTeaser";
import { Marquee } from "@/components/scroll/Marquee";
import { TextReveal } from "@/components/text/TextReveal";
import { ProjectListHover } from "@/components/interactive/ProjectListHover";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { QuoteStartCta } from "@/components/home/QuoteStartCta";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { projects } from "@/lib/projects";
import { team } from "@/lib/team";
import { CONTACT_EMAIL } from "@/lib/site";

const marqueeWords = [
  "Web Design",
  "Social Strategy",
  "Brand Consulting",
  "Digital Ads",
  "QR Campaigns",
  "SEO",
  "Internet Marketing",
];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <SiteHeader />

      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
        <EyeCloudReveal
          lineOne={
            <>
              Being <span className="font-bold text-[var(--color-cherry)]">seen</span> is the
              goal.
            </>
          }
          lineTwo={
            <>
              Being <span className="font-bold text-[var(--color-cherry)]">remembered</span>{" "}
              is the promise.
            </>
          }
        />
      </section>

      <PurposeSection />

      <ServicesTeaser />

      {/* Founders teaser — the only section on this page whose job is to send people to
          another page rather than to sell a service.

          Runs on the dark ground with NO local token overrides, which is the whole reason it
          can be this colourful. --color-cherry (#a85fd1) is proven 4.5:1+ on --color-paper
          (see the token's note in globals.css), so the eyebrow, the numerals, the accent half
          of the headline and `.name-outline`'s stroke all just work on their default values.
          The earlier --color-ash version of this band could not: cherry sits at ~2.1:1 on
          #8a7ab0, so it had no usable accent and ran entirely in flat near-black.

          Ground is --color-surface rather than plain --color-bg so it separates from
          ServicesTeaser above (on --color-bg) and the Selected Work band below (on
          --color-raised) — three adjacent darks, each a couple of percent apart, instead of
          one undifferentiated run.

          Content is pulled from `team` rather than retyped, so the two founders shown here
          cannot drift from /about. Each card shows beats[0] — team.ts deliberately orders the
          professional credential first, which is the beat that earns the click; the Jeep and
          the six-iron are the payoff on the page this button leads to, and giving them away
          here would spend the surprise. */}
      <section className="relative overflow-hidden bg-[var(--color-surface)] px-6 py-28 sm:py-32">
        <div
          className="pointer-events-none absolute -right-[15%] -top-1/4 h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Who&apos;s Behind It
          </p>
          {/* Same line the /about intro opens with, on purpose — it is the hook here and the
              header there, so arriving on that page confirms the click rather than restarting. */}
          <TextReveal
            as="h2"
            className="display-face max-w-3xl text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight tracking-tight"
          >
            <span className="whitespace-nowrap">Aidan markets it.</span>{" "}
            <span className="whitespace-nowrap text-[var(--color-cherry)]">Jonah runs it.</span>
          </TextReveal>
          <TextReveal
            as="p"
            className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
          >
            No agency runaround, no jargon, no waiting three weeks for a headline change. Just
            the two of us, taking your business as seriously as you do.
          </TextReveal>

          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-10">
            {team.map((member) => (
              <article key={member.number}>
                <ParallaxMedia rate={0.12} className="aspect-[4/5]">
                  <PlaceholderMedia
                    label={`TODO: ${member.firstName}`}
                    aspect="aspect-auto"
                    className="h-full"
                  />
                </ParallaxMedia>
                <div className="mt-6 flex items-baseline gap-3 text-xs uppercase tracking-[0.2em]">
                  <span className="tabular-nums text-[var(--color-cherry)]">{member.number}</span>
                  <span className="text-[var(--color-muted)]">{member.role}</span>
                </div>
                {/* Filled given name over outlined surname — the same lockup TeamMemberFlow
                    builds on /about, so the two pages introduce these two the same way. */}
                <p className="display-face mt-3 text-[clamp(1.75rem,4vw,2.5rem)] uppercase leading-[0.92] tracking-tight">
                  <span className="block">{member.firstName}</span>
                  <span className="name-outline block">{member.lastName}</span>
                </p>
                <p className="mt-5 text-lg font-semibold leading-snug">
                  {member.beats[0].headline}
                </p>
                <p className="mt-2 leading-relaxed text-[var(--color-muted)]">
                  {member.beats[0].detail}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <MagneticButton
              as={TransitionLink}
              href="/about"
              radius={100}
              className="btn-primary w-full max-w-md px-8 py-4 text-center text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
            >
              Get to know us better
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Darkened for contrast against the light sections above/below — locally overrides the
          fg/muted/border tokens so ProjectListHover's text and dividers flip to their
          on-dark equivalents without touching that component. */}
      <section
        className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-24 text-[var(--color-on-dark)]"
        style={
          {
            "--color-fg": "var(--color-on-dark)",
            "--color-muted": "color-mix(in srgb, var(--color-on-dark) 65%, var(--color-raised))",
            "--color-border": "color-mix(in srgb, var(--color-on-dark) 15%, transparent)",
          } as React.CSSProperties
        }
      >
        <div
          className="pointer-events-none absolute -top-1/4 left-[-10%] h-[55vw] max-h-[700px] w-[55vw] max-w-[700px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Selected Work
          </p>
          <TextReveal as="h2" className="mb-10 text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight">
            Work we&apos;re proud to put our name on.
          </TextReveal>
          <ProjectListHover projects={projects} />

          {/* Founders' note. Plain <p>, not TextReveal — SplitText rewraps text nodes into
              per-line divs, and this paragraph has an anchor inside it that React owns. */}
          <p className="mx-auto mt-14 max-w-2xl text-center text-base leading-relaxed text-[var(--color-muted)]">
            <span className="font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
              A message from the founders
            </span>
            <span className="mx-2 text-[var(--color-cherry)]">&bull;</span>
            We&apos;re still filling this page out. While we do, email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--color-cherry)] underline decoration-[var(--color-cherry)]/35 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-[var(--color-cherry)]"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            for a chance to work with us at a rate we won&apos;t be offering for long. Back us
            early and we&apos;ll make sure it pays off.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-cherry-dark)] py-6">
        <Marquee baseDuration={16}>
          {marqueeWords.map((word, index) => (
            <span
              key={index}
              className="px-8 text-[clamp(1.5rem,4vw,2.5rem)] text-[var(--color-white)]/80"
            >
              {word}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Close — same bookend as /services, /about, and /work: the last thing a visitor sees
          is a direct push to get in touch, not just a fade-out. */}
      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-center text-[var(--color-on-dark)] sm:py-36">
        <div
          className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          {/* Light leak behind the accent line. `mix-blend-screen` is what makes it read as
              light rather than as a purple panel laid over the section: screen is additive, so
              on this near-black background it brightens toward cherry instead of flatly tinting.
              Biased low (top-[62%]) so the bloom pools behind "impossible to scroll past."
              rather than the white first line, and inset negatively so its soft edge is already
              past the text before it falls off. The section's own `overflow-hidden` clips it. */}
          <div className="relative mb-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[-18%] top-[62%] h-[80%] -translate-y-1/2 opacity-70 blur-[70px] mix-blend-screen"
              style={{
                background:
                  "radial-gradient(ellipse 62% 52% at 50% 50%, color-mix(in srgb, var(--color-white) 62%, transparent) 0%, transparent 72%)",
              }}
            />
            <TextReveal
              as="h2"
              className="relative text-[clamp(2.25rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight"
            >
              Let&apos;s make you{" "}
              <span className="text-[var(--color-cherry)]">impossible to scroll past.</span>
            </TextReveal>
          </div>

          {/* The CTA *is* the quote's last word: "…just before you start." is one unbroken
              sentence, so this button is built to sit INSIDE a line of prose rather than under
              it. Three things make that work, and all three are why it isn't just `.btn-primary`:

              - Padding is in `em`, not `rem`/px, so the pill scales with the blockquote's own
                clamp() font size instead of staying a fixed chip that drifts out of proportion
                as the quote grows.
              - `align-baseline` + inherited font-size put the word on the sentence's baseline;
                a stock button's `text-sm` and inline-flex centering would sit it visibly off.
              - Outlined at rest, filled on hover. A solid gradient chip mid-sentence reads as a
                foreign object dropped in the line; a hairline outline keeps the word's color
                and weight leading, then the accent gradient + glow arrive on approach.

              The markup lives in QuoteStartCta so it can own a client-side timer: two seconds
              after this quote scrolls into view the button plays that hover state once on its
              own, then releases.

              Three consequences:
              1. Lowercase "start" — it's the sentence's own last word, so it takes the
                 sentence's capitalization.
              2. No trailing punctuation and no quotation marks. <blockquote> plus the
                 figcaption already mark this as a quotation, and a period or a `."` stranded
                 after the pill reads as a rendering artifact rather than as the sentence's end.
              3. No MagneticButton and no TextReveal. Both move or rewrap DOM mid-sentence —
                 the magnet visibly tears the word out of the line as the cursor approaches,
                 and SplitText would rewrap text nodes React owns. Either one undoes the exact
                 flow this layout exists to create. */}
          <figure className="flex flex-col items-center gap-3">
            <blockquote className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed text-[var(--color-on-dark)]/75">
              The scariest moment is always just before you{" "}
              <QuoteStartCta />
            </blockquote>
            <figcaption className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-cherry)]">
              &mdash; Stephen King
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
