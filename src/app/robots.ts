import type { MetadataRoute } from "next";

// Written to /robots.txt at build time (the site is a static export).
export const dynamic = "force-static";

/**
 * Everything may be crawled; pages that shouldn't be indexed say so themselves with a robots
 * noindex meta tag, which a crawler can only read if it's allowed to fetch the page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://kwicshake.com/sitemap.xml",
  };
}
