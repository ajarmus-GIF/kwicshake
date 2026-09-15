"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Text that resolves into place, as if it were being rendered rather than simply appearing.
 *
 * Used as punctuation — a handful of headlines across the site, never a whole page. The effect
 * is a left-to-right resolve: each character spends a moment as a substitute glyph before
 * locking to its final value, so the line reads as assembling rather than decrypting. That
 * distinction is the whole design constraint. Character-shuffling on every glyph simultaneously
 * is the Matrix effect the brief rules out; a directional wipe where most of the line is already
 * correct reads as an interface building itself.
 *
 * ── Accessibility ───────────────────────────────────────────────────────────────────────────
 * The real string is always present in an sr-only span, so assistive tech reads the finished
 * sentence once and never sees a frame of substitute glyphs. The animated copy is aria-hidden.
 * The animated copy also *starts* as the real text, which means the server-rendered HTML and
 * the no-JS experience are the correct sentence — the scramble only ever happens as a
 * transient on top of already-correct markup.
 *
 * ── Why rAF is justified here ───────────────────────────────────────────────────────────────
 * This is a one-shot, sub-second animation of text CONTENT, which CSS cannot express — there is
 * no property to interpolate between two strings. It runs once per element, cancels on unmount,
 * and stops scheduling frames the moment the line is resolved, so there is no persistent loop.
 */

// Deliberately not katakana, not 0/1, not ASCII soup. A small set of technical-but-neutral
// glyphs that share the body font's rhythm, so mid-animation the line still looks like
// typography rather than like corrupted data.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/\\<>{}[]()#*+=-_";

/** How long each character stays scrambled before locking, in ms. */
const CHAR_DWELL = 45;
/** Gap between adjacent characters starting to resolve. Lower = faster wipe across the line. */
const CHAR_STAGGER = 22;
/** How often a scrambled character picks a new substitute glyph. */
const SHUFFLE_INTERVAL = 55;

export function BuildText({
  text,
  as: Tag = "span",
  className,
  /** Delay before the resolve starts once the element is in view. */
  delay = 0,
}: {
  text: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const [display, setDisplay] = useState(text);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    let started = false;

    const run = () => {
      const start = performance.now() + delay;
      // Whitespace is never scrambled — substituting a glyph for a space collapses the word
      // gaps and the line visibly changes width as it resolves.
      const chars = Array.from(text);
      let lastShuffle = 0;
      let shuffleSeed = 0;

      const tick = (now: number) => {
        const elapsed = now - start;

        if (elapsed < 0) {
          frameRef.current = requestAnimationFrame(tick);
          return;
        }

        // Re-roll substitute glyphs on a slower clock than the frame rate. At 60fps an
        // every-frame re-roll is a blur nobody can read as characters; ~18Hz reads as discrete
        // glyphs being tried.
        if (now - lastShuffle > SHUFFLE_INTERVAL) {
          lastShuffle = now;
          shuffleSeed += 1;
        }

        let resolvedCount = 0;
        const next = chars.map((char, i) => {
          if (char === " " || char === " ") return char;
          const charStart = i * CHAR_STAGGER;
          if (elapsed >= charStart + CHAR_DWELL) {
            resolvedCount += 1;
            return char;
          }
          if (elapsed < charStart) return char;
          // Index varies per character AND per shuffle tick, so adjacent glyphs aren't
          // showing the same substitute at the same moment.
          return GLYPHS[(i * 7 + shuffleSeed * 13) % GLYPHS.length];
        });

        setDisplay(next.join(""));

        if (resolvedCount < chars.filter((c) => c !== " " && c !== " ").length) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          // Snap to the exact source string rather than leaving the reconstructed join,
          // so the DOM text is identical to the prop once settled.
          setDisplay(text);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        // One-shot: the effect is punctuation, and re-firing it every time the reader scrolls
        // back past would turn a flourish into a tic.
        observer.disconnect();
        run();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    };
  }, [text, delay, prefersReducedMotion]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      <span className="sr-only">{text}</span>
      {/* tabular-nums keeps substitute glyphs from changing the line's measured width as they
          swap, which is what stops the surrounding layout from shivering during the resolve. */}
      <span aria-hidden="true" className="tabular-nums">
        {prefersReducedMotion ? text : display}
      </span>
    </Tag>
  );
}
