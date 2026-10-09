"use client";

import { useEffect, useRef, useState } from "react";
import { worlds, worldFaces, type World } from "@/lib/worlds";
import { BrowserFrame, MiniSite, PhoneFrame } from "@/components/reveal/MiniSite";
import { StatGuess } from "./StatGuess";
import { FactCard, Onward, sources } from "./parts";

/**
 * The moments of the Concept 3 run. Each one is something the visitor DOES, and each finishes by
 * handing them a fact they earned. They share one fictional business — whichever kind the visitor
 * picked in the first moment — so the whole run is one customer's story, not a list of demos.
 */

export const pickable = worlds.filter((w) => !w.client);

/** The other businesses in the search results (and a decoy for the memory test). Fictional. */
const others: Record<string, [string, string, string]> = {
  restaurant: ["Golden Wok Express", "Main Street Diner", "Harbor Grill"],
  salon: ["Hair Express", "Shear Magic", "Studio 9 Salon"],
  carpentry: ["AAA Home Repair", "Precision Builders LLC", "Oak & Sons"],
  therapy: ["Wellness Counseling Center", "Hope Therapy Group", "Pathways Counseling"],
  accounting: ["Main St Tax Service", "Smith & Co Accounting", "Premier CPA Group"],
  outdoor: ["River Bend Guides", "Bob's Bait & Tackle", "Lakeside Outfitters"],
};
export const othersFor = (w: World) => others[w.id] ?? ["Business One", "Business Two", "Business Three"];

const now = () => performance.now();

/* ── 01 · The search ───────────────────────────────────────────────────────────────────── */
export function SearchMoment({ onDone, done }: { onDone: (w: World) => void; done: boolean }) {
  const [world, setWorld] = useState<World | null>(null);
  const [typed, setTyped] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const query = world ? `best ${world.industry.toLowerCase()} near me` : "";

  useEffect(() => {
    if (!world) return;
    let i = 0;
    setTyped("");
    const id = window.setInterval(() => {
      i += 1;
      setTyped(query.slice(0, i));
      if (i >= query.length) window.clearInterval(id);
    }, 38);
    return () => window.clearInterval(id);
  }, [world, query]);

  const results = world ? [othersFor(world)[0], world.name, othersFor(world)[1]] : [];
  const finishedTyping = world && typed.length >= query.length;

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
      <div className="text-center lg:text-left">
        <h2 className="section-title">
          You need someone. <span className="text-[var(--color-cherry)]">What for?</span>
        </h2>
        <p className="section-lede lg:mx-0 mx-auto">Pick one. You&apos;re the customer now.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start">
          {pickable.map((w) => (
            <button
              key={w.id}
              type="button"
              disabled={done}
              onClick={() => {
                setWorld(w);
                setPicked(null);
              }}
              aria-pressed={world?.id === w.id}
              className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors disabled:opacity-60 ${
                world?.id === w.id
                  ? "border-[var(--color-cherry)] bg-[var(--color-cherry)] text-[var(--color-paper)]"
                  : "border-[var(--color-ash-40)] hover:border-[var(--color-cherry)]"
              }`}
            >
              {w.industry}
            </button>
          ))}
        </div>
        {finishedTyping && (
          <FactCard stat="76%" source={sources.nearMe}>
            of people who search for something nearby on their phone visit a business within a day.
          </FactCard>
        )}
      </div>

      <PhoneFrame className="mx-auto w-[16rem] sm:w-[17.5rem]">
        <div className="flex h-full flex-col bg-white px-[6cqw] pt-[17cqw] text-[#202124]">
          <span className="flex min-h-[11cqw] items-center rounded-full border border-[#dadce0] px-[5cqw] text-[4.2cqw]">
            {typed || <span className="text-[#9aa0a6]">Search</span>}
            {world && !finishedTyping && <span className="ml-[0.5cqw] h-[5cqw] w-px animate-pulse bg-[#202124]" />}
          </span>
          {finishedTyping &&
            results.map((name, i) => (
              <button
                key={name}
                type="button"
                disabled={done}
                onClick={() => {
                  setPicked(name);
                  onDone(world!);
                }}
                className={`fact-pop mt-[4cqw] block rounded-[2.5cqw] p-[3.5cqw] text-left transition-colors hover:bg-[#f1f3f4] ${
                  picked === name ? "bg-[#f3e8fd] outline outline-1 outline-[#a85fd1]" : ""
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span className="block text-[4.6cqw] text-[#1a0dab]">{name}</span>
                <span className="mt-[1cqw] block text-[3.4cqw] text-[#70757a]">
                  {["★★★★☆ 4.2", "★★★★★ 4.8", "★★★★☆ 4.4"][i]} · {world!.industry}
                </span>
              </button>
            ))}
          {finishedTyping && !picked && (
            <span className="mt-[5cqw] text-center text-[3.4cqw] text-[#70757a]">Tap the one you&apos;d check out.</span>
          )}
        </div>
      </PhoneFrame>
    </div>
  );
}

/* ── 02 · The glance (the 50ms flash) ─────────────────────────────────────────────────── */
type Verdict = "stay" | "leave";
export function GlanceMoment({
  world,
  onDone,
  done,
  onNext,
}: {
  world: World;
  onDone: (v: Verdict[]) => void;
  done: boolean;
  onNext: () => void;
}) {
  const [round, setRound] = useState<0 | 1>(0);
  const [phase, setPhase] = useState<"ready" | "flash" | "ask" | "result">("ready");
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = () => {
    setPhase("flash");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        timer.current = window.setTimeout(() => setPhase("ask"), 50);
      })
    );
  };

  const decide = (v: Verdict) => {
    const next = [...verdicts, v];
    setVerdicts(next);
    if (round === 0) {
      setRound(1);
      setPhase("ready");
    } else {
      setPhase("result");
      onDone(next);
    }
  };

  return (
    <div className="text-center">
      {phase === "ready" && (
        <div className="fact-pop">
          <h2 className="section-title mx-auto max-w-3xl">
            {round === 0 ? (
              <>
                You tapped <span className="text-[var(--color-cherry)]">{world.name}.</span> Their site
                is loading.
              </>
            ) : (
              <>
                Same business. They rebuilt their site.{" "}
                <span className="text-[var(--color-cherry)]">Look again.</span>
              </>
            )}
          </h2>
          <p className="section-lede mx-auto">It&apos;ll be on screen for 50 milliseconds. Don&apos;t blink.</p>
          <button
            type="button"
            onClick={flash}
            className="mt-10 rounded-full border border-[var(--color-cherry)] px-10 py-4 text-xs font-bold uppercase tracking-widest text-[var(--color-cherry)] transition-colors hover:bg-[var(--color-cherry)] hover:text-[var(--color-paper)]"
          >
            {round === 0 ? "Load it" : "Load it again"}
          </button>
        </div>
      )}

      {/* Fixed-size box during the flash so the page doesn't jump. */}
      {phase === "flash" && (
        <BrowserFrame url={`${world.id}.example`} className="mx-auto max-w-3xl">
          <MiniSite world={world} generic={round === 0} layout="desktop" />
        </BrowserFrame>
      )}

      {phase === "ask" && (
        <div>
          <h2 className="section-title mx-auto">Stay, or back out?</h2>
          <div className="mt-10 flex justify-center gap-4">
            {(["stay", "leave"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => decide(v)}
                className="min-w-36 rounded-full border border-[var(--color-ash-40)] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:border-[var(--color-cherry)] hover:text-[var(--color-cherry)]"
              >
                {v === "stay" ? "Stay" : "Back out"}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="fact-pop">
          <h2 className="section-title mx-auto">
            You decided. <span className="text-[var(--color-cherry)]">Twice.</span>
          </h2>
          <p className="section-lede mx-auto">You didn&apos;t read a single word either time.</p>
          <div className="mt-10 grid gap-5 text-left sm:grid-cols-2">
            {[0, 1].map((r) => (
              <figure key={r}>
                <BrowserFrame url={`${world.id}.example`}>
                  <MiniSite world={world} generic={r === 0} layout="desktop" />
                </BrowserFrame>
                <figcaption className="mt-3 flex justify-between font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  <span>{r === 0 ? "Before" : "After"}</span>
                  <span>
                    You:{" "}
                    <span className="text-[var(--color-cherry)]">
                      {verdicts[r] === "stay" ? "stayed" : "backed out"}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <FactCard stat="50ms" source={sources.fiftyMs}>
            is how long it takes people to form a first impression of a website.
          </FactCard>
          {done && <Onward onClick={onNext} />}
        </div>
      )}
    </div>
  );
}

/* ── 04 · The wait ─────────────────────────────────────────────────────────────────────── */
const WAIT_MAX = 12;
export function WaitMoment({
  world,
  onDone,
  done,
  onNext,
}: {
  world: World;
  onDone: (seconds: number) => void;
  done: boolean;
  onNext: () => void;
}) {
  const [phase, setPhase] = useState<"ready" | "loading" | "result">("ready");
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(0);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const stop = (t: number) => {
    cancelAnimationFrame(frame.current);
    setElapsed(t);
    setPhase("result");
    onDone(t);
  };

  const start = () => {
    setPhase("loading");
    started.current = now();
    const tick = () => {
      const t = (now() - started.current) / 1000;
      if (t >= WAIT_MAX) return stop(WAIT_MAX);
      setElapsed(t);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  // A loading bar that never quite finishes — it eases toward 92% and stalls, like the real thing.
  const fill = Math.min(92, 92 * (1 - Math.exp(-elapsed / 3.5)));
  const gaveUp = phase === "result" && elapsed < WAIT_MAX;

  return (
    <div className="text-center">
      <h2 className="section-title mx-auto max-w-3xl">
        {phase === "result" ? (
          gaveUp ? (
            <>
              You gave up at <span className="text-[var(--color-cherry)]">{elapsed.toFixed(1)} seconds.</span>
            </>
          ) : (
            <>
              You waited <span className="text-[var(--color-cherry)]">{WAIT_MAX} seconds.</span> Most people
              don&apos;t.
            </>
          )
        ) : (
          <>
            You tapped <span className="text-[var(--color-cherry)]">&ldquo;{world.cta}.&rdquo;</span>
          </>
        )}
      </h2>
      <p className="section-lede mx-auto">
        {phase === "ready" && "The next page starts loading. Hit the button the moment you'd give up."}
        {phase === "loading" && "Still loading…"}
        {phase === "result" && "Every second of that is a customer deciding whether you're worth it."}
      </p>

      <div className="mx-auto mt-12 max-w-2xl">
        <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-white)]" style={{ width: `${phase === "ready" ? 0 : fill}%` }} />
        </div>
        <div className="relative mt-3 h-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-ink)]/60">
          <span className="absolute left-0">0s</span>
          <span className="absolute -translate-x-1/2 text-[var(--color-white)]" style={{ left: `${(3 / WAIT_MAX) * 100}%` }}>
            ▲ 3s
          </span>
          <span className="absolute right-0">{WAIT_MAX}s</span>
        </div>
        <p className="display-face mt-8 text-[clamp(3.5rem,12vw,7rem)] leading-none tabular-nums text-[var(--color-white)]">
          {elapsed.toFixed(1)}
          <span className="text-[var(--color-cherry)]">s</span>
        </p>
      </div>

      {phase === "ready" && (
        <button
          type="button"
          onClick={start}
          className="mt-10 rounded-full bg-[var(--color-white)] px-10 py-4 text-xs font-bold uppercase tracking-widest text-[var(--color-paper)]"
        >
          Tap &ldquo;{world.cta}&rdquo;
        </button>
      )}
      {phase === "loading" && (
        <button
          type="button"
          onClick={() => stop((now() - started.current) / 1000)}
          className="mt-10 rounded-full border-2 border-[var(--color-white)] px-10 py-4 text-xs font-bold uppercase tracking-widest text-[var(--color-white)] transition-colors hover:bg-[var(--color-white)] hover:text-[var(--color-paper)]"
        >
          I&apos;m out
        </button>
      )}
      {phase === "result" && (
        <>
          <FactCard stat="53%" source={sources.speed}>
            of mobile visits are abandoned when a page takes longer than 3 seconds to load. From 1 to 3
            seconds, the chance someone bounces rises 32%.
          </FactCard>
          {done && <Onward onClick={onNext} />}
        </>
      )}
    </div>
  );
}

/* ── 05 · The hunt ─────────────────────────────────────────────────────────────────────── */
export function HuntMoment({
  world,
  onDone,
  done,
  onNext,
}: {
  world: World;
  onDone: (times: [number, number]) => void;
  done: boolean;
  onNext: () => void;
}) {
  const [round, setRound] = useState<0 | 1>(0);
  const [phase, setPhase] = useState<"ready" | "hunting" | "between" | "result">("ready");
  const [elapsed, setElapsed] = useState(0);
  const [misses, setMisses] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [readDone, setReadDone] = useState(false);
  const started = useRef(0);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const go = () => {
    setPhase("hunting");
    setMisses(0);
    started.current = now();
    const tick = () => {
      setElapsed((now() - started.current) / 1000);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  const found = () => {
    cancelAnimationFrame(frame.current);
    const t = (now() - started.current) / 1000;
    const next = [...times, t];
    setTimes(next);
    setElapsed(t);
    if (round === 0) {
      setPhase("between");
      setRound(1);
    } else {
      setPhase("result");
      onDone([next[0], next[1]]);
    }
  };

  const miss = () => phase === "hunting" && setMisses((m) => m + 1);
  const faster = times.length === 2 ? Math.max(1, Math.round(times[0] / Math.max(times[1], 0.1))) : 0;

  return (
    <div className="text-center">
      {(phase === "ready" || phase === "between") && (
        <div className="fact-pop">
          <h2 className="section-title mx-auto max-w-3xl">
            {round === 0 ? (
              <>
                Okay, you&apos;re in. <span className="text-[var(--color-cherry)]">Find how to book.</span>
              </>
            ) : (
              <>
                {times[0].toFixed(1)} seconds. <span className="text-[var(--color-cherry)]">Now the rebuilt site.</span>
              </>
            )}
          </h2>
          <p className="section-lede mx-auto">A timer starts the moment the page appears.</p>
          <button
            type="button"
            onClick={go}
            className="mt-10 rounded-full bg-[var(--color-cherry)] px-10 py-4 text-xs font-bold uppercase tracking-widest text-[var(--color-paper)]"
          >
            Go
          </button>
        </div>
      )}

      {phase === "hunting" && (
        <div>
          <div className="mb-5 flex items-baseline justify-center gap-6 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            <span>
              <span className="display-face text-3xl text-[var(--color-white)] tabular-nums">{elapsed.toFixed(1)}</span>s
            </span>
            <span>{misses} wrong clicks</span>
          </div>
          <BrowserFrame url={`${world.id}.example`} className="mx-auto max-w-4xl">
            <div className="absolute inset-0" onClick={miss}>
              {round === 0 ? <ClutteredPage world={world} onFind={found} /> : <ClearPage world={world} onFind={found} />}
            </div>
          </BrowserFrame>
        </div>
      )}

      {phase === "result" && (
        <div className="fact-pop">
          <h2 className="section-title mx-auto max-w-3xl">
            {times[0].toFixed(1)}s, then {times[1].toFixed(1)}s.{" "}
            <span className="text-[var(--color-cherry)]">
              {faster > 1 ? `${faster}× faster.` : "Faster."}
            </span>
          </h2>
          <p className="section-lede mx-auto">That&apos;s what &ldquo;easy to choose&rdquo; feels like from the other side.</p>
          <div className="mx-auto mt-14 max-w-2xl">
            <StatGuess
              question="On the average web page, how many of the words do people actually read?"
              answer={28}
              step={2}
              max={100}
              tolerance={6}
              hitText="People read at most 28% of the words on a page, and 20% is more likely."
              revealText={
                <>
                  <span className="font-semibold text-[var(--color-cherry)]">At most 28%.</span> And 20% is more likely.
                  The rest gets scanned past, which is why the button has to find them.
                </>
              }
              source={sources.reading}
              onDone={() => setReadDone(true)}
            />
          </div>
          {readDone && (
            <FactCard stat="57%" source={sources.fold}>
              of page-viewing time is spent in the first screen, before anyone scrolls.
            </FactCard>
          )}
          {done && readDone && <Onward onClick={onNext} />}
        </div>
      )}
    </div>
  );
}

function ClutteredPage({ world, onFind }: { world: World; onFind: () => void }) {
  const lower = world.industry.toLowerCase();
  return (
    <div className="h-full overflow-hidden bg-white p-[2cqw] text-left font-serif text-[#444]" style={{ fontSize: "1.25cqw", lineHeight: 1.5 }}>
      <div className="flex items-center justify-between bg-[#3a5ea8] px-[1.5cqw] py-[1cqw] text-white" style={{ fontSize: "1.8cqw" }}>
        <span>{world.name}</span>
        <span style={{ fontSize: "1.1cqw" }}>Call us today!</span>
      </div>
      <div className="flex flex-wrap gap-[1.6cqw] bg-[#eee] px-[1.5cqw] py-[0.8cqw] text-[#1a0dab] underline">
        {["Home", "About Us", "Our Services", "Gallery", "Testimonials", "News", "FAQ", "Links"].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-[2cqw] p-[1.5cqw]">
        <div className="space-y-[1.2cqw]">
          <p style={{ fontSize: "2.4cqw" }} className="font-bold text-[#222]">Welcome to {world.name}!</p>
          <p>
            We are a family owned and operated {lower} business proudly serving the area for many years.
            Our team is dedicated to providing quality service at affordable prices and we pride
            ourselves on customer satisfaction. We offer a wide range of services for residential and
            commercial customers and are fully licensed and insured.
          </p>
          <p>
            Our mission is to exceed your expectations every time. Whether you are a new or returning
            customer we look forward to serving you. To schedule please{" "}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFind();
              }}
              className="text-[#1a0dab] underline"
            >
              click here
            </button>{" "}
            or call during normal business hours. Hours may vary on holidays.
          </p>
          <p>
            Check out our Gallery page to see examples of our work and visit our Testimonials page to
            hear what customers are saying. Don&apos;t forget to like us on social media for specials
            and updates!
          </p>
        </div>
        <div className="space-y-[1.2cqw]">
          <div className="aspect-[4/3] border border-[#bbb] bg-[#ddd]" />
          <div className="border border-[#ccc] bg-[#f6f6f6] p-[1cqw]">
            <p className="font-bold">Latest News</p>
            <p>We have updated our website! More coming soon.</p>
          </div>
          <div className="border border-[#ccc] bg-[#f6f6f6] p-[1cqw]">
            <p className="font-bold">Service Area</p>
            <p>Serving the greater metro area and surrounding communities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClearPage({ world, onFind }: { world: World; onFind: () => void }) {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-[2cqw] p-[6cqw] text-left" style={{ background: world.bg, color: world.fg }}>
      <span style={{ fontSize: "1.4cqw", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7 }}>{world.kicker}</span>
      <span style={{ fontFamily: worldFaces[world.face], fontSize: "5.5cqw", lineHeight: 1 }}>{world.headline}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onFind();
        }}
        className="mt-[1.5cqw] rounded-full font-bold uppercase"
        style={{ background: world.accent, color: world.onAccent, fontSize: "1.6cqw", padding: "1.4cqw 3cqw", letterSpacing: "0.08em" }}
      >
        {world.cta}
      </button>
    </div>
  );
}

/* ── 06 · The memory ───────────────────────────────────────────────────────────────────── */
export function MemoryMoment({
  world,
  onDone,
  done,
  onNext,
}: {
  world: World;
  onDone: (right: boolean) => void;
  done: boolean;
  onNext: () => void;
}) {
  const [o1, o2, o3] = othersFor(world);
  const options = [o3, o1, world.name, o2];
  const [choice, setChoice] = useState<string | null>(null);
  const right = choice === world.name;

  return (
    <div className="text-center">
      <h2 className="section-title mx-auto max-w-3xl">
        Quick. <span className="text-[var(--color-cherry)]">No scrolling up.</span>
      </h2>
      <p className="section-lede mx-auto">What was the name of the business you picked?</p>
      <div className="mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
        {options.map((name) => {
          const isChoice = choice === name;
          const isAnswer = choice && name === world.name;
          return (
            <button
              key={name}
              type="button"
              disabled={!!choice}
              onClick={() => {
                setChoice(name);
                onDone(name === world.name);
              }}
              className={`rounded-2xl border px-6 py-5 text-left text-base transition-colors ${
                isAnswer
                  ? "border-[var(--color-cherry)] bg-[var(--color-cherry)] text-[var(--color-paper)]"
                  : isChoice
                    ? "border-[var(--color-miss)] text-[var(--color-miss)]"
                    : "border-[var(--color-ash-40)] hover:border-[var(--color-cherry)] disabled:opacity-50"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>
      {choice && (
        <div className="fact-pop mt-14">
          <p className="display-face mx-auto max-w-3xl text-balance text-[clamp(1.6rem,4vw,2.75rem)] leading-tight">
            {right ? (
              <>
                You remembered them. <span className="text-[var(--color-cherry)]">That&apos;s the entire job.</span>
              </>
            ) : (
              <>
                Gone already. <span className="text-[var(--color-cherry)]">That&apos;s what forgettable costs.</span>
              </>
            )}
          </p>
          <p className="brand-wordmark mt-10 text-[clamp(1.5rem,4vw,2.5rem)] uppercase tracking-[0.04em] text-[var(--color-white)]">
            Make them remember you.
          </p>
          {done && <Onward onClick={onNext}>One more thing</Onward>}
        </div>
      )}
    </div>
  );
}
