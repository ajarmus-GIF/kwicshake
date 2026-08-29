import { navLinks } from "@/components/SiteHeader";
import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * The home page's header, painted transparent over the top of the hero photo.
 *
 * Home is the one route where the real <SiteHeader /> isn't at the top of the screen: it sits
 * *below* the full-height hero so `sticky` catches it there (see the note in layout.tsx). That
 * left a visitor who lands at scroll 0 with no visible navigation and no reason to believe
 * scrolling would produce any. This is that navigation — same wordmark, same links, same
 * Contact pill, over transparent instead of --color-raised, and fully clickable.
 *
 * Links come from SiteHeader's exported `navLinks` and route through TransitionLink, so this
 * and the solid bar below cannot drift apart and both play the same page transition.
 *
 * Rendered as a plain <div>, NOT a <nav>: the real header below is already the page's nav
 * landmark, and a second unlabelled one holding identical links makes a screen reader announce
 * "navigation" twice for one set of destinations. The links themselves are ordinary focusable
 * anchors either way — this only keeps a duplicate landmark out of the document, it takes
 * nothing away from keyboard or assistive-tech users. Being first in the DOM, it also means
 * tabbing into the page reaches the nav before the hero's CTAs.
 *
 * Nothing hides it on scroll, and nothing needs to: HomeHero is `min-h-screen`, so the solid
 * header always starts below the fold and this has scrolled off the top long before the solid
 * bar arrives there. The two are never on screen at the same time.
 *
 * `data-hero-line` opts it into HomeHero's entrance stagger — first in DOM order, so the bar
 * settles before the copy under it. `hero-text-shadow` / `hero-gradient-shadow` are the same
 * legibility pair the hero copy uses; globals.css explains why the gradient half of the
 * wordmark can't ride the plain text-shadow.
 */
export function HeroHeader() {
  return (
    <div
      data-hero-line
      className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4 text-sm font-bold text-[var(--color-on-dark)]"
    >
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
        {navLinks.map((link) => (
          <TransitionLink
            key={link.href}
            href={link.href}
            className="hero-text-shadow hover:underline hover:underline-offset-4"
          >
            {link.label}
          </TransitionLink>
        ))}
        <TransitionLink
          href="/contact"
          className="btn-primary rounded-full px-5 py-2 text-xs uppercase tracking-widest text-[var(--color-button-primary-text)] transition-shadow"
        >
          Contact
        </TransitionLink>
      </div>
    </div>
  );
}
