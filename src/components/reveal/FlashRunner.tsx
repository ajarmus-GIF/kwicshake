"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { World } from "@/lib/worlds";
import { useLenis } from "@/components/scroll/SmoothScroll";
import { BrowserFrame, MiniSite, PhoneFrame } from "./MiniSite";

/**
 * The 50ms flash, shared by the homepage run (moment 02) and the /traditional PerceptionTest:
 * a 3-2-1 countdown, then one site on screen for 50 milliseconds, then `onDone`.
 *
 * Why it's built this way, since "it didn't work on my phone" is the failure it exists to fix:
 *
 * · The countdown sits exactly where the site will appear. Without it, the flash fired the
 *   instant the button was tapped, while a thumb was still covering the screen and the eyes were
 *   on the button, so on a phone it came and went unseen.
 * · The site is rendered from the first frame of the countdown, just invisible, so the flash
 *   has nothing left to lay out or paint when it's shown: it appears on the very next frame.
 *   That also means the countdown and the flash occupy the same box, so nothing jumps.
 * · Before counting, the box is scrolled into view, so on a short phone screen the flash can't
 *   land below the fold.
 * · Phones see the phone version of the site in a phone frame, which is what a customer on a
 *   phone actually sees; a desktop page shrunk to 340px is too small to register at all.
 * · The 50ms is timed from the first frame the site is actually on screen (the second
 *   animation frame after it's shown) and ends on the first frame boundary at or past 50ms.
 *   That holds on 60Hz screens (3 frames), 120Hz phones (6 frames) and iPhones in Low Power
 *   Mode, which drop to 30Hz (2 frames, the closest a 30Hz screen can get).
 */
export const FLASH_MS = 50;
const COUNT_STEP_MS = 700;
/** Frame timestamps jitter by a millisecond or two; without slack a 60Hz screen would round a
 *  49.9ms third frame up to a fourth (67ms). */
const FRAME_SLACK_MS = 4;

export function FlashRunner({
  world,
  generic,
  url,
  eyebrow,
  onDone,
}: {
  world: World;
  generic: boolean;
  url: string;
  eyebrow: string;
  onDone: () => void;
}) {
  const [step, setStep] = useState<3 | 2 | 1 | "flash">(3);
  const box = useRef<HTMLDivElement>(null);
  const site = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });

  // Bring the whole block (label, box, caption) into view below the sticky header, centred in
  // the space that's left, then count down.
  useEffect(() => {
    const el = box.current;
    if (el) {
      const header = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      const r = el.getBoundingClientRect();
      if (r.top < header || r.bottom > window.innerHeight) {
        // An absolute target from the real scroll position: handing Lenis the element makes it
        // measure against its own (possibly stale) scroll value, which lands it off by however
        // far the two have drifted.
        const top =
          window.scrollY + r.top - header - Math.max(0, (window.innerHeight - header - r.height) / 2);
        if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
        else window.scrollTo({ top, behavior: "instant" });
      }
    }
    const timers = [
      window.setTimeout(() => setStep(2), COUNT_STEP_MS),
      window.setTimeout(() => setStep(1), COUNT_STEP_MS * 2),
      window.setTimeout(() => setStep("flash"), COUNT_STEP_MS * 3),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
    // Runs once per flash; lenis is read at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The flash itself, timed in frames rather than with a bare setTimeout. A layout effect, not a
  // passive one: it runs before the browser paints the now-visible site, so the first frame
  // callback below lands on the very frame that shows it. A passive effect usually runs after
  // that paint and would start the clock a frame late (~67ms on screen instead of 50).
  useLayoutEffect(() => {
    if (step !== "flash") return;
    let raf = 0;
    let shownAt = 0;
    const tick = (now: number) => {
      if (!shownAt) {
        // This frame is the one that paints the site; the clock starts here.
        shownAt = now;
      } else if (now - shownAt >= FLASH_MS - FRAME_SLACK_MS) {
        // Hide it here, in this frame's callback, before this frame paints. Leaving it to React
        // isn't enough: a state update made outside an event handler is committed in a later
        // task, after this frame has painted, which keeps the site up one frame too long
        // (measured: 67ms instead of 50 at 60Hz). React never writes this style back, since
        // the prop it renders stays "visible" until the component unmounts.
        if (site.current) site.current.style.visibility = "hidden";
        done.current();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  const flashing = step === "flash";

  return (
    <div ref={box} className="flex flex-col items-center">
      <p className="eyebrow mb-6">{eyebrow}</p>
      <div className="relative w-full">
        {/* The site, rendered from the start of the countdown but only visible during the flash. */}
        <div ref={site} style={{ visibility: flashing ? "visible" : "hidden" }} aria-hidden={!flashing}>
          <PhoneFrame className="mx-auto w-[min(15rem,calc((100svh-17rem)*9/19))] sm:hidden">
            <MiniSite world={world} generic={generic} layout="phone" />
          </PhoneFrame>
          <BrowserFrame url={url} className="mx-auto hidden max-w-3xl sm:block">
            <MiniSite world={world} generic={generic} layout="desktop" />
          </BrowserFrame>
        </div>

        {!flashing && (
          <div aria-live="assertive" className="absolute inset-0 grid place-items-center">
            <span
              key={step}
              className="countdown-pop display-face text-[clamp(5rem,22vw,10rem)] leading-none text-[var(--color-cherry)]"
            >
              {step}
            </span>
          </div>
        )}
      </div>
      <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">
        {flashing ? " " : "Eyes here"}
      </p>
    </div>
  );
}
