import { MobileNav } from "@/components/MobileNav";
import { NavLinks, navLinks } from "@/components/SiteHeader";
import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * The home page's nav, sitting on top of the hero photo.
 *
 * Home is the one route where the real SiteHeader sits below the fold (it comes after the
 * full-height hero), so this stands in above it. It shares `NavLinks` and `navLinks` with that
 * header, which is what stops the two bars from disagreeing when a destination is added or
 * renamed.
 *
 * ── Solid, not transparent ─────────────────────────────────────────────────────────────────
 * This bar used to be transparent so the hero photo ran edge to edge behind it. That read as a
 * different, floating navigation than the solid one further down the page, which is confusing
 * when they are in fact the same set of destinations. It now carries the identical background
 * and bottom border as SiteHeader, so scrolling past the hero doesn't appear to swap one nav
 * for another.
 *
 * Because the bar is opaque, none of the `.hero-text-shadow` / `.hero-gradient-shadow`
 * treatments apply to it any more — those exist to hold light text legible against a busy
 * photo, and over a flat panel they only add a muddy halo. The rest of HomeHero still uses
 * them; this header deliberately does not.
 *
 * Kept `absolute` rather than `sticky`: HomeHero is `overflow-hidden`, which makes it a scroll
 * container with no scrollable overflow of its own, so a sticky child would never actually
 * stick — it would behave exactly like this, with extra indirection.
 *
 * The <nav> here is deliberately unlabelled: the home page renders this bar AND SiteHeader, and
 * naming both "Main" would put two identically-named navigation landmarks on one page. SiteHeader
 * owns that name; this one is found by role. The two MobileNav panels this page also ends up with
 * do not repeat that problem — a closed panel is `inert`, which takes it out of the accessibility
 * tree entirely, and only one panel can be open at a time since an open one covers the viewport.
 *
 * `data-hero-line` puts the whole bar into the hero's entrance stagger, and its position first
 * in DOM order means it leads that stagger — and that tabbing into the page reaches the nav
 * before the hero's CTAs.
 */
export function HeroHeader() {
  return (
    <div
      data-hero-line
      className="absolute inset-x-0 top-0 z-10 border-b border-[var(--color-on-dark)]/20 bg-[var(--color-raised)] px-6 py-4 text-sm font-bold text-[var(--color-on-dark)]"
    >
      <div className="flex items-center justify-between gap-4">
        <TransitionLink
          href="/"
          className="brand-wordmark tracking-tight hover:underline hover:underline-offset-4"
        >
          <span className="text-[var(--color-white)]">Kwic </span>
          <span className="brand-shake">Shake</span>
        </TransitionLink>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden items-center gap-6 sm:flex">
            <NavLinks />
          </nav>
          <TransitionLink
            href="/contact"
            className="btn-primary shrink-0 rounded-full px-5 py-2 text-xs uppercase tracking-widest text-[var(--color-button-primary-text)] transition-shadow"
          >
            Let&apos;s Talk
          </TransitionLink>
          <MobileNav links={navLinks} />
        </div>
      </div>
    </div>
  );
}
