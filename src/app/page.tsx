import { HomeHero } from "@/components/home/HomeHero";
import { SiteHeader } from "@/components/SiteHeader";
import { EyeCloudReveal } from "@/components/home/EyeCloudReveal";
import { CredibilityGuess } from "@/components/home/CredibilityGuess";
import { FiftyMsTest } from "@/components/home/FiftyMsTest";
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
import { ScrollThread } from "@/components/atmosphere/ScrollThread";
import { ToneShift } from "@/components/atmosphere/ToneShift";
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
 * Adjacent bands never share a background, so a long scroll reads as distinct moments rather
 * than one continuous slab. The quieter, text-only beats wear the Kwic Wins tones (`data-tone` +
 * `.tone-section`, see globals.css) and are stitched
 * internally with the same dotted ScrollThread the Wins feed uses, so the page shifts colour as
 * it goes the way that feed does. If you add a section, check its neighbours.
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

      {/* The band's claim, made for the reader to prove to themselves: they guess the stat
          before they're told it. Same raised ground as the band on purpose, and no top padding
          (the band's own bottom padding is the gap), so the two read as one section rather than
          breaking the ground alternation. StatementBand itself stays one statement, no slots. */}
      <section className="relative bg-[var(--color-raised)] px-6 pb-24 text-[var(--color-on-dark)] sm:pb-32">
        <CredibilityGuess />
      </section>

      {/* The conclusion of the band above, given its own air. The only support it gets is a
          number, not an explanation: "50 milliseconds" makes the line concrete without talking
          it into a platitude, and the quiet last line turns it from a warning into our job. The
          50ms test under it lets the reader feel the number instead of taking our word for it. */}
      <section
        data-tone="cherry"
        className="tone-section section-y relative overflow-hidden px-6 text-center"
      >
        <div
          className="tone-glow pointer-events-none absolute left-1/2 top-0 h-[60vw] max-h-[640px] w-[60vw] max-w-[640px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          aria-hidden="true"
        />
        <p className="eyebrow relative mb-6">
          + The First Look
        </p>
        <TextReveal
          as="p"
          className="display-face section-title relative mx-auto max-w-3xl"
        >
          Your first impression is{" "}
          <span className="text-[var(--color-cherry)]">already marketing.</span>
        </TextReveal>
        <ScrollThread arrow className="mx-auto mt-8 h-16 max-w-3xl sm:h-20" />
        <TextReveal
          as="p"
          delay={0.15}
          className="relative mx-auto mt-8 max-w-2xl text-balance text-[clamp(1.25rem,2.6vw,1.75rem)] leading-snug text-[var(--color-on-dark)]"
        >
          <span className="display-face text-[var(--color-cherry)]">50 milliseconds</span> is
          all it takes.
        </TextReveal>
        <TextReveal
          as="p"
          delay={0.3}
          className="mx-auto mt-4 max-w-md text-base text-[var(--color-muted)]"
        >
          We have to start with a good impression.
        </TextReveal>
        <FiftyMsTest />
      </section>

      {/* ── PROBLEM ─────────────────────────────────────────────────────────────────────────
          Two voices, in order. First ours, naming the symptoms gently ("maybe"), then theirs,
          in the monologue cards. Ours makes it safe to admit; theirs makes it recognisable. */}
      <ToneShift initial="night" className="section-y relative overflow-hidden px-6">
        <div
          className="tone-glow pointer-events-none absolute -top-1/4 left-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-60 blur-3xl"
          aria-hidden="true"
        />

        {/* The three "Maybe your website feels stuck in the past."-style symptom lines were
            removed here. They stated the problem in OUR voice immediately before the monologue
            cards state it in the reader's — the same beat twice, and the weaker version first.
            The eyebrow now leads straight into their own words. */}
        <div className="relative mx-auto mb-14 max-w-5xl">
          <p className="eyebrow">
            + Sound Familiar
          </p>
        </div>

        <MonologueGrid lines={problemMonologue} />

        {/* The turn. After eight sentences of recognition, the first thing the page says about
            itself — and it is one line, because arriving quietly after all that recognition is
            what makes it land. */}
        {/* Same 5xl measure as the cards, so the thread leaves from under the last one. */}
        <div className="relative mx-auto max-w-5xl">
          <ScrollThread
            from={problemMonologue.length % 2 === 1 ? 320 : 680}
            to={500}
            arrow
            className="mt-4 h-20 sm:h-28"
          />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <TextReveal
            as="p"
            className="mt-10 text-[clamp(1.25rem,3vw,1.75rem)] leading-snug text-[var(--color-muted)]"
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
      </ToneShift>

      {/* ── EMOTION ─────────────────────────────────────────────────────────────────────────
          The thesis of the whole company, stated plainly. Everything the site sells follows
          from this one idea, so it gets the sparest treatment on the page. */}
      <section
        data-tone="dusk"
        className="tone-section section-y relative overflow-hidden px-6"
      >
        <div
          className="tone-glow pointer-events-none absolute left-1/2 top-1/4 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-6">
            + Why People Choose
          </p>
          <TextReveal
            as="h2"
            className="section-title"
          >
            They buy because{" "}
            <span className="text-[var(--color-cherry)]">they believe.</span>
          </TextReveal>

          <TextReveal
            as="p"
            className="section-lede mx-auto"
          >
            Not because they understand.
          </TextReveal>
        </div>

        {/* The three reasons, zigzagging down the page the way the Kwic Wins feed does — an
            oversized outlined number on alternating sides, the thread drawing from one to the
            next — so three sentences read as one descent toward the line that closes them. */}
        <ol className="relative mx-auto mt-16 max-w-4xl">
          {[
            "They remember the business that made them feel confident.",
            "They trust the company that looked like it knew exactly what it was doing.",
            "They choose the brand that made the decision feel easy.",
          ].map((line, index, lines) => {
            const right = index % 2 === 1;
            return (
              <li key={line}>
                <div
                  className={`flex items-center gap-5 sm:gap-8 ${right ? "flex-row-reverse text-right" : ""}`}
                >
                  <span
                    aria-hidden="true"
                    className="display-face tone-outline w-[1.3em] shrink-0 text-center text-[clamp(3.5rem,9vw,7rem)] leading-none"
                  >
                    {index + 1}
                  </span>
                  <TextReveal
                    as="p"
                    className="display-face max-w-xl text-balance text-[clamp(1.3rem,3vw,2.1rem)] leading-snug"
                  >
                    {line}
                  </TextReveal>
                </div>
                {index < lines.length - 1 && (
                  <ScrollThread
                    from={right ? 935 : 65}
                    to={right ? 65 : 935}
                    className="my-3 h-16 sm:h-24"
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="relative mx-auto max-w-4xl text-center">
          <ScrollThread from={65} to={500} arrow className="mt-3 h-20 sm:h-28" />
          <TextReveal
            as="p"
            className="mt-10 text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-none text-[var(--color-cherry)]"
          >
            That&apos;s what we&apos;re building.
          </TextReveal>
        </div>
      </section>

      {/* The eye-into-thought-cloud morph. It was already making exactly this argument before
          the rewrite — seen versus remembered — so it stays untouched and simply moves to where
          that argument now belongs: immediately before the brand line it sets up. */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] section-y px-6">
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
      <section
        data-tone="nova"
        className="tone-section section-y relative overflow-hidden px-6 text-center"
      >
        <div
          className="tone-glow pointer-events-none absolute left-1/2 top-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <TextReveal
            as="p"
            className="text-balance text-[clamp(1.25rem,2.8vw,1.75rem)] leading-snug text-[var(--color-muted)]"
          >
            Your website isn&apos;t just a website. It&apos;s the moment someone decides whether
            you&apos;re worth their time.
          </TextReveal>
          <ScrollThread arrow className="mt-8 h-16 sm:h-20" />
          <div className="mt-10">
            <Tagline size="lg" />
          </div>
        </div>
      </section>

      {/* ── POSSIBILITY ─────────────────────────────────────────────────────────────────────
          The first section on the page that describes a good outcome. It only arrives after the
          reader has recognised the problem and accepted the premise — offered earlier it would
          be a feature list, offered here it is a picture of their own business. */}
      <section className="section-y relative overflow-hidden px-6">
        <div
          className="pointer-events-none absolute -bottom-1/4 right-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="eyebrow mb-6">
            + What It Could Look Like
          </p>
          <TextReveal
            as="h2"
            className="section-title max-w-3xl"
          >
            The version{" "}
            <span className="text-[var(--color-cherry)]">
              you&apos;ve always pictured.
            </span>
          </TextReveal>
          <TextReveal
            as="p"
            className="section-lede"
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
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start md:gap-14">
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
        className="section-y relative overflow-hidden bg-[var(--color-raised)] px-6 text-[var(--color-on-dark)]"
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
          <p className="eyebrow mb-6">
            + The Work
          </p>
          <TextReveal
            as="h2"
            className="section-title max-w-3xl"
          >
            We show you{" "}
            <span className="text-[var(--color-cherry)]">what changed.</span>
          </TextReveal>
          {/* Two jobs now, where there used to be one. It still refuses the "pretty websites"
              framing the rest of the industry leads with, and it now also tells the reader what
              the moving frame underneath it is — a real page, running, rather than a render. */}
          <TextReveal
            as="p"
            className="section-lede"
          >
            Not pretty websites. The work itself, running.
          </TextReveal>

          <div className="mt-14">
            <FeaturedCaseStudy project={featured} />
          </div>

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
      <section
        data-tone="night"
        className="tone-section section-y relative overflow-hidden px-6"
      >
        <div
          className="tone-glow pointer-events-none absolute -bottom-1/4 right-[-10%] h-[55vw] max-h-[640px] w-[55vw] max-w-[640px] rounded-full opacity-60 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-6">
            + How It Goes
          </p>
          <TextReveal
            as="h2"
            className="section-title"
          >
            First:{" "}
            <span className="text-[var(--color-cherry)]">what isn&apos;t working.</span>
          </TextReveal>
          <TextReveal
            as="p"
            className="section-lede mx-auto"
          >
            Not what you think isn&apos;t working. What&apos;s actually getting in the way.
          </TextReveal>

          <ScrollThread arrow className="mt-8 h-14 sm:h-16" />

          <ol className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-4 sm:gap-x-4">
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
              className="tone-fill inline-flex items-center gap-3 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-widest"
            >
              See How We Work
              <span aria-hidden="true">&rarr;</span>
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
      <section
        data-tone="nova"
        className="tone-section section-y-lg relative overflow-hidden px-6 text-center"
      >
        <div
          className="tone-glow pointer-events-none absolute left-1/2 top-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="eyebrow mb-6">
            + Your Move
          </p>
          <TextReveal
            as="h2"
            className="section-title text-[var(--color-white)]"
          >
            Impossible{" "}
            <span className="text-[var(--color-cherry)]">to scroll past.</span>
          </TextReveal>

          {/* The thread drops from the headline into the quote, whose last word is the button —
              the same "follow the line, land on the ask" move as the Kwic Wins feed. */}
          <ScrollThread arrow className="mt-8 h-20 sm:h-28" />

          <figure className="mt-10 flex flex-col items-center gap-4">
            <blockquote className="text-balance text-[clamp(1.35rem,2.8vw,2rem)] leading-relaxed text-[var(--color-fg)]/85">
              The scariest moment is always just before you{" "}
              <QuoteStartCta />
            </blockquote>
            <figcaption className="eyebrow whitespace-nowrap">
              &mdash; Stephen King
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
