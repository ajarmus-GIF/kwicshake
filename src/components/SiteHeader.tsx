import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * Plain server-rendered nav — no client state, no animation of its own. It's the thing every
 * other pattern in this app must not break: it has to stay fully clickable/keyboard-reachable
 * through page transitions and the preloader, so it deliberately does nothing clever.
 *
 * Contact is deliberately NOT in `navLinks`: it's the nav's one conversion target, so it renders
 * as a `.btn-primary` pill instead of a text link. Kept as a plain styled TransitionLink rather
 * than a MagneticButton — the magnet is a client component, and this header's whole job is to
 * stay boringly reliable through page transitions.
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
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--color-on-dark)]/20 bg-[var(--color-raised)] px-6 py-4 text-sm font-bold text-[var(--color-on-dark)]">
      <TransitionLink
        href="/"
        className="brand-wordmark tracking-tight hover:underline hover:underline-offset-4"
      >
        <span className="text-[var(--color-white)]">Kwic </span>
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-shake)" }}>
          Shake
        </span>
      </TransitionLink>
      <nav className="flex items-center gap-6">
        {navLinks.map((link) => (
          <TransitionLink key={link.href} href={link.href} className="hover:underline hover:underline-offset-4">
            {link.label}
          </TransitionLink>
        ))}
        <TransitionLink
          href="/contact"
          className="btn-primary rounded-full px-5 py-2 text-xs uppercase tracking-widest text-[var(--color-button-primary-text)] transition-shadow"
        >
          Contact
        </TransitionLink>
      </nav>
    </header>
  );
}
