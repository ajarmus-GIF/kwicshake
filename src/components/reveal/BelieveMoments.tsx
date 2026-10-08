import type { ReactNode } from "react";
import { TextReveal } from "@/components/text/TextReveal";
import { worlds, worldFaces } from "@/lib/worlds";
import { BrowserFrame, MiniSite, PhoneFrame } from "./MiniSite";

/**
 * "They buy because they believe" — shown, not illustrated. Three moments, one per reason:
 * confidence (a cursor about to book), trust (search → listing → site, all one brand), and an
 * easy decision (one obvious button, everything else falling away). All three use the same
 * fictional accounting firm, so it also reads as one customer's path to yes.
 */
const firm = worlds.find((w) => w.id === "accounting")!;
const face = worldFaces[firm.face];

const moments: { name: string; line: string; visual: ReactNode }[] = [
  {
    name: "Confidence",
    line: "They remember the business that made them feel confident.",
    visual: (
      <div className="relative">
        <BrowserFrame url="ledgerwell.example">
          <MiniSite world={firm} layout="desktop" />
        </BrowserFrame>
        <svg
          className="believe-cursor absolute h-7 w-7 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#000" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>
    ),
  },
  {
    name: "Trust",
    line: "They trust the company that looked like it knew exactly what it was doing.",
    visual: (
      <div className="grid grid-cols-3 items-end gap-3 sm:gap-5">
        <PhoneFrame>
          <SearchScreen />
        </PhoneFrame>
        <PhoneFrame className="-translate-y-6">
          <ListingScreen />
        </PhoneFrame>
        <PhoneFrame>
          <MiniSite world={firm} />
        </PhoneFrame>
      </div>
    ),
  },
  {
    name: "Easy decision",
    line: "They choose the brand that made the decision feel easy.",
    visual: (
      <BrowserFrame url="ledgerwell.example/start">
        <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw]" style={{ background: firm.bg }}>
          {[62, 48, 70, 40].map((w, i) => (
            <span
              key={i}
              className="block h-[1.4cqw] rounded-full opacity-[0.12]"
              style={{ width: `${w}%`, background: firm.fg }}
            />
          ))}
          <span
            className="believe-cta rounded-full px-[4cqw] py-[1.8cqw] text-[1.8cqw] font-bold uppercase tracking-[0.08em]"
            style={{ background: firm.accent, color: firm.onAccent }}
          >
            {firm.cta}
          </span>
          {[54, 66].map((w, i) => (
            <span
              key={i}
              className="block h-[1.4cqw] rounded-full opacity-[0.12]"
              style={{ width: `${w}%`, background: firm.fg }}
            />
          ))}
        </div>
      </BrowserFrame>
    ),
  },
];

export function BelieveMoments() {
  return (
    <div className="relative mx-auto max-w-6xl">
      {moments.map((m, index) => (
        <div
          key={m.name}
          className="grid min-h-[70svh] items-center gap-10 py-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16"
        >
          <div>
            <p className="eyebrow">
              0{index + 1} / {m.name}
            </p>
            <TextReveal
              as="p"
              className="display-face mt-5 text-balance text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.15]"
            >
              {m.line}
            </TextReveal>
          </div>
          <div>{m.visual}</div>
        </div>
      ))}
      <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">
        {firm.name} is a concept study, not a client.
      </p>
    </div>
  );
}

function SearchScreen() {
  const rows = ["Ledgerwell CPA", "Taxes R Us", "Smith & Co Accounting"];
  return (
    <div className="flex h-full flex-col bg-white px-[6cqw] pt-[16cqw] text-[#202124]">
      <span className="rounded-full border border-[#dadce0] px-[5cqw] py-[3cqw] text-[4.2cqw]">
        best accountant near me
      </span>
      {rows.map((r, i) => (
        <span
          key={r}
          className="mt-[5cqw] block rounded-[2cqw] p-[3cqw]"
          style={i === 0 ? { background: "#fbeef0", outline: `1px solid ${firm.bg}` } : undefined}
        >
          <span className="block text-[4.6cqw]" style={{ color: i === 0 ? firm.bg : "#1a0dab", fontFamily: i === 0 ? face : undefined }}>
            {r}
          </span>
          <span className="mt-[1cqw] block text-[3.4cqw] text-[#70757a]">★★★★{i === 0 ? "★ 4.9" : "☆ 3.8"}</span>
        </span>
      ))}
    </div>
  );
}

function ListingScreen() {
  return (
    <div className="flex h-full flex-col bg-white text-[#202124]">
      <span className="block h-[38%]" style={{ background: firm.panel }} />
      <div className="px-[6cqw] pt-[5cqw]">
        <span className="block text-[6cqw]" style={{ color: firm.bg, fontFamily: face }}>
          {firm.name}
        </span>
        <span className="mt-[1.5cqw] block text-[3.6cqw] text-[#70757a]">★★★★★ 4.9 · Accountant</span>
        <span className="mt-[1.5cqw] block text-[3.6cqw] text-[#188038]">Open · Closes 6 PM</span>
        <span
          className="mt-[5cqw] block rounded-full py-[2.6cqw] text-center text-[3.6cqw] font-bold"
          style={{ background: firm.bg, color: firm.fg }}
        >
          Website
        </span>
      </div>
    </div>
  );
}
