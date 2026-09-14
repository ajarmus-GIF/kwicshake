import type { ReactNode } from "react";
import { TextReveal } from "@/components/text/TextReveal";

/**
 * A single large statement with nothing else in the band.
 *
 * This exists because the most important lines on this site are the ones that are given room to
 * be uncomfortable. "People decide how much they trust you before they ever connect with you."
 * is an idea a business owner has to sit with for a second; wrapped in supporting copy and a
 * button it becomes a bullet point and the reader skims past it.
 *
 * So the constraint is deliberate and the component enforces it: one heading, an optional short
 * line under it, and a lot of vertical space. There is no CTA slot on purpose. If a band needs a
 * button it is not a statement band, it is a section, and it should be built as one.
 *
 * `tone` picks the ground. Alternating dark and default down a long page is what keeps a scroll
 * from flattening into one continuous surface — see the home page, where each statement band
 * sits on the opposite ground from the section above it.
 */
export function StatementBand({
  eyebrow,
  children,
  support,
  tone = "default",
  align = "center",
  size = "lg",
}: {
  eyebrow?: string;
  children: ReactNode;
  support?: ReactNode;
  tone?: "default" | "raised" | "surface";
  align?: "center" | "left";
  size?: "md" | "lg";
}) {
  const ground =
    tone === "raised"
      ? "bg-[var(--color-raised)] text-[var(--color-on-dark)]"
      : tone === "surface"
        ? "bg-[var(--color-surface)]"
        : "";

  const supportTone =
    tone === "raised" ? "text-[var(--color-on-dark)]/65" : "text-[var(--color-muted)]";

  const centered = align === "center";
  const scale =
    size === "lg"
      ? "text-[clamp(2rem,5.5vw,4.25rem)]"
      : "text-[clamp(1.75rem,4vw,3rem)]";

  return (
    <section
      className={`relative overflow-hidden px-6 py-28 sm:py-36 ${ground} ${
        centered ? "text-center" : ""
      }`}
    >
      <div
        className={`pointer-events-none absolute top-1/2 h-[55vw] max-h-[640px] w-[55vw] max-w-[640px] -translate-y-1/2 rounded-full opacity-[0.18] blur-3xl ${
          centered ? "left-1/2 -translate-x-1/2" : "left-[-14%]"
        }`}
        style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className={`relative ${centered ? "mx-auto" : ""} max-w-4xl`}>
        {eyebrow && (
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + {eyebrow}
          </p>
        )}
        <TextReveal
          as="h2"
          className={`display-face ${scale} font-medium leading-[1.06] tracking-tight text-balance`}
        >
          {children}
        </TextReveal>
        {support && (
          <TextReveal
            as="p"
            className={`mt-8 ${centered ? "mx-auto" : ""} max-w-xl text-base leading-relaxed sm:text-lg ${supportTone}`}
          >
            {support}
          </TextReveal>
        )}
      </div>
    </section>
  );
}
