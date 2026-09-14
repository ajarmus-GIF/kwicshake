import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * Plain server-rendered nav — no client state, no animation of its own. It's the thing every
 * other pattern in this app must not break: it has to stay fully clickable/keyboard-reachable
 * through page transitions, so it deliberately does nothing clever.
 *
 * Contact is deliberately NOT in `navLinks`: it's the nav's one conversion target, so it renders
 * as a `.btn-primary` pill instead of a text link. Kept as a plain styled TransitionLink rather
 * than a MagneticButton — the magnet is a client component, and this header's whole job is to
 * stay boringly reliable through page transitions.
 *
 * ── Why the links move to a second row on mobile ────────────────────────────────────────────
 * A single row of five links plus a pill plus the wordmark measures roughly 440px at `text-sm`,
 * against about 352px of usable width on a 400px screen — so it overflowed, and adding /process
 * made it worse. The fix is a second row below the wordmark on small screens rather than a
 * hamburger: a disclosure would need client state (or a `<details>` element) in the one component
 * that is deliberately stateless, and it would hide the site's structure on the devices where
 * discovering it matters most. Two rows keeps every destination visible, needs no JavaScript, and
 * cannot desynchronise from page transitions.
 *
 * The links are rendered twice — once inline for `sm:` and up, once in the wrapped mobile row —
 * from the same `NavLinks` component, so the two can't drift.
 *
 * `navLinks` is exported because the home page renders a second, transparent copy of this bar
 * over its hero (see home/HeroHeader.tsx) — home is the one route where this header sits below
 * the fold. Sharing the array is what keeps the two from drifting apart when a link is added
 * or renamed.
 */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
];

export function NavLinks({ linkClassName = "" }: { linkClassName?: string }) {
  return (
    <>
      {navLinks.map((link) => (
        <TransitionLink
          key={link.href}
          href={link.href}
          className={`hover:underline hover:underline-offset-4 ${linkClassName}`}
        >
          {link.label}
        </TransitionLink>
      ))}
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-on-dark)]/20 bg-[var(--color-raised)] px-6 py-4 text-sm font-bold text-[var(--color-on-dark)]">
      <div className="flex items-center justify-between gap-4">
        <TransitionLink
          href="/"
          className="brand-wordmark tracking-tight hover:underline hover:underline-offset-4"
        >
          <span className="text-[var(--color-white)]">Kwic </span>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-shake)" }}
          >
            Shake
          </span>
        </TransitionLink>

        <div className="flex items-center gap-6">
          <nav aria-label="Main" className="hidden items-center gap-6 sm:flex">
            <NavLinks />
          </nav>
          <TransitionLink
            href="/contact"
            className="btn-primary shrink-0 rounded-full px-5 py-2 text-xs uppercase tracking-widest text-[var(--color-button-primary-text)] transition-shadow"
          >
            Let&apos;s Talk
          </TransitionLink>
        </div>
      </div>

      {/* Mobile row. `aria-hidden` is deliberately NOT used on either copy: both are real,
          reachable links and only one is displayed at a time, so hiding one from assistive tech
          would mean hiding it on exactly the viewport where it is the visible one. */}
      <nav
        aria-label="Main"
        className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-wide sm:hidden"
      >
        <NavLinks />
      </nav>
    </header>
  );
}
