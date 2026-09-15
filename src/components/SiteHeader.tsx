import { MobileNav } from "@/components/MobileNav";
import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * Server-rendered nav. It's the thing every other pattern in this app must not break: it has to
 * stay fully clickable/keyboard-reachable through page transitions, so it deliberately does
 * nothing clever.
 *
 * Contact is deliberately NOT in `navLinks`: it's the nav's one conversion target, so it renders
 * as a `.btn-primary` pill instead of a text link. Kept as a plain styled TransitionLink rather
 * than a MagneticButton — the magnet is a client component, and this header's whole job is to
 * stay boringly reliable through page transitions.
 *
 * ── Small screens ──────────────────────────────────────────────────────────────────────────
 * A single row of five links plus a pill plus the wordmark measures roughly 440px at `text-sm`,
 * against about 352px of usable width on a 400px screen — so below `sm` the links collapse into
 * a hamburger (see MobileNav) and only the wordmark, the pill, and the trigger stay in the bar.
 *
 * This header stays a server component regardless: MobileNav is a self-contained client island,
 * so the only JS that ships is the disclosure itself. The `sm:`-and-up nav below is still plain
 * server-rendered HTML with no state that could desynchronise from a page transition.
 *
 * The trade-off a hamburger carries is that it hides the site's structure behind a tap on exactly
 * the devices where discovering it matters most — the earlier design wrapped the links onto a
 * visible second row to avoid that. The hamburger is the chosen direction; if the second row is
 * ever wanted back, it was a `sm:hidden` <nav> holding a second <NavLinks /> under this bar.
 *
 * `navLinks` is exported because the home page renders a second, transparent copy of this bar
 * over its hero (see home/HeroHeader.tsx) — home is the one route where this header sits below
 * the fold. Sharing the array is what keeps the two from drifting apart when a link is added
 * or renamed. It is passed to MobileNav as a prop rather than imported there, so the client
 * island never has to import from this server module.
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
          <span className="brand-shake">Shake</span>
        </TransitionLink>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label="Main" className="hidden items-center gap-6 sm:flex">
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
    </header>
  );
}
