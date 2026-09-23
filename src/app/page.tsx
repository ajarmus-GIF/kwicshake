import { HomeHero } from "@/components/home/HomeHero";
import { SiteHeader } from "@/components/SiteHeader";
import { EyeCloudReveal } from "@/components/home/EyeCloudReveal";
import { PurposeSection } from "@/components/home/PurposeSection";
import { ServiceSplitScroll } from "@/components/home/ServiceSplitScroll";
import { PossibilityList } from "@/components/home/PossibilityList";
import { EditorialMedia } from "@/components/media/EditorialMedia";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { Marquee } from "@/components/scroll/Marquee";
import { TextReveal } from "@/components/text/TextReveal";
import { StatementBand } from "@/components/marketing/StatementBand";
import { MonologueGrid } from "@/components/marketing/MonologueGrid";
import { Tagline } from "@/components/marketing/Tagline";
import { FeaturedCaseStudy } from "@/components/work/FeaturedCaseStudy";
import { QuoteStartCta } from "@/components/home/QuoteStartCta";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { projects } from "@/lib/projects";
import { problemMonologue } from "@/lib/monologue";
import { processSteps } from "@/lib/process";
import { CONTACT_EMAIL } from "@/lib/site";

/**
 * ── The home page is a sequence, not a set of sections ──────────────────────────────────────
 *
 * It runs PROBLEM → EMOTION → POSSIBILITY → PROOF → PROCESS → ACTION, and the order is the
 * argument. Each beat only works because of the one before it:
 *
 *   PROBLEM      Something isn't landing, and here it is in your own words.
 *   EMOTION      That's because people decide on belief, not information.
 *   POSSIBILITY  Here's the version of your business where belief is on your side.
 *   RELIEF       And you don't have to build it yourself.
 *   PROOF        Here's us doing it, honestly reported.
 *   PROCESS      Here's how it goes, so it stops feeling like a leap.
 *   ACTION       So: talk to us. No pressure attached.
 *
 * Reordering these breaks the page even if every section still renders. Showing services before
 * the emotional beats turns the page back into a brochure; showing proof before possibility asks
 * someone to be impressed before they want anything.
 *
 * ── Ground alternation ──────────────────────────────────────────────────────────────────────
 * Adjacent bands never share a background. The page runs photo → raised → default → surface →
 * raised → default → photo → default → raised → surface → cherry → raised, so a long scroll
 * reads as distinct moments rather than one continuous slab. If you add a section, check its
 * neighbours.
 *
 * ── What deliberately is NOT here ───────────────────────────────────────────────────────────
 * The six service explanations (they live on /services), the full process detail (/process), and
 * the case-study narrative (/work). This page's job is to make someone want those pages, not to
 * be all of them.
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

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <SiteHeader />

      {/* ── TRUST ───────────────────────────────────────────────────────────────────────────
          First thing after the hero, and deliberately an uncomfortable idea rather than a
          welcome. It reframes the entire purchase before any service is mentioned: this is not
          about having a website, it's about a judgement people are already making. */}
      <StatementBand
        eyebrow="First Impressions"
        tone="raised"
        support={
          <>
            How much they trust you. Before they contact you. Before they visit. Before they
            buy. <span className="text-[var(--color-cherry)]">They&apos;re looking.</span>
          </>
        }
      >
        People decide{" "}
        <span className="text-[var(--color-cherry)]">before they connect.</span>
      </StatementBand>

      {/* The conclusion of the band above, given its own air. Nothing else in this section on
          purpose — it is the kind of line that only works if the reader has a second to sit
          with it, and any supporting copy would immediately explain it into a platitude. */}
      <section className="relative overflow-hidden px-6 py-24 text-center sm:py-28">
        <TextReveal
          as="p"
          className="display-face mx-auto max-w-3xl text-balance text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-tight tracking-tight"
        >
          Your first impression is{" "}
          <span className="text-[var(--color-cherry)]">already marketing.</span>
        </TextReveal>
      </section>

      {/* ── PROBLEM ─────────────────────────────────────────────────────────────────────────
          Two voices, in order. First ours, naming the symptoms gently ("maybe"), then theirs,
          in the monologue cards. Ours makes it safe to admit; theirs makes it recognisable. */}
      <section className="relative overflow-hidden bg-[var(--color-surface)] px-6 py-28 sm:py-32">
        <div
          className="pointer-events-none absolute -top-1/4 left-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />

        {/* The three "Maybe your website feels stuck in the past."-style symptom lines were
            removed here. They stated the problem in OUR voice immediately before the monologue
            cards state it in the reader's — the same beat twice, and the weaker version first.
            The eyebrow now leads straight into their own words. */}
        <div className="relative mx-auto mb-12 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Sound Familiar
          </p>
        </div>

        <MonologueGrid lines={problemMonologue} />

        {/* The turn. After eight sentences of recognition, the first thing the page says about
            itself — and it is one line, because arriving quietly after all that recognition is
            what makes it land. */}
        <div className="relative mx-auto mt-24 max-w-3xl text-center">
          <TextReveal
            as="p"
            className="text-[clamp(1.25rem,3vw,1.75rem)] leading-snug text-[var(--color-muted)]"
          >
            That&apos;s where we come in.
          </TextReveal>
          <TextReveal
            as="p"
            className="display-face mt-6 text-balance text-[clamp(1.5rem,3.6vw,2.5rem)] font-medium leading-snug tracking-tight"
          >
            Kwic Shake builds digital experiences that make people stop, feel something, and{" "}
            <span className="text-[var(--color-cherry)]">take the next step.</span>
          </TextReveal>
        </div>
      </section>

      {/* ── EMOTION ─────────────────────────────────────────────────────────────────────────
          The thesis of the whole company, stated plainly. Everything the site sells follows
          from this one idea, so it gets the sparest treatment on the page. */}
      <section className="relative overflow-hidden px-6 py-28 sm:py-36">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.2] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <TextReveal
            as="h2"
            className="display-face text-balance text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[1.06] tracking-tight"
          >
            They buy because{" "}
            <span className="text-[var(--color-cherry)]">they believe.</span>
          </TextReveal>

          <TextReveal
            as="p"
            className="mx-auto mt-6 max-w-xl text-lg leading-snug text-[var(--color-muted)]"
          >
            Not because they understand.
          </TextReveal>

          <div className="mx-auto mt-14 max-w-2xl space-y-5 text-left sm:text-center">
            <TextReveal as="p" className="text-lg leading-snug sm:text-xl">
              They remember the business that made them feel confident.
            </TextReveal>
            <TextReveal as="p" className="text-lg leading-snug sm:text-xl">
              They trust the company that looked like it knew exactly what it was doing.
            </TextReveal>
            <TextReveal as="p" className="text-lg leading-snug sm:text-xl">
              They choose the brand that made the decision feel easy.
            </TextReveal>
          </div>

          <TextReveal
            as="p"
            className="mt-12 text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-none text-[var(--color-cherry)]"
          >
            That&apos;s what we&apos;re building.
          </TextReveal>
        </div>
      </section>

      {/* The eye-into-thought-cloud morph. It was already making exactly this argument before
          the rewrite — seen versus remembered — so it stays untouched and simply moves to where
          that argument now belongs: immediately before the brand line it sets up. */}
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

      {/* The brand line, arriving as the conclusion of the emotional argument rather than as a
          slogan. Everything above it — trust, belief, seen versus remembered — is the reason it
          means anything here. */}
      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-center text-[var(--color-on-dark)] sm:py-36">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <TextReveal
            as="p"
            className="text-balance text-[clamp(1.25rem,2.8vw,1.75rem)] leading-snug text-[var(--color-on-dark)]/70"
          >
            Your website isn&apos;t just a website. It&apos;s the moment someone decides whether
            you&apos;re worth their time.
          </TextReveal>
          <div className="mt-12">
            <Tagline size="lg" />
          </div>
        </div>
      </section>

      {/* ── POSSIBILITY ─────────────────────────────────────────────────────────────────────
          The first section on the page that describes a good outcome. It only arrives after the
          reader has recognised the problem and accepted the premise — offered earlier it would
          be a feature list, offered here it is a picture of their own business. */}
      <section className="relative overflow-hidden px-6 py-28 sm:py-32">
        <div
          className="pointer-events-none absolute -bottom-1/4 right-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + What It Could Look Like
          </p>
          <TextReveal
            as="h2"
            className="display-face mb-14 max-w-3xl text-[clamp(1.75rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-tight"
          >
            The version{" "}
            <span className="text-[var(--color-cherry)]">
              you&apos;ve always pictured.
            </span>
          </TextReveal>
          <TextReveal
            as="p"
            className="mb-14 -mt-10 max-w-xl text-lg leading-snug text-[var(--color-muted)]"
          >
            Your business should feel like it.
          </TextReveal>

          {/* The most earned image on the page: this section's whole subject is the reader
              picturing a better version of their own business, and it is the one beat where a
              picture is the argument rather than an illustration of it. Two slots at different
              ratios and opposite wipe directions so the pair reads as a composition rather than
              as a row of matching boxes.

              The list keeps the wider column — the five lines are still what carries the beat;
              the images support them. */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start md:gap-14">
            <PossibilityList />

            <div className="flex flex-col gap-5">
              <EditorialMedia
                src="/images/storefront-night.jpg"
                alt="A small storefront at night, its windows the only lit thing on the street."
                label="Client business — environment, 4:3"
                aspect="aspect-[4/3]"
                from="bottom"
                sizes="(max-width: 768px) 100vw, 38vw"
              />
              <EditorialMedia
                src="/images/site-on-screen.jpg"
                alt="A laptop open in a dark room, its screen the brightest surface in the frame."
                label="Finished site — on screen, 16:10"
                aspect="aspect-[16/10]"
                from="right"
                delay={140}
                className="md:ml-10"
                sizes="(max-width: 768px) 100vw, 32vw"
              />
            </div>
          </div>

          {/* The rhetorical turn. Two lines, the second correcting the first — kept out of the
              list above because it is a conclusion about all five items, not a sixth item. */}
          <div className="mt-14 max-w-2xl">
            <TextReveal
              as="p"
              className="text-[clamp(1.25rem,3vw,1.9rem)] leading-snug text-[var(--color-muted)]"
            >
              Marketing that doesn&apos;t just exist.
            </TextReveal>
            <TextReveal
              as="p"
              className="mt-2 text-[clamp(1.25rem,3vw,1.9rem)] leading-snug text-[var(--color-cherry)]"
            >
              Marketing that moves people.
            </TextReveal>
          </div>

        </div>
      </section>

      {/* ── RELIEF ──────────────────────────────────────────────────────────────────────── */}
      <PurposeSection />

      {/* ── MECHANISM ───────────────────────────────────────────────────────────────────────
          Services appear this late on purpose. By now the reader wants an outcome; the six
          disciplines are how it gets made, which is a very different thing from a menu shown to
          someone who hasn't decided they want anything.

          This is also the page's one sticky split-screen — the single most attention-expensive
          interaction on the site, spent here because this is the beat where six separate
          disciplines have to read as one connected system. See ServiceSplitScroll for why there
          is exactly one of these and why it is this section. */}
      <ServiceSplitScroll />

      <BeforeAfter />

      {/* ── PROOF ───────────────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-[var(--color-on-dark)] sm:py-32"
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
        {/* 6xl, not 5xl: the case-study frame below is now full width and showing a recording
            of a real page, and 1024px was a container sized for a 4:3 card beside a paragraph.
            The frame caps itself against viewport height, so the wider container buys size on a
            desktop without pushing the bottom of the video off a laptop screen. */}
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + The Work
          </p>
          <TextReveal
            as="h2"
            className="mb-14 max-w-3xl text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-tight"
          >
            We show you{" "}
            <span className="text-[var(--color-cherry)]">what changed.</span>
          </TextReveal>
          {/* Two jobs now, where there used to be one. It still refuses the "pretty websites"
              framing the rest of the industry leads with, and it now also tells the reader what
              the moving frame underneath it is — a real page, running, rather than a render. */}
          <TextReveal
            as="p"
            className="mb-14 -mt-10 max-w-xl text-lg leading-snug text-[var(--color-muted)]"
          >
            Not pretty websites. The work itself, running.
          </TextReveal>

          <FeaturedCaseStudy project={featured} />

          {/* Founders' note. Plain <p>, not TextReveal — SplitText rewraps text nodes into
              per-line divs, and this paragraph has an anchor inside it that React owns.

              Rewritten from a limited-time-rate pitch. Urgency reads as need, and this is the
              one paragraph on the page written in our own first person — the place a sceptical
              reader looks to decide whether we sound like people or like a funnel. */}
          <p className="mx-auto mt-16 max-w-2xl text-center text-base leading-relaxed text-[var(--color-muted)]">
            <span className="font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
              Straight from us
            </span>
            <span className="mx-2 text-[var(--color-cherry)]">&bull;</span>
            We&apos;re early, and we&apos;d rather say so than pad this page. What we offer is
            our full attention on a few businesses. Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--color-cherry)] underline decoration-[var(--color-cherry)]/35 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-[var(--color-cherry)]"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            and talk to the two people who&apos;ll do the work.
          </p>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────────────────────────────────────
          A teaser, not the process. Six verbs is enough to convert "this sounds like a big
          undertaking" into "that's six steps and none of them are mine"; the detail lives on
          /process for the reader who wants to be sure. */}
      <section className="relative overflow-hidden bg-[var(--color-surface)] px-6 py-28 sm:py-32">
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + How It Goes
          </p>
          <TextReveal
            as="h2"
            className="display-face text-balance text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-tight tracking-tight"
          >
            First:{" "}
            <span className="text-[var(--color-cherry)]">what isn&apos;t working.</span>
          </TextReveal>
          <TextReveal
            as="p"
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
          >
            Not what you think isn&apos;t working. What&apos;s actually getting in the way.
          </TextReveal>

          <ol className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-4 sm:gap-x-4">
            {processSteps.map((step, index) => (
              <li key={step.number} className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  <span className="mr-2 tabular-nums text-[var(--color-cherry)]">
                    {step.number}
                  </span>
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
              className="inline-flex items-center gap-2 border border-[var(--color-fg)] px-7 py-3.5 text-sm uppercase tracking-widest transition-colors hover:border-[var(--color-cherry)] hover:text-[var(--color-cherry)]"
            >
              See How We Work
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ── The typographic band ────────────────────────────────────────────────────────────
          Two rows moving against each other. The upper row is the company name at display size,
          travelling right-to-left; the lower row is the six disciplines, travelling left-to-right
          at a different speed. Opposed motion is what makes this read as a mechanism rather than
          as a single thick ticker, and the speed mismatch (22s against 16s) keeps the two rows
          from settling into a mirrored rhythm.

          The brand row exists for a specific reason: it is the one place on the page where the
          full name is set large enough to be unmissable and repeated enough to be unforgettable,
          which is precisely this band's job. It is the NAME here and not the tagline on purpose —
          "Make them remember you." already lands twice on this page (the brand-line section and
          the footer), and a third appearance in a loop would turn the site's one recurring idea
          into wallpaper. See the note in lib/site.ts. */}
      <section className="overflow-hidden bg-[var(--color-cherry-dark)] py-7">
        <Marquee baseDuration={22} reverse>
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className="brand-wordmark flex shrink-0 items-center gap-7 px-7 text-[clamp(1.75rem,4.5vw,3rem)] uppercase leading-none tracking-[0.04em] text-[var(--color-white)]"
            >
              Kwic Shake
              {/* Separator, so four repetitions read as a cadence rather than as one long
                  run-on string. aria-hidden: the duplicate track is already hidden, but this
                  glyph is decorative even in the visible copy. */}
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

      {/* ── ACTION ──────────────────────────────────────────────────────────────────────────
          The close. The Stephen King quote with the CTA as its own last word survives the
          rewrite intact — it is the least sales-shaped call to action on the site, which is
          exactly right for a visitor who has just been told they don't have to have it figured
          out. See QuoteStartCta for why the button is built to sit inside a line of prose. */}
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
              Biased low (top-[62%]) so the bloom pools behind the accent half of the line rather
              than the white first half, and inset negatively so its soft edge is already past
              the text before it falls off. The section's own `overflow-hidden` clips it. */}
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
              Impossible{" "}
              <span className="text-[var(--color-cherry)]">to scroll past.</span>
            </TextReveal>
          </div>

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
