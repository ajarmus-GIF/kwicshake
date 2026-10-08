import { TextReveal } from "@/components/text/TextReveal";

/**
 * "You have a business to run" as a split screen: the owner's craft on one side, the marketing
 * machinery on the other. "Do this." / "We'll do this." — the whole offer in four words.
 */
const crafts = [
  "Cut the hair.",
  "Sand the oak.",
  "Plate the dish.",
  "Clip the leash.",
  "Close the books.",
  "String the stick.",
];

const tools = [
  { name: "Search rankings", detail: "best [business] near me" },
  { name: "Ads manager", detail: "4 campaigns · 3 audiences" },
  { name: "Analytics", detail: "where people drop off" },
  { name: "Website", detail: "fast · clear · one next step" },
  { name: "Social calendar", detail: "12 posts this month" },
  { name: "Google profile", detail: "photos · hours · reviews" },
];

export function DoThis() {
  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="mb-16 text-center">
        <p className="eyebrow mb-6">+ Not Your Job</p>
        <TextReveal as="h2" className="section-title mx-auto">
          You have a <span className="text-[var(--color-cherry)]">business to run.</span>
        </TextReveal>
        <p className="section-lede mx-auto">You shouldn&apos;t have to become a marketer too.</p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--color-ash-22)] bg-[var(--color-ash-22)] md:grid-cols-2">
        <div className="bg-[var(--tone-bg,var(--color-paper))] p-8 sm:p-12">
          <p className="display-face text-[clamp(2.5rem,6vw,4.5rem)] leading-none">Do this.</p>
          <ul className="mt-10 space-y-4">
            {crafts.map((c) => (
              <li key={c} className="display-face text-[clamp(1.25rem,2.4vw,1.75rem)] text-[var(--color-ink)]/85">
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[var(--color-raised)] p-8 sm:p-12">
          <p className="display-face text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-[var(--color-cherry)]">
            We&apos;ll do this.
          </p>
          <ul className="mt-10 grid gap-3">
            {tools.map((t) => (
              <li
                key={t.name}
                className="flex items-baseline justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                <span className="text-sm font-semibold text-[var(--color-ink)]">{t.name}</span>
                <span className="truncate font-mono text-[0.7rem] text-[var(--color-muted)]">{t.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="display-face mt-14 text-center text-[clamp(2rem,5vw,3.5rem)] leading-none text-[var(--color-cherry)]">
        That&apos;s our job.
      </p>
    </div>
  );
}
