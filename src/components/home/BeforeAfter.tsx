import { TextReveal } from "@/components/text/TextReveal";

/**
 * Same business, different first impression.
 *
 * ── Why this is not attributed to a client ──────────────────────────────────────────────────
 * This describes the SHAPE of the change our work makes, not a specific engagement, and it says
 * so by naming no client and showing no screenshots. That is deliberate: a before/after with a
 * logo on it is a claim about a real business's results, and we do not yet have measured results
 * to put behind one. Inventing a transformation here would undermine the case study one click
 * away that is scrupulously honest about being in progress.
 *
 * When a real before/after exists, this component takes it: pass `attribution` and the column
 * items become that project's actual starting and ending state. Until then it stays generic and
 * true rather than specific and invented.
 *
 * The emotional payload is the line underneath, and it is the reason the section exists at all:
 * the business didn't get better, it got legible. That reframes the entire purchase — the reader
 * is not being told they need to fix their company.
 */
const before = [
  "Old website",
  "Confusing messaging",
  "Weak positioning",
  "Forgettable brand",
  "No clear next step",
];

const after = [
  "Clear positioning",
  "Strong visual identity",
  "Modern experience",
  "Confident messaging",
  "Obvious path forward",
];

export function BeforeAfter({ attribution }: { attribution?: string }) {
  return (
    <section className="relative overflow-hidden px-6 py-28 sm:py-32">
      <div
        className="pointer-events-none absolute -top-1/4 right-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + The Shift
          </p>
          <TextReveal
            as="h2"
            className="display-face text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.06] tracking-tight"
          >
            <span className="block">Same business.</span>
            <span className="block text-[var(--color-cherry)]">
              Completely different first impression.
            </span>
          </TextReveal>
        </div>

        {/* Two columns on desktop with the arrow between them; stacked on mobile with the arrow
            rotated to point down. The arrow is a real element in the flow rather than a border
            trick so it stays centered between columns of unequal height. */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          <Column
            label="Before"
            items={before}
            className="border-[var(--color-border)] text-[var(--color-muted)]"
            markerClass="text-[var(--color-muted)]/50"
          />

          <div
            aria-hidden="true"
            className="flex items-center justify-center text-[clamp(1.75rem,4vw,2.5rem)] text-[var(--color-cherry)] md:px-2"
          >
            <span className="md:hidden">&darr;</span>
            <span className="hidden md:inline">&rarr;</span>
          </div>

          <Column
            label="After"
            items={after}
            className="border-[var(--color-cherry)]/40 bg-[var(--color-surface)]"
            markerClass="text-[var(--color-cherry)]"
          />
        </div>

        <TextReveal
          as="p"
          className="mx-auto mt-14 max-w-2xl text-balance text-center text-[clamp(1.15rem,2.6vw,1.6rem)] leading-snug"
        >
          The business didn&apos;t suddenly become better.{" "}
          <span className="text-[var(--color-cherry)]">People can finally see it.</span>
        </TextReveal>

        {attribution && (
          <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            {attribution}
          </p>
        )}
      </div>
    </section>
  );
}

function Column({
  label,
  items,
  className,
  markerClass,
}: {
  label: string;
  items: string[];
  className: string;
  markerClass: string;
}) {
  return (
    <div className={`border p-8 sm:p-9 ${className}`}>
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em]">{label}</p>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-baseline gap-3 text-base sm:text-lg">
            <span aria-hidden="true" className={`shrink-0 ${markerClass}`}>
              &mdash;
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
