/**
 * Neutral grayscale placeholder standing in for real imagery. Deliberately not next/image —
 * there's no real asset to optimize yet, and using next/image with a fake src would force a
 * remotePatterns/domain config for no reason. Swap this out for next/image (or real media)
 * per-instance once real content lands; the label and aspect prop are TODO scaffolding only.
 */
export function PlaceholderMedia({
  label = "TODO: image",
  aspect = "aspect-[4/3]",
  className,
}: {
  label?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex ${aspect} w-full items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] bg-[repeating-linear-gradient(135deg,var(--color-border)_0,var(--color-border)_1px,transparent_1px,transparent_12px)] ${className ?? ""}`}
    >
      <span className="bg-[var(--color-bg)] px-2 py-1 text-xs text-[var(--color-muted)]">
        {label}
      </span>
    </div>
  );
}
