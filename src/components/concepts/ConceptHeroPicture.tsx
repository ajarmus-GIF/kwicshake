import { getImageProps } from "next/image";

/**
 * The top image for the home concepts: one phone surrounded by many businesses' sites — the
 * "one device, many worlds" idea as a photograph. Art-directed like media/HeroPicture: the
 * portrait cut on phones, the landscape cut everywhere else, one request either way.
 *
 * Decorative (alt=""): the headline over it carries the meaning, and describing a background
 * collage to a screen reader before the headline would only delay it.
 */
const shared = { alt: "", fill: true, priority: true, sizes: "100vw" } as const;
const { props: desktop } = getImageProps({ ...shared, src: "/images/concepts/hero-laptop.jpg" });
const { props: mobile } = getImageProps({ ...shared, src: "/images/concepts/hero-phone.jpg" });

export function ConceptHeroPicture({ className = "object-cover" }: { className?: string }) {
  return (
    <picture>
      {/* The site builds with images.unoptimized (static export), and in that mode
          getImageProps returns no srcSet — only `src`. Without the fallback this <source> renders
          empty and phones silently get the landscape image. */}
      <source media="(max-width: 767px)" srcSet={mobile.srcSet ?? mobile.src} sizes={mobile.sizes} />
      <img {...desktop} alt="" className={className} />
    </picture>
  );
}
