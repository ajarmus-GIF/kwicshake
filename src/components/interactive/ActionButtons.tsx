import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";
import { TransitionLink } from "@/components/transition/TransitionProvider";

/**
 * The site's call-to-action buttons: ONE look, used for every CTA bigger than the header's small
 * "Start a Project" pill. It started as the home hero's "I'm the customer" and is now the theme:
 * a pill with a bold display-face label and an arrow that nudges forward on hover.
 *
 *   variant "solid" (default) — --color-action (chartreuse, the Nova purple's complement) with a
 *                               dark label. The main ask on any screen.
 *   variant "ghost"           — the same shape, size and type, see-through with a white outline
 *                               and label. The second choice beside a solid one ("Explore the
 *                               Work" next to "Start a Project").
 *
 * Both have a 2px border (transparent on solid) so the two variants are exactly the same size
 * side by side. With `shine`, a band of light also sweeps across every 5s and straight away on
 * hover (keyframes in globals.css under "Action button"); off by default, only the CTAs that
 * call for it shine.
 *
 * ActionButton is a <button>; ActionLink is a page link (TransitionLink, so it gets the page
 * transition) with the identical look.
 */
type Variant = "solid" | "ghost";

const variants: Record<Variant, string> = {
  solid:
    "border-transparent bg-[var(--color-action)] text-[var(--color-on-action)] shadow-[0_14px_40px_-14px_color-mix(in_srgb,var(--color-action)_60%,transparent)] hover:bg-[var(--color-button-primary-hover)] focus-visible:outline-[var(--color-action)]",
  ghost:
    "border-[color-mix(in_srgb,var(--color-white)_60%,transparent)] bg-transparent text-[var(--color-white)] hover:border-[var(--color-white)] hover:bg-[color-mix(in_srgb,var(--color-white)_10%,transparent)] focus-visible:outline-[var(--color-white)]",
};

export function actionClass({
  variant = "solid",
  shine = false,
  className = "",
}: {
  variant?: Variant;
  shine?: boolean;
  className?: string;
}) {
  return `${shine ? "action-shine " : ""}group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border-2 px-7 py-4 sm:px-8 transition-[transform,background-color,border-color] duration-200 active:scale-[0.97] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 ${variants[variant]} ${className}`;
}

/** The label and arrow inside every action button. */
function ActionInner({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="display-face relative text-balance text-[1.2rem] font-bold uppercase leading-none tracking-tight sm:text-[1.45rem]">
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
        className="relative h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M4 10h12M11 5l5 5-5 5" />
      </svg>
    </>
  );
}

export function ActionButton({
  onClick,
  children,
  className = "",
  style,
  shine = false,
  variant = "solid",
  type = "button",
  disabled,
}: {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  /** e.g. to try another colour: { "--color-action": "#3df5c4" } */
  style?: CSSProperties;
  shine?: boolean;
  variant?: Variant;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={actionClass({ variant, shine, className: `disabled:opacity-60 ${className}` })}
    >
      <ActionInner>{children}</ActionInner>
    </button>
  );
}

export function ActionLink({
  href,
  children,
  className = "",
  shine = false,
  variant = "solid",
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  shine?: boolean;
  variant?: Variant;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">) {
  return (
    <TransitionLink href={href} className={actionClass({ variant, shine, className })} {...rest}>
      <ActionInner>{children}</ActionInner>
    </TransitionLink>
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
