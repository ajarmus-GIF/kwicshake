"use client";

import { useState } from "react";
import { worlds } from "@/lib/worlds";
import { BrowserFrame, MiniSite } from "./MiniSite";
import { FlashRunner } from "./FlashRunner";

/**
 * The 200ms first-impression claim, run on the visitor instead of explained to them.
 *
 * Two flashes of the SAME business — first the template version, then the designed one — each on
 * screen for 200 milliseconds, each followed by "Would you trust this business?". The reveal shows
 * both side by side with their own answers under them. They didn't read anything either time;
 * they decided anyway. That's the point, proven on their own brain.
 *
 * The countdown and the 200ms flash itself live in FlashRunner, shared with the homepage run.
 */
const business = worlds.find((w) => w.id === "carpentry")!;

type Stage = "intro" | "flash" | "ask" | "reveal";
type Answer = "yes" | "no";

export function PerceptionTest() {
  const [stage, setStage] = useState<Stage>("intro");
  const [round, setRound] = useState<0 | 1>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const runRound = (r: 0 | 1) => {
    setRound(r);
    setStage("flash");
  };

  const answer = (a: Answer) => {
    const next = [...answers, a];
    setAnswers(next);
    if (round === 0) runRound(1);
    else setStage("reveal");
  };

  const reset = () => {
    setAnswers([]);
    setStage("intro");
  };

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[var(--color-paper)] px-6 py-24 text-[var(--color-ink)]">
      <div className="relative mx-auto w-full max-w-5xl text-center">
        {stage === "intro" && (
          <div>
            <p className="eyebrow mb-6">+ First Impressions</p>
            <h2 className="section-title mx-auto max-w-4xl uppercase">
              You have <span className="text-[var(--color-cherry)]">200 milliseconds.</span>
            </h2>
            <p className="section-lede mx-auto">
              We&apos;ll flash two websites, each for 200ms. Don&apos;t read. Just tell us if
              you&apos;d trust the business.
            </p>
            <button
              type="button"
              onClick={() => runRound(0)}
              className="mt-10 rounded-full bg-[var(--color-cherry)] px-9 py-4 text-xs font-bold uppercase tracking-widest text-[var(--color-paper)] transition-shadow hover:shadow-[0_0_32px_var(--color-glow)]"
            >
              Show me
            </button>
          </div>
        )}

        {stage === "flash" && (
          <FlashRunner
            key={round}
            world={business}
            generic={round === 0}
            url={`${business.id}.example`}
            eyebrow={`Website ${round + 1} of 2`}
            onDone={() => setStage("ask")}
          />
        )}

        {stage === "ask" && (
          <div>
            <p className="eyebrow mb-6">Website {round + 1} of 2</p>
            <h3 className="section-title mx-auto">Would you trust this business?</h3>
            <div className="mt-10 flex justify-center gap-4">
              {(["yes", "no"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => answer(a)}
                  className="min-w-32 rounded-full border border-[var(--color-ash-40)] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:border-[var(--color-cherry)] hover:text-[var(--color-cherry)]"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "reveal" && (
          <div>
            <p className="eyebrow mb-6">+ The result</p>
            <h2 className="section-title mx-auto uppercase">
              You already <span className="text-[var(--color-cherry)]">decided.</span>
            </h2>
            <p className="section-lede mx-auto">
              Same business. Same 200 milliseconds. You didn&apos;t read a word either time.
            </p>
            <div className="mt-12 grid gap-6 text-left sm:grid-cols-2">
              {[0, 1].map((r) => (
                <figure key={r}>
                  <BrowserFrame url={`${business.id}.example`}>
                    <MiniSite world={business} generic={r === 0} layout="desktop" />
                  </BrowserFrame>
                  <figcaption className="mt-3 flex justify-between font-mono text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">
                    <span>{r === 0 ? "Template" : "Designed"}</span>
                    <span>
                      You said{" "}
                      <span className="text-[var(--color-cherry)]">{answers[r] ?? "—"}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="display-face mx-auto mt-14 max-w-3xl text-balance text-[clamp(1.5rem,3.6vw,2.5rem)] leading-snug">
              People decide before they connect.{" "}
              <span className="text-[var(--color-cherry)]">Your first impression is already marketing.</span>
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-muted)] underline underline-offset-4 hover:text-[var(--color-cherry)]"
            >
              Run it again
            </button>
            <p className="mx-auto mt-6 max-w-md text-xs text-[var(--color-muted)]">
              Northgrain Carpentry is a concept study, not a client.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
