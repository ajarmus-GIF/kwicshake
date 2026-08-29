"use client";

import { useSyncExternalStore } from "react";

/**
 * Generic matchMedia subscription used by every interaction pattern in this app to decide
 * whether it's allowed to run. useSyncExternalStore (not useEffect+useState) so the value is
 * correct on the very first client render with no flash-of-wrong-behavior, and so concurrent
 * rendering can't tear the value across components reading the same query.
 *
 * Failure mode: matchMedia is undefined during SSR/static export, so `getServerSnapshot`
 * must return a safe default (false) — never assume a browser environment here.
 */
function subscribe(query: string, callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** True when the user has requested reduced motion at the OS level. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True only for devices with an accurate pointer (mouse/trackpad) — never touch. */
export function usePointerFine(): boolean {
  return useMediaQuery("(pointer: fine) and (hover: hover)");
}
