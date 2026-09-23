"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * The single image slot used everywhere photography appears on this site.
 *
 * It exists because imagery arrived last. Every layout that needs a picture was built against a
 * grey hatched TODO box (the old PlaceholderMedia), which meant the layouts were designed around
 * a rectangle rather than around an image — no reveal, no crop intent, no aspect discipline, and
 * nothing to stop each caller inventing its own treatment. This component owns all of that, so
 * dropping a real asset in later is a one-line change at the call site and zero layout work.
 *
 * ── The unfilled state is a design, not an error ─────────────────────────────────────────────
 * With no `src`, this renders a composed frame: hairline border, corner brackets, a faint grid,
 * and a mono caption naming what belongs there. That is deliberate. A site mid-build looks
 * intentional if its empty slots look specified, and it reads as the brief's "image frame
 * initializing" idea rather than as a missing asset. It is also honest — the caption says what
 * the slot is for, so nobody mistakes a placeholder for a finished composition.
 *
 * ── Reveal ──────────────────────────────────────────────────────────────────────────────────
 * A clip-path wipe plus a small counter-scale on the inner layer, so the frame opens and the
 * image appears to settle into it rather than sliding in as a block. CSS transition driven by one
 * class toggle from an IntersectionObserver — no GSAP, no scrubbing, nothing per-frame. The other
 * scroll reveals on this site use GSAP because they stagger split text; this one animates two
 * properties on one element, which does not justify the dependency.
 *
 * ── Why not next/image for the placeholder ──────────────────────────────────────────────────
 * There is no file to optimise. next/image with a fake src forces a remotePatterns entry and
 * emits a broken request. The placeholder is pure CSS and costs no bytes.
 *
 * ── Video slots ─────────────────────────────────────────────────────────────────────────────
 * Passing `video` turns the same frame into a silent, looping clip — the frame, the hairline,
 * the reveal and the crop discipline are unchanged, which is the point: a moving slot has to sit
 * in a layout next to still ones without announcing itself as a different component.
 *
 * `src` stays required alongside it and does double duty as the poster: it is what paints before
 * the clip has buffered, and it is the whole slot under `prefers-reduced-motion`, where the
 * <video> is not rendered at all. Not rendering it is deliberate — a paused video element still
 * fetches its first frames, so honouring the preference by rendering-but-not-playing would cost
 * a reader who asked for less motion the same megabytes with none of the payoff.
 *
 * muted + playsInline are what make autoplay legal on iOS and in Chrome; without both, the clip
 * silently never starts and the slot shows a frozen poster forever. There are no controls by
 * design: this is a moving picture, not media the reader is being asked to operate.
 */

export type MediaFrame = "editorial" | "soft";

export function EditorialMedia({
  src,
  /**
   * Optional silent clip for this slot. `src` is still required when this is set — it is the
   * poster and the reduced-motion fallback. See the note above.
   */
  video,
  alt,
  /** What belongs in this slot. Shown in the placeholder caption; ignored once `src` is set. */
  label = "Image",
  aspect = "aspect-[4/3]",
  frame = "editorial",
  /** Wipe direction. Vary it between adjacent slots so a grid doesn't open in lockstep. */
  from = "bottom",
  /** Staggers a group of slots. Keep under ~240ms; beyond that it reads as a loading delay. */
  delay = 0,
  /**
   * Responsive hint for next/image. Default assumes a slot roughly half a 1280px container on
   * desktop and full width on phones — correct it per call site when the slot is wider, or the
   * browser downloads a larger file than it paints.
   */
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className,
}: {
  src?: string;
  video?: string;
  alt?: string;
  label?: string;
  aspect?: string;
  frame?: MediaFrame;
  from?: "bottom" | "top" | "left" | "right";
  delay?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion still reveals — the image must end up visible — but with no wipe and no
    // scale. Skipping straight to the revealed class is that.
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (delay) {
          const timer = window.setTimeout(() => setRevealed(true), delay);
          // Stored on the element so the cleanup below can reach it without another ref.
          el.dataset.revealTimer = String(timer);
        } else {
          setRevealed(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      const timer = el.dataset.revealTimer;
      if (timer) window.clearTimeout(Number(timer));
    };
  }, [delay, prefersReducedMotion]);

  const radius = frame === "soft" ? "rounded-2xl" : "rounded-none";

  return (
    <div
      ref={ref}
      className={`media-frame ${revealed ? "is-revealed" : ""} relative overflow-hidden ${radius} ${aspect} ${className ?? ""}`}
      data-from={from}
    >
      {video && !prefersReducedMotion ? (
        <div className="media-inner absolute inset-0">
          {/* role="img" because this carries the same information a photograph in this slot
              would: it is described once, by `alt`, rather than announced as a player the
              reader can operate. */}
          <video
            src={video}
            poster={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            role="img"
            aria-label={alt}
            className="h-full w-full object-cover"
          />
        </div>
      ) : src ? (
        <div className="media-inner absolute inset-0">
          <Image
            src={src}
            alt={alt ?? ""}
            fill
            sizes={sizes}
            priority={priority}
            // Everything except an explicitly prioritised slot loads lazily. next/image defaults
            // to lazy already; stating it keeps the intent visible at the one place someone
            // would go looking after a Lighthouse complaint.
            loading={priority ? undefined : "lazy"}
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className="media-inner absolute inset-0 flex items-end justify-between gap-4 bg-[var(--color-surface)] p-4"
          style={{
            // A faint 32px grid. Reads as a measured, specified area rather than as a gap —
            // the difference between "not finished" and "not started".
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        >
          {/* Corner brackets — two opposite corners only. Four reads as a crop tool; two reads
              as a registration mark. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l border-t border-[var(--color-cherry)]/50"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b border-r border-[var(--color-cherry)]/50"
          />
          <span className="relative font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            {label}
          </span>
        </div>
      )}

      {/* Hairline, drawn over the content so it survives the inner layer's scale. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${radius} border border-[var(--color-border)]`}
      />
    </div>
  );
}
