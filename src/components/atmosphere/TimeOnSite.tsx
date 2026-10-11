"use client";

import { useEffect, useState } from "react";

/**
 * "You've already been here for 5:00" — a white clock in the bottom-left corner that shows up
 * at a few milestones of time spent on the site, plays a short sequence, then hides again.
 *
 * Counts wall-clock time since the visitor's first page in this tab (sessionStorage), so it
 * carries across page changes and reloads but starts over in a new tab.
 *
 * Each milestone plays the same 30-second sequence, measured from the milestone:
 *   0–8s    large, bold, label + time on a dark frosted pill (so it's noticed)
 *   8–15s   shrinks to small bold white label + time, no background, text shadow only
 *   15–30s  the label goes; just the running time
 *   30s     fades out until the next milestone
 * Live milestones are 5, 10, 15, 20, 30 and 45 minutes. In `next dev` (the test tunnel) they're
 * compressed to 0, 1, 2, 3, 5 and 8 minutes so the whole thing can be judged without waiting.
 *
 * Bottom-left because the Wins and concept feeds put their position counter bottom-right.
 * Decorative (aria-hidden): a clock ticking every second would be noise to a screen reader.
 */
const MIN = 60 * 1000;
const MILESTONES =
  process.env.NODE_ENV === "development"
    ? [0, 1, 2, 3, 5, 8].map((m) => m * MIN)
    : [5, 10, 15, 20, 30, 45].map((m) => m * MIN);
const BIG_MS = 8 * 1000;
const LABEL_MS = 15 * 1000;
const SHOWN_MS = 30 * 1000;
const FADE_MS = 1000;
const KEY = "ks-arrived-at";

function arrivedAt(): number {
  try {
    const stored = Number(sessionStorage.getItem(KEY));
    if (stored > 0) return stored;
    const now = Date.now();
    sessionStorage.setItem(KEY, String(now));
    return now;
  } catch {
    return Date.now();
  }
}

function format(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export function TimeOnSite() {
  const [elapsed, setElapsed] = useState<number | null>(null);

  useEffect(() => {
    const start = arrivedAt();
    const tick = () => setElapsed(Date.now() - start);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Nothing renders on the server or between milestones, so there's no hydration mismatch and
  // no empty box sitting in the corner.
  if (elapsed === null) return null;
  const milestone = [...MILESTONES].reverse().find((m) => elapsed >= m);
  if (milestone === undefined) return null;
  const t = elapsed - milestone;
  if (t >= SHOWN_MS + FADE_MS) return null;

  const big = t < BIG_MS;
  const label = t < LABEL_MS;
  const fading = t >= SHOWN_MS;

  return (
    <div
      aria-hidden="true"
      className={`time-on-site pointer-events-none fixed bottom-4 left-4 z-[9000] rounded-2xl border text-[var(--color-white)] transition-all duration-700 ease-out motion-reduce:transition-none sm:bottom-5 sm:left-5 ${fading ? "opacity-0" : "opacity-100"} ${
        big
          ? "border-[var(--color-white)]/20 bg-black/60 px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
          : "border-transparent bg-transparent p-0 shadow-none [text-shadow:0_1px_3px_rgba(0,0,0,0.75),0_0_12px_rgba(0,0,0,0.5)]"
      }`}
    >
      <p
        className={`font-mono font-bold uppercase transition-all duration-700 ease-out motion-reduce:transition-none ${
          big ? "text-[0.65rem] tracking-[0.15em] sm:text-[0.7rem]" : "text-[0.55rem] tracking-[0.2em]"
        } ${label ? "max-h-10 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
      >
        You&apos;ve already been here for
      </p>
      <p
        className={`font-mono font-bold tabular-nums leading-tight transition-all duration-700 ease-out motion-reduce:transition-none ${
          big ? "mt-0.5 text-2xl sm:text-[1.75rem]" : "text-sm"
        }`}
      >
        {format(elapsed)}
      </p>
    </div>
  );
}
