"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * About 28 purple squares that brighten as the cursor passes near them — the "Kwic Shake lens"
 * signature. Not fireworks: each pixel only ever eases between a dim and a lit opacity.
 *
 * Positions come from a fixed formula (not Math.random) so the server HTML and the first client
 * render match. Pointer tracking listens on the window but measures against this element, and
 * writes opacity straight to the DOM in a rAF so moving the mouse never re-renders React.
 */
const COUNT = 28;
const pixels = Array.from({ length: COUNT }, (_, i) => {
  // Golden-angle scatter over a disc: even-looking without a grid.
  const r = Math.sqrt((i + 0.5) / COUNT) * 0.5;
  const a = i * 2.399963;
  // Rounded: trig results can differ in the last digit between engines (Node vs Safari), and an
  // unrounded value in a style attribute is exactly the kind of thing that breaks hydration.
  return {
    x: Math.round((50 + Math.cos(a) * r * 100) * 100) / 100,
    y: Math.round((50 + Math.sin(a) * r * 100) * 100) / 100,
    size: 6 + ((i * 7) % 4) * 3,
  };
});

export function PixelField({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const squares = Array.from(el.children) as HTMLElement[];
    let frame = 0;
    let px = -9999;
    let py = -9999;

    const paint = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      squares.forEach((sq, i) => {
        const cx = box.left + (pixels[i].x / 100) * box.width;
        const cy = box.top + (pixels[i].y / 100) * box.height;
        const d = Math.hypot(px - cx, py - cy);
        const lit = Math.max(0, 1 - d / 220);
        sq.style.opacity = String(0.14 + lit * 0.75);
        sq.style.transform = `scale(${1 + lit * 0.6})`;
      });
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div ref={root} aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      {pixels.map((p, i) => (
        <span
          key={i}
          className="absolute bg-[var(--color-cherry)] transition-[opacity,transform] duration-500 ease-out"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.14,
          }}
        />
      ))}
    </div>
  );
}
