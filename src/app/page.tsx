import { SiteHeader } from "@/components/SiteHeader";
import { CustomerRun } from "@/components/run/CustomerRun";

// Title, description and Open Graph come from the root layout; only the canonical is set here.
// It deliberately isn't in the layout, where every page without its own `alternates` (the
// unlisted concepts, the 404) would inherit "/" as its canonical.
export const metadata = {
  alternates: { canonical: "/" },
};

/**
 * The homepage is the interactive "Be the customer" run (was Home Concept 3). A pill in the
 * top-left of its hero offers the traditional scrolling homepage at /traditional instead.
 * The previous homepage is kept, unlisted, at /home-original.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <CustomerRun switchToTraditional />
    </>
  );
}
