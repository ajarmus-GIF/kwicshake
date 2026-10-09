import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroEntrance } from "@/components/text/HeroEntrance";
import { BuildText } from "@/components/text/BuildText";
import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { CredibilityGuess } from "@/components/home/CredibilityGuess";
import { FiftyMsTest } from "@/components/home/FiftyMsTest";
import { PossibilityList } from "@/components/home/PossibilityList";
import { QuoteStartCta } from "@/components/home/QuoteStartCta";
import { Tagline } from "@/components/marketing/Tagline";
import { BeatFeed, type Beat } from "@/components/feed/BeatFeed";
import { problemMonologue } from "@/lib/monologue";
import { processSteps } from "@/lib/process";
import { services } from "@/lib/services";
import { DESCRIPTOR } from "@/lib/site";

// Unlisted concept: reachable by URL only, never linked from the site, and kept out of search.
export const metadata = {
  title: "Home Concept 2 — Kwic Shake",
  robots: { index: false, follow: false },
};

/**
 * ── Home Concept 2: the home page as a Kwic Wins feed ───────────────────────────────────────
 *
 * Same words as the live home page, told the way /wins tells its posts: one beat per screen,
 * zigzagging, the whole page's colour shifting to the beat in view, a giant outlined number
 * sliding behind each frame, a dotted thread drawn between beats, and a counter in the corner
 * so a scroller always knows how deep they are. See components/feed/BeatFeed.tsx.
 *
 * The two interactive pieces from the live home page — the credibility-stat slider quiz and the
 * 50ms test — are "stage" beats: full width, no wipe or tilt, because they have to stay usable.
 */
const photo = (src: string, alt: string) => (
  <div data-beat-photo className="absolute inset-0">
    <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
  </div>
);

const reasons = [
  "They remember the business that made them feel confident.",
  "They trust the company that looked like it knew exactly what it was doing.",
  "They choose the brand that made the decision feel easy.",
];

const notYourJob = [
  "You shouldn't need to understand SEO.",
  "You shouldn't need to learn ad platforms.",
  "You shouldn't need to spend your nights wondering why your website isn't working.",
];

const beats: Beat[] = [
  {
    id: "first-impressions",
    tone: "night",
    label: "First Impressions",
    title: (
      <>
        People decide <span className="tone-text">before they connect.</span>
      </>
    ),
    body: (
      <p>
        How much they trust you. Before they contact you. Before they visit. Before they buy.{" "}
        <span className="tone-text">They&apos;re looking.</span>
      </p>
    ),
    stage: (
      <div className="mt-10">
        <CredibilityGuess />
      </div>
    ),
  },
  {
    id: "first-look",
    tone: "cherry",
    label: "The First Look",
    title: (
      <>
        Your first impression is <span className="tone-text">already marketing.</span>
      </>
    ),
    body: (
      <p>
        <span className="display-face tone-text">50 milliseconds</span> is all it takes. We have
        to start with a good impression.
      </p>
    ),
    stage: <FiftyMsTest />,
  },
  {
    id: "sound-familiar",
    tone: "dusk",
    label: "Sound Familiar",
    title: (
      <>
        Something <span className="tone-text">isn&apos;t landing.</span>
      </>
    ),
    body: (
      <p>
        That&apos;s where we come in. Kwic Shake builds digital experiences that make people stop,
        feel something, and <span className="tone-text">take the next step.</span>
      </p>
    ),
    visual: (
      <div className="flex h-full flex-col justify-center gap-4 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--tone-accent)_22%,transparent),transparent_60%)] p-6 sm:p-10">
        {problemMonologue.map((line, i) => (
          <p
            key={line.id}
            className={`max-w-[85%] rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-[clamp(0.95rem,1.6vw,1.2rem)] leading-snug text-[var(--color-white)]/90 backdrop-blur-sm ${
              i % 2 ? "self-end" : "self-start"
            }`}
          >
            &ldquo;{line.text}&rdquo;
          </p>
        ))}
      </div>
    ),
  },
  {
    id: "believe",
    tone: "nova",
    label: "Why People Choose",
    title: (
      <>
        They buy because <span className="tone-text">they believe.</span>
      </>
    ),
    body: <p>Not because they understand. That&apos;s what we&apos;re building.</p>,
    visual: (
      <ol className="flex h-full flex-col justify-center divide-y divide-white/10 px-6 sm:px-12">
        {reasons.map((line, i) => (
          <li key={line} className="flex items-baseline gap-6 py-7">
            <span className="display-face tone-text text-[clamp(2rem,4vw,3.5rem)] leading-none">{i + 1}</span>
            <span className="display-face text-[clamp(1.2rem,2.2vw,1.75rem)] leading-snug text-[var(--color-white)]">
              {line}
            </span>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "remembered",
    tone: "lilac",
    label: "Seen vs. Remembered",
    title: (
      <>
        Being seen is the goal. <span className="tone-text">Being remembered is the promise.</span>
      </>
    ),
    body: (
      <p>
        Your website isn&apos;t just a website. It&apos;s the moment someone decides whether
        you&apos;re worth their time.
      </p>
    ),
    visual: (
      <div className="grid h-full place-items-center bg-[radial-gradient(circle,color-mix(in_srgb,var(--tone-accent)_28%,transparent),transparent_65%)] px-8 text-center">
        <Tagline size="lg" />
      </div>
    ),
  },
  {
    id: "possibility",
    tone: "night",
    label: "What It Could Look Like",
    title: (
      <>
        The version <span className="tone-text">you&apos;ve always pictured.</span>
      </>
    ),
    body: (
      <>
        <p>Your business should feel like it.</p>
        <div className="mt-6 text-base">
          <PossibilityList />
        </div>
        <p className="mt-6">
          Marketing that doesn&apos;t just exist.{" "}
          <span className="tone-text">Marketing that moves people.</span>
        </p>
      </>
    ),
    visual: photo(
      "/images/storefront-night.jpg",
      "A small storefront at night, its windows the only lit thing on the street."
    ),
  },
  {
    id: "not-your-job",
    tone: "dusk",
    label: "Not Your Job",
    title: (
      <>
        You have a <span className="tone-text">business to run.</span>
      </>
    ),
    body: (
      <>
        <p>You shouldn&apos;t have to become a marketer too.</p>
        <ul className="mt-5 space-y-2 text-base">
          {notYourJob.map((line) => (
            <li key={line}>— {line}</li>
          ))}
        </ul>
        <p className="display-face tone-text mt-6 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-none">
          That&apos;s our job.
        </p>
      </>
    ),
    visual: photo("/images/studio-workspace.jpg", "A quiet workspace lit by a single screen."),
  },
  {
    id: "what-we-do",
    tone: "nova",
    label: "What We Actually Do",
    title: (
      <>
        Pieces that <span className="tone-text">work together.</span>
      </>
    ),
    body: (
      <>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-base">
          {services.map((s) => (
            <li key={s.number}>
              <span className="tone-text mr-2 font-mono text-xs">{s.number}</span>
              {s.title}
            </li>
          ))}
        </ul>
        <TransitionLink
          href="/services"
          className="tone-fill mt-8 inline-flex items-center gap-3 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-widest"
        >
          See the services <span aria-hidden="true">→</span>
        </TransitionLink>
      </>
    ),
    visual: photo("/images/service-social-phone.jpg", "A phone screen glowing in a dark room."),
  },
  {
    id: "the-shift",
    tone: "cherry",
    label: "The Shift",
    title: (
      <>
        Same business. <span className="tone-text">Completely different first impression.</span>
      </>
    ),
    body: (
      <p>
        The business didn&apos;t suddenly become better.{" "}
        <span className="tone-text">People can finally see it.</span>
      </p>
    ),
    visual: (
      <div className="grid h-full grid-rows-2">
        {[
          { src: "/images/revolt-before.jpg", label: "Before", alt: "Revolt Lacrosse's old homepage." },
          { src: "/images/revolt-after.jpg", label: "After", alt: "Revolt Lacrosse's redesigned homepage." },
        ].map((shot) => (
          <div key={shot.label} className="relative overflow-hidden">
            <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover object-top" />
            <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-white)] backdrop-blur-sm">
              {shot.label}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "the-work",
    tone: "night",
    label: "The Work",
    title: (
      <>
        We show you <span className="tone-text">what changed.</span>
      </>
    ),
    body: (
      <>
        <p>Not pretty websites. The work itself, running.</p>
        <p className="mt-5 text-base">
          We&apos;re early, and we&apos;d rather say so than pad this page. What we offer is our
          full attention on a few businesses.
        </p>
        <TransitionLink
          href="/work/revolt-lacrosse"
          className="tone-fill mt-8 inline-flex items-center gap-3 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-widest"
        >
          Revolt Lacrosse case study <span aria-hidden="true">→</span>
        </TransitionLink>
      </>
    ),
    visual: (
      <video
        className="absolute inset-0 h-full w-full object-cover object-top"
        src="/video/revolt-home.mp4"
        poster="/images/revolt-cover.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-label="A screen recording of the live Revolt Lacrosse website being scrolled."
      />
    ),
  },
  {
    id: "how-it-goes",
    tone: "lilac",
    label: "How It Goes",
    title: (
      <>
        First: <span className="tone-text">what isn&apos;t working.</span>
      </>
    ),
    body: (
      <>
        <p>Not what you think isn&apos;t working. What&apos;s actually getting in the way.</p>
        <TransitionLink
          href="/process"
          className="tone-fill mt-8 inline-flex items-center gap-3 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-widest"
        >
          See how we work <span aria-hidden="true">→</span>
        </TransitionLink>
      </>
    ),
    visual: (
      <ol className="grid h-full grid-cols-2 content-center gap-px bg-white/10">
        {processSteps.map((step) => (
          <li key={step.number} className="bg-[var(--tone-bg)] p-6 sm:p-8">
            <span className="tone-text font-mono text-xs">{step.number}</span>
            <span className="display-face mt-3 block text-[clamp(1.4rem,2.6vw,2.2rem)] leading-none text-[var(--color-white)]">
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    ),
  },
];

export default function HomeConceptTwoPage() {
  return (
    <>
      <SiteHeader />

      <BeatFeed
        beats={beats}
        intro={
          <section className="relative flex min-h-[92svh] items-center px-4 py-24 sm:px-6">
            <div
              className="tone-glow pointer-events-none absolute -top-1/4 right-[-15%] h-[70vw] max-h-[800px] w-[70vw] max-w-[800px] rounded-full opacity-70 blur-3xl"
              aria-hidden="true"
            />
            <HeroEntrance className="relative mx-auto w-full max-w-7xl">
              <p data-hero-line className="eyebrow tone-text mb-6">
                + <BuildText text={DESCRIPTOR} delay={500} />
              </p>
              <h1 className="text-[clamp(3rem,10vw,9rem)] leading-[0.9] text-[var(--color-white)]">
                <span data-hero-line className="block">
                  You built a
                </span>
                <span data-hero-line className="block">
                  great business.
                </span>
                <span data-hero-line className="tone-text mt-4 block text-[clamp(1.75rem,4.5vw,3.75rem)] leading-[1.05]">
                  Does your marketing show it?
                </span>
              </h1>
              <p data-hero-line className="mt-10 max-w-xl text-[clamp(1.1rem,2.2vw,1.45rem)] leading-snug">
                A great business can still look forgettable online. We fix the part people see
                first.
              </p>
              <div data-hero-line className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <MagneticButton
                  as={TransitionLink}
                  href="/contact"
                  radius={100}
                  className="btn-hero-white inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest"
                >
                  Start a Conversation
                </MagneticButton>
                <TransitionLink
                  href="/work"
                  className="text-sm font-semibold uppercase tracking-widest text-[var(--color-white)] underline decoration-[var(--color-cherry)] underline-offset-4 transition-colors hover:text-[var(--color-cherry)]"
                >
                  See What We&apos;ve Built →
                </TransitionLink>
              </div>
              <p
                data-hero-line
                className="mt-14 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--color-fg)]/60"
              >
                <span className="inline-block h-8 w-px animate-pulse bg-current motion-reduce:animate-none" />
                Scroll · {beats.length} beats
              </p>
            </HeroEntrance>
          </section>
        }
        outro={
          <section className="section-y-lg relative px-4 text-center sm:px-6">
            <div
              className="tone-glow pointer-events-none absolute left-1/2 top-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-3xl">
              <p className="eyebrow tone-text mb-6">+ Your Move</p>
              <TextReveal as="h2" className="section-title text-[var(--color-white)]">
                Impossible <span className="tone-text">to scroll past.</span>
              </TextReveal>
              <figure className="mt-10 flex flex-col items-center gap-4">
                <blockquote className="text-balance text-[clamp(1.35rem,2.8vw,2rem)] leading-relaxed text-[var(--color-fg)]/85">
                  The scariest moment is always just before you <QuoteStartCta />
                </blockquote>
                <figcaption className="eyebrow tone-text whitespace-nowrap">&mdash; Stephen King</figcaption>
              </figure>
            </div>
          </section>
        }
      />
    </>
  );
}
