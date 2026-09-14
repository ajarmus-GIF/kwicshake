import { TextReveal } from "@/components/text/TextReveal";
import { monologueFor, type MonologueLine } from "@/lib/monologue";

/**
 * One overheard thought, standing alone between two conventional sections.
 *
 * Where MonologueGrid is the home page's full PROBLEM beat, this is the same device used as
 * punctuation on the other pages: a single line, a lot of space, nothing else in the band. It is
 * the pause between "here is what we do" and "here is how we do it" — the moment the page stops
 * talking about itself and says something the reader recognises.
 *
 * It takes a page key rather than a string so lib/monologue.ts stays the single owner of which
 * line belongs where. Two pages cannot accidentally quote the same thought, which is the failure
 * that would turn a recognised sentence back into a slogan.
 *
 * Renders nothing at all if the key has no line. A missing pull quote is invisible; a crash on a
 * marketing page is not.
 */
export function MonologuePull({
  where,
  tone = "default",
}: {
  where: MonologueLine["where"];
  tone?: "default" | "raised";
}) {
  const line = monologueFor(where);
  if (!line) return null;

  const raised = tone === "raised";

  return (
    <section
      className={`relative overflow-hidden px-6 py-24 text-center sm:py-28 ${
        raised ? "bg-[var(--color-raised)] text-[var(--color-on-dark)]" : "bg-[var(--color-surface)]"
      }`}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50vw] max-h-[560px] w-[50vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
        aria-hidden="true"
      />
      <figure className="relative mx-auto max-w-3xl">
        <span
          aria-hidden="true"
          className="mb-2 block select-none font-black leading-none text-[var(--color-cherry)]/25"
          style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(3rem,7vw,5rem)" }}
        >
          &ldquo;
        </span>
        <TextReveal
          as="blockquote"
          className="text-balance text-[clamp(1.5rem,3.6vw,2.5rem)] font-medium leading-snug tracking-tight"
        >
          {line.text}
        </TextReveal>
        <figcaption
          className={`mt-8 text-xs font-semibold uppercase tracking-[0.2em] ${
            raised ? "text-[var(--color-on-dark)]/45" : "text-[var(--color-muted)]"
          }`}
        >
          Something we hear a lot
        </figcaption>
      </figure>
    </section>
  );
}
