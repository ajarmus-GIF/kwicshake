import type { Metadata } from "next";
import { SparkField } from "@/components/atmosphere/SparkField";
import { ComingSoonForm } from "@/components/contact/ComingSoonForm";
import { HeroPicture } from "@/components/media/HeroPicture";

/**
 * Stand-alone holding page for the Instagram bio (kwicshake.com/comingsoon) while the full site
 * isn't live yet.
 *
 * Deliberately linked from nowhere, and links nowhere: no header, no nav, no footer
 * (SiteFooter skips this route, see FooterGate). One screen: wordmark, the First Impressions
 * line, and a form. Once the real site launches the bio should point at the home page and this
 * route can go.
 *
 * Background is the home hero's photo (laptop shot on desktop, phone shot on mobile), and both
 * photos carry text of their own on the device screens. The layout keeps ours off theirs:
 *   desktop  everything sits in one left column over the empty pixel field; the laptop, anchored
 *            right with `object-position`, stays in clear view.
 *   mobile   only the photo's empty top band is drawn, faded out before the phone's screen, so
 *            the headline sits over pixels and nothing of the phone's text ever shows.
 *
 * `noindex` so search engines never surface it in place of the real pages.
 */
export const metadata: Metadata = {
  title: "Coming Soon — Kwic Shake",
  description: "People decide before they connect. Believe in us first, and we'll make it worth it.",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden px-5 py-7 text-[var(--color-on-dark)] sm:px-10 lg:px-16">
      {/* On mobile the photo is cropped to its top band (the empty pixel field) and faded out
          before the phone's screen begins, so the phone's own text never sits behind ours. A
          scrim over the full photo still let it ghost through; not drawing it is the only
          reliable fix. From `sm` up it is the full frame again. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[36%] [mask-image:linear-gradient(180deg,#000_35%,transparent)] sm:inset-0 sm:h-auto sm:[mask-image:none]"
      >
        <HeroPicture className="object-cover object-top sm:object-right xl:object-[75%_50%]" />
        <div className="absolute inset-0 bg-[var(--color-paper)]/35 sm:hidden" />
      </div>

      {/* Desktop scrim: solid behind the text column, released before the laptop. Below `xl`
          the frame is narrower than the photo, so the laptop crops in under the column even
          anchored right; there the scrim holds dark further across to keep its screen text from
          reading behind ours. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden sm:block xl:hidden"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--color-paper) 94%, transparent) 0%, color-mix(in srgb, var(--color-paper) 90%, transparent) 45%, color-mix(in srgb, var(--color-paper) 65%, transparent) 60%, color-mix(in srgb, var(--color-paper) 15%, transparent) 80%, transparent 95%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden xl:block"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--color-paper) 92%, transparent) 0%, color-mix(in srgb, var(--color-paper) 80%, transparent) 35%, color-mix(in srgb, var(--color-paper) 30%, transparent) 55%, transparent 72%)",
        }}
      />

      <SparkField variant="streak" />

      <div className="relative w-full max-w-xl sm:max-w-[30rem] xl:max-w-[36rem]">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
          <span className="brand-wordmark text-[clamp(1.15rem,2.4vw,1.85rem)] uppercase leading-none tracking-[0.06em]">
            <span className="text-[var(--color-white)]">Kwic </span>
            <span className="brand-shake">Shake</span>
          </span>
          <span className="flex items-center gap-2 border border-[var(--color-cherry)]/50 bg-[var(--color-paper)]/60 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-cherry)]"
            />
            Coming soon
          </span>
        </p>

        <h1 className="hero-text-shadow mt-5 text-[clamp(2rem,min(4.2vw,6.4vh),3.3rem)] leading-[1.04] tracking-tight sm:mt-8">
          <span className="block whitespace-nowrap">People decide</span>
          <span className="block text-[var(--color-cherry)]">before they connect.</span>
        </h1>

        <p className="hero-text-shadow mt-3 text-[0.9rem] leading-relaxed sm:mt-4 text-[var(--color-on-dark)]/80 sm:text-base">
          <span className="font-semibold text-[var(--color-white)]">
            Believe in us first, and we&apos;ll make it worth it.
          </span>{" "}
          Contact us below about our services. We need people who believe in us, so
          let&apos;s make a deal.
        </p>

        <div className="mt-5 border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-raised)_88%,transparent)] p-4 shadow-[0_0_60px_-20px_var(--color-glow)] backdrop-blur-md sm:mt-7 sm:p-6">
          <ComingSoonForm />
        </div>
      </div>
    </section>
  );
}
