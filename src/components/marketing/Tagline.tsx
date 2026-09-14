import { TextReveal } from "@/components/text/TextReveal";

/**
 * The brand line, set as a statement rather than a slogan.
 *
 * It appears a small number of times across the site and always in the same place structurally:
 * at the END of an argument the section just finished making, never as an introduction. That is
 * what keeps it reading as a conclusion the reader arrives at rather than a tagline being
 * repeated at them.
 *
 * The split — "Make them" in the foreground colour, "remember you." in --color-cherry — puts the
 * emphasis on the second half, which is the half carrying the idea. Being remembered is the
 * claim; making them is just the verb.
 *
 * The string is NOT hardcoded here: it is assembled from TAGLINE in lib/site.ts by splitting on
 * the first space after "them", so the copy has exactly one home. If the line ever changes, this
 * falls back to rendering it whole rather than mis-splitting it.
 */
import { TAGLINE } from "@/lib/site";

const SPLIT_AT = "Make them ";
const accent = TAGLINE.startsWith(SPLIT_AT) ? TAGLINE.slice(SPLIT_AT.length) : null;

export function Tagline({
  size = "lg",
  className = "",
}: {
  /** `lg` closes a page; `sm` punctuates a section without competing with its own heading. */
  size?: "sm" | "lg";
  className?: string;
}) {
  const scale =
    size === "lg"
      ? "text-[clamp(2.25rem,6.5vw,5rem)]"
      : "text-[clamp(1.5rem,3.5vw,2.5rem)]";

  return (
    <TextReveal
      as="p"
      className={`display-face ${scale} font-medium leading-[1.02] tracking-tight ${className}`}
    >
      {accent ? (
        <>
          {SPLIT_AT}
          <span className="text-[var(--color-cherry)]">{accent}</span>
        </>
      ) : (
        TAGLINE
      )}
    </TextReveal>
  );
}
