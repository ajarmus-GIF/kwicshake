import type { ReactNode } from "react";

/**
 * The big CTA: a solid action-chartreuse pill with bold dark type. The large label sets its size,
 * padding wraps it; no gradient, glow or motion beyond a lighter hover and a small press.
 * An optional `sub` line sits under the button, not inside it.
 *
 * --color-action rather than a cherry token on purpose: inside a tone section the cherry tokens
 * are re-pointed at the tone's accent, and the CTA must look the same on every ground.
 */
export function BlockCta({
  onClick,
  children,
  sub,
  align = "center",
  className = "",
  compact = false,
}: {
  /** A smaller pill, for tight spots like the gap under the phone in the home hero photo. */
  compact?: boolean;
  onClick?: () => void;
  children: ReactNode;
  /** Optional small line under the button, e.g. "One minute · no sign-up". */
  sub?: ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"} ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className={`display-face rounded-full bg-[var(--color-action)] ${
          compact ? "px-8 py-4 text-[clamp(1.4rem,2.2vw,1.9rem)] sm:px-10" : "px-10 py-5 text-[clamp(1.6rem,4.4vw,3rem)] sm:px-14 sm:py-6"
        } font-bold uppercase leading-none tracking-tight text-[var(--color-on-action)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-[background-color,transform] duration-200 hover:bg-[var(--color-button-primary-hover)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.98] active:bg-[#b3e62e]`}
      >
        {children}
      </button>
      {sub && (
        <span className="mt-4 font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-muted)] sm:text-xs">
          {sub}
        </span>
      )}
    </div>
  );
}
