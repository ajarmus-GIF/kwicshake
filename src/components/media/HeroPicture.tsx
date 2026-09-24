import { getImageProps } from "next/image";

/**
 * The home hero's background photo, art-directed: a portrait phone shot below `sm`, the
 * landscape laptop shot above it. Shared by the home hero and /comingsoon so the two can't drift.
 *
 * A <picture> rather than two <Image>s toggled with `hidden`, so each device only downloads the
 * one it shows. The breakpoint matches Tailwind's `sm` (640px). Fills its positioned parent.
 */
const shared = { alt: "", fill: true, priority: true, sizes: "100vw" } as const;
const { props: desktop } = getImageProps({ ...shared, src: "/images/hero-bg-desktop.jpg" });
const { props: mobile } = getImageProps({ ...shared, src: "/images/hero-bg-mobile.jpg" });

export function HeroPicture({ className = "object-cover" }: { className?: string }) {
  return (
    <picture>
      <source media="(max-width: 639px)" srcSet={mobile.srcSet} sizes={mobile.sizes} />
      <img {...desktop} alt="" className={className} />
    </picture>
  );
}
