"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

/**
 * A one-question "guess the stat" slider under the First Impressions band.
 *
 * It isn't a quiz and doesn't score anyone. The point is that a number you guessed at sticks
 * harder than a number you read, so the visitor commits to a guess before the fact is shown.
 * A right guess is flattered ("you know how important this is"); a wrong one flashes red, then
 * the fill slides to the real answer with the fact underneath. Either way it's answered once
 * and then stays put: a second go would turn a point into a game.
 *
 * The track is a custom `role="slider"` rather than a native range input because a native
 * range commits on every step: dragging or arrowing through 40 on the way to 75 would lock in
 * 40. Here moving only previews, and the guess is committed on release (pointer) or Enter/Space
 * (keyboard).
 */
const ANSWER = 75;
const STEP = 5;
const MIN = 5;
const MAX = 100;
const TICKS = Array.from({ length: MAX / STEP }, (_, i) => (i + 1) * STEP);

/** How long the wrong guess flashes red before the fill slides to the answer. */
const MISS_FLASH_MS = 700;

type Phase = "idle" | "miss" | "revealed" | "hit";

function clampToStep(value: number) {
  return Math.min(MAX, Math.max(MIN, Math.round(value / STEP) * STEP));
}

export function CredibilityGuess() {
  const questionId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<number | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const missTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(missTimer.current), []);

  const locked = phase !== "idle";

  function valueAt(clientX: number) {
    const rect = trackRef.current!.getBoundingClientRect();
    return clampToStep(((clientX - rect.left) / rect.width) * MAX);
  }

  function commit(value: number) {
    setGuess(value);
    if (value === ANSWER) {
      setPhase("hit");
      return;
    }
    setPhase("miss");
    missTimer.current = window.setTimeout(() => setPhase("revealed"), MISS_FLASH_MS);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (locked) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setPreview(valueAt(event.clientX));
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (locked) return;
    // A mouse previews on hover; touch only previews while the finger is down.
    if (dragging || event.pointerType === "mouse") setPreview(valueAt(event.clientX));
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (locked || !dragging) return;
    setDragging(false);
    commit(valueAt(event.clientX));
  }

  function onPointerLeave() {
    if (!locked && !dragging) setPreview(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (locked) return;
    const current = preview ?? 50;
    const next: Record<string, number> = {
      ArrowRight: current + STEP,
      ArrowUp: current + STEP,
      ArrowLeft: current - STEP,
      ArrowDown: current - STEP,
      Home: MIN,
      End: MAX,
    };
    if (event.key in next) {
      event.preventDefault();
      setPreview(clampToStep(next[event.key]));
    } else if ((event.key === "Enter" || event.key === " ") && preview !== null) {
      event.preventDefault();
      commit(preview);
    }
  }

  const shown =
    phase === "idle" ? preview : phase === "miss" ? guess : ANSWER;
  const missed = phase === "miss";

  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
        + Take a guess
      </p>
      <p
        id={questionId}
        className="display-face text-balance text-[clamp(1.35rem,3vw,2rem)] leading-tight tracking-tight"
      >
        How many people judge a company&apos;s credibility on its website design alone?
      </p>

      {/* Readout. Fixed-width digits so the number doesn't shuffle the layout as it changes. */}
      <p
        aria-hidden="true"
        className={`display-face mt-8 text-[clamp(3rem,9vw,5.5rem)] leading-none tabular-nums transition-colors duration-200 ${
          missed ? "text-[var(--color-miss)]" : "text-[var(--color-white)]"
        }`}
      >
        {shown === null ? "?" : shown}
        <span className={missed ? "" : "text-[var(--color-cherry)]"}>%</span>
      </p>

      <div
        ref={trackRef}
        role="slider"
        tabIndex={locked ? -1 : 0}
        aria-labelledby={questionId}
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={shown ?? undefined}
        aria-valuetext={shown === null ? "No guess yet" : `${shown}%`}
        aria-disabled={locked}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setDragging(false)}
        onPointerLeave={onPointerLeave}
        onKeyDown={onKeyDown}
        className={`relative mt-8 touch-none select-none py-4 ${
          locked ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <div
          className={`relative h-3 rounded-full border transition-colors duration-200 ${
            missed
              ? "border-[var(--color-miss)] bg-[color-mix(in_srgb,var(--color-miss)_12%,transparent)]"
              : "border-[var(--color-border)] bg-[var(--color-paper)]"
          }`}
        >
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${missed ? "credibility-miss" : ""}`}
            style={{
              width: `${shown ?? 0}%`,
              background: missed ? "var(--color-miss)" : "var(--color-button-primary-bg)",
              // Quick while previewing so it tracks the pointer; slow for the slide to 75.
              transition: `width ${phase === "revealed" ? 600 : 120}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          />
          {/* Where the wrong guess landed, left behind once the fill moves to the answer. */}
          {phase === "revealed" && guess !== null && (
            <div
              aria-hidden="true"
              className="absolute top-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-miss)]"
              style={{ left: `${guess}%` }}
            />
          )}
        </div>

        <div aria-hidden="true" className="relative mt-3 h-4">
          {TICKS.map((tick) => {
            const labelled = tick % 25 === 0;
            return (
              <span
                key={tick}
                className="absolute top-0 -translate-x-1/2"
                style={{ left: `${tick}%` }}
              >
                <span
                  className={`mx-auto block w-px ${
                    labelled ? "h-2 bg-[var(--color-muted)]" : "h-1 bg-[var(--color-border)]"
                  }`}
                />
                {labelled && (
                  <span className="mt-1 block text-[0.65rem] tabular-nums text-[var(--color-muted)]">
                    {tick}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Result. Reserved height so the section doesn't jump when the answer appears. */}
      <div aria-live="polite" className="mt-10 min-h-[5.5rem] sm:min-h-[4.5rem]">
        {phase === "idle" && (
          <p className="text-sm text-[var(--color-muted)]">
            Pick a spot on the bar to lock in your guess.
          </p>
        )}
        {phase === "hit" && (
          <p className="credibility-result mx-auto max-w-lg text-base leading-relaxed sm:text-lg">
            <span className="font-semibold text-[var(--color-cherry)]">Spot on.</span> You really
            know your stuff. You must know how important this is.
          </p>
        )}
        {phase === "revealed" && (
          <p className="credibility-result mx-auto max-w-lg text-base leading-relaxed sm:text-lg">
            <span className="font-semibold text-[var(--color-cherry)]">It&apos;s 75%.</span>{" "}
            Three in four people judge a company&apos;s credibility on its website design
            alone.
          </p>
        )}
      </div>
    </div>
  );
}
