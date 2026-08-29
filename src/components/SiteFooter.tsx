import { ServiceIcon } from "@/components/services/ServiceIcon";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * Compact two-row footer:
 *
 *   row 1 — the four capability pillars, hairline-ruled underneath
 *   row 2 — the wordmark on the left, the email between, the ask on the right, one baseline
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
 * "something great." is solid --color-cherry, not --gradient-shake: that gradient bottoms out
 * at #4a2f80, near-invisible on this background at heading sizes. The gradient stays on the
 * wordmark — the same .brand-wordmark treatment used in the nav bar and hero lockup.
 */
const pillars = [
  {
    label: "Strategy",
    sub: "That Works",
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
    sub: "That Stands Out",
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
    sub: "That Performs",
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
    sub: "That Matter",
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
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-shake)" }}
              >
                Shake
              </span>
            </p>
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--color-on-dark)]/40">
              A Digital Marketing Agency
            </p>
          </div>

          {/* Email sits in the closing row itself, between the wordmark and the ask, rather than
              in a band of its own. `flex-1` hands it whatever space the two fixed blocks leave,
              so it centers in the gap instead of being pushed against either one. */}
          <a
            href="mailto:info@kwicshake.com"
            className="text-sm tracking-[0.08em] text-[var(--color-cherry)] underline decoration-[var(--color-cherry)]/35 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-[var(--color-cherry)] md:flex-1 md:text-center"
          >
            info@kwicshake.com
          </a>

          <div className="md:shrink-0 md:text-right">
            <h2 className="text-[1.375rem] font-medium leading-tight tracking-tight sm:text-2xl">
              Let&apos;s build{" "}
              <span className="text-[var(--color-cherry)]">something great.</span>
            </h2>
            <MagneticButton
              as={TransitionLink}
              href="/contact"
              className="btn-primary mt-4 inline-flex items-center rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-button-primary-text)] transition-shadow"
            >
              Get Your Free Consultation
            </MagneticButton>
          </div>
        </div>
      </div>
    </footer>
  );
}
