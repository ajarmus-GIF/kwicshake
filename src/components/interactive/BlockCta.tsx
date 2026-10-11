import type { ReactNode } from "react";
import { ActionButton, ActionNote } from "@/components/interactive/ActionButtons";

/**
 * A CTA button with an optional note under it. It used to be its own oversized pill; it now
 * renders the site's one action button (interactive/ActionButtons) so every CTA matches. Kept as
 * a component because RevealHero and the concept pages pass `sub` and `align`.
 */
export function BlockCta({
  onClick,
  children,
  sub,
  align = "center",
  className = "",
}: {
  onClick?: () => void;
  children: ReactNode;
  /** Optional small line under the button, e.g. "One minute · no sign-up". */
  sub?: ReactNode;
  align?: "center" | "start";
  className?: string;
  /** No longer has an effect (every action button is one size); accepted so callers compile. */
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"} ${className}`}>
      <ActionButton onClick={onClick}>{children}</ActionButton>
      {sub && <ActionNote>{sub}</ActionNote>}
    </div>
  );
}
