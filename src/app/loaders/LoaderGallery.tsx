"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./loaders.module.css";

/**
 * Side-by-side previews of five loading-screen candidates. Each plays over a mock of the real
 * homepage hero, so the judgement is about the whole hand-off (loader, then site), not the
 * loader in isolation. "Replay" remounts it; "Full screen" plays it over the whole viewport,
 * which is the size it would actually run at.
 */

type Option = {
  name: string;
  note: string;
  Loader: (props: { onDone: () => void }) => ReactNode;
};

const options: Option[] = [
  {
    name: "1 · The Shake",
    note: "The wordmark rises, “Shake” gives a quick shake, then the panel lifts away like the page transitions already do. The name as the animation.",
    Loader: ShakeLoader,
  },
  {
    name: "2 · Pixel Bloom",
    note: "The glowing purple squares from the site's photography pop in around the wordmark and drift off as the page fades up. Ties the loader to the imagery.",
    Loader: PixelLoader,
  },
  {
    name: "3 · Counter",
    note: "A big 000 → 100 count with a hairline filling underneath, then the panel lifts. The classic agency loader; reads as “something is being built”.",
    Loader: CounterLoader,
  },
  {
    name: "4 · Split",
    note: "“Don't read this website.” lands, then the screen parts down the middle onto the page. Puts the homepage's line to work before the page is even there.",
    Loader: SplitLoader,
  },
  {
    name: "5 · Scan",
    note: "A chartreuse line sweeps down, drawing the wordmark as it passes, then wipes the loader away. Uses the action colour, so it previews the buttons.",
    Loader: ScanLoader,
  },
];

const LOADER_MS = 2400;

export function LoaderGallery() {
  const [runs, setRuns] = useState(() => options.map(() => 0));
  const [full, setFull] = useState<number | null>(null);

  const replay = (i: number) => setRuns((r) => r.map((n, j) => (j === i ? n + 1 : n)));

  return (
    <>
      <div className="grid gap-12 md:grid-cols-2">
        {options.map((o, i) => (
          <figure key={o.name}>
            <Stage key={runs[i]} Loader={o.Loader} />
            <figcaption className="mt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl text-[var(--color-white)]">{o.name}</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => replay(i)}
                    className="rounded-full border border-[var(--color-ash-40)] px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-ink)] hover:border-[var(--color-cherry)]"
                  >
                    Replay
                  </button>
                  <button
                    type="button"
                    onClick={() => setFull(i)}
                    className="rounded-full border border-[var(--color-ash-40)] px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-ink)] hover:border-[var(--color-cherry)]"
                  >
                    Full screen
                  </button>
                </div>
              </div>
              <p className="mt-2 leading-relaxed text-[var(--color-muted)]">{o.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {full !== null && (
        <FullScreen key={full} Loader={options[full].Loader} onClose={() => setFull(null)} />
      )}
    </>
  );
}

function Stage({ Loader }: { Loader: Option["Loader"] }) {
  const [done, setDone] = useState(false);
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--color-border)]">
      <MockPage />
      {!done && <Loader onDone={() => setDone(true)} />}
    </div>
  );
}

function FullScreen({ Loader, onClose }: { Loader: Option["Loader"]; onClose: () => void }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(onClose, 900);
    return () => window.clearTimeout(t);
  }, [done, onClose]);

  return (
    <div className="fixed inset-0 z-50" onClick={onClose} role="presentation">
      <MockPage />
      {!done && <Loader onDone={() => setDone(true)} />}
    </div>
  );
}

/** A stand-in for the homepage hero, so each loader is seen handing off to the real look. */
function MockPage() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_70%_55%_at_50%_75%,var(--color-glow),transparent_70%)] bg-[var(--color-paper)] px-6 text-center">
      <div>
        <p className="eyebrow mb-3">+ A one-minute experiment</p>
        <p className="display-face text-[clamp(1.4rem,4.5vw,3.2rem)] leading-[0.95] text-[var(--color-white)]">
          Don&apos;t read this website. <span className="text-[var(--color-cherry)]">Use it.</span>
        </p>
      </div>
    </div>
  );
}

function Wordmark({ className = "", shakeClass = "" }: { className?: string; shakeClass?: string }) {
  return (
    <p className={`brand-wordmark text-[clamp(1.4rem,5vw,3rem)] tracking-tight ${className}`}>
      <span className="text-[var(--color-white)]">Kwic </span>
      <span className={`brand-shake ${shakeClass}`}>Shake</span>
    </p>
  );
}

/** Hides the layer once its animation has run, so it stops covering the page. */
function useDone(onDone: () => void) {
  // Held in a ref so a re-render (the counter re-renders every frame) never restarts the timer.
  const latest = useRef(onDone);
  useEffect(() => {
    latest.current = onDone;
  });
  useEffect(() => {
    const t = window.setTimeout(() => latest.current(), LOADER_MS);
    return () => window.clearTimeout(t);
  }, []);
}

function ShakeLoader({ onDone }: { onDone: () => void }) {
  useDone(onDone);
  return (
    <div className={`${s.layer} ${s.shakeLayer}`} aria-hidden="true">
      <Wordmark className={s.shakeMark} shakeClass={s.shakeWord} />
    </div>
  );
}

// Fixed positions (not random) so the bloom looks composed and every replay matches.
const pixels = [
  [18, 22, 26, 0], [74, 18, 18, 60], [10, 64, 14, 120], [84, 58, 28, 40], [30, 80, 16, 160],
  [62, 78, 12, 90], [46, 14, 10, 200], [90, 32, 12, 140], [22, 44, 10, 240], [70, 42, 16, 180],
  [52, 88, 20, 30], [6, 30, 18, 260],
];

function PixelLoader({ onDone }: { onDone: () => void }) {
  useDone(onDone);
  return (
    <div className={`${s.layer} ${s.pixelLayer}`} aria-hidden="true">
      {pixels.map(([x, y, size, delay]) => (
        <span
          key={`${x}-${y}`}
          className={s.pixel}
          style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${delay}ms, ${500 + delay}ms` }}
        />
      ))}
      <Wordmark className={s.pixelMark} />
    </div>
  );
}

function CounterLoader({ onDone }: { onDone: () => void }) {
  useDone(onDone);
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1400, 1);
      // Ease-in-out, matching the bar underneath.
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setN(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`${s.layer} ${s.counterLayer}`} aria-hidden="true">
      <div>
        <p className="brand-wordmark mb-2 text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">
          Kwic Shake
        </p>
        <p className="display-face text-[clamp(3rem,14vw,9rem)] leading-none tabular-nums text-[var(--color-white)]">
          {String(n).padStart(3, "0")}
        </p>
      </div>
      <span className={s.counterBar} />
    </div>
  );
}

function SplitLoader({ onDone }: { onDone: () => void }) {
  useDone(onDone);
  return (
    <div className={`${s.layer} ${s.splitLayer}`} aria-hidden="true">
      <span className={`${s.splitHalf} ${s.splitTop}`} />
      <span className={`${s.splitHalf} ${s.splitBottom}`} />
      <p className="display-face relative px-6 text-center text-[clamp(1.4rem,4.5vw,3.2rem)] leading-[0.95] text-[var(--color-white)]">
        <span className={`${s.splitLine} block`} style={{ ["--delay" as string]: "0.1s" }}>
          Don&apos;t read
        </span>
        <span className={`${s.splitLine} block text-[var(--color-cherry)]`} style={{ ["--delay" as string]: "0.35s" }}>
          this website.
        </span>
      </p>
    </div>
  );
}

function ScanLoader({ onDone }: { onDone: () => void }) {
  useDone(onDone);
  return (
    <div className={`${s.layer} ${s.scanLayer}`} aria-hidden="true">
      <Wordmark className={s.scanMark} />
      <span className={s.scanTrack}>
        <span className={`${s.scanLine} block`} />
      </span>
    </div>
  );
}
