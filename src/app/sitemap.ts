import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { wins } from "@/lib/wins";

// Written to /sitemap.xml at build time (the site is a static export).
export const dynamic = "force-static";

const SITE = "https://kwicshake.com";

/**
 * Every public, indexable page, at the same URLs as their canonical tags. Pages hidden from
 * search (the home concepts, /home-original, /comingsoon, the 404) are deliberately absent;
 * a new public page needs adding here as well as its own `alternates.canonical`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/traditional", "/about", "/services", "/work", "/process", "/contact", "/wins", "/privacy"];
  return [
    ...pages.map((path) => ({ url: `${SITE}${path}` })),
    ...projects.map((project) => ({ url: `${SITE}/work/${project.slug}` })),
    ...wins.map((win) => ({ url: `${SITE}/wins/${win.slug}` })),
  ];
}
