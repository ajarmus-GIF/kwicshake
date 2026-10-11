import { TraditionalHome } from "@/components/reveal/TraditionalHome";

// Unlisted concept: reachable by URL only, never linked from the site, and kept out of search.
// Now promoted to /traditional; this URL stays so links already shared keep working.
export const metadata = {
  title: "Home Concept 1 — Kwic Shake",
  robots: { index: false, follow: false },
};

export default function HomeConceptOnePage() {
  return <TraditionalHome />;
}
