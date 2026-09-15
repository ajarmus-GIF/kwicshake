import { TextReveal } from "@/components/text/TextReveal";

/**
 * The RELIEF beat.
 *
 * Everything above this on the home page has been building recognition and desire, which is
 * useful right up until the reader thinks "great, and now I have to go learn all of this."
 * This section exists to close that door. It is the only place on the page whose entire job is
 * to take something OFF the reader's plate rather than to show them something new.
 *
 * So the copy is a list of things they are explicitly not responsible for, and it deliberately
 * names the specific dreads — SEO, ad platforms, the website that isn't working — because
 * "we handle everything" is a claim and "you shouldn't need to learn ad platforms" is a
 * permission slip. The three-line anaphora is doing the emotional work; flattening it into one
 * sentence would make it an assurance instead of a release.
 *
 * "That's our job." lands alone, in the accent, as the answer to all three at once. It is the
 * shortest line in the section on purpose — after three "you shouldn't"s, brevity reads as
 * competence.
 *
 * This section is NOT a services pitch and must not become one. The moment a deliverable or a
 * price or a "learn more" appears here, the reader is back to evaluating rather than exhaling.
 */
import Image from "next/image";

const notYourJob = [
  "You shouldn't need to understand SEO.",
  "You shouldn't need to learn ad platforms.",
  "You shouldn't need to spend your nights wondering why your website isn't working.",
];

export function PurposeSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-bg)] px-6 py-28 sm:py-32">
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
        <div className="max-w-2xl text-left">
          <TextReveal
            as="h2"
            className="hero-text-shadow text-[clamp(1.75rem,4.2vw,3rem)] font-medium leading-[1.1]"
          >
            <span className="block text-[var(--color-white)]">You have a</span>
            <span className="block text-[var(--color-cherry)]">business to run.</span>
          </TextReveal>

          {/* The second half of the original headline. It is the argument, not the statement,
              so it reads better one size down and directly under the claim it qualifies. */}
          <TextReveal
            as="p"
            className="hero-text-shadow mt-5 max-w-lg text-lg leading-snug text-[var(--color-on-dark)]/80"
          >
            You shouldn&apos;t have to become a marketer too.
          </TextReveal>

          <ul className="mt-8 space-y-3">
            {notYourJob.map((line) => (
              <li
                key={line}
                className="hero-text-shadow max-w-xl text-base leading-relaxed text-[var(--color-on-dark)]/80 sm:text-lg"
              >
                {line}
              </li>
            ))}
          </ul>

          <p className="hero-text-shadow mt-8 text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-none text-[var(--color-cherry)]">
            That&apos;s our job.
          </p>
        </div>
      </div>
    </section>
  );
}
