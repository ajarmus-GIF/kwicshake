import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { Preloader } from "@/components/preloader/Preloader";
import { SiteFooter } from "@/components/SiteFooter";

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

// `metadataBase` is the Next.js equivalent of Astro's `site`: the absolute origin every
// relative URL in metadata resolves against (canonical links, OG/Twitter images). Without it
// Next emits relative URLs and warns at build time, and link previews resolve against
// whatever host served the page — the deploy preview URL rather than the real domain.
export const metadata: Metadata = {
  metadataBase: new URL("https://kwicshake.com"),
  title: "Kwic Shake",
  description: "TODO — portfolio site description.",
};

// Layout mounts once for the whole app session — everything here (Lenis, the transition
// overlay, the preloader) must be a singleton that survives client-side navigation.
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
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Karla:wght@400;500;700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--color-bg)] text-[var(--color-fg)] antialiased">
        <TransitionProvider>
          <SmoothScroll>
            <Preloader>
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </Preloader>
          </SmoothScroll>
        </TransitionProvider>
      </body>
    </html>
  );
}
