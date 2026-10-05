import { SiteHeader } from "@/components/SiteHeader";
import { HeroEntrance } from "@/components/text/HeroEntrance";
import { BuildText } from "@/components/text/BuildText";
import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { WinsFeed } from "@/components/wins/WinsFeed";
import { wins } from "@/lib/wins";

export const metadata = {
  title: "Kwic Wins — Free Marketing Resources from Kwic Shake",
  description:
    "Free, one-sitting marketing wins for small businesses: checklists, scripts and templates you can use today. No email wall.",
  openGraph: {
    title: "Kwic Wins — Free Marketing Resources",
    description: "Free marketing wins you can use today. No email wall, no catch.",
    url: "/wins",
    images: [wins[0].image],
  },
};

/**
 * Kwic Wins, the index. Most visitors arrive on a single post from a social link; this page is
 * where the curious ones land next, so it is built to be scrolled like the feed they came from —
 * see components/wins/WinsFeed.tsx for the mechanics.
 *
 * The hero says the deal in one breath (free, usable today, no catch) and gets out of the way:
 * the first post starts one scroll down.
 */
export default function WinsPage() {
  return (
    <>
      <SiteHeader />

      <WinsFeed
        wins={wins.map(({ slug, title, hook, format, minutes, image, tone }) => ({
          slug,
          title,
          hook,
          format,
          minutes,
          image,
          tone,
        }))}
        intro={
          <section className="relative flex min-h-[88svh] items-center px-4 py-24 sm:px-6">
            <div
              className="tone-glow pointer-events-none absolute -top-1/4 right-[-15%] h-[70vw] max-h-[800px] w-[70vw] max-w-[800px] rounded-full opacity-70 blur-3xl"
              aria-hidden="true"
            />
            <HeroEntrance className="relative mx-auto w-full max-w-7xl">
              <p
                data-hero-line
                className="eyebrow tone-text mb-6"
              >
                + <BuildText text="Free Resources from Kwic Shake" delay={500} />
              </p>
              <h1 className="text-[clamp(3.5rem,14vw,12rem)] leading-[0.88] text-[var(--color-white)]">
                <span data-hero-line className="block">
                  Kwic
                </span>
                <span data-hero-line className="tone-text block">
                  Wins.
                </span>
              </h1>
              <p
                data-hero-line
                className="mt-10 max-w-xl text-[clamp(1.1rem,2.2vw,1.45rem)] leading-snug"
              >
                Free marketing moves you can make today. Checklists, scripts and templates that
                take one sitting. No email wall, no catch.
              </p>
              <p
                data-hero-line
                className="mt-14 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--color-fg)]/60"
              >
                <span className="inline-block h-8 w-px animate-pulse bg-current motion-reduce:animate-none" />
                Scroll for {wins.length} wins
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
              <p className="eyebrow tone-text mb-6">
                + That&apos;s the free stuff
              </p>
              <TextReveal
                as="h2"
                className="section-title text-[var(--color-white)]"
              >
                Want the whole thing done for you?
              </TextReveal>
              <TextReveal
                as="p"
                className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-fg)]/80"
              >
                These are the quick wins. Kwic Shake builds the websites, brands, social and
                search presence that make people remember you.
              </TextReveal>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <MagneticButton
                  as={TransitionLink}
                  href="/contact"
                  radius={100}
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
                >
                  Start a Project
                </MagneticButton>
                <TransitionLink
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-white)]/25 px-8 py-4 text-sm uppercase tracking-widest text-[var(--color-white)] transition-colors hover:border-[var(--color-white)]/60"
                >
                  See What We Do
                </TransitionLink>
              </div>
            </div>
          </section>
        }
      />
    </>
  );
}
