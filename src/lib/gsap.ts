/**
 * Central GSAP registration. Every plugin used anywhere in the app is registered exactly
 * once, here, guarded by a `typeof window` check so importing this module during SSR (or in
 * a Server Component that transitively imports a client component) never throws. Components
 * should import `gsap`, `ScrollTrigger`, `SplitText` from this file instead of "gsap" directly
 * so registration order is never a footgun.
 *
 * Failure mode: registering plugins more than once is harmless (GSAP no-ops on duplicate
 * registration), but registering them at module scope *without* the window guard breaks on
 * the server because ScrollTrigger touches `document` during registration.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin);
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin };
