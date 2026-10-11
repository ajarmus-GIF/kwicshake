"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
import { ActionButton } from "@/components/interactive/ActionButtons";

/**
 * A page that threw while rendering in the browser. Same room as the 404 (components/
 * ErrorScreen) so a failure still looks like Kwic Shake, with "Try again" as the way out:
 * `reset` re-renders the page, which clears most one-off glitches without a reload.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      code="OOPS"
      eyebrow="Something broke"
      title="That one's on us."
      accent="Not on you."
      lede={
        <>
          Something on this page didn&apos;t load the way it should. Give it another try, and if
          it keeps happening, email us at info@kwicshake.com and we&apos;ll fix it fast.
        </>
      }
      primary={
        <ActionButton onClick={reset}>Try again</ActionButton>
      }
    />
  );
}
