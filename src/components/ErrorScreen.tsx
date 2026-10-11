import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SparkField } from "@/components/atmosphere/SparkField";
import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * The branded dead end, shared by app/not-found.tsx (a page that doesn't exist) and
 * app/error.tsx (a page that broke while rendering). Same room, different words.
 *
 * The giant code sits behind the headline as texture, the way the "01" numerals do on the
 * About page, so the first thing read is the human line, not the number. No reveal animations:
 * someone who just hit a dead end should see the way out the instant the page loads.
 *
 * `primary` is the main way out (an ActionLink or ActionButton), `links` the quieter alternatives.
 */
export const errorLinks = [
  { href: "/work", label: "See the work" },
  { href: "/services", label: "Services" },
  { href: "/wins", label: "Kwic Wins" },
  { href: "/contact", label: "Start a Project" },
];

export function ErrorScreen({
  code,
  eyebrow,
  title,
  accent,
  lede,
  primary,
}: {
  code: string;
  eyebrow: string;
  title: ReactNode;
  accent: ReactNode;
  lede: ReactNode;
  primary: ReactNode;
}) {
  return (
    <>
      <SiteHeader />

      <section className="relative flex min-h-[calc(100svh_-_4.8rem)] flex-col justify-center overflow-hidden bg-[var(--color-raised)] px-6 py-24 text-[var(--color-on-dark)] sm:min-h-[calc(100svh_-_4.05rem)]">
        <SparkField variant="diagonal" />
        <div
          className="pointer-events-none absolute -top-1/3 right-[-15%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute bottom-[-0.12em] right-[-0.04em] select-none font-black leading-none opacity-[0.07]"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(10rem,34vw,30rem)",
            color: "var(--color-cherry)",
          }}
          aria-hidden="true"
        >
          {code}
        </span>

        <div className="relative mx-auto w-full max-w-5xl">
          <p className="eyebrow mb-6">+ {eyebrow}</p>
          <h1 className="max-w-4xl text-[clamp(2.4rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-tight">
            <span className="block text-[var(--color-white)]">{title}</span>
            <span className="block text-[var(--color-cherry)]">{accent}</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            {lede}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6">
            {primary}
            <nav aria-label="Other pages" className="flex flex-wrap gap-x-6 gap-y-3">
              {errorLinks.map((link) => (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-on-dark)]/70 underline-offset-4 transition-colors hover:text-[var(--color-on-dark)] hover:underline"
                >
                  {link.label}
                </TransitionLink>
              ))}
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
