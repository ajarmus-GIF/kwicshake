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
import { ScrollThread } from "@/components/atmosphere/ScrollThread";

const notYourJob = [
  "You shouldn't need to understand SEO.",
  "You shouldn't need to learn ad platforms.",
  "You shouldn't need to spend your nights wondering why your website isn't working.",
];

/**
 * Laid out as one drop down the middle of the page: claim, then each thing off their plate,
 * strung together by the dotted thread (see atmosphere/ScrollThread) and landing on the arrow
 * into "That's our job." The thread is what makes three separate sentences read as a single
 * release, and the answer arrive as where the line was always going.
 *
 * The handshake graphic that used to sit behind this was removed — the copy carries the beat.
 */
export function PurposeSection() {
  return (
    <section
      data-tone="lilac"
      className="section-y tone-section relative overflow-hidden px-6 text-center"
    >
      <div
        className="tone-glow pointer-events-none absolute left-1/2 top-1/3 h-[70vw] max-h-[760px] w-[70vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl">
        <p className="eyebrow mb-6">
          + Not Your Job
        </p>
        <TextReveal
          as="h2"
          className="section-title"
        >
          <span className="block text-[var(--color-white)]">You have a</span>
          <span className="block text-[var(--color-cherry)]">business to run.</span>
        </TextReveal>
        <TextReveal
          as="p"
          className="mx-auto mt-6 max-w-lg text-lg leading-snug text-[var(--color-muted)] sm:text-xl"
        >
          You shouldn&apos;t have to become a marketer too.
        </TextReveal>

        <ul>
          {notYourJob.map((line) => (
            <li key={line}>
              <ScrollThread className="h-16 sm:h-20" />
              <TextReveal
                as="p"
                className="mx-auto mt-4 max-w-xl text-balance text-lg leading-relaxed text-[var(--color-fg)]/85 sm:text-xl"
              >
                {line}
              </TextReveal>
            </li>
          ))}
        </ul>

        <ScrollThread arrow className="mt-4 h-20 sm:h-24" />
        <p className="display-face mt-8 text-[clamp(2.25rem,6vw,4rem)] leading-none text-[var(--color-cherry)]">
          That&apos;s our job.
        </p>
      </div>
    </section>
  );
}
