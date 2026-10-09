import { SiteHeader } from "@/components/SiteHeader";
import { CustomerRun } from "@/components/run/CustomerRun";

// Unlisted concept: reachable by URL only, never linked from the site, and kept out of search.
export const metadata = {
  title: "Home Concept 3 — Kwic Shake",
  robots: { index: false, follow: false },
};

/** Home Concept 3, "Be the customer". The whole experience lives in components/run/CustomerRun.tsx. */
export default function HomeConceptThreePage() {
  return (
    <>
      <SiteHeader />
      <CustomerRun />
    </>
  );
}
