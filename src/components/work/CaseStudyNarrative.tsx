import { TextReveal } from "@/components/text/TextReveal";
import type { Project } from "@/lib/projects";

/**
 * A case study told as a story: problem, opportunity, idea, what we built, what changed, and —
 * the chapter that does the actual persuading — why we chose any of it.
 *
 * ── Why "The Thinking" is last and not first ────────────────────────────────────────────────
 * It's the payoff. A reader who has just seen what changed is primed to ask "why that?", and
 * answering it there converts a nice-looking project into evidence that someone reasoned about
 * the business. Put the reasoning up front and it's a manifesto nobody asked for.
 *
 * ── Prose vs. list, and why the distinction is enforced ─────────────────────────────────────
 * Narrative chapters get real paragraphs; `built` and `result` get lists. Those two are
 * inventories — discrete, checkable items — and running them as prose hides individual claims
 * inside a wall of text where nobody can weigh them. Conversely, running `why` as bullets would
 * strip out the reasoning that connects the points, which is the entire content of that chapter.
 *
 * Chapters alternate their ground so a long single-column read has a rhythm, and the numerals
 * are decoration only (`aria-hidden`) — the real structure is the h2 in each chapter.
 */
const chapters = [
  { key: "problem", label: "The Problem", prompt: "What wasn't working?" },
  { key: "opportunity", label: "The Opportunity", prompt: "What could this become?" },
  { key: "idea", label: "The Idea", prompt: "What direction did we choose?" },
  { key: "built", label: "The Changes", prompt: "What did we actually build?" },
  { key: "result", label: "The Result", prompt: "What changed?" },
  { key: "why", label: "The Thinking", prompt: "Why we made those decisions." },
] as const;

export function CaseStudyNarrative({ project }: { project: Project }) {
  return (
    <div>
      {chapters.map((chapter, index) => {
        const value = project[chapter.key];
        const raised = index % 2 === 1;

        return (
          <section
            key={chapter.key}
            className={`relative px-6 py-20 sm:py-24 ${
              raised ? "bg-[var(--color-raised)] text-[var(--color-on-dark)]" : ""
            }`}
          >
            {/* The oversized chapter numeral is deliberately bled off the edge (-3%), so it
                needs clipping — but the clip has to live on this wrapper rather than on the
                <section>, because the section also contains a md:sticky chapter label. An
                overflow-hidden ancestor becomes the scroll container for a sticky descendant,
                which would stop the label sticking entirely. See TeamMemberFlow.tsx. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <span
                className={`absolute top-4 select-none font-black leading-none text-[var(--color-cherry)]/[0.07] ${
                  raised ? "left-[-3%]" : "right-[-3%]"
                }`}
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontSize: "clamp(6rem,16vw,12rem)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-[0.8fr_1.4fr] md:gap-14">
              <div className="md:sticky md:top-28 md:self-start">
                <h2 className="display-face text-[clamp(1.5rem,3vw,2.25rem)] leading-tight tracking-tight text-[var(--color-cherry)]">
                  {chapter.label}
                </h2>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    raised ? "text-[var(--color-on-dark)]/55" : "text-[var(--color-muted)]"
                  }`}
                >
                  {chapter.prompt}
                </p>
              </div>

              <div>
                {Array.isArray(value) ? (
                  <ul className="space-y-5">
                    {value.map((item) => (
                      <li key={item} className="flex items-baseline gap-4">
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-[var(--color-cherry)]"
                        >
                          &mdash;
                        </span>
                        <span className="text-[clamp(1.05rem,2vw,1.3rem)] leading-snug">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <TextReveal
                    as="p"
                    className={`text-[clamp(1.05rem,2vw,1.3rem)] leading-relaxed ${
                      raised ? "text-[var(--color-on-dark)]/80" : ""
                    }`}
                  >
                    {value}
                  </TextReveal>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
