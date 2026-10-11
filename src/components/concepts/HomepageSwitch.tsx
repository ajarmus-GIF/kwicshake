import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * The pill in the top-left of each homepage hero that lets a visitor swap experiences: the
 * interactive run at `/` and the traditional scrolling page at `/traditional`. Sits absolutely
 * inside the hero (which must be `relative`), just under the sticky header.
 */
export function HomepageSwitch({ to }: { to: "traditional" | "interactive" }) {
  const traditional = to === "traditional";
  return (
    <div className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto w-full max-w-7xl px-6 pt-6">
        <TransitionLink
          href={traditional ? "/traditional" : "/"}
          className="group inline-flex max-w-full items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--color-cherry)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-raised)_70%,transparent)] py-2 pl-4 pr-3 text-[var(--color-on-dark)] backdrop-blur-md transition-colors hover:border-[var(--color-cherry)]"
        >
          <span className="flex flex-col leading-tight">
            <span className="text-[0.8rem] font-medium text-[var(--color-white)]">
              {traditional ? "Enjoy a traditional website experience?" : "Want the interactive experience?"}
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-cherry)]">
              {traditional ? "Try our other homepage" : "Try our new homepage"}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-cherry)] text-xs text-[var(--color-paper)] transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </TransitionLink>
      </div>
    </div>
  );
}
