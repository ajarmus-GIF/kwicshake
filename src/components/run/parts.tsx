import { ActionButton, ActionNote } from "@/components/interactive/ActionButtons";
import type { ReactNode } from "react";

/**
 * Shared pieces of the Concept 3 run: the cited facts, the "fact unlocked" card, and the stage
 * wrapper that gives every moment its own visual world while keeping one rhythm.
 */
export const sources = {
  phoneSearch: {
    label: "BrightLocal, Consumer Search Behavior (July 2026, 1,227 US consumers)",
    href: "https://www.brightlocal.com/research/consumer-search-behavior-channels/",
  },
  fiftyMs: {
    label: "Lindgaard et al., Behaviour & Information Technology (2006)",
    href: "https://doi.org/10.1080/01449290500330448",
  },
  credibility: {
    label: "Stanford Web Credibility Research",
    href: "https://credibility.stanford.edu/",
  },
  speed: {
    label: "Think with Google, mobile page speed benchmarks",
    href: "https://www.thinkwithgoogle.com/intl/en-gb/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks/",
  },
  reading: {
    label: "Nielsen Norman Group, “How Little Do Users Read?”",
    href: "https://www.nngroup.com/articles/how-little-do-users-read/",
  },
  fold: {
    label: "Nielsen Norman Group, “Scrolling and Attention”",
    href: "https://www.nngroup.com/articles/scrolling-and-attention/",
  },
} as const;

export type Source = (typeof sources)[keyof typeof sources];

/** A fact the visitor earned. Pops in once (CSS .fact-pop) so unlocking it feels like a reward. */
export function FactCard({ stat, children, source }: { stat: string; children: ReactNode; source: Source }) {
  return (
    <div className="fact-pop mx-auto mt-10 max-w-xl rounded-2xl border border-[var(--color-cherry)]/40 bg-black/30 p-6 text-left shadow-[0_0_60px_-20px_var(--color-glow)] backdrop-blur-sm sm:p-7">
      <p className="eyebrow flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-cherry)]" /> Fact unlocked
      </p>
      <p className="mt-4 flex items-baseline gap-4">
        <span className="display-face shrink-0 text-[clamp(2.4rem,6vw,3.5rem)] leading-none text-[var(--color-cherry)]">
          {stat}
        </span>
        <span className="text-base leading-snug text-[var(--color-ink)]/90 sm:text-lg">{children}</span>
      </p>
      <a
        href={source.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-[0.7rem] text-[var(--color-muted)] underline decoration-[var(--color-cherry)]/50 underline-offset-2 hover:text-[var(--color-cherry)]"
      >
        {source.label}
      </a>
    </div>
  );
}

/**
 * One moment of the run. Each `look` is a different room — that is what breaks the experience
 * up visually without it ever becoming "sections" — and every stage enters with .stage-enter
 * (a rise + unblur) the moment it's unlocked.
 */
export type StageLook = "door" | "glass" | "void" | "tone" | "alarm" | "paper" | "night" | "glow";

const looks: Record<StageLook, string> = {
  door: "bg-[var(--color-paper)]",
  glass: "bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--color-nova-secondary)_35%,var(--color-paper)),var(--color-paper)_70%)]",
  void: "bg-black",
  tone: "bg-[linear-gradient(180deg,var(--color-paper),color-mix(in_srgb,var(--color-cherry-dark)_30%,var(--color-paper)))]",
  alarm: "bg-[color-mix(in_srgb,var(--color-cherry-dark)_55%,black)]",
  paper: "bg-[var(--color-raised)] bg-[linear-gradient(var(--color-ash-22)_1px,transparent_1px),linear-gradient(90deg,var(--color-ash-22)_1px,transparent_1px)] [background-size:48px_48px]",
  night: "bg-[var(--color-surface)]",
  glow: "bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--color-cherry-dark)_55%,var(--color-paper)),var(--color-paper)_70%)]",
};

export function Stage({
  id,
  look,
  index,
  name,
  children,
  onSkip,
  done,
  active = true,
  onBack,
  onNext,
}: {
  id: string;
  look: StageLook;
  index?: number;
  name?: string;
  children: ReactNode;
  onSkip?: () => void;
  done?: boolean;
  /** The run shows one moment at a time; the others stay mounted (keeping their state) but hidden.
   *  Un-hiding replays .stage-enter, so every page turn gets the entrance. */
  active?: boolean;
  /** Phones have no rail, so each moment gets its own small "Back". */
  onBack?: () => void;
  /** A way forward for a moment that was skipped, then revisited: its own "next" never appeared. */
  onNext?: () => void;
}) {
  return (
    <section
      id={id}
      className={`${active ? "flex" : "hidden"} stage-enter relative min-h-[100svh] items-center overflow-hidden px-6 py-24 text-[var(--color-ink)] ${looks[look]}`}
    >
      <div className="relative mx-auto w-full max-w-5xl">
        {onBack && (
          <p className="mb-6 text-center lg:hidden">
            <button
              type="button"
              onClick={onBack}
              className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--color-muted)] hover:text-[var(--color-cherry)]"
            >
              ← Back
            </button>
          </p>
        )}
        {name && (
          <p className="eyebrow mb-8 text-center">
            Moment {String(index).padStart(2, "0")} <span className="mx-2 opacity-50">/</span> {name}
          </p>
        )}
        {children}
        {onSkip && !done && (
          <p className="mt-10 text-center">
            <button
              type="button"
              onClick={onSkip}
              className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-cherry)] hover:underline"
            >
              Skip this moment →
            </button>
          </p>
        )}
        {done && onNext && <Onward onClick={onNext} />}
      </div>
    </section>
  );
}

/**
 * The run's call to action: the same action button as the hero's "I'm the customer"
 * (interactive/ActionButtons), so every button in the run is one size and one style. It used to
 * be the oversized BlockCta, which made long labels like "Tap “Schedule a consultation”" huge.
 * No shine: that is reserved for the CTAs that ask for it (the hero's included).
 */
export function RunCta({
  onClick,
  children,
  sub,
  align = "center",
  className = "",
}: {
  onClick: () => void;
  children: ReactNode;
  sub?: ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${align === "center" ? "items-center" : "items-start"} ${className}`}>
      <ActionButton onClick={onClick}>{children}</ActionButton>
      {sub && <ActionNote>{sub}</ActionNote>}
    </div>
  );
}

/** The "next" that appears once a moment is finished. */
export function Onward({ onClick, children = "Keep going" }: { onClick: () => void; children?: ReactNode }) {
  return (
    <div className="fact-pop mt-12">
      <RunCta onClick={onClick}>
        {children}
      </RunCta>
    </div>
  );
}
