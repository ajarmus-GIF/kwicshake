import { TextReveal } from "@/components/text/TextReveal";
import { MagneticButton } from "@/components/interactive/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionProvider";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { TeamMemberFlow } from "@/components/about/TeamMemberFlow";
import { team } from "@/lib/team";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = { title: "About — Kwic Shake" };

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero — same full-bleed dark band + glow + gradient headline as /services, so the two
          pages read as the same studio rather than two different templates. */}
      <section className="relative flex min-h-[60vh] flex-col justify-center overflow-hidden bg-[var(--color-raised)] px-6 py-24 text-[var(--color-on-dark)]">
        <div
          className="pointer-events-none absolute -top-1/3 left-[-10%] h-[65vw] max-h-[850px] w-[65vw] max-w-[850px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + The Studio
          </p>
          <TextReveal as="h1" className="max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[1.05] tracking-tight">
            Two brothers.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--color-cherry), var(--color-nova-secondary))" }}
            >
              One obsession.
            </span>
          </TextReveal>
        </div>
      </section>

      {/* Intro. Built from the decoration vocabulary the rest of the page already uses —
          nothing invented here — so it stops reading as an unstyled slab between the hero and
          "The Team": a cherry eyebrow, a section numeral bled off the edge, one glow blob, and
          an offset frame on the image.

          The numeral is "01" and it hangs off the LEFT. "The Team" below carries "02" off the
          right, so this both completes a sequence that previously started at 02 with nothing
          before it, and alternates sides with it — the same left/right mirroring TeamMemberFlow
          does band to band. Its font is set inline rather than via `.display-face` because it
          needs `font-black` on a face that has one weight: this is decoration, not type, and
          the inline style keeps it from being mistaken for a heading treatment. */}
      <section className="relative overflow-hidden px-6 py-24">
        <span
          className="pointer-events-none absolute left-[-4%] top-0 select-none font-black leading-none opacity-[0.06]"
          style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(8rem,22vw,16rem)", color: "var(--color-cherry)" }}
          aria-hidden="true"
        >
          01
        </span>
        <div
          className="pointer-events-none absolute -bottom-1/4 right-[-12%] h-[55vw] max-h-[650px] w-[55vw] max-w-[650px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          {/* Offset cherry frame behind the photo, down-left so it reads against the numeral
              on that side. `-z-10` rather than DOM order alone: ParallaxMedia sets its own
              `relative overflow-hidden`, which would otherwise paint the photo's background
              over the frame's overlap. Hairline and 40% alpha — at full strength it competes
              with the image instead of framing it. */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 -left-4 -z-10 h-full w-full border border-[var(--color-cherry)]/40"
            />
            <ParallaxMedia rate={0.15} className="aspect-[4/3] md:aspect-[3/4]">
              <PlaceholderMedia label="TODO: image" aspect="aspect-auto" className="h-full" />
            </ParallaxMedia>
          </div>
        {/* Hook then argument.

            The two declaratives wear "The Team" heading's treatment — .display-face,
            font-medium, leading-tight, tracking-tight, second half in solid --color-cherry,
            same `plain word + cherry <span>` shape — at roughly half its size. That heading
            gets a full-width max-w-6xl container; this sits in the 1.2fr column of a
            two-column grid (~33rem), where the same clamp ran to four wrapped lines and read
            as a competing page title rather than as an intro.

            `.display-face` is the load-bearing class, not decoration. Every h1-h6 gets
            "Archivo Black" from an element rule in globals.css; this is a <p>, so without the
            class it silently falls back to Karla and reads as a different typeface at the
            same size, weight, and tracking. That face is also where the letter heft comes
            from — Archivo Black has one weight, so font-medium here is inert.

            Solid cherry, not the hero's cherry->nova-secondary gradient, because that is what
            "The Team" uses — and it is also the accessible half of that pair: nova-secondary
            is ~2.4:1 as text (see the token's contrast note in globals.css).

            `whitespace-nowrap` per sentence: at this size each one clears the column on its
            own at every width in the clamp, so the only break available is BETWEEN them.
            Without it a mid-width viewport breaks mid-sentence and the color change lands in
            the middle of a line, which is the one way this treatment looks like a mistake.
            (It was correctly absent at 4.75rem — there a single sentence was wider than the
            column, and pinning it unbreakable pushed text past the column edge.)

            The pitch under it stays at body size and --color-muted; same size for both would
            be an undifferentiated wall and the eye would have nowhere to land first.

            Display type on a <p>, not a heading: the page's h1 is "Two brothers. One
            obsession." above and its h2 is "The Team" below, and this is a statement between
            them, not a third section title.

            Second paragraph is the client's own copy, verbatim — same rule as the beats in
            team.ts. The direct address ("you want the phone to ring") is the point; tidying
            it into third-person agency prose is exactly what it's arguing against.

            Static styled spans inside TextReveal are fine — the hero above and "The Team"
            below both do this, and SplitText carries nested inline elements across the lines
            it builds. What must stay out is anything React owns and re-renders or attaches
            handlers to (an <a>, a client component); that is the constraint on the home
            page's founders' note, and it is narrower than "plain text only".

            Wrapped in a flex column rather than sitting as two grid children — the parent is
            a two-column grid, so a bare second <p> would wrap to a new row under the image
            instead of stacking here. */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
                + Who We Are
              </p>
              <TextReveal
                as="p"
                className="display-face text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-tight tracking-tight"
              >
                <span className="whitespace-nowrap">Aidan markets it.</span>{" "}
                <span className="whitespace-nowrap text-[var(--color-cherry)]">Jonah runs it.</span>
              </TextReveal>
            </div>
            <TextReveal as="p" className="text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
              We&apos;re Aidan and Jonah Jarmus, two brothers who started Kwic Shake on a simple
              belief: you want way more than just a website. You want the phone to ring. You want to
              look like the company you&apos;ve been describing to people for years. You want to
              stop wondering whether your marketing is working and start seeing it. So yes, we
              build websites, but what we&apos;re really building is the version of your business
              you&apos;ve been carrying around in your head. We handle the SEO that puts you in
              front of the people already looking for you, the social media direction that sounds
              like you instead of an algorithm, and a working relationship where you text us and
              we answer. No agency runaround, no jargon, no waiting three weeks for a headline
              change. Just the two of us, taking your business as seriously as you do, and handing
              you back something that finally looks the part.
            </TextReveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 pb-10 pt-24">
        <span
          className="pointer-events-none absolute right-[-4%] top-0 select-none font-black leading-none opacity-[0.06]"
          style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(8rem,22vw,16rem)", color: "var(--color-cherry)" }}
          aria-hidden="true"
        >
          02
        </span>
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--color-cherry)]">
            + Who&apos;s Behind It
          </p>
          {/* "Team" in --color-cherry, the same accent the home page puts on "Beyond A Website"
              and "impossible to scroll past." — the one purple in this palette that clears 4.5:1
              as text (see the token's contrast note in globals.css). */}
          <TextReveal
            as="h2"
            className="text-[clamp(2.75rem,6.5vw,4.75rem)] font-medium leading-tight tracking-tight"
          >
            The <span className="text-[var(--color-cherry)]">Team</span>
          </TextReveal>
        </div>
      </section>

      {/* Each founder gets his own band, mirrored against the other: sticky name panel on one
          side, beats streaming past on the other. See TeamMemberFlow for why this is sticky
          rather than pinned, and why the beat counter runs even under reduced motion. */}
      {team.map((member, index) => (
        <TeamMemberFlow
          key={member.number}
          member={member}
          align={index % 2 === 0 ? "left" : "right"}
        />
      ))}

      {/* Close — mirrors /services' closing CTA so the two pages bookend the same way. */}
      <section className="relative overflow-hidden bg-[var(--color-raised)] px-6 py-28 text-center text-[var(--color-on-dark)] sm:py-36">
        <div
          className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <TextReveal
            as="h2"
            className="mb-10 text-[clamp(2.25rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight"
          >
            Curious what we&apos;d build for you?
          </TextReveal>
          <MagneticButton
            as={TransitionLink}
            href="/contact"
            radius={100}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-widest text-[var(--color-button-primary-text)]"
          >
            Start a Project
          </MagneticButton>
        </div>
      </section>
    </>
  );
}
