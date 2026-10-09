import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ConceptHeroPicture } from "@/components/concepts/ConceptHeroPicture";
import { DESCRIPTOR } from "@/lib/site";

/**
 * "One device, many worlds" — now as the photograph itself (concepts/ConceptHeroPicture): one
 * phone at the centre, many businesses' sites floating around it. The coded phone that used to
 * cycle here is gone from the hero on purpose — two phones side by side would compete — and its
 * interactive version still arrives later in ImagineYours, where the visitor drives it.
 *
 * Legibility: the copy sits on a scrim, not on the photo. Desktop fades from the left (the copy
 * column) and leaves the phone in the centre clear; phones fade from the bottom, where the copy
 * is anchored, so the device stays visible above it.
 */
export function RevealHero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-[var(--color-raised)] text-[var(--color-on-dark)] lg:items-center">
      <ConceptHeroPicture className="object-cover object-center" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-raised)_8%,color-mix(in_srgb,var(--color-raised)_80%,transparent)_42%,transparent_70%)] lg:bg-[linear-gradient(90deg,var(--color-raised)_0%,var(--color-raised)_18%,color-mix(in_srgb,var(--color-raised)_85%,transparent)_34%,transparent_50%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-raised)] to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-32 lg:py-28">
        <div className="max-w-[30rem]">
          <p className="eyebrow mb-6">+ {DESCRIPTOR}</p>
          <h1 className="text-[clamp(2.4rem,4.4vw,4rem)] font-medium leading-[1.03] tracking-tight">
            <span className="block text-[var(--color-white)]">You built a great business.</span>
            <span className="block text-[var(--color-cherry)]">Does your marketing show it?</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-snug text-[var(--color-on-dark)]/85">
            A great business can still look forgettable online. We fix the part people see first.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <MagneticButton
              as={TransitionLink}
              href="/contact"
              radius={100}
              className="btn-hero-white inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest"
            >
              Start a Conversation
            </MagneticButton>
            <TransitionLink
              href="/work"
              className="text-sm font-semibold uppercase tracking-widest text-[var(--color-on-dark)] underline decoration-[var(--color-cherry)] underline-offset-4 transition-colors hover:text-[var(--color-cherry)]"
            >
              See What We&apos;ve Built →
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
