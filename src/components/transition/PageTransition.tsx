"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { useTransition } from "./TransitionProvider";

/**
 * PageTransition, part 3: mounted inside app/template.tsx, which App Router remounts on every
 * navigation (unlike layout.tsx, which persists). That remount is the only signal we get that
 * "the new route has mounted" — so this component's entire job is to call reveal() once, on
 * mount, and otherwise get out of the way. It renders `children` directly and immediately; it
 * never wraps them in an opacity-0 state, because the new page's content must be visible and
 * readable the instant it's in the DOM, independent of whether this effect (or JS at all) runs.
 *
 * Failure mode: if this were a layout instead of living in template.tsx, it would only mount
 * once for the whole app and never see subsequent navigations — the classic App Router mistake
 * that makes page transitions silently stop working after the first route.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { reveal } = useTransition();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      reveal();
    },
    { scope, dependencies: [] }
  );

  return <div ref={scope}>{children}</div>;
}
