"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ConceptHeroPicture } from "@/components/concepts/ConceptHeroPicture";
import { ConceptStudies } from "@/components/concepts/ConceptStudies";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import type { World } from "@/lib/worlds";
import { StatGuess } from "./StatGuess";
import { Onward, Stage, sources } from "./parts";
import { GlanceMoment, HuntMoment, MemoryMoment, SearchMoment, WaitMoment, pickable } from "./stages";

/**
 * ── Home Concept 3: "Be the customer" ───────────────────────────────────────────────────────
 *
 * Not a page you read — a minute you live through. The visitor plays a customer looking for a
 * business, and every moment only unlocks once they've DONE the previous one: search, judge a
 * site in 50ms, guess how much design matters, wait on a slow page until they give up, hunt for a
 * buried "book" link against a clock, then try to remember who they picked. Each moment pays out
 * a real, cited fact. Then it turns around: "now it's your business they're doing this to."
 *
 * Every moment is a different room (Stage `look`), so the run is broken up visually without ever
 * being "sections"; the rail on the left fills as they go. Every moment can be skipped, so nobody
 * is trapped. Reduced motion: unlocking jumps instead of gliding.
 */
const moments = ["The search", "The glance", "The gut check", "The wait", "The hunt", "The memory", "Your turn"];

export function CustomerRun() {
  const reduced = useReducedMotion();
  const [unlocked, setUnlocked] = useState(0); // highest stage index shown (0 = the door)
  const [done, setDone] = useState<Set<number>>(new Set());
  const [world, setWorld] = useState<World | null>(null);
  const [waited, setWaited] = useState<number | null>(null);
  const [hunt, setHunt] = useState<[number, number] | null>(null);
  const [name, setName] = useState("");

  const finish = (i: number) => setDone((d) => new Set(d).add(i));
  const open = (i: number) => setUnlocked((u) => Math.max(u, i));
  const finishAndOpen = (i: number) => {
    finish(i);
    open(i + 1);
  };

  // Glide to whatever just unlocked.
  useEffect(() => {
    if (unlocked === 0) return;
    const id = window.setTimeout(() => {
      document.getElementById(`moment-${unlocked}`)?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }, 80);
    return () => window.clearTimeout(id);
  }, [unlocked, reduced]);

  // If someone skips the very first choice, give them a business to carry through the run.
  const skip = (i: number) => {
    if (!world) setWorld(pickable[4]);
    finishAndOpen(i);
  };

  const shown = (i: number) => unlocked >= i && (i <= 1 || world);
  const business = name.trim() || "your business";

  return (
    <div className="relative">
      <Rail unlocked={unlocked} done={done} />

      {/* ── The door ───────────────────────────────────────────────────────────────────── */}
      {/* Top image behind the door. Copy on a scrim (left on desktop, bottom on phones) so the
          phone at the centre of the photo stays clear. */}
      <section
        id="moment-0"
        className="relative flex min-h-[100svh] items-end overflow-hidden bg-[var(--color-paper)] text-[var(--color-ink)] lg:items-center"
      >
        <ConceptHeroPicture className="object-cover object-center" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-paper)_10%,color-mix(in_srgb,var(--color-paper)_80%,transparent)_45%,transparent_72%)] lg:bg-[linear-gradient(90deg,var(--color-paper)_0%,var(--color-paper)_18%,color-mix(in_srgb,var(--color-paper)_85%,transparent)_34%,transparent_50%)]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-paper)] to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-32 lg:py-28">
          <div className="max-w-[30rem]">
            <p className="eyebrow mb-6">+ A one-minute experiment</p>
            <h1 className="text-[clamp(2.6rem,4.6vw,4.25rem)] leading-[0.95] text-[var(--color-white)]">
              Don&apos;t read this website. <span className="text-[var(--color-cherry)]">Use it.</span>
            </h1>
            <p className="mt-6 max-w-md text-[clamp(1.05rem,1.8vw,1.3rem)] leading-snug text-[var(--color-ink)]/85">
              For the next minute you&apos;re a customer looking for a business. Every choice you
              make is one your customers are already making about you.
            </p>
            {unlocked === 0 && (
              <button
                type="button"
                onClick={() => open(1)}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--color-cherry)] px-10 py-5 text-sm font-bold uppercase tracking-widest text-[var(--color-paper)] transition-shadow hover:shadow-[0_0_40px_var(--color-glow)]"
              >
                I&apos;m the customer <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {shown(1) && (
        <Stage id="moment-1" look="glass" index={1} name={moments[0]} done={done.has(1)} onSkip={() => skip(1)}>
          <SearchMoment
            done={done.has(1)}
            onDone={(w) => {
              setWorld(w);
              window.setTimeout(() => finishAndOpen(1), 450);
            }}
          />
        </Stage>
      )}

      {shown(2) && world && (
        <Stage id="moment-2" look="void" index={2} name={moments[1]} done={done.has(2)} onSkip={() => finishAndOpen(2)}>
          <GlanceMoment world={world} done={done.has(2)} onDone={() => finish(2)} onNext={() => open(3)} />
        </Stage>
      )}

      {shown(3) && (
        <Stage id="moment-3" look="tone" index={3} name={moments[2]} done={done.has(3)} onSkip={() => finishAndOpen(3)}>
          <h2 className="section-title mx-auto mb-12 max-w-3xl text-center">
            Be honest. <span className="text-[var(--color-cherry)]">Did the design change your answer?</span>
          </h2>
          <StatGuess
            question="So how many people judge a company's credibility on its website design?"
            answer={75}
            hitText="You must know how important this is."
            revealText={
              <>
                <span className="font-semibold text-[var(--color-cherry)]">It&apos;s 75%.</span> Three in four
                people judge a company&apos;s credibility on its website design. You just did it too.
              </>
            }
            source={sources.credibility}
            onDone={() => finish(3)}
          />
          {done.has(3) && <Onward onClick={() => open(4)} />}
        </Stage>
      )}

      {shown(4) && world && (
        <Stage id="moment-4" look="alarm" index={4} name={moments[3]} done={done.has(4)} onSkip={() => finishAndOpen(4)}>
          <WaitMoment
            world={world}
            done={done.has(4)}
            onDone={(s) => {
              setWaited(s);
              finish(4);
            }}
            onNext={() => open(5)}
          />
        </Stage>
      )}

      {shown(5) && world && (
        <Stage id="moment-5" look="paper" index={5} name={moments[4]} done={done.has(5)} onSkip={() => finishAndOpen(5)}>
          <HuntMoment
            world={world}
            done={done.has(5)}
            onDone={(t) => {
              setHunt(t);
              finish(5);
            }}
            onNext={() => open(6)}
          />
        </Stage>
      )}

      {shown(6) && world && (
        <Stage id="moment-6" look="night" index={6} name={moments[5]} done={done.has(6)} onSkip={() => finishAndOpen(6)}>
          <MemoryMoment world={world} done={done.has(6)} onDone={() => finish(6)} onNext={() => open(7)} />
        </Stage>
      )}

      {shown(7) && (
        <Stage id="moment-7" look="glow" index={7} name={moments[6]}>
          <div className="text-center">
            <h2 className="section-title mx-auto max-w-3xl">
              Now flip it. <span className="text-[var(--color-cherry)]">What&apos;s your business called?</span>
            </h2>
            <label className="mx-auto mt-10 block max-w-md">
              <span className="sr-only">Your business name</span>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  finish(7);
                }}
                maxLength={60}
                placeholder="Type it here"
                className="w-full border-b-2 border-[var(--color-cherry)]/60 bg-transparent pb-3 text-center text-[clamp(1.5rem,4vw,2.25rem)] text-[var(--color-white)] outline-none placeholder:text-[var(--color-ink)]/30 focus:border-[var(--color-cherry)]"
              />
            </label>

            <p className="display-face mx-auto mt-14 max-w-3xl text-balance text-[clamp(1.5rem,3.8vw,2.6rem)] leading-tight">
              Right now, someone is giving <span className="text-[var(--color-cherry)]">{business}</span> 50
              milliseconds.
            </p>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-snug text-[var(--color-ink)]/75">
              Searching, glancing, waiting, hunting, forgetting. Everything you just did, they&apos;re
              doing to you. We fix the part people see first.
            </p>

            {/* The fix, shown: a site resolving out of pixels into its rebuilt self. */}
            <div className="relative mx-auto mt-12 aspect-[8/3] max-w-4xl overflow-hidden rounded-2xl border border-[var(--color-ash-22)] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9),0_0_80px_-40px_var(--color-glow)]">
              <Image
                src="/images/concepts/redesign-band.jpg"
                alt="A website on a laptop and a phone, its old version dissolving into pixels as the redesigned version takes its place."
                fill
                sizes="(min-width: 896px) 56rem, 100vw"
                className="object-cover"
              />
            </div>

            {(waited !== null || hunt) && (
              <dl className="mx-auto mt-12 grid max-w-2xl gap-px overflow-hidden rounded-2xl border border-[var(--color-ash-22)] bg-[var(--color-ash-22)] sm:grid-cols-3">
                <RunStat label="Time to judge a site" value="50ms" />
                <RunStat label="You waited" value={waited !== null ? `${waited.toFixed(1)}s` : "—"} />
                <RunStat label="Finding “book”" value={hunt ? `${hunt[0].toFixed(1)}s → ${hunt[1].toFixed(1)}s` : "—"} />
              </dl>
            )}

            <div className="mx-auto mt-20 max-w-6xl text-left">
              <p className="display-face mb-8 text-balance text-center text-[clamp(1.4rem,3vw,2.1rem)] leading-tight">
                What could <span className="text-[var(--color-cherry)]">{business}</span> look like?
              </p>
              <ConceptStudies />
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton
                as={TransitionLink}
                href="/contact"
                radius={100}
                className="btn-primary inline-flex items-center gap-2 rounded-full px-9 py-4 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
              >
                Make them remember {name.trim() ? "us" : "you"}
              </MagneticButton>
              <TransitionLink
                href="/work/revolt-lacrosse"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-white)]/25 px-8 py-4 text-sm uppercase tracking-widest text-[var(--color-white)] transition-colors hover:border-[var(--color-white)]/60"
              >
                See a real one
              </TransitionLink>
            </div>

            <p className="mx-auto mt-14 max-w-md font-mono text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">
              Paragraphs you had to read to get all that: <span className="text-[var(--color-cherry)]">0</span>
            </p>

            <div className="mx-auto mt-16 max-w-2xl text-left">
              <p className="eyebrow mb-4">Sources</p>
              <ul className="space-y-2 text-xs text-[var(--color-muted)]">
                {Object.values(sources).map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--color-cherry)]/40 underline-offset-2 hover:text-[var(--color-cherry)]">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[var(--color-muted)]">
                Every business in this experiment is fictional, made up for the demonstration.
              </p>
            </div>
          </div>
        </Stage>
      )}
    </div>
  );
}

function RunStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-paper)] p-5">
      <dt className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">{label}</dt>
      <dd className="display-face mt-2 text-2xl text-[var(--color-white)]">{value}</dd>
    </div>
  );
}

/** Progress: a rail on the left on desktop, a thin bar along the top on phones. */
function Rail({ unlocked, done }: { unlocked: number; done: Set<number> }) {
  if (unlocked === 0) return null;
  const progress = done.size / moments.length;
  return (
    <>
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-40 h-0.5 bg-white/10 lg:hidden">
        <div className="h-full bg-[var(--color-cherry)] transition-[width] duration-700" style={{ width: `${progress * 100}%` }} />
      </div>
      <nav aria-label="Progress" className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <ol className="relative space-y-4 border-l border-white/10 pl-5">
          <span
            aria-hidden="true"
            className="absolute -left-px top-0 w-px bg-[var(--color-cherry)] transition-[height] duration-700"
            style={{ height: `${progress * 100}%` }}
          />
          {moments.map((m, i) => {
            const n = i + 1;
            const isDone = done.has(n);
            const isOpen = unlocked >= n;
            return (
              <li
                key={m}
                className={`flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] transition-colors ${
                  isDone ? "text-[var(--color-cherry)]" : isOpen ? "text-[var(--color-white)]" : "text-white/25"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isDone ? "bg-[var(--color-cherry)]" : isOpen ? "bg-white" : "bg-white/25"}`} />
                {m}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
