import { ServiceIcon } from "@/components/services/ServiceIcon";
import { ActionLink } from "@/components/interactive/ActionButtons";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { navLinks } from "@/components/SiteHeader";
import { CONTACT_EMAIL, LOCATIONS, SOCIALS, TAGLINE, DESCRIPTOR } from "@/lib/site";

/**
 * Compact two-row footer:
 *
 *   row 1 — the four capability pillars, hairline-ruled underneath
 *   row 2 — the wordmark on the left, the email between, the ask on the right, one baseline
 *   row 3 — the site's pages (the header's navLinks plus Contact) and the social icons
 *   row 4 — the copyright line and the privacy link, the quietest type on the page
 *
 * Kept deliberately short: small type, tight padding, no oversized closing mark. The wordmark
 * and the CTA balance each other across the row instead of stacking, which is what keeps the
 * whole thing to roughly a third of the height it had when each block owned its own band.
 *
 * That closing row is deliberately full-bleed — it is the only band not held to the centered
 * max-w-6xl measure — so the wordmark and the ask anchor the two far corners of the page.
 *
 * Pillar icons reuse the site's own stroke-drawn `ServiceIcon` language (see
 * services/serviceIcons.tsx), so they animate in and read as native rather than imported.
 *
 * "something great." is solid --color-cherry, not --gradient-shake. That was originally
 * because the gradient bottomed out at #4a2f80 and went near-invisible here; the gradient has
 * since been restopped to a 4.73:1 floor (see globals.css), so this is now a composition
 * choice rather than a workaround — one gradient wordmark per view, and in the footer that
 * slot belongs to the company name. The wordmark uses .brand-shake, shared with the nav bar
 * and hero lockup.
 *
 * The stack under the wordmark is ordered deliberately: TAGLINE first, in the accent, at
 * readable size — it is the brand idea and the last thing anyone reads on any page. DESCRIPTOR
 * ("A Digital Marketing Agency") sits below it as the smallest type in the footer. That is the
 * whole positioning decision expressed as type size: what we stand for leads, what category we
 * file under follows. Both come from lib/site.ts rather than being typed here.
 */
const pillars = [
  {
    label: "Strategy",
    sub: "Before The Design",
    icon: (
      <>
        <path key="arm-l" d="M12 55 L38 42" />
        <path key="arm-r" d="M88 55 L62 42" />
        <path key="clasp" d="M38 42 L45 50 L52 42 L59 50 L66 42" />
      </>
    ),
  },
  {
    label: "Creativity",
    sub: "Worth Remembering",
    icon: (
      <>
        <path key="body" d="M50 10 C64 24 67 48 59 68 L41 68 C33 48 36 24 50 10 Z" />
        <circle key="window" cx="50" cy="34" r="7" />
        <path key="fin-l" d="M41 58 L26 76 L41 70" />
        <path key="fin-r" d="M59 58 L74 76 L59 70" />
        <path key="flame" d="M45 68 L50 88 L55 68" />
      </>
    ),
  },
  {
    label: "Development",
    sub: "Built To Last",
    icon: (
      <>
        <path key="bracket-l" d="M35 28 L14 50 L35 72" />
        <path key="bracket-r" d="M65 28 L86 50 L65 72" />
        <line key="slash" x1="58" y1="20" x2="42" y2="80" />
      </>
    ),
  },
  {
    label: "Results",
    sub: "Watched And Adjusted",
    icon: (
      <>
        <line key="bar-1" x1="18" y1="82" x2="18" y2="62" />
        <line key="bar-2" x1="38" y1="82" x2="38" y2="48" />
        <line key="bar-3" x1="58" y1="82" x2="58" y2="30" />
        <path key="trend" d="M14 58 L38 40 L58 30 L82 16" />
        <path key="arrowhead" d="M66 16 L82 16 L82 32" />
      </>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-raised)] py-12 text-[var(--color-on-dark)]">
      <div
        className="pointer-events-none absolute bottom-[-45%] left-1/2 h-[45vw] max-h-[400px] w-[45vw] max-w-[400px] -translate-x-1/2 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
        aria-hidden="true"
      />

      {/* The gutter is fluid rather than a fixed px-6 + centered measure: it tracks the viewport
          (3vw) so the closing row's wordmark and CTA sit near the page edges on a wide screen and
          tighten toward them as the window narrows, floored at 1rem so nothing ever touches the
          edge. The pillars keep the centered max-w-6xl measure inside it — only their rule and the
          row below run the full width. */}
      <div className="relative px-[clamp(1rem,3vw,3rem)]">
        {/* Pillars */}
        <div className="border-b border-[var(--color-on-dark)]/10 pb-9">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-[var(--color-on-dark)]/10">
            {pillars.map((pillar) => (
              <div key={pillar.label} className="flex flex-col items-center px-4 text-center">
                <ServiceIcon className="h-8 w-8 text-[var(--color-cherry)]">
                  {pillar.icon}
                </ServiceIcon>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em]">
                  {pillar.label}
                </p>
                <p className="mt-0.5 text-[0.7rem] text-[var(--color-on-dark)]/55">{pillar.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wordmark left, ask right */}
        <div className="mt-9 flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <p className="brand-wordmark text-[clamp(1.75rem,5vw,3rem)] leading-none tracking-[-0.02em]">
              <span className="text-[var(--color-white)]">Kwic </span>
              <span className="brand-shake">Shake</span>
            </p>
            <p className="mt-4 text-[clamp(0.95rem,1.6vw,1.15rem)] font-medium leading-none text-[var(--color-cherry)]">
              {TAGLINE}
            </p>
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--color-on-dark)]/40">
              {DESCRIPTOR}
            </p>
          </div>

          {/* Email and locations sit in the closing row itself, between the wordmark and the
              ask, rather than in a band of their own. `flex-1` hands them whatever space the two
              fixed blocks leave, so they center in the gap instead of being pushed against
              either one. */}
          <div className="md:flex-1 md:text-center">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm tracking-[0.08em] text-[var(--color-cherry)] underline decoration-[var(--color-cherry)]/35 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-[var(--color-cherry)]"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--color-on-dark)]/40">
              {LOCATIONS.join(" · ")}
            </p>
          </div>

          <div className="md:shrink-0 md:text-right">
            <h2 className="text-[1.375rem] font-medium leading-tight tracking-tight sm:text-2xl">
              Let&apos;s build{" "}
              <span className="text-[var(--color-cherry)]">something great.</span>
            </h2>
            <ActionLink href="/contact" className="mt-4">
              Start a Project
            </ActionLink>
          </div>
        </div>

        {/* Pages and socials */}
        <div className="mt-10 flex flex-col gap-6 border-t border-[var(--color-on-dark)]/10 pt-7 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-[0.14em]">
              {[...navLinks, { href: "/contact", label: "Contact" }].map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={link.href}
                    className="text-[var(--color-on-dark)]/70 underline-offset-4 transition-colors hover:text-[var(--color-on-dark)] hover:underline"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex items-center gap-2" aria-label="Kwic Shake on social media">
            {SOCIALS.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Kwic Shake on ${social.name} (opens in a new tab)`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-on-dark)]/15 text-[var(--color-on-dark)]/75 transition-colors hover:border-[var(--color-action)] hover:text-[var(--color-action)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <SocialIcon name={social.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="mt-7 flex flex-col gap-2 text-[0.7rem] text-[var(--color-on-dark)]/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Kwic Shake. All rights reserved.</p>
          <TransitionLink
            href="/privacy"
            className="underline-offset-4 transition-colors hover:text-[var(--color-on-dark)]/80 hover:underline"
          >
            Privacy Policy
          </TransitionLink>
        </div>
      </div>
    </footer>
  );
}

/** Brand marks for the footer, drawn at 24×24 and sized by the parent link's colour. */
function SocialIcon({ name }: { name: (typeof SOCIALS)[number]["name"] }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true, className: "h-[1.05rem] w-[1.05rem]" } as const;
  switch (name) {
    case "Instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "X":
      return (
        <svg {...common} fill="currentColor">
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 22v-8.2h2.8l.4-3.3h-3.2V8.4c0-.95.27-1.6 1.63-1.6h1.72V3.86A23 23 0 0 0 14.33 3.7c-2.5 0-4.2 1.52-4.2 4.32v2.48H7.3v3.3h2.83V22z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg {...common} fill="currentColor">
          <path
            fillRule="evenodd"
            d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"
          />
        </svg>
      );
  }
}
