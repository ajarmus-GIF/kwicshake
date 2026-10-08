import type { CSSProperties, ReactNode } from "react";
import { worldFaces, type World } from "@/lib/worlds";

/**
 * A tiny, real (HTML, not a screenshot) website for one of the worlds in lib/worlds.ts.
 *
 * Everything is sized in container-query units (cqw) so the same markup reads correctly inside a
 * 260px phone or a 900px browser window — the frame decides the size, the site just fills it.
 * `layout="desktop"` switches the hero to two columns for the browser frame.
 *
 * `generic` renders the same business the way a template builder would: default fonts, centred
 * everything, a grey placeholder image, "Welcome to our website!". It is the "before" in the
 * perception test and the image-picker slider, and it is intentionally bland rather than ugly —
 * the point is that it's forgettable, not broken.
 */
export function MiniSite({
  world,
  generic = false,
  layout = "phone",
}: {
  world: World;
  generic?: boolean;
  layout?: "phone" | "desktop";
}) {
  const desktop = layout === "desktop";
  if (generic) return <GenericSite world={world} desktop={desktop} />;

  const face = worldFaces[world.face];
  const s = (phone: number, wide: number) => `${desktop ? wide : phone}cqw`;

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      style={{ background: world.bg, color: world.fg, fontFamily: "var(--font-body), sans-serif" }}
    >
      <nav
        className="flex items-center justify-between"
        style={{ padding: `${s(5, 2)} ${s(6, 3.5)}`, fontSize: s(3.4, 1.3) }}
      >
        <span style={{ fontFamily: face, fontSize: s(4.6, 1.8), letterSpacing: "-0.01em" }}>
          {world.name}
        </span>
        <span className="flex" style={{ gap: s(3.5, 2), opacity: 0.75 }}>
          {(desktop ? world.nav : world.nav.slice(-1)).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
      </nav>

      <div
        className={desktop ? "grid flex-1 grid-cols-2 items-center" : "flex flex-1 flex-col"}
        style={{ gap: s(5, 4), padding: `${s(4, 2)} ${s(6, 3.5)} ${s(6, 3)}` }}
      >
        <div>
          <p style={{ fontSize: s(3, 1.1), letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>
            {world.kicker}
          </p>
          <p
            style={{
              fontFamily: face,
              fontSize: s(10.5, 4.4),
              lineHeight: 1.02,
              letterSpacing: world.face === "mono" ? "-0.04em" : "-0.02em",
              marginTop: s(3, 1.4),
              textTransform: world.face === "mono" ? "uppercase" : undefined,
            }}
          >
            {world.headline}
          </p>
          <p style={{ fontSize: s(3.8, 1.5), lineHeight: 1.4, opacity: 0.78, marginTop: s(3.5, 1.6) }}>
            {world.sub}
          </p>
          <span
            className="inline-block"
            style={{
              background: world.accent,
              color: world.onAccent,
              fontSize: s(3.4, 1.25),
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: `${s(3, 1.2)} ${s(5, 2.2)}`,
              marginTop: s(5, 2.4),
              borderRadius: world.face === "serif" ? 0 : "999px",
            }}
          >
            {world.cta}
          </span>
        </div>

        <HeroArt world={world} style={{ minHeight: desktop ? "28cqw" : "42cqw" }} />
      </div>

      <div
        className="grid grid-cols-3"
        style={{ borderTop: `1px solid color-mix(in srgb, ${world.fg} 15%, transparent)`, fontSize: s(2.8, 1.1) }}
      >
        {world.points.map((point) => (
          <span key={point} style={{ padding: `${s(3.5, 1.4)} ${s(3, 2)}`, opacity: 0.8 }}>
            {point}
          </span>
        ))}
      </div>
    </div>
  );
}

/** An abstract "photograph" for the hero: light falling across a surface in the world's colours.
 *  Deliberately not an illustration of the product — it reads as art direction, not clip art. */
function HeroArt({ world, style }: { world: World; style?: CSSProperties }) {
  return (
    <div className="relative flex-1 overflow-hidden" style={{ background: world.panel, ...style }}>
      <span
        className="absolute rounded-full blur-2xl"
        style={{
          width: "70%",
          height: "70%",
          right: "-10%",
          top: "-15%",
          background: `color-mix(in srgb, ${world.accent} 55%, transparent)`,
        }}
      />
      <span
        className="absolute inset-x-[12%] bottom-[14%] h-[38%]"
        style={{
          border: `1px solid color-mix(in srgb, ${world.fg} 30%, transparent)`,
          borderRadius: world.face === "serif" ? 0 : "0.6cqw",
        }}
      />
      <span
        className="absolute bottom-[14%] left-[12%] h-[1px] w-[76%]"
        style={{ background: world.accent }}
      />
    </div>
  );
}

function GenericSite({ world, desktop }: { world: World; desktop: boolean }) {
  const s = (phone: number, wide: number) => `${desktop ? wide : phone}cqw`;
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden text-center"
      style={{ background: "#ffffff", color: "#333333", fontFamily: '"Times New Roman", Times, serif' }}
    >
      <div style={{ background: "#3a5ea8", color: "#ffffff", padding: s(3, 1.2), fontSize: s(3.6, 1.4) }}>
        {world.name}
      </div>
      <div
        className="flex"
        style={{ justifyContent: "center", gap: s(3, 1.6), padding: s(2, 0.8), fontSize: s(3, 1.1), color: "#1a0dab", textDecoration: "underline", background: "#eeeeee" }}
      >
        <span>Home</span>
        {world.nav.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="flex flex-1 flex-col items-center" style={{ padding: s(5, 2.5), gap: s(3, 1.4) }}>
        <p style={{ fontSize: s(6.5, 2.8), fontWeight: 700 }}>Welcome to our website!</p>
        <p style={{ fontSize: s(3.4, 1.3), color: "#666666", maxWidth: "90%" }}>
          We are a {world.industry.toLowerCase()} business. We offer quality services at affordable
          prices. Please contact us for more information.
        </p>
        <Placeholder style={{ width: desktop ? "45%" : "80%", flex: 1, minHeight: desktop ? "16cqw" : "30cqw" }} />
        <span style={{ fontSize: s(3.4, 1.3), color: "#1a0dab", textDecoration: "underline" }}>
          Click here to contact us
        </span>
      </div>
      <div style={{ background: "#eeeeee", padding: s(2.5, 1), fontSize: s(2.6, 1), color: "#888888" }}>
        © {world.name} · All rights reserved
      </div>
    </div>
  );
}

function Placeholder({ style }: { style?: CSSProperties }) {
  return (
    <div className="relative" style={{ background: "#dddddd", border: "1px solid #bbbbbb", ...style }}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
        <line x1="0" y1="0" x2="100" y2="100" stroke="#bbbbbb" strokeWidth="0.6" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#bbbbbb" strokeWidth="0.6" />
      </svg>
    </div>
  );
}

/** A phone body. The screen is a size container so MiniSite's cqw units resolve against it. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19] rounded-[2.6rem] border border-white/15 bg-[#07050d] p-[0.55rem] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9),0_0_90px_-30px_var(--color-glow)] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] [container-type:inline-size]">
        {children}
        <span className="pointer-events-none absolute left-1/2 top-[0.6rem] h-[1.1rem] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

/** A browser window. Same container trick as PhoneFrame. */
export function BrowserFrame({
  children,
  url,
  className = "",
}: {
  children: ReactNode;
  url: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/12 bg-[#0d0a16] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 truncate rounded-md bg-white/5 px-3 py-1 font-mono text-[0.65rem] text-white/45">
          {url}
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full [container-type:inline-size]">{children}</div>
    </div>
  );
}
