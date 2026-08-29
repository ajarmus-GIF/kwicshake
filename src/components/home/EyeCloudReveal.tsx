"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { TextReveal } from "@/components/text/TextReveal";

const BREATHE_SCALE = 1.14;
const BREATHE_DURATION = 3.4;

// The eye's outline as a path (an ellipse, cx 50 cy 50 rx 46 ry 26, expressed as two arcs) so
// MorphSVGPlugin has a real `d` to interpolate from — you can't morph an <ellipse>.
const EYE_PATH = "M4,50 A46,26 0 1,0 96,50 A46,26 0 1,0 4,50 Z";

// The thought-cloud outline, lifted from the old ThoughtBubble.tsx and shifted +14 on every
// y-coordinate so it's centered in this component's 100x100 viewBox instead of ThoughtBubble's
// original 100x70 one — otherwise the morph reads as sliding down mid-transition.
const CLOUD_PATH =
  "M30,59 C20,59 15,49 20,42 C15,34 25,24 35,28 C38,20 52,18 58,24 C68,18 82,24 78,34 C88,36 88,50 78,52 C82,62 68,66 60,60 C55,68 40,68 34,62 C28,64 24,62 30,59 Z";

// Same +14 shift applied to the three trailing dots.
const CLOUD_DOTS = [
  { cx: 22, cy: 72, r: 5 },
  { cx: 13, cy: 78, r: 3.5 },
  { cx: 7, cy: 82, r: 2 },
];

/**
 * Replaces the old static "EyeOpen next to line one, ThoughtBubble next to line two" pairing
 * with one continuous performance: a single traveling icon draws itself as an eye next to line
 * one, morphs into the thought-cloud while sliding across to line two, and only once it's landed
 * does a second, independent eye blink open back at line one. Reads as "the idea gets seen, then
 * remembered" instead of two icons that just happen to sit there.
 *
 * Three moving pieces, all driven by one ScrollTrigger (`once: true` — this is a one-time intro,
 * not a scrubbed effect):
 *
 * 1. `travelerRef` — an absolutely-positioned div that structurally lives inside slot two (so a
 *    no-JS visitor sees exactly the old resting state: a cloud icon next to line two, dots and
 *    all — the CLOUD_PATH/CLOUD_DOTS values above are literally what's server-rendered). On
 *    mount, JS immediately (before paint) rewinds it: translates it up to slot one's position,
 *    swaps its path to EYE_PATH, and zeroes its stroke-draw — matching this codebase's
 *    hide-before-reveal convention (see TextReveal, ThoughtBubble) so nothing ever visibly pops.
 * 2. `row1EyeWrapRef` — a second, independent eye sitting in slot one, hidden until the traveler
 *    lands, then blinks open once (identical lid mechanics to the old EyeOpen.tsx) and stays open —
 *    no recurring/idle blinking after that.
 * 3. Slot one and two are measured via `getBoundingClientRect` (not hardcoded offsets) so the
 *    travel vector is correct regardless of how the two lines wrap at a given viewport width.
 *    Both axes matter: each row centers its own icon+text group, so the shorter line one parks
 *    its slot further right and the trip is a diagonal whose dx changes with every reflow.
 *
 * `prefers-reduced-motion` skips straight to the end state: traveler stays put as the cloud
 * (its default markup already is one), row one's eye is just set open, no loops are scheduled.
 */
export function EyeCloudReveal({ lineOne, lineTwo }: { lineOne: ReactNode; lineTwo: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const slot1Ref = useRef<HTMLDivElement>(null);
  const slot2Ref = useRef<HTMLDivElement>(null);

  const travelerRef = useRef<HTMLDivElement>(null);
  const travelerShapeGroupRef = useRef<SVGGElement>(null);
  const travelerOutlineRef = useRef<SVGPathElement>(null);
  const travelerPupilGroupRef = useRef<SVGGElement>(null);
  const dot1Ref = useRef<SVGCircleElement>(null);
  const dot2Ref = useRef<SVGCircleElement>(null);
  const dot3Ref = useRef<SVGCircleElement>(null);

  const row1EyeWrapRef = useRef<HTMLDivElement>(null);
  const row1TopLidRef = useRef<SVGGElement>(null);
  const row1BottomLidRef = useRef<SVGGElement>(null);

  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const slot1 = slot1Ref.current;
      const slot2 = slot2Ref.current;
      const traveler = travelerRef.current;
      const outline = travelerOutlineRef.current;
      const pupil = travelerPupilGroupRef.current;
      const dots = [dot1Ref.current, dot2Ref.current, dot3Ref.current];
      const row1Wrap = row1EyeWrapRef.current;
      const topLid = row1TopLidRef.current;
      const bottomLid = row1BottomLidRef.current;
      if (!section || !slot1 || !slot2 || !traveler || !outline || !pupil || !row1Wrap || !topLid || !bottomLid) {
        return;
      }
      if (dots.some((d) => !d)) return;

      if (prefersReducedMotion) {
        gsap.set(row1Wrap, { opacity: 1 });
        gsap.set(topLid, { y: -60 });
        gsap.set(bottomLid, { y: 60 });
        return;
      }

      let hasPlayed = false;
      const measure = () => {
        const r1 = slot1.getBoundingClientRect();
        const r2 = slot2.getBoundingClientRect();
        return { dx: r1.left - r2.left, dy: r1.top - r2.top };
      };

      // Rewind the traveler (default markup = resting cloud in slot two) back up to slot one
      // and reshape it into the not-yet-drawn eye — all before first paint, so no-JS and
      // slow-JS visitors never see a flash of the wrong icon in the wrong place.
      const rewind = () => {
        const { dx, dy } = measure();
        gsap.set(traveler, { x: dx, y: dy, rotation: 0, scale: 1 });
        gsap.set(outline, { attr: { d: EYE_PATH, "stroke-width": 4 }, drawSVG: "0%" });
        gsap.set(pupil, { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
        gsap.set(dots, { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
        gsap.set(row1Wrap, { opacity: 0 });
        gsap.set([topLid, bottomLid], { y: 0 });
      };
      rewind();

      const onResize = () => {
        if (!hasPlayed) rewind();
      };
      window.addEventListener("resize", onResize);

      let breathe: gsap.core.Tween | null = null;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          hasPlayed = true;
          rewind(); // final re-measure — layout may have settled further since mount

          gsap
            .timeline()
            // 1. The eye draws itself in next to line one.
            .to(outline, { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" })
            .to(pupil, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, "-=0.15")
            .to({}, { duration: 0.35 }) // a beat to actually look like an eye before it moves
            // 2. It morphs into the cloud and slides down to line two, all in one motion.
            .addLabel("morph")
            .to(outline, { morphSVG: CLOUD_PATH, attr: { "stroke-width": 3 }, duration: 1.15, ease: "power3.inOut" }, "morph")
            .to(traveler, { x: 0, y: 0, duration: 1.15, ease: "power3.inOut" }, "morph")
            .to(pupil, { opacity: 0, scale: 0.3, duration: 0.5, ease: "power2.in" }, "morph")
            .fromTo(
              dots,
              { opacity: 0, scale: 0 },
              { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(2)" },
              "morph+=0.7"
            )
            // landing squash + settle shake, echoing the old ThoughtBubble pop-in
            .to(traveler, { scale: 1.08, duration: 0.16, ease: "power1.out" })
            .to(traveler, { scale: 1, duration: 0.35, ease: "elastic.out(1,0.6)" })
            .to(traveler, { rotation: 6, duration: 0.1, ease: "power1.inOut" })
            .to(traveler, { rotation: -6, duration: 0.1, ease: "power1.inOut" })
            .to(traveler, { rotation: 3, duration: 0.1, ease: "power1.inOut" })
            .to(traveler, { rotation: 0, duration: 0.14, ease: "power1.out" })
            // 3. Only now does a fresh eye blink open back at line one.
            .to(row1Wrap, { opacity: 1, duration: 0.01 })
            .to(topLid, { y: -60, duration: 0.5, ease: "power3.out" })
            .to(bottomLid, { y: 60, duration: 0.5, ease: "power3.out" }, "<")
            .call(() => {
              breathe = gsap.to(travelerShapeGroupRef.current, {
                scale: BREATHE_SCALE,
                transformOrigin: "51px 50px",
                duration: BREATHE_DURATION,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            });
        },
      });

      return () => {
        window.removeEventListener("resize", onResize);
        trigger.kill();
        breathe?.kill();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div
      ref={sectionRef}
      /* Each row centers its own icon+text group (`justify-center` below), rather than the two
         rows sharing a left edge and the whole lockup being centered as one block. The block was
         already centered that way, but with the icon column eating the left side the *words* sat
         visibly right of center, which is the thing that read as uncentered.
         The cost: the two slots no longer share an x, so the traveler's trip to line two is a
         diagonal rather than a straight drop. That still lands correctly — `measure()` above
         returns dx as well as dy for exactly this reason; it was never assuming dx was 0.
         `w-fit` stays so the divider hairlines hug the widest row instead of running the full
         56rem. The max-width is a single `min()` rather than two classes — 56rem is the old
         max-w-4xl cap, and the 100% term is what stops a max-content column from overflowing a
         narrow viewport. */
      className="relative mx-auto flex w-fit max-w-[min(56rem,100%)] flex-col divide-y divide-[var(--color-border)]"
    >
      <div className="flex items-center justify-center gap-8 py-8 sm:gap-12">
        <div ref={slot1Ref} className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
          <div ref={row1EyeWrapRef} className="absolute inset-0">
            <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
              <ellipse cx="50" cy="50" rx="46" ry="26" fill="none" stroke="var(--color-fg)" strokeWidth="4" />
              <g>
                <circle cx="50" cy="50" r="19" fill="none" stroke="var(--color-fg)" strokeWidth="2" />
                <circle cx="50" cy="50" r="13" fill="var(--color-fg)" />
                <circle cx="55" cy="45" r="4" fill="var(--color-surface)" />
              </g>
              <g ref={row1TopLidRef}>
                <path d="M4,50 Q50,16 96,50 L96,-10 L4,-10 Z" fill="var(--color-surface)" />
                <g stroke="var(--color-fg)" strokeWidth="3" strokeLinecap="round">
                  <line x1="20" y1="42" x2="13" y2="29" />
                  <line x1="35" y1="30" x2="31" y2="15" />
                  <line x1="50" y1="26" x2="50" y2="10" />
                  <line x1="65" y1="30" x2="69" y2="15" />
                  <line x1="80" y1="42" x2="87" y2="29" />
                </g>
              </g>
              <g ref={row1BottomLidRef}>
                <path d="M4,50 Q50,84 96,50 L96,110 L4,110 Z" fill="var(--color-surface)" />
                <g stroke="var(--color-fg)" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="30" y1="58" x2="27" y2="68" />
                  <line x1="50" y1="61" x2="50" y2="72" />
                  <line x1="70" y1="58" x2="73" y2="68" />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <TextReveal as="p" className="text-center text-[clamp(1.5rem,3.5vw,2.25rem)] leading-snug">
          {lineOne}
        </TextReveal>
      </div>

      <div className="flex items-center justify-center gap-8 py-8 sm:gap-12">
        <div ref={slot2Ref} className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
          <div ref={travelerRef} className="absolute inset-0">
            <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
              <g ref={travelerShapeGroupRef}>
                <path
                  ref={travelerOutlineRef}
                  d={CLOUD_PATH}
                  fill="none"
                  stroke="var(--color-fg)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <g ref={travelerPupilGroupRef} style={{ opacity: 0 }}>
                <circle cx="50" cy="50" r="19" fill="none" stroke="var(--color-fg)" strokeWidth="2" />
                <circle cx="50" cy="50" r="13" fill="var(--color-fg)" />
                <circle cx="55" cy="45" r="4" fill="var(--color-surface)" />
              </g>
              <circle ref={dot1Ref} cx={CLOUD_DOTS[0].cx} cy={CLOUD_DOTS[0].cy} r={CLOUD_DOTS[0].r} fill="var(--color-fg)" />
              <circle ref={dot2Ref} cx={CLOUD_DOTS[1].cx} cy={CLOUD_DOTS[1].cy} r={CLOUD_DOTS[1].r} fill="var(--color-fg)" />
              <circle ref={dot3Ref} cx={CLOUD_DOTS[2].cx} cy={CLOUD_DOTS[2].cy} r={CLOUD_DOTS[2].r} fill="var(--color-fg)" />
            </svg>
          </div>
        </div>
        <TextReveal as="p" className="text-center text-[clamp(1.5rem,3.5vw,2.25rem)] leading-snug">
          {lineTwo}
        </TextReveal>
      </div>
    </div>
  );
}
