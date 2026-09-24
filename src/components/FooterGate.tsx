"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Routes that render as a single bare screen, without the site footer. The footer lives in the
 * root layout (it's the same on every page), so this is the one place that can leave it off.
 */
const BARE_ROUTES = new Set(["/comingsoon"]);

export function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return BARE_ROUTES.has(pathname) ? null : children;
}
