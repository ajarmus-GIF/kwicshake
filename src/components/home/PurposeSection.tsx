import Image from "next/image";
import { TextReveal } from "@/components/text/TextReveal";

/**
 * The purpose statement's own section. Background is the "dissolve" marketing graphic — a
 * physical hand breaking into digital pixels mid-handshake, a literal illustration of the copy
 * rather than a decorative photo.
 *
 * The text block sits left, so the scrim (.purpose-scrim, globals.css) runs left-to-right:
 * fully solid --color-bg for the first 5% so that edge reads as flat page rather than as an
 * overlay, then eased out to fully transparent by 50% — just short of where the handshake's
 * solid mass begins, at 50.5% of the graphic's width. The image is anchored `object-right` to
 * keep the hands in the open right half; plain `object-cover` re-crops toward center on narrow
 * screens and slides the artwork under the type.
 *
 * Two-part headline: the statement of what we do, then what that buys the client, in
 * --color-cherry. The smaller line underneath states the same promise as a standard we hold
 * ourselves to, rather than restating the headline.
 */
export function PurposeSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-bg)] px-6 py-28">
      <Image
        src="/images/purpose-dissolve.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-right"
      />
      <div aria-hidden="true" className="purpose-scrim absolute inset-0" />

      {/* No `mx-auto max-w-*` wrapper: the block sits flush against the section's own px-6
          gutter, the same way HomeHero's text column does, rather than starting at a centered
          container's left edge. */}
      <div className="relative">
        <div className="max-w-xl text-left">
          <TextReveal
            as="h2"
            className="hero-text-shadow text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.1]"
          >
            <span className="block text-[var(--color-white)]">We handle the digital.</span>
            <span className="block text-[var(--color-cherry)]">You run the business.</span>
          </TextReveal>
          <TextReveal
            as="p"
            className="hero-text-shadow mt-6 max-w-md text-base leading-relaxed text-[var(--color-on-dark)]/75 sm:text-lg"
          >
            If our service creates more work for you, we&apos;ve failed. We&apos;ll handle the
            details so you don&apos;t have to think about them.
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
