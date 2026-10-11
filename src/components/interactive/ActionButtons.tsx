import type { CSSProperties, ReactNode } from "react";

/**
 * The site's action button: a solid --color-action (chartreuse, the Nova purple's complement)
 * pill with a dark label and an arrow that nudges forward on hover. With `shine`, a band of light
 * also sweeps across it every 5s and straight away on hover (keyframes in globals.css under
 * "Action button"); off by default, only the CTAs that call for it shine.
 */
export function ActionButton({
  onClick,
  children,
  className = "",
  style,
  shine = false,
}: {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  /** e.g. to try another colour: { "--color-action": "#3df5c4" } */
  style?: CSSProperties;
  shine?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`${shine ? "action-shine " : ""}group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[var(--color-action)] px-8 py-4 text-[var(--color-on-action)] shadow-[0_14px_40px_-14px_color-mix(in_srgb,var(--color-action)_60%,transparent)] transition-transform duration-200 active:scale-[0.97] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[var(--color-action)] ${className}`}
    >
      <span className="display-face relative text-[1.3rem] font-bold uppercase leading-none tracking-tight sm:text-[1.45rem]">
        {children}
      </span>
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M4 10h12M11 5l5 5-5 5" />
      </svg>
    </button>
  );
}

/** The small line under an action button, e.g. "One minute · no sign-up". */
export function ActionNote({ children }: { children: ReactNode }) {
  return (
    <span className="mt-3 flex items-center gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-muted)] sm:text-xs">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-action)]" />
      {children}
    </span>
  );
}
