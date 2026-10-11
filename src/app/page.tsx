import { SiteHeader } from "@/components/SiteHeader";
import { CustomerRun } from "@/components/run/CustomerRun";

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
