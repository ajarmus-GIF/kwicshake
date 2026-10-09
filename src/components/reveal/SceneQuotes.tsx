import Image from "next/image";
import type { ReactNode } from "react";
import { TextReveal } from "@/components/text/TextReveal";
import { ScrollThread } from "@/components/atmosphere/ScrollThread";
import { worlds } from "@/lib/worlds";
import type { WinTone } from "@/lib/wins";
import { BrowserFrame, MiniSite, PhoneFrame } from "./MiniSite";

/**
 * "Sound familiar" — the five owner quotes, each staged as a scene from a real kind of business
 * rather than next to a portrait. No faces: the business is the subject, and the gap between how
 * good it is and how it looks is the thing every scene shows.
 *
 * Each row is a `data-tone-step`, so the surrounding ToneShift walks the background through the
 * site's purples as the reader goes.
 */
const restaurant = worlds.find((w) => w.id === "restaurant")!;
const salon = worlds.find((w) => w.id === "salon")!;
const carpentry = worlds.find((w) => w.id === "carpentry")!;

const scenes: { quote: string; tone: WinTone; caption: string; scene: ReactNode }[] = [
  {
    quote: "I know we're better than our website makes us look.",
    tone: "night",
    caption: "The room vs. the page",
    scene: (
      <div className="grid h-full grid-cols-2">
        <div className="relative">
          <Image
            src="/images/concepts/cafe.jpg"
            alt="A warmly lit restaurant dining room at night, every table full."
            fill
            sizes="(max-width: 768px) 50vw, 23vw"
            className="object-cover"
          />
        </div>
        <div className="grid place-items-center bg-[#16121d] p-3">
          <BrowserFrame url="kaito.example" className="w-full">
            <MiniSite world={restaurant} generic layout="desktop" />
          </BrowserFrame>
        </div>
      </div>
    ),
  },
  {
    quote: "We get good customers. I just wish more people knew about us.",
    tone: "dusk",
    caption: "Open, lit, and walked past",
    scene: (
      <Image
        src="/images/storefront-night.jpg"
        alt="A small storefront at night, its windows the only lit thing on the street."
        fill
        sizes="(max-width: 768px) 100vw, 45vw"
        className="object-cover"
      />
    ),
  },
  {
    quote: "Our business has grown, but our brand still looks like we're just getting started.",
    tone: "nova",
    caption: "Grown up. Still dressed like day one.",
    scene: (
      <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#2b1d3d,#0e0a16_70%)] py-6">
        <PhoneFrame className="h-[88%]">
          <MiniSite world={salon} generic />
        </PhoneFrame>
      </div>
    ),
  },
  {
    quote: "I don't even know where to start with marketing anymore.",
    tone: "lilac",
    caption: "Every tab open. None of them finished.",
    scene: <OverwhelmedDesk />,
  },
  {
    quote: "I know we have something good here. I just don't think people see it.",
    tone: "cherry",
    caption: "Beautiful work, in the dark",
    scene: (
      <div className="relative h-full bg-[#050407]">
        <span
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 40% 30% at 50% 62%, rgba(224,168,104,0.28), transparent 70%)" }}
        />
        <span className="absolute bottom-[30%] left-1/2 h-[16%] w-[52%] -translate-x-1/2 rounded-sm bg-[linear-gradient(180deg,#6b4a2b,#3a2717)] opacity-80 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9)]" />
        <span className="absolute bottom-[22%] left-[28%] h-[10%] w-[3%] bg-[#2a1c11] opacity-80" />
        <span className="absolute bottom-[22%] right-[28%] h-[10%] w-[3%] bg-[#2a1c11] opacity-80" />
        <span className="absolute bottom-[8%] left-1/2 -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/25">
          {carpentry.name}
        </span>
      </div>
    ),
  },
];

export function SceneQuotes() {
  return (
    <ol className="relative mx-auto max-w-6xl">
      {scenes.map((s, index) => {
        const flip = index % 2 === 1;
        return (
          <li key={s.quote} data-tone-step={s.tone}>
            <div
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <figure>
                <div
                  data-tone={s.tone}
                  className="tone-frame relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[color-mix(in_srgb,var(--tone-accent)_30%,transparent)]"
                >
                  {s.scene}
                </div>
                <figcaption className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">
                  {s.caption}
                </figcaption>
              </figure>
              <div className={flip ? "md:text-right" : ""}>
                <span className="eyebrow">0{index + 1}</span>
                <TextReveal
                  as="p"
                  className="display-face mt-4 text-balance text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.15]"
                >
                  &ldquo;{s.quote}&rdquo;
                </TextReveal>
              </div>
            </div>
            {index < scenes.length - 1 && (
              <ScrollThread from={flip ? 700 : 300} to={flip ? 300 : 700} className="my-6 h-16 sm:h-24" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** The marketing to-do pile, as a desk: tabs, tools and sticky notes stacked over each other. */
function OverwhelmedDesk() {
  const tabs = ["Ads Manager", "Analytics", "Search Console", "Canva", "Instagram", "Google Profile", "Email list", "Website builder", "TikTok", "Reviews"];
  const notes = ["post 3x/wk??", "fix SEO", "logo v7", "boost post?", "reply to reviews"];
  return (
    <div className="relative h-full overflow-hidden bg-[#1a1424]">
      {tabs.map((t, i) => (
        <span
          key={t}
          className="absolute rounded-md border border-white/10 bg-[#241c31] px-3 py-2 font-mono text-[0.6rem] text-white/60 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]"
          style={{ left: `${(i * 37) % 72}%`, top: `${8 + ((i * 23) % 70)}%`, transform: `rotate(${((i * 7) % 9) - 4}deg)` }}
        >
          {t}
        </span>
      ))}
      {notes.map((n, i) => (
        <span
          key={n}
          className="absolute w-[22%] bg-[#e9d77a] p-2 font-mono text-[0.6rem] leading-tight text-[#3a3210] shadow-[0_10px_20px_-8px_rgba(0,0,0,0.7)]"
          style={{ left: `${10 + ((i * 41) % 70)}%`, top: `${20 + ((i * 29) % 55)}%`, transform: `rotate(${((i * 11) % 13) - 6}deg)` }}
        >
          {n}
        </span>
      ))}
    </div>
  );
}
