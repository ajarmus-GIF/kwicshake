import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import { EditorialMedia } from "@/components/media/EditorialMedia";
import { TeamMemberFlow } from "@/components/about/TeamMemberFlow";
import { MonologuePull } from "@/components/marketing/MonologuePull";
import { Tagline } from "@/components/marketing/Tagline";
import { team } from "@/lib/team";
import { SiteHeader } from "@/components/SiteHeader";
import { SparkField } from "@/components/atmosphere/SparkField";

export const metadata = {
  title: "About — Kwic Shake",
  description:
    "Two brothers who build the marketing for businesses that are better than they look online. You talk to the people doing the work.",
};

/**
 * ── This page is about the client, not about us ─────────────────────────────────────────────
 *
 * It is a page about two people, which makes it the easiest page on the site to turn into a
 * pair of biographies nobody asked for. The discipline that prevents that: every section here
 * answers "what does this mean for you", not "here is what we have done".
 *
 * The hero states an obsession rather than a history. The origin story is one frustration, and
 * the frustration is about businesses like the reader's rather than about us. The small-agency
 * section is the most important on the page and is phrased entirely as things that will not
 * happen TO the reader — no handoffs, no ticket number, no meeting to schedule a meeting —
 * because that is a real, checkable advantage where "we care about our clients" is not.
 *
 * The founders' personal beats (see lib/team.ts) still run in full, because the flat declarative
 * voice in them is genuinely disarming and does more for trust than any credential list would.
 * They are framed by each founder's `intro` above and `inOtherWords` below so they read as
 * character rather than as trivia.
 *
 * ── The honesty constraint ──────────────────────────────────────────────────────────────────
 * Nothing here is inflated. Every claim traces to a beat in lib/team.ts. No awards, no client
 * counts, no years-in-business figure, no invented accolades.
 */
const wontHappen = [
  "You won't be handed off to a salesperson.",
  "You won't become ticket #1847.",
  "You won't need a meeting to schedule a meeting.",
  "You'll talk to the people actually doing the work.",
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero — same full-bleed dark band + glow + gradient headline as /services, so the two
          pages read as the same studio rather than two different templates. */}
      <section className="relative flex min-h-[60vh] flex-col justify-center overflow-hidden bg-[var(--color-raised)] px-6 py-24 text-[var(--color-on-dark)]">
        <SparkField variant="diagonal" />
        <div
          className="pointer-events-none absolute -top-1/3 left-[-10%] h-[65vw] max-h-[850px] w-[65vw] max-w-[850px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-5xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + The Studio
          </p>
          <TextReveal
            as="h1"
            className="max-w-4xl text-[clamp(2.25rem,6vw,4.75rem)] font-medium leading-[1.04] tracking-tight"
          >
            <span className="block">Two brothers.</span>
            <span className="block">One obsession:</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--color-cherry), var(--color-nova-secondary))",
              }}
            >
              Making good businesses look impossible to ignore.
            </span>
          </TextReveal>
        </div>
      </section>

      {/* Origin. One frustration, and it is about businesses like the reader's rather than
          about us — which is what keeps an origin story from being self-indulgent. */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-28">
        <span
          className="pointer-events-none absolute left-[-4%] top-0 select-none font-black leading-none opacity-[0.06]"
          style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "clamp(8rem,22vw,16rem)",
            color: "var(--color-cherry)",
          }}
          aria-hidden="true"
        >
          01
        </span>
        <div
          className="pointer-events-none absolute -bottom-1/4 right-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-14">
          {/* Offset cherry frame behind the photo, down-left. `-z-10` rather than DOM order
              alone: ParallaxMedia sets its own `relative overflow-hidden`, which would otherwise
              paint the photo's background over the frame's overlap. */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 -left-4 -z-10 h-full w-full border border-[var(--color-cherry)]/40"
            />
            <ParallaxMedia rate={0.15} className="aspect-[4/3] md:aspect-[3/4]">
              {/* aspect-auto + h-full: the ParallaxMedia wrapper above already owns the
                  ratio, and a second aspect rule here would fight it. */}
              {/* The asset is cropped to the left half of its source frame on purpose. The
                  right half carried a wall slogan — "INNOVATE. SCALE. IMPACT. TEAM SOLUTIONS."
                  — which is precisely the interchangeable agency language the copy on this site
                  argues against; lib/services.ts opens by naming what it is NOT. Letting it sit
                  on the studio's own wall would have the picture contradict the writing. Re-crop
                  from the source before swapping this file, or the slogan comes back. */}
              <EditorialMedia
                src="/images/studio-workspace.jpg"
                alt="A desk mid-project: two monitors of work in progress, a laptop, a lamp still on."
                label="Studio — workspace, 3:4"
                aspect="aspect-auto"
                className="h-full"
                from="bottom"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </ParallaxMedia>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
                + Why We Started
              </p>
              {/* `.display-face` is load-bearing, not decoration: every h1-h6 gets Archivo Black
                  from an element rule in globals.css, and this is a <p>, so without the class it
                  silently falls back to Karla at the same size and reads as a different
                  typeface. That face is also where the letter heft comes from — Archivo Black
                  has one weight, so font-medium here is inert. */}
              <TextReveal
                as="p"
                className="display-face text-[clamp(1.35rem,2.8vw,2rem)] font-medium leading-snug tracking-tight"
              >
                Too many genuinely good businesses{" "}
                <span className="text-[var(--color-cherry)]">
                  don&apos;t look like genuinely good businesses online.
                </span>
              </TextReveal>
            </div>

            <TextReveal
              as="p"
              className="text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
            >
              The company might be great. The work might be great. The people might be great. But
              none of that matters if the first impression doesn&apos;t communicate it.
            </TextReveal>

            <TextReveal as="p" className="text-lg font-medium leading-snug sm:text-xl">
              So we built Kwic Shake to fix that.
            </TextReveal>
          </div>
        </div>
      </section>

      {/* The goal, in our own words — the only place on the site where we say what we want. It
          is phrased as three things we want FOR the reader's business, not three things we do. */}
      <section className="relative overflow-hidden bg-[var(--color-surface)] px-6 py-28 sm:py-32">
        <div
          className="pointer-events-none absolute -top-1/4 left-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <TextReveal as="p" className="text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            We&apos;re not interested in creating marketing that simply checks a box. We want
            someone to land on your site and immediately understand:
          </TextReveal>

          <TextReveal
            as="p"
            className="display-face mt-8 text-balance text-[clamp(1.5rem,3.6vw,2.5rem)] font-medium leading-snug tracking-tight text-[var(--color-cherry)]"
          >
            &ldquo;These people know what they&apos;re doing.&rdquo;
          </TextReveal>

          <div className="mt-14 space-y-4">
            <TextReveal as="p" className="text-lg leading-snug sm:text-xl">
              We want your customers to trust you faster.
            </TextReveal>
            <TextReveal as="p" className="text-lg leading-snug sm:text-xl">
              We want your business to feel bigger.
            </TextReveal>
            <TextReveal as="p" className="text-lg leading-snug sm:text-xl">
              We want your digital presence to finally match the vision you have for the company.
            </TextReveal>
          </div>

          <TextReveal
            as="p"
            className="mt-12 text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-none"
          >
            That&apos;s the goal.
          </TextReveal>

          <div className="mt-20">
            <Tagline size="sm" />
          </div>
        </div>
      </section>

      {/* The reader's scepticism, said out loud before we answer it. */}
      <MonologuePull where="about" tone="raised" />

      {/* ── The small-agency advantage ──────────────────────────────────────────────────────
          The most persuasive section on this page, and the reason it is phrased as four things
          that will NOT happen: every agency claims to care, and none of those claims are
          checkable. "You'll talk to the people actually doing the work" is checkable on the
          first call, which is what makes it worth saying. */}
      <section className="relative overflow-hidden px-6 py-28 sm:py-32">
        <div
          className="pointer-events-none absolute -bottom-1/4 right-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + What You&apos;re Actually Getting
          </p>
          <TextReveal
            as="h2"
            className="display-face text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[1.06] tracking-tight"
          >
            You won&apos;t get lost here.
          </TextReveal>

          <ul className="mt-14 border-t border-[var(--color-border)]">
            {wontHappen.map((line) => (
              <li
                key={line}
                className="border-b border-[var(--color-border)] py-6 text-[clamp(1.15rem,2.6vw,1.6rem)] leading-snug sm:py-7"
              >
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-16">
            <TextReveal
              as="p"
              className="display-face text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-tight"
            >
              <span className="block">Less agency.</span>
              <span className="block text-[var(--color-cherry)]">More partnership.</span>
            </TextReveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 pb-10 pt-24">
        <span
          className="pointer-events-none absolute right-[-4%] top-0 select-none font-black leading-none opacity-[0.06]"
          style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "clamp(8rem,22vw,16rem)",
            color: "var(--color-cherry)",
          }}
          aria-hidden="true"
        >
          02
        </span>
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Who&apos;s Behind It
          </p>
          <TextReveal
            as="h2"
            className="text-[clamp(2.75rem,6.5vw,4.75rem)] font-medium leading-tight tracking-tight"
          >
            The <span className="text-[var(--color-cherry)]">Team</span>
          </TextReveal>
        </div>
      </section>

      {/* Each founder gets his own band, mirrored against the other: sticky name panel on one
          side, intro + beats + "in other words" streaming past on the other. */}
      {team.map((member, index) => (
        <TeamMemberFlow
          key={member.number}
          member={member}
          align={index % 2 === 0 ? "left" : "right"}
        />
      ))}

      {/* ── The two of us ───────────────────────────────────────────────────────────────────
          The argument that two people is a feature. It only works after both founders have been
          introduced, which is why it sits here rather than in the hero. */}
      <section className="relative overflow-hidden bg-[var(--color-surface)] px-6 py-28 sm:py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <TextReveal
            as="h2"
            className="display-face text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-tight"
          >
            <span className="block">Different strengths.</span>
            <span className="block text-[var(--color-cherry)]">Same standard.</span>
          </TextReveal>

          <div className="mt-12 space-y-4">
            <TextReveal as="p" className="text-lg leading-snug sm:text-xl">
              One thinks about the operation.
            </TextReveal>
            <TextReveal as="p" className="text-lg leading-snug sm:text-xl">
              One thinks about the experience.
            </TextReveal>
            <TextReveal as="p" className="text-lg leading-snug sm:text-xl">
              Both think about the customer.
            </TextReveal>
          </div>

          <TextReveal
            as="p"
            className="mt-12 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
          >
            And because we&apos;re the ones building Kwic Shake, we&apos;re invested in getting it
            right. No giant agency hierarchy. No disappearing account manager. No three-week wait
            for a simple change. Just two brothers who care deeply about the businesses we get to
            work with.
          </TextReveal>

          <div className="mt-20">
            <Tagline size="lg" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-center text-[var(--color-on-dark)] sm:py-36">
        <div
          className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <TextReveal
            as="h2"
            className="mb-10 text-balance text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[1.06] tracking-tight"
          >
            Curious what we&apos;d build for you?
          </TextReveal>
          <MagneticButton
            as={TransitionLink}
            href="/contact"
            radius={100}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
          >
            Start a Conversation
          </MagneticButton>
        </div>
      </section>
    </>
  );
}
