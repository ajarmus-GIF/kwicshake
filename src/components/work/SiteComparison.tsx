"use client";

import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";

/**
 * Before/after of a real site, shown inside one browser window.
 *
 * Both screenshots sit in the same box with the same `fill` + `object-cover` + object-position,
 * so they are laid out identically and overlay pixel for pixel. The only thing the divider
 * changes is the clip-path on the AFTER layer; neither image is ever resized or moved, which is
 * what makes it read as one site turning into the other rather than two pictures side by side.
 *
 * AFTER is on the left of the divider and BEFORE on the right, so the slider's value is simply
 * "how much of the new site is showing": 0 = all old, 100 = all new, and dragging right wipes
 * the new site across the old one.
 *
 * ── Performance ─────────────────────────────────────────────────────────────────────────────
 * The position never goes through React state. Dragging writes one CSS variable (`--pos`) and
 * the slider's aria values straight onto the DOM, throttled to one write per frame, so a drag
 * costs no re-renders and the clip and the divider can't drift apart.
 *
 * ── Touch ───────────────────────────────────────────────────────────────────────────────────
 * `touch-action: pan-y` keeps vertical page scrolling working over the image. A touch that
 * starts on the image only moves the divider once it turns out to be a horizontal drag, or on
 * release if it was a tap — otherwise every scroll that happened to start on the screenshot
 * would yank the divider to wherever the thumb landed. The handle itself drags immediately.
 *
 * ── Intro ───────────────────────────────────────────────────────────────────────────────────
 * The first time the frame is mostly in view, the divider drifts 50 → 60 → 40 → 50 once, to
 * show it moves. Any interaction cancels it, and reduced motion skips it entirely.
 */
const START = 50;
const INTRO: { to: number; ms: number }[] = [
  { to: 60, ms: 750 },
  { to: 40, ms: 1100 },
  { to: 50, ms: 750 },
];
/** Horizontal travel (px) before a touch on the image counts as a drag rather than a scroll. */
const TOUCH_SLOP = 6;

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function SiteComparison({
  before,
  after,
  width,
  height,
  url,
  title,
}: {
  before: string;
  after: string;
  width: number;
  height: number;
  url: string;
  title: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const pos = useRef(START);
  const frame = useRef(0);
  const introFrame = useRef(0);
  const introDone = useRef(false);
  const drag = useRef<{
    id: number;
    active: boolean;
    startX: number;
    startY: number;
  } | null>(null);

  function apply(value: number) {
    pos.current = clamp(value);
    const viewport = viewportRef.current;
    const handle = handleRef.current;
    if (!viewport || !handle) return;
    viewport.style.setProperty("--pos", `${pos.current}%`);
    const shown = Math.round(pos.current);
    handle.setAttribute("aria-valuenow", String(shown));
    handle.setAttribute("aria-valuetext", `${shown}% redesigned site, ${100 - shown}% original`);
  }

  function applyNextFrame(value: number) {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => apply(value));
  }

  function stopIntro() {
    introDone.current = true;
    cancelAnimationFrame(introFrame.current);
    viewportRef.current?.removeAttribute("data-intro");
  }

  function valueAt(clientX: number) {
    const rect = viewportRef.current!.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function setDragging(on: boolean) {
    viewportRef.current?.toggleAttribute("data-dragging", on);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    stopIntro();
    const onHandle = handleRef.current?.contains(event.target as Node) ?? false;
    const immediate = event.pointerType !== "touch" || onHandle;
    drag.current = {
      id: event.pointerId,
      active: immediate,
      startX: event.clientX,
      startY: event.clientY,
    };
    if (immediate) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
      // Clicking the handle grabs it where it is; clicking anywhere else jumps there.
      if (!onHandle) applyNextFrame(valueAt(event.clientX));
      if (onHandle) handleRef.current?.focus({ preventScroll: true });
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    if (!state.active) {
      const dx = Math.abs(event.clientX - state.startX);
      const dy = Math.abs(event.clientY - state.startY);
      if (dx < TOUCH_SLOP || dx < dy) return;
      state.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    applyNextFrame(valueAt(event.clientX));
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    // A touch that never became a drag or a scroll was a tap: move the divider to it.
    if (!state.active) applyNextFrame(valueAt(event.clientX));
    drag.current = null;
    setDragging(false);
  }

  function onPointerCancel() {
    // Fires when the browser takes a touch over for vertical scrolling. Leave the divider be.
    drag.current = null;
    setDragging(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const big = event.shiftKey ? 10 : 2;
    const next: Record<string, number> = {
      ArrowRight: pos.current + big,
      ArrowUp: pos.current + big,
      ArrowLeft: pos.current - big,
      ArrowDown: pos.current - big,
      PageUp: pos.current + 10,
      PageDown: pos.current - 10,
      Home: 0,
      End: 100,
    };
    if (!(event.key in next)) return;
    event.preventDefault();
    stopIntro();
    apply(next[event.key]);
  }

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    apply(START);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      introDone.current = true;
      return;
    }

    let startTimer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || introDone.current) return;
        observer.disconnect();
        startTimer = window.setTimeout(runIntro, 350);
      },
      { threshold: 0.6 }
    );
    observer.observe(viewport);

    function runIntro() {
      if (introDone.current) return;
      viewport!.setAttribute("data-intro", "");
      let step = 0;
      let from = pos.current;
      let stepStart = performance.now();
      const tick = (now: number) => {
        if (introDone.current) return;
        const { to, ms } = INTRO[step];
        const t = Math.min(1, (now - stepStart) / ms);
        apply(from + (to - from) * ease(t));
        if (t < 1) {
          introFrame.current = requestAnimationFrame(tick);
          return;
        }
        step += 1;
        if (step === INTRO.length) {
          stopIntro();
          return;
        }
        from = to;
        stepStart = now;
        introFrame.current = requestAnimationFrame(tick);
      };
      introFrame.current = requestAnimationFrame(tick);
    }

    return () => {
      observer.disconnect();
      window.clearTimeout(startTimer);
      cancelAnimationFrame(introFrame.current);
      cancelAnimationFrame(frame.current);
    };
    // Runs once on mount; `apply` only touches refs.
  }, []);

  // Wide enough for the frame at full width, and on phones twice that: the mobile crop shows
  // the left half of the screenshot at the frame's height, so the image paints ~2x the frame.
  const sizes = "(max-width: 640px) 200vw, (max-width: 1280px) 100vw, 1200px";
  const layer = "object-cover object-left-top select-none";

  return (
    <figure className="comparison-frame overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Browser chrome: deliberately minimal so the screenshots stay the subject. */}
      <div
        aria-hidden="true"
        className="flex h-9 items-center gap-3 border-b border-[var(--color-border)] px-3 sm:h-11 sm:px-4"
      >
        <div className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-ash-40)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-ash-40)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-ash-40)]" />
        </div>
        <div className="mx-auto flex h-6 w-full max-w-xs items-center justify-center rounded-full bg-[var(--color-paper)] px-3 text-[0.7rem] tracking-wide text-[var(--color-muted)] sm:h-7 sm:text-xs">
          {url}
        </div>
        {/* Balances the traffic lights so the address bar sits truly centred. */}
        <div className="w-[2.625rem] shrink-0" />
      </div>

      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onDragStart={(event) => event.preventDefault()}
        className="comparison-viewport relative aspect-[4/5] cursor-grab touch-pan-y select-none overflow-hidden bg-[var(--color-paper)] sm:aspect-[var(--ratio)]"
        style={
          {
            "--pos": `${START}%`,
            "--ratio": `${width} / ${height}`,
          } as React.CSSProperties
        }
      >
        {/* BEFORE: underneath, always whole. */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={before}
            alt={`${title} — the original website`}
            fill
            sizes={sizes}
            draggable={false}
            className={layer}
          />
          <Label className="right-3 sm:right-5">Before</Label>
        </div>

        {/* AFTER: same box, same fit, only its clip changes. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}
        >
          <Image
            src={after}
            alt={`${title} — the redesigned website`}
            fill
            sizes={sizes}
            draggable={false}
            className={layer}
          />
          <Label className="left-3 sm:left-5">After</Label>
        </div>

        {/* Divider + handle. The handle is the focusable slider; the whole viewport is its hit
            area for pointers. */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-[var(--color-white)] shadow-[0_0_12px_rgba(0,0,0,0.6)]"
          style={{ left: "var(--pos)" }}
        >
          <div
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-label={`Compare the original and redesigned ${title} websites`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={START}
            aria-valuetext={`${START}% redesigned site, ${100 - START}% original`}
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
            onFocus={stopIntro}
            className="comparison-handle btn-primary pointer-events-auto absolute touch-none focus-visible:outline-offset-4 left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--color-white)] text-[var(--color-white)] shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:h-12 sm:w-12"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
              <path
                d="M9 7l-5 5 5 5M15 7l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Label({ children, className }: { children: string; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute bottom-3 rounded-full border border-[var(--color-white)]/25 bg-[var(--color-paper)]/75 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-white)] backdrop-blur-sm sm:bottom-5 ${className}`}
    >
      {children}
    </span>
  );
}
