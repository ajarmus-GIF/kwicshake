"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePointerFine } from "@/hooks/useMediaQuery";

/**
 * Element eases toward the cursor while the pointer is within `radius` px of its center, and
 * springs back to rest (elastic ease) on leave. The listener lives on `window`, not the element
 * itself — a mousemove-on-element listener only fires once the pointer is already over the
 * element, which is too late for a "pulls you in from a distance" magnetic feel. Distance is
 * computed every move against the element's live `getBoundingClientRect()` rather than a
 * value cached at mount, so it stays correct across layout shifts (font load, resize).
 *
 * `usePointerFine()` gates the whole effect: on touch, there is no persistent cursor position
 * to react to, and a "magnetic pull" on tap would just look like a mis-registered touch target.
 *
 * Failure mode: without `gsap.quickTo`'s built-in easing, a naive `gsap.to` per mousemove event
 * queues overlapping tweens and the element stutters; quickTo instead reuses one tween and just
 * retargets it, which is what keeps this smooth under a fast mousemove stream.
 */
export function MagneticButton({
  as: Component = "button",
  radius = 80,
  strength = 0.4,
  className,
  children,
  ...props
}: {
  as?: ElementType;
  radius?: number;
  strength?: number;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}) {
  const elRef = useRef<HTMLElement | null>(null);
  const isPointerFine = usePointerFine();

  useGSAP(
    () => {
      const el = elRef.current;
      if (!el || !isPointerFine) return;

      const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const handleMove = (event: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = event.clientX - centerX;
        const distY = event.clientY - centerY;
        const distance = Math.hypot(distX, distY);

        if (distance < radius) {
          x(distX * strength);
          y(distY * strength);
        } else {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        }
      };

      window.addEventListener("mousemove", handleMove);
      return () => window.removeEventListener("mousemove", handleMove);
    },
    { dependencies: [isPointerFine, radius, strength] }
  );

  return (
    <Component ref={elRef} className={className} {...props}>
      {children}
    </Component>
  );
}
