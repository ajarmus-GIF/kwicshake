"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

/**
 * The home page's credibility slider (components/home/CredibilityGuess.tsx), generalised so the
 * Concept 3 run can ask more than one "guess the stat" question with the same feel: move to
 * preview, release (or Enter) to commit, a miss flashes red and the fill slides to the truth,
 * leaving a marker where you guessed. Answered once, then it stays put.
 *
 * `tolerance` widens what counts as a hit — a guess within ±tolerance of the answer is "spot on".
 */
const MISS_FLASH_MS = 700;
type Phase = "idle" | "miss" | "revealed" | "hit";

export function StatGuess({
  question,
  answer,
  step = 5,
  min = 0,
  max = 100,
  tolerance = 0,
  unit = "%",
  hitText,
  revealText,
  source,
  onDone,
}: {
  question: ReactNode;
  answer: number;
  step?: number;
  min?: number;
  max?: number;
  tolerance?: number;
  unit?: string;
  hitText: ReactNode;
  revealText: ReactNode;
  source: { label: string; href: string };
  onDone?: (guess: number, hit: boolean) => void;
}) {
  const questionId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<number | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const locked = phase !== "idle";
  const range = max - min;
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));
  const pct = (v: number) => ((v - min) / range) * 100;

  function valueAt(clientX: number) {
    const rect = trackRef.current!.getBoundingClientRect();
    return clamp(min + ((clientX - rect.left) / rect.width) * range);
  }

  function commit(value: number) {
    setGuess(value);
    const hit = Math.abs(value - answer) <= tolerance;
    if (hit) {
      setPhase("hit");
      onDone?.(value, true);
      return;
    }
    setPhase("miss");
    timer.current = window.setTimeout(() => {
      setPhase("revealed");
      onDone?.(value, false);
    }, MISS_FLASH_MS);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (locked) return;
    const current = preview ?? clamp(min + range / 2);
    const next: Record<string, number> = {
      ArrowRight: current + step,
      ArrowUp: current + step,
      ArrowLeft: current - step,
      ArrowDown: current - step,
      Home: min,
      End: max,
    };
    if (event.key in next) {
      event.preventDefault();
      setPreview(clamp(next[event.key]));
    } else if ((event.key === "Enter" || event.key === " ") && preview !== null) {
      event.preventDefault();
      commit(preview);
    }
  }

  const shown = phase === "idle" ? preview : phase === "miss" ? guess : answer;
  const missed = phase === "miss";
  const labelEvery = range / 4;

  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <p id={questionId} className="display-face text-balance text-[clamp(1.35rem,3vw,2rem)] leading-tight">
        {question}
      </p>

      <p
        aria-hidden="true"
        className={`display-face mt-8 text-[clamp(3rem,9vw,5.5rem)] leading-none tabular-nums transition-colors duration-200 ${
          missed ? "text-[var(--color-miss)]" : "text-[var(--color-white)]"
        }`}
      >
        {shown === null ? "?" : shown}
        <span className={missed ? "" : "text-[var(--color-cherry)]"}>{unit}</span>
      </p>

      <div
        ref={trackRef}
        role="slider"
        tabIndex={locked ? -1 : 0}
        aria-labelledby={questionId}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={shown ?? undefined}
        aria-valuetext={shown === null ? "No guess yet" : `${shown}${unit}`}
        aria-disabled={locked}
        onPointerDown={(e: PointerEvent<HTMLDivElement>) => {
          if (locked) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          setPreview(valueAt(e.clientX));
        }}
        onPointerMove={(e: PointerEvent<HTMLDivElement>) => {
          if (locked) return;
          if (dragging || e.pointerType === "mouse") setPreview(valueAt(e.clientX));
        }}
        onPointerUp={(e: PointerEvent<HTMLDivElement>) => {
          if (locked || !dragging) return;
          setDragging(false);
          commit(valueAt(e.clientX));
        }}
        onPointerCancel={() => setDragging(false)}
        onPointerLeave={() => {
          if (!locked && !dragging) setPreview(null);
        }}
        onKeyDown={onKeyDown}
        className={`relative mt-8 touch-none select-none py-4 ${locked ? "cursor-default" : "cursor-pointer"}`}
      >
        <div
          className={`relative h-3 rounded-full border transition-colors duration-200 ${
            missed
              ? "border-[var(--color-miss)] bg-[color-mix(in_srgb,var(--color-miss)_12%,transparent)]"
              : "border-[var(--color-ash-40)] bg-[var(--color-paper)]"
          }`}
        >
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${missed ? "credibility-miss" : ""}`}
            style={{
              width: `${shown === null ? 0 : pct(shown)}%`,
              background: missed ? "var(--color-miss)" : "var(--color-button-primary-bg)",
              transition: `width ${phase === "revealed" ? 600 : 120}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          />
          {phase === "revealed" && guess !== null && (
            <div
              aria-hidden="true"
              className="absolute top-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-miss)]"
              style={{ left: `${pct(guess)}%` }}
            />
          )}
        </div>
        <div aria-hidden="true" className="relative mt-3 h-4">
          {[0, 1, 2, 3, 4].map((i) => {
            const v = min + i * labelEvery;
            return (
              <span key={i} className="absolute top-0 -translate-x-1/2" style={{ left: `${i * 25}%` }}>
                <span className="mx-auto block h-2 w-px bg-[var(--color-muted)]" />
                <span className="mt-1 block text-[0.65rem] tabular-nums text-[var(--color-muted)]">
                  {Math.round(v)}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div aria-live="polite" className="mt-8 min-h-[4.5rem]">
        {phase === "idle" && (
          <p className="text-sm text-[var(--color-muted)]">Slide and let go to lock in your guess.</p>
        )}
        {phase === "hit" && (
          <p className="credibility-result mx-auto max-w-lg text-base leading-relaxed sm:text-lg">
            <span className="font-semibold text-[var(--color-cherry)]">Spot on.</span> {hitText}
          </p>
        )}
        {phase === "revealed" && (
          <p className="credibility-result mx-auto max-w-lg text-base leading-relaxed sm:text-lg">{revealText}</p>
        )}
      </div>
      <p className="mt-2 text-[0.7rem] text-[var(--color-muted)]">
        Source:{" "}
        <a
          href={source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[var(--color-cherry)] underline-offset-2 hover:text-[var(--color-cherry)]"
        >
          {source.label}
        </a>
      </p>
    </div>
  );
}
