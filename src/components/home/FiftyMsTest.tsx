"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "See for yourself": two screens, each with a play button that counts down 3-2-1 and then
 * shows a page for 50ms, the time the line above says a first impression takes. The left one
 * is a deliberately awful old website, the right one is our own "They buy because they
 * believe." line in the site's style. Once both have played, the screens leave and the title
 * becomes "See what we're saying?".
 *
 * The point lands because the visitor can't read either screen in 50ms and still comes away
 * with a verdict on both. That's the whole argument, felt rather than told.
 *
 * Timing is measured against `performance.now()` inside rAF rather than a bare 50ms
 * setTimeout: a timer can fire late under load and leave the flash up long enough to read,
 * which would quietly break the demonstration. The flash is taken down on the first frame at or
 * past 50ms (3 frames at 60Hz).
 *
 * One flash per screen, well under the three-flashes-a-second photosensitivity threshold.
 */
const FLASH_MS = 50;
const COUNT_STEP_MS = 700;
/** Pause after the second screen before the pair leaves, so the flash isn't cut by the exit. */
const OUTRO_DELAY_MS = 1100;

type Stage = "idle" | 3 | 2 | 1 | "flash" | "seen";

export function FiftyMsTest() {
  const [stages, setStages] = useState<[Stage, Stage]>(["idle", "idle"]);
  const [finished, setFinished] = useState(false);
  const timers = useRef<number[]>([]);
  const frames = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    const f = frames.current;
    return () => {
      t.forEach(window.clearTimeout);
      f.forEach(window.cancelAnimationFrame);
    };
  }, []);

  const bothSeen = stages[0] === "seen" && stages[1] === "seen";
  useEffect(() => {
    if (!bothSeen) return;
    const id = window.setTimeout(() => setFinished(true), OUTRO_DELAY_MS);
    timers.current.push(id);
  }, [bothSeen]);

  function setStage(index: 0 | 1, stage: Stage) {
    setStages((prev) => {
      const next: [Stage, Stage] = [...prev];
      next[index] = stage;
      return next;
    });
  }

  function play(index: 0 | 1) {
    setStage(index, 3);
    timers.current.push(
      window.setTimeout(() => setStage(index, 2), COUNT_STEP_MS),
      window.setTimeout(() => setStage(index, 1), COUNT_STEP_MS * 2),
      window.setTimeout(() => flash(index), COUNT_STEP_MS * 3)
    );
  }

  function flash(index: 0 | 1) {
    setStage(index, "flash");
    let start: number | undefined;
    const tick = (now: number) => {
      // Start the clock on the first frame the flash is actually painted, not at setState.
      start ??= now;
      if (now - start >= FLASH_MS) {
        setStage(index, "seen");
        return;
      }
      frames.current.push(window.requestAnimationFrame(tick));
    };
    frames.current.push(window.requestAnimationFrame(tick));
  }

  return (
    <div className="mx-auto mt-16 max-w-3xl sm:mt-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
        + 50ms test
      </p>
      <h3
        key={finished ? "after" : "before"}
        className={`mt-3 text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight tracking-tight ${
          finished ? "fifty-title-pop" : ""
        }`}
        aria-live="polite"
      >
        {finished ? (
          <>
            See what we&apos;re <span className="text-[var(--color-cherry)]">saying?</span>
          </>
        ) : (
          "See for yourself."
        )}
      </h3>

      {!finished && (
        <div
          className={`mt-8 grid grid-cols-2 gap-3 transition-all duration-700 sm:gap-6 ${
            bothSeen ? "pointer-events-none translate-y-4 opacity-0 delay-500" : ""
          }`}
        >
          <Screen label="Screen one" stage={stages[0]} onPlay={() => play(0)}>
            <BadSite />
          </Screen>
          <Screen label="Screen two" stage={stages[1]} onPlay={() => play(1)}>
            <GoodSite />
          </Screen>
        </div>
      )}
    </div>
  );
}

function Screen({
  label,
  stage,
  onPlay,
  children,
}: {
  label: string;
  stage: Stage;
  onPlay: () => void;
  children: React.ReactNode;
}) {
  const counting = stage === 3 || stage === 2 || stage === 1;
  return (
    <div>
      {/* A bare browser frame, so both flashes read as "a website" rather than a slide. */}
      <div className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-raised)] shadow-[0_0_50px_-25px_var(--color-glow)]">
        <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]/50 sm:h-2 sm:w-2" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]/50 sm:h-2 sm:w-2" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]/50 sm:h-2 sm:w-2" />
        </div>
        <div className="relative aspect-[4/3] [container-type:inline-size]">
          {stage === "flash" && (
            <div aria-hidden="true" className="absolute inset-0">
              {children}
            </div>
          )}

          {stage === "idle" && (
            <button
              type="button"
              onClick={onPlay}
              aria-label={`Play ${label}`}
              className="group absolute inset-0 grid place-items-center"
            >
              <span className="btn-primary grid h-12 w-12 place-items-center rounded-full transition-transform duration-200 group-hover:scale-110 sm:h-16 sm:w-16">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-[var(--color-white)] sm:h-6 sm:w-6">
                  <path d="M7 4.5v15a.5.5 0 0 0 .77.42l11.5-7.5a.5.5 0 0 0 0-.84L7.77 4.08A.5.5 0 0 0 7 4.5Z" />
                </svg>
              </span>
            </button>
          )}

          {counting && (
            <span
              key={stage}
              aria-live="assertive"
              className="fifty-count display-face absolute inset-0 grid place-items-center text-[clamp(2.5rem,8vw,4.5rem)] text-[var(--color-white)]"
            >
              {stage}
            </span>
          )}

          {stage === "seen" && (
            <span className="absolute inset-0 grid place-items-center text-xs uppercase tracking-widest text-[var(--color-muted)]">
              That was 50ms
            </span>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">{label}</p>
    </div>
  );
}

/**
 * The bad one: every late-90s sin at once. Sized in container units so it composes the same in
 * a 160px phone card as in a 360px desktop one. Raw colours are deliberate here: this is a
 * picture of someone else's website, not part of the palette.
 */
function BadSite() {
  return (
    <div
      className="absolute inset-0 overflow-hidden text-left"
      style={{
        background: "repeating-linear-gradient(45deg, #39ff14 0 6cqw, #ffff00 6cqw 12cqw)",
        fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", cursive',
      }}
    >
      <div
        className="border-b-4 border-dashed px-[2cqw] py-[1.5cqw] text-center font-bold"
        style={{ background: "#ff00ff", color: "#00ffff", borderColor: "#ff0000", fontSize: "8cqw", textShadow: "2px 2px #0000ff" }}
      >
        WELCOME 2 OUR WEBSITE!!!
      </div>
      <div
        className="whitespace-nowrap py-[0.8cqw] font-bold"
        style={{ background: "#000", color: "#ff0", fontSize: "4.2cqw", fontFamily: '"Times New Roman", serif' }}
      >
        ★ BEST PRICES IN TOWN ★ CALL NOW ★ BEST PRICES IN TOWN ★ CALL NOW ★
      </div>
      <div className="flex gap-[2cqw] p-[2cqw]">
        <div
          className="grid shrink-0 place-items-center border-2"
          style={{ width: "24cqw", height: "20cqw", background: "#c0c0c0", borderColor: "#808080 #fff #fff #808080", fontSize: "3cqw", color: "#f00" }}
        >
          [ image not found ]
        </div>
        <div style={{ fontSize: "4cqw", lineHeight: 1.15 }}>
          <p style={{ color: "#0000ee", textDecoration: "underline" }}>Click Here!!</p>
          <p style={{ color: "#ff0000", fontFamily: '"Papyrus", fantasy', transform: "rotate(-4deg)" }}>
            Quality Service Since 1998
          </p>
          <p style={{ color: "#800080", fontFamily: '"Times New Roman", serif', fontWeight: 700 }}>
            u will NOT be disapointed
          </p>
        </div>
      </div>
      <div
        className="absolute bottom-[3cqw] left-[3cqw] rotate-[-8deg] border-4 px-[1.5cqw] font-black"
        style={{ background: "#ffa500", borderColor: "#000", color: "#000", fontSize: "4.5cqw", fontFamily: "Impact, sans-serif" }}
      >
        🚧 UNDER CONSTRUCTION 🚧
      </div>
      <div
        className="absolute bottom-[3cqw] right-[3cqw] px-[1cqw]"
        style={{ background: "#000", color: "#0f0", fontSize: "3cqw", fontFamily: "monospace" }}
      >
        visitor #000417
      </div>
    </div>
  );
}

/** The good one: the home page's own "They buy because they believe." line, same treatment. */
function GoodSite() {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden bg-[var(--color-paper)] px-[6cqw]">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90cqw] w-[90cqw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-2xl"
        style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
      />
      <p className="display-face relative text-center text-[9cqw] leading-[1.06] tracking-tight text-[var(--color-ink)]">
        They buy because <span className="text-[var(--color-cherry)]">they believe.</span>
      </p>
    </div>
  );
}
