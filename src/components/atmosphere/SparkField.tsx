"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * The spark layer that sits over environmental photography.
 *
 * Brief calls these "falling stars", but literal starfields read as space, and this site is a
 * marketing studio, not a planetarium. What's here instead is closer to a lens artifact: a
 * luminous streak crossing a corner of the frame every few seconds, at an opacity where you're
 * never quite sure you saw it. The intent is that it rewards attention rather than competing
 * for it — so nothing here runs faster than ~1.6s or brighter than 0.55 alpha.
 *
 * ── Why CSS keyframes and not canvas/rAF ────────────────────────────────────────────────────
 * Every spark is one absolutely-positioned <span> animated on transform + opacity only, which
 * the compositor handles off the main thread. A canvas doing the same thing costs a rAF loop, a
 * context, and a redraw per frame for what is at most a dozen moving elements. The section this
 * sits in is usually behind a next/image too, so main-thread time here competes directly with
 * image decode.
 *
 * ── Why IntersectionObserver gates it ───────────────────────────────────────────────────────
 * CSS animations keep ticking when scrolled out of view — the compositor doesn't know the
 * element stopped mattering. Several of these across a long page means several always-running
 * animations. The observer flips `animation-play-state` so only the field actually on screen is
 * doing anything, which is the "avoid continuously running animations when they are not
 * visible" requirement.
 *
 * ── Why the positions are seeded and not Math.random() ──────────────────────────────────────
 * This renders on the server first. Math.random() would produce different positions in the SSR
 * HTML than on hydration, and React would log a mismatch and discard the markup. mulberry32 with
 * a per-variant seed gives scattered-looking placement that is identical on both sides.
 */

export type SparkVariant = "streak" | "diagonal" | "trail" | "cluster" | "point";

/** Small, fast, deterministic PRNG. Same seed in, same sequence out — on server and client. */
function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Per-variant character. These exist so no two pages get the same effect — the brief is
 * explicit that the same animation everywhere reads as a screensaver. Each entry tunes count,
 * timing and geometry rather than swapping the underlying mechanism, which keeps all five
 * recognisably one system.
 */
const VARIANTS: Record<
  SparkVariant,
  {
    count: number;
    seed: number;
    /** Travel angle in degrees, 0 = straight down. */
    angle: number;
    lengthRange: [number, number];
    durationRange: [number, number];
    /** Longest possible wait before a spark's first appearance — the "unexpected moment" dial. */
    maxDelay: number;
    opacity: number;
    /** Clusters bunch their origins into one band instead of spreading across the frame. */
    clustered?: boolean;
  }
> = {
  // Home hero: near-vertical, quick, the most "meteor"-like of the set.
  streak: { count: 7, seed: 1207, angle: 14, lengthRange: [40, 90], durationRange: [1.6, 2.6], maxDelay: 9, opacity: 0.5 },
  // Slow, shallow, travels much further across the frame. Reads as drifting rather than falling.
  diagonal: { count: 5, seed: 5541, angle: 38, lengthRange: [70, 140], durationRange: [3.2, 4.4], maxDelay: 12, opacity: 0.42 },
  // Long faint tails, more of them, staggered — a trail of particles rather than discrete hits.
  trail: { count: 10, seed: 8893, angle: 22, lengthRange: [24, 52], durationRange: [2.4, 3.6], maxDelay: 7, opacity: 0.35 },
  // Tight group crossing one region of the frame together.
  cluster: { count: 9, seed: 3317, angle: 28, lengthRange: [16, 34], durationRange: [2.0, 3.0], maxDelay: 6, opacity: 0.4, clustered: true },
  // Barely there: three points, long waits, almost no tail. The quietest variant.
  point: { count: 3, seed: 7723, angle: 8, lengthRange: [8, 16], durationRange: [2.8, 3.8], maxDelay: 16, opacity: 0.55 },
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function SparkField({
  variant = "streak",
  className,
}: {
  variant?: SparkVariant;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      // Slight rootMargin so a spark is already in flight by the time the section is actually
      // being read, rather than the field starting from nothing at the exact edge.
      { rootMargin: "10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Reduced motion removes the effect entirely rather than slowing it down. It is pure
  // decoration with no informational content, so there is nothing to preserve a static
  // fallback of — a frozen streak mid-frame would just look like a rendering artifact.
  if (prefersReducedMotion) return null;

  const config = VARIANTS[variant];
  const random = mulberry32(config.seed);

  const sparks = Array.from({ length: config.count }, (_, i) => {
    const r1 = random();
    const r2 = random();
    const r3 = random();
    const r4 = random();

    // Clustered variants draw origins from a narrow horizontal band; the rest spread wide.
    const left = config.clustered ? lerp(52, 82, r1) : lerp(-5, 100, r1);
    const top = config.clustered ? lerp(-8, 18, r2) : lerp(-15, 45, r2);

    return {
      key: i,
      left: `${left.toFixed(2)}%`,
      top: `${top.toFixed(2)}%`,
      length: `${Math.round(lerp(config.lengthRange[0], config.lengthRange[1], r3))}px`,
      duration: `${lerp(config.durationRange[0], config.durationRange[1], r4).toFixed(2)}s`,
      // Spread start times across the whole window so sparks never arrive in lockstep.
      delay: `${(r1 * config.maxDelay).toFixed(2)}s`,
      // Travel distance scales with viewport so the path reads the same on a phone and a 27".
      distance: `${Math.round(lerp(38, 72, r2))}vh`,
    };
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      style={
        {
          "--spark-angle": `${config.angle}deg`,
          "--spark-opacity": config.opacity,
        } as React.CSSProperties
      }
    >
      {sparks.map((spark) => (
        <span
          key={spark.key}
          className="spark"
          style={
            {
              left: spark.left,
              top: spark.top,
              height: spark.length,
              animationDuration: spark.duration,
              animationDelay: spark.delay,
              animationPlayState: active ? "running" : "paused",
              "--spark-distance": spark.distance,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
