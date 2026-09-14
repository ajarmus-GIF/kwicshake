import { NavLinks } from "@/components/SiteHeader";
import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * The home page's transparent nav, laid over the hero photo.
 *
 * Home is the one route where the real SiteHeader sits below the fold (it comes after the
 * full-height hero), so this stands in above it. It shares `NavLinks` with that header, which is
 * what stops the two bars from disagreeing when a destination is added or renamed.
 *
 * Same two-row behaviour as SiteHeader on small screens, and for the same reason — five links
 * plus a pill plus the wordmark does not fit on a phone in one row. Here it matters slightly
 * more: this bar is absolutely positioned over the hero, so an overflowing row would push its
 * contents off the photo entirely rather than just wrapping awkwardly.
 *
 * The two <nav> elements here are deliberately unlabelled: the home page renders this bar AND
 * SiteHeader, and naming both "Main" would put two identically-named navigation landmarks on one
 * page. SiteHeader owns that name; this one is found by role.
 *
 * `data-hero-line` puts the whole bar into the hero's entrance stagger, and its position first
 * in DOM order means it leads that stagger — and that tabbing into the page reaches the nav
 * before the hero's CTAs.
 */
export function HeroHeader() {
  return (
    <div
      data-hero-line
      className="absolute inset-x-0 top-0 z-10 px-6 py-4 text-sm font-bold text-[var(--color-on-dark)]"
    >
      <div className="flex items-center justify-between gap-4">
        <TransitionLink
          href="/"
          className="brand-wordmark hero-text-shadow tracking-tight hover:underline hover:underline-offset-4"
        >
          <span className="text-[var(--color-white)]">Kwic </span>
          <span
            className="hero-gradient-shadow bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-shake)" }}
          >
            Shake
          </span>
        </TransitionLink>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 sm:flex">
            <NavLinks linkClassName="hero-text-shadow" />
          </nav>
          <TransitionLink
            href="/contact"
            className="btn-primary shrink-0 rounded-full px-5 py-2 text-xs uppercase tracking-widest text-[var(--color-button-primary-text)] transition-shadow"
          >
            Let&apos;s Talk
          </TransitionLink>
        </div>
      </div>

      <nav className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-wide sm:hidden">
        <NavLinks linkClassName="hero-text-shadow" />
      </nav>
    </div>
  );
}
