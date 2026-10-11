import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/site";

/**
 * Google Analytics 4 (gtag.js), mounted once in the root layout.
 *
 * Production builds only: `next dev` would otherwise send every local page view (and every
 * iPhone preview over WiFi) into the real property. The static export is a production build,
 * so the live site always has it.
 *
 * Page views on client-side navigation (TransitionLink → router.push) are counted by GA4's
 * enhanced measurement ("Page changes based on browser history events", on by default in the
 * property's web stream settings), so there is no per-route tracking code here. If that setting
 * is ever switched off, only the first page of each visit will be recorded.
 *
 * `afterInteractive` loads it after the page is usable, so analytics never delays first paint.
 * Adding or removing this changes what the privacy policy (app/privacy) has to say.
 */
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
