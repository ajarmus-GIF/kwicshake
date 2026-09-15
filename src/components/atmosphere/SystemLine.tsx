"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * A single line of interface microcopy — a status indicator and a short monospace label that
 * counts up and settles, e.g. "RENDERING ... 100% / READY".
 *
 * This is the smallest of the "the site is building itself" devices, and the one that would be
 * easiest to overdo. Rules it holds itself to:
 *
 *   - It never carries information the reader needs. If the label were removed the page would
 *     lose nothing, which is what makes it safe to treat as ornament.
 *   - It is aria-hidden in its entirety. A screen reader announcing "loading 47%" about a page
 *     that finished loading is a lie told by decoration.
 *   - It runs once, on entry, then stops. No looping counters.
 *   - Under reduced motion it renders its settled state immediately — unlike the sparks, this
 *     one has a meaningful resting appearance, so it degrades rather than disappears.
 *
 * Pair it with a section label, not with body copy. It reads as the frame around content, and
 * putting it inside a paragraph makes the paragraph look like a system message.
 */

const COUNT_DURATION = 900;

export function SystemLine({
  label,
  /** Shown once the count completes. Kept short — it is the punchline, not a sentence. */
  settled = "READY",
  className,
}: {
  label: string;
  settled?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const [progress, setProgress] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / COUNT_DURATION, 1);
          // easeOutCubic: the number races away and decelerates into place, which reads as a
          // process completing. Linear counting reads as a timer.
          const eased = 1 - Math.pow(1 - t, 3);
          setProgress(Math.round(eased * 100));
          if (t < 1) frameRef.current = requestAnimationFrame(tick);
        };
        frameRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    };
  }, [prefersReducedMotion]);

  const done = prefersReducedMotion || progress === 100;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`flex items-center gap-2.5 font-mono text-[0.625rem] uppercase tracking-[0.25em] text-[var(--color-muted)] ${className ?? ""}`}
    >
      {/* The indicator stops pulsing once settled — a dot that keeps blinking after "READY"
          undercuts the idea that anything completed. */}
      <span
        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-cherry)] ${
          done ? "" : "system-pulse"
        }`}
      />
      <span>{label}</span>
      <span className="text-[var(--color-cherry)]">
        {done ? settled : `${progress ?? 0}%`}
      </span>
    </div>
  );
}
