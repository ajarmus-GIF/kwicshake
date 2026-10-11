import { ErrorScreen } from "@/components/ErrorScreen";
import { ActionLink } from "@/components/interactive/ActionButtons";

export const metadata = {
  title: "Page not found — Kwic Shake",
  robots: { index: false },
};

/**
 * Any URL that doesn't exist. With the static export this is written out as 404.html, which
 * the host serves for every missing path (wrangler.jsonc: not_found_handling "404-page").
 *
 * The lede turns the dead end into the pitch: a broken link is exactly the kind of thing that
 * loses a customer, and fixing that is the job.
 */
export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      eyebrow="Error 404"
      title="This page got lost."
      accent="You didn't."
      lede={
        <>
          The link might be old, or the page moved. Either way, a dead end is the fastest way to
          lose a customer, and fixing those is literally what we do. Here&apos;s the way back.
        </>
      }
      primary={
        <ActionLink href="/">Back to Home</ActionLink>
      }
    />
  );
}
