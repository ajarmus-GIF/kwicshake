import { SiteHeader } from "@/components/SiteHeader";
import { LoaderGallery } from "./LoaderGallery";

// Unlisted: reachable by URL only, never linked from the site, and kept out of search. A place
// to compare loading-screen candidates at real size before one is built into the site.
export const metadata = {
  title: "Loading Screens — Kwic Shake",
  robots: { index: false, follow: false },
};

export default function LoadersPage() {
  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <p className="eyebrow mb-4">+ Unlisted · pick one</p>
        <h1 className="text-[clamp(2.2rem,6vw,4rem)] leading-[0.95] text-[var(--color-white)]">
          Loading screens
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
          Five options, each shown handing off to the homepage. Hit Full screen to see one at the
          size it would really run, or Replay to watch it again. Whichever is picked would run
          once per visit, last under two seconds, and be skipped for anyone who has reduced
          motion turned on.
        </p>
        <div className="mt-14">
          <LoaderGallery />
        </div>
      </section>
    </>
  );
}
