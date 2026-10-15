"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PresizedPicture } from "@/components/media/EditorialMedia";
import { ActionButton, ActionNote } from "@/components/interactive/ActionButtons";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ConceptStudies } from "@/components/concepts/ConceptStudies";
import { HomepageSwitch } from "@/components/concepts/HomepageSwitch";
import { useLenis } from "@/components/scroll/SmoothScroll";
import type { World } from "@/lib/worlds";
import { StatGuess } from "./StatGuess";
import { Onward, Stage, sources } from "./parts";
import { GlanceMoment, HuntMoment, MemoryMoment, SearchMoment, WaitMoment, pickable } from "./stages";

/**
 * ── Home Concept 3: "Be the customer" ───────────────────────────────────────────────────────
 *
 * Not a page you read — a minute you live through. The visitor plays a customer looking for a
 * business, and every moment only unlocks once they've DONE the previous one: search, judge a
 * site in 200ms, guess how much design matters, wait on a slow page until they give up, hunt for a
 * buried "book" link against a clock, then try to remember who they picked. Each moment pays out
 * a real, cited fact. Then it turns around: "now it's your business they're doing this to."
 *
 * Every moment is a different room (Stage `look`), so the run is broken up visually without ever
 * being "sections"; the rail on the left fills as they go. Every moment can be skipped, so nobody
 * is trapped. It runs as pages, one moment on screen at a time: buttons go forward, the rail
 * (and a small "Back" on phones) only goes back.
 */
/** Edge fades for the hero photos, so their dark borders melt into the page. */
const fadeSides = "radial-gradient(ellipse 62% 64% at 50% 50%, #000 68%, transparent 100%)";
/** Phone background photo: fades its top into the page behind the copy, and its bottom into
 *  the floor under the button, so it reads as the page rather than a picture on it. */
const fadePhone = {
  maskImage: "linear-gradient(to bottom, transparent, #000 26%, #000 82%, transparent)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 26%, #000 82%, transparent)",
};

/** Tablet photo: fades its top under the copy, its bottom under the button, and its sides
 *  (which are usually off-screen). */
const fadeTablet = {
  maskImage:
    "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 22%, #000 86%, transparent)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 22%, #000 86%, transparent)",
  WebkitMaskComposite: "source-in",
};

const moments = ["The search", "The glance", "The gut check", "The wait", "The hunt", "The memory", "Your turn"];

/** `switchToTraditional` adds the top-left pill to /traditional (the real homepage only). */
export function CustomerRun({ switchToTraditional = false }: { switchToTraditional?: boolean }) {
  const [unlocked, setUnlocked] = useState(0); // highest stage index shown (0 = the door)
  const [done, setDone] = useState<Set<number>>(new Set());
  const [world, setWorld] = useState<World | null>(null);
  const [waited, setWaited] = useState<number | null>(null);
  const [hunt, setHunt] = useState<[number, number] | null>(null);
  const [name, setName] = useState("");

  // One moment on screen at a time. `page` is the one showing; `unlocked` is the furthest
  // reached. Buttons inside a moment move forward; the rail (and the phone "Back") only go back.
  const [page, setPage] = useState(0);
  const [skipped, setSkipped] = useState<Set<number>>(new Set());

  const finish = (i: number) => setDone((d) => new Set(d).add(i));
  const open = (i: number) => {
    setUnlocked((u) => Math.max(u, i));
    setPage(i);
  };
  const finishAndOpen = (i: number) => {
    finish(i);
    open(i + 1);
  };
  const back = (i: number) => setPage((p) => (i < p ? i : p));

  // Each new page starts at the top, instantly: it's a page turn, not a scroll. Goes through
  // Lenis when it's running so its idea of the scroll position stays in step with the page's.
  const lenis = useLenis();
  const firstPage = useRef(true);
  useEffect(() => {
    if (firstPage.current) {
      firstPage.current = false;
      return;
    }
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    // Only on a page change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // If someone skips the very first choice, give them a business to carry through the run.
  const skip = (i: number) => {
    if (!world) setWorld(pickable[4]);
    setSkipped((k) => new Set(k).add(i));
    finishAndOpen(i);
  };

  const shown = (i: number) => unlocked >= i && (i <= 1 || world);
  const business = name.trim() || "your business";

  return (
    <div className="relative">
      <Rail unlocked={unlocked} done={done} current={page} onPick={back} />

      {/* ── The door ───────────────────────────────────────────────────────────────────── */}
      {/* Fills the screen under the sticky header (about 4.8rem tall on phones, 4.05rem wide).
          Two layouts, both built so the button sits right under the phone in the photo without
          guessing where the photo lands:
          · a stack: copy, then the photo, then the button. The photo runs edge to edge as the
            page's background, positioned so the phone in it ends right above the button: the
            portrait photo on phones, the landscape one from 44rem (portrait tablets);
          · hero-wide (xl, and landscape tablets), the landscape photo behind the page with the
            copy on the left. Its height is set from the section's, so the phone always ends
            exactly HERO_GAP above the bottom (the phone's base is 84.5% down that 1672×941 photo), and the button fills that gap. */}
      <section
        id="moment-0"
        className={`${page === 0 ? "flex" : "hidden"} stage-enter relative min-h-[calc(100svh_-_4.8rem)] flex-col overflow-hidden bg-[var(--color-paper)] text-[var(--color-ink)] hero-wide:min-h-[max(calc(100svh_-_4.05rem),40rem)]`}
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-14 hidden aspect-[1672/941] h-[calc((100%_-_3.5rem_-_9.5rem)/0.845)] -translate-x-1/2 hero-wide:block"
          style={{ maskImage: fadeSides, WebkitMaskImage: fadeSides }}
        >
          <Image src="/images/concepts/hero-laptop.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-paper)_0%,var(--color-paper)_12%,color-mix(in_srgb,var(--color-paper)_80%,transparent)_28%,transparent_44%)] hero-wide:block"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-[var(--color-paper)] to-transparent hero-wide:block" />
        {/* A soft glow behind the stacked photo, so its faded edges melt into the page. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_70%,var(--color-glow),transparent_70%)] opacity-50 hero-wide:hidden"
        />
        {switchToTraditional && <HomepageSwitch to="traditional" />}

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-6 pt-28 hero-wide:justify-center hero-wide:pb-40 hero-wide:pt-24">
          <div className="relative z-10 mx-auto max-w-xl text-center hero-wide:mx-0 hero-wide:max-w-[min(28rem,34vw)] hero-wide:text-left">
            <p className="eyebrow mb-4 hero-wide:mb-6">+ A one-minute experiment</p>
            <h1 className="hero-text-shadow text-balance text-[clamp(2.3rem,8vw,3.4rem)] leading-[0.95] text-[var(--color-white)] hero-wide:text-[clamp(2.6rem,4.2vw,3.75rem)]">
              Don&apos;t read this website. <span className="text-[var(--color-cherry)]">Use it.</span>
            </h1>
            <p className="hero-text-shadow mx-auto mt-4 max-w-md text-[clamp(1rem,1.6vw,1.25rem)] leading-snug text-[var(--color-ink)]/80 hero-wide:mx-0 hero-wide:mt-6">
              For the next minute you&apos;re a customer looking for a business.{" "}
              <span className="hidden sm:inline">
                Every choice you make is one your customers are already making about you.
              </span>
            </p>
          </div>

          <div className="relative mt-4 min-h-[15rem] flex-1 [@media(max-height:760px)]:min-h-[7rem] hero-wide:hidden">
            {/* Phones: the full portrait photo as the page's background, edge to edge. Its
                width is the screen's, so its height is 100vw × 1300/731, and the phone's base is
                77% of the way down it (y≈1000 of 1300). Pulling the box down by the remaining 23%
                of its height puts that base exactly on this area's bottom edge, right above the
                "I'm the customer" button, whatever the screen size. Whatever extends above sits
                behind the copy, where the photo is dark; the section clips the rest. */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 aspect-[731/1300] w-screen -translate-x-1/2 min-[44rem]:hidden"
              style={{ bottom: "calc(100vw * -1300 / 731 * 0.23)", ...fadePhone }}
            >
              <PresizedPicture
                src="/images/concepts/hero-phone.jpg"
                widths={[480, 731]}
                alt=""
                sizes="100vw"
                priority
                className="h-full w-full object-cover"
              />
            </div>
            {/* Phones: a scrim behind the copy. The photo is busiest exactly where the copy sits,
                so the page colour holds solid down through the text and clears over the last
                stretch above this area, leaving the phone and the cards around it untouched. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[calc(100%_-_2.5rem)] left-1/2 h-[100svh] w-screen -translate-x-1/2 min-[44rem]:hidden"
              style={{
                background:
                  "linear-gradient(to top, transparent, color-mix(in srgb, var(--color-paper) 88%, transparent) 6rem, var(--color-paper) 11rem)",
              }}
            />
            {/* Tablets: the phone's base is 84.5% down the 1672×941 photo, so a photo
                (area + 6rem) / 0.845 tall, starting 6rem up behind the copy, puts it on this
                box's bottom edge. The 6rem tucks the photo's dark top under the copy. */}
            <div
              aria-hidden="true"
              className="absolute -top-24 left-1/2 hidden aspect-[1672/941] h-[calc((100%_+_6rem)/0.845)] -translate-x-1/2 min-[44rem]:block"
              style={fadeTablet}
            >
              <Image src="/images/concepts/hero-laptop.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
            </div>
          </div>
          <HeroCta className="relative z-10 mt-5 hero-wide:hidden" onClick={() => open(1)} />
        </div>

        <div className="absolute inset-x-0 top-[calc(100%_-_9.5rem)] hidden justify-center pt-4 hero-wide:flex">
          <HeroCta onClick={() => open(1)} />
        </div>
      </section>

      {shown(1) && (
        <Stage id="moment-1" active={page === 1} onBack={() => back(0)} look="glass" index={1} name={moments[0]} done={done.has(1)} onSkip={() => skip(1)} onNext={done.has(1) ? () => open(2) : undefined}>
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
        <Stage id="moment-2" active={page === 2} onBack={() => back(1)} look="void" index={2} name={moments[1]} done={done.has(2)} onSkip={() => finishAndOpen(2)} onNext={skipped.has(2) ? () => open(3) : undefined}>
          <GlanceMoment world={world} done={done.has(2)} onDone={() => finish(2)} onNext={() => open(3)} />
        </Stage>
      )}

      {shown(3) && (
        <Stage id="moment-3" active={page === 3} onBack={() => back(2)} look="tone" index={3} name={moments[2]} done={done.has(3)} onSkip={() => finishAndOpen(3)} onNext={skipped.has(3) ? () => open(4) : undefined}>
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
        <Stage id="moment-4" active={page === 4} onBack={() => back(3)} look="alarm" index={4} name={moments[3]} done={done.has(4)} onSkip={() => finishAndOpen(4)} onNext={skipped.has(4) ? () => open(5) : undefined}>
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
        <Stage id="moment-5" active={page === 5} onBack={() => back(4)} look="paper" index={5} name={moments[4]} done={done.has(5)} onSkip={() => finishAndOpen(5)} onNext={skipped.has(5) ? () => open(6) : undefined}>
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
        <Stage id="moment-6" active={page === 6} onBack={() => back(5)} look="night" index={6} name={moments[5]} done={done.has(6)} onSkip={() => finishAndOpen(6)} onNext={skipped.has(6) ? () => open(7) : undefined}>
          <MemoryMoment world={world} done={done.has(6)} onDone={() => finish(6)} onNext={() => open(7)} />
        </Stage>
      )}

      {shown(7) && (
        <Stage id="moment-7" active={page === 7} onBack={() => back(6)} look="glow" index={7} name={moments[6]}>
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
              Right now, someone is giving <span className="text-[var(--color-cherry)]">{business}</span> 200
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
                <RunStat label="Time to judge a site" value="0.2s" />
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

/** The hero's start button: the site's action button (interactive/ActionButtons) and its note. */
function HeroCta({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <ActionButton shine onClick={onClick}>I&apos;m the customer</ActionButton>
      <ActionNote>One minute · no sign-up</ActionNote>
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
/** The rail's steps go back, never forward: the ones above the moment on screen are buttons
 *  that turn back to that page; the current one and everything after stay plain text. */
function Rail({
  unlocked,
  done,
  current,
  onPick,
}: {
  unlocked: number;
  done: Set<number>;
  current: number;
  onPick: (i: number) => void;
}) {
  if (current === 0) return null;
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
            const isHere = current === n;
            const canGoBack = isOpen && n < current;
            const tone = isDone ? "text-[var(--color-cherry)]" : isOpen ? "text-[var(--color-white)]" : "text-white/25";
            const dot = (
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-transform ${isHere ? "scale-[1.8]" : ""} ${
                  isDone ? "bg-[var(--color-cherry)]" : isOpen ? "bg-white" : "bg-white/25"
                }`}
              />
            );
            const text = "flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] transition-colors";
            return (
              <li key={m} aria-current={isHere ? "step" : undefined}>
                {canGoBack ? (
                  <button
                    type="button"
                    onClick={() => onPick(n)}
                    className={`${text} ${tone} group cursor-pointer text-left hover:text-[var(--color-white)]`}
                  >
                    {dot}
                    <span className="underline-offset-4 group-hover:underline">{m}</span>
                    <span aria-hidden="true" className="opacity-0 transition-opacity group-hover:opacity-100">
                      ↑
                    </span>
                  </button>
                ) : (
                  <span className={`${text} ${tone} ${isHere ? "font-bold" : ""}`}>
                    {dot}
                    {m}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
