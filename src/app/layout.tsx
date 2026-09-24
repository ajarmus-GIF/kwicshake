import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Archivo_Black, Karla } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { TAGLINE } from "@/lib/site";

// TODO: swap for real typefaces via next/font/local or next/font/google.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: swap for a real display/quote typeface — placeholder bouncy hand-lettered script,
// bold weight, standing in for a custom hand-lettered quote treatment.
const caveat = Caveat({
  variable: "--font-quote",
  subsets: ["latin"],
  weight: "700",
});

// The two faces the site actually reads in. Both used to arrive through a stylesheet <link> to
// fonts.googleapis.com in <head>, which is the worst available way to load a webfont: it is
// render-blocking, and it blocks on a *third-party* origin, so first paint waited on a DNS
// lookup, a TLS handshake and a CSS round trip before the browser even learned which .woff2
// files it needed — then paid a second handshake to fonts.gstatic.com to fetch them.
//
// next/font downloads both at build time and serves them from this origin, hashed and
// immutable, with a <link rel=preload> emitted in the same document that needs them. No
// third-party connection, no blocking stylesheet, and no layout shift: `display: "swap"` plus
// Next's generated fallback metrics keep the pre-swap text at the same measure.
//
// Archivo Black ships a single weight, so it is declared as one. Karla is a variable font and
// takes the full 400-700 range the design uses, at one file rather than three.
const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const karla = Karla({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// `metadataBase` is the Next.js equivalent of Astro's `site`: the absolute origin every
// relative URL in metadata resolves against (canonical links, OG/Twitter images). Without it
// Next emits relative URLs and warns at build time, and link previews resolve against
// whatever host served the page — the deploy preview URL rather than the real domain.
export const metadata: Metadata = {
  metadataBase: new URL("https://kwicshake.com"),
  title: {
    default: `Kwic Shake — ${TAGLINE}`,
    // Pages set a bare title (e.g. "About — Kwic Shake"); this template leaves those alone.
    template: "%s",
  },
  description:
    "You built a great business. Does your marketing show it? Kwic Shake builds websites, brands, social, and search presence that make people stop, feel something, and take the next step.",
  openGraph: {
    title: `Kwic Shake — ${TAGLINE}`,
    description:
      "A digital marketing agency for businesses that are better than they look online. Web design, brand, social, advertising, real-world marketing, and SEO — built as one connected system.",
    url: "/",
    siteName: "Kwic Shake",
    type: "website",
  },
};

// Layout mounts once for the whole app session — everything here (Lenis, the transition
// overlay) must be a singleton that survives client-side navigation.
// Per-route mount/unmount behavior belongs in template.tsx instead.
//
// SiteHeader is deliberately NOT rendered here: it needs to sit below the home page's hero
// image in normal document flow (so `sticky` catches it there) but at the very top on every
// other page, and that position varies per route. Each page renders its own <SiteHeader />
// in the right spot instead.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${archivoBlack.variable} ${karla.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-[var(--color-bg)] text-[var(--color-fg)] antialiased">
        <TransitionProvider>
          <SmoothScroll>
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </SmoothScroll>
        </TransitionProvider>
      </body>
    </html>
  );
}
