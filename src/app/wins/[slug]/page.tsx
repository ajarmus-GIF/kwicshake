import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroEntrance } from "@/components/text/HeroEntrance";
import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { getNextWin, getWin, wins, type WinBlock } from "@/lib/wins";

export function generateStaticParams() {
  return wins.map((win) => ({ slug: win.slug }));
}

export async function generateMetadata({ params }: PageProps<"/wins/[slug]">) {
  const { slug } = await params;
  const win = getWin(slug);
  if (!win) return { title: "Not found" };
  return {
    title: `${win.title} — Kwic Wins`,
    description: win.hook,
    // These pages are shared from social more than any other page on the site, so the link
    // preview carries the post's own image rather than the site default.
    openGraph: {
      title: win.title,
      description: win.hook,
      url: `/wins/${win.slug}`,
      type: "article",
      images: [win.image],
    },
  };
}

/**
 * A single Kwic Win. Most visitors land HERE first, straight from a social link, so the page
 * does three jobs in order: deliver the resource immediately (no preamble, no wall), say who made
 * it, and hand the reader to the next win — the "next" tile at the bottom is the feed's swipe-up.
 */
export default async function WinPage({ params }: PageProps<"/wins/[slug]">) {
  const { slug } = await params;
  const win = getWin(slug);
  if (!win) notFound();
  const next = getNextWin(slug);

  return (
    <article data-tone={win.tone} className="wins-tone text-[var(--color-fg)]">
      <SiteHeader />

      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24">
        <div
          className="tone-glow pointer-events-none absolute -top-1/3 right-[-15%] h-[70vw] max-h-[760px] w-[70vw] max-w-[760px] rounded-full blur-3xl"
          aria-hidden="true"
        />
        <HeroEntrance className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p data-hero-line className="mb-8">
              <TransitionLink
                href="/wins"
                className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-fg)]/60 hover:text-[var(--color-fg)]"
              >
                ← All Kwic Wins
              </TransitionLink>
            </p>
            <p
              data-hero-line
              className="tone-text font-mono text-xs uppercase tracking-[0.25em]"
            >
              Free {win.format} · {win.minutes} min
            </p>
            <h1
              data-hero-line
              className="mt-5 text-balance text-[clamp(2.4rem,6vw,5rem)] leading-[1] text-[var(--color-white)]"
            >
              {win.title}
            </h1>
            <p
              data-hero-line
              className="mt-7 max-w-xl text-[clamp(1.1rem,2.2vw,1.4rem)] leading-snug text-[var(--color-fg)]/85"
            >
              {win.hook}
            </p>
          </div>
          <div data-hero-line className="lg:col-span-6">
            <div className="tone-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:aspect-[4/5] lg:max-h-[72svh] lg:w-full">
              <Image
                src={win.image}
                alt={win.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </HeroEntrance>
      </section>

      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="mx-auto max-w-2xl text-[1.075rem] leading-relaxed">
          {win.body.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </div>
      </section>

      {/* The handoff. Plain about the trade: the reader got something for free, this is who
          made it and what else they do. Said once, at the end, after the value is delivered. */}
      <section className="section-y relative overflow-hidden border-y border-[var(--color-white)]/10 bg-black/20 px-4 sm:px-6">
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow tone-text mb-6">
            + Made by Kwic Shake
          </p>
          <TextReveal
            as="h2"
            className="display-face text-balance text-[clamp(1.9rem,4.5vw,3.25rem)] leading-tight text-[var(--color-white)]"
          >
            That&apos;s the quick win. We do the whole thing.
          </TextReveal>
          <TextReveal
            as="p"
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-fg)]/80"
          >
            Kwic Shake is a digital marketing agency. We build the websites, brands, social and
            search presence that make people stop, remember you, and take the next step.
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
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-white)]/25 px-8 py-4 text-sm uppercase tracking-widest text-[var(--color-white)] transition-colors hover:border-[var(--color-white)]/60"
            >
              Meet Kwic Shake
            </TransitionLink>
          </div>
        </div>
      </section>

      {next.slug !== win.slug && (
        <TransitionLink
          href={`/wins/${next.slug}`}
          data-tone={next.tone}
          className="wins-tone group relative block overflow-hidden"
        >
          <div className="absolute inset-0 opacity-35 transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:opacity-50">
            <Image src={next.image} alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--tone-bg)] via-[var(--tone-bg)]/70 to-transparent"
            aria-hidden="true"
          />
          <div className="relative mx-auto flex min-h-[60svh] max-w-7xl flex-col justify-end px-4 py-16 sm:px-6">
            <p className="eyebrow tone-text">
              Next win ↓
            </p>
            <p className="display-face mt-4 max-w-4xl text-balance text-[clamp(2.2rem,6vw,5rem)] leading-[1] text-[var(--color-white)]">
              {next.title}
            </p>
            <p className="mt-5 max-w-xl text-lg text-[var(--color-fg)]/80">{next.hook}</p>
          </div>
        </TransitionLink>
      )}
    </article>
  );
}

function Block({ block }: { block: WinBlock }) {
  switch (block.type) {
    case "p":
      return <p className="mt-6 text-[var(--color-fg)]/85">{block.text}</p>;
    case "h":
      return (
        <h2 className="mt-16 text-[clamp(1.5rem,3vw,2rem)] leading-tight text-[var(--color-white)]">
          {block.text}
        </h2>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className="mt-6 space-y-4">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-4 text-[var(--color-fg)]/85">
              <span
                aria-hidden="true"
                className="tone-text mt-[0.2em] shrink-0 font-mono text-sm tabular-nums"
              >
                {block.ordered ? String(index + 1).padStart(2, "0") : "+"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </List>
      );
    }
    case "template":
      return (
        <figure className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-white)]/15 bg-black/30">
          <figcaption className="tone-text border-b border-[var(--color-white)]/10 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.25em]">
            {block.label}
          </figcaption>
          <pre className="whitespace-pre-wrap px-5 py-5 font-mono text-sm leading-relaxed text-[var(--color-white)]">
            {block.text}
          </pre>
        </figure>
      );
    case "callout":
      return (
        <aside className="mt-10 border-l-2 border-[var(--tone-accent)] py-1 pl-6">
          <p className="tone-text font-mono text-[0.7rem] uppercase tracking-[0.25em]">
            {block.label}
          </p>
          <p className="display-face mt-3 text-[1.3rem] leading-snug text-[var(--color-white)]">
            {block.text}
          </p>
        </aside>
      );
  }
}
