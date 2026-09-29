import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is fully static — every route is prerendered and the forms post straight to
  // Web3Forms from the browser — so it builds to plain files in /out, which Cloudflare serves
  // as static assets with no server or adapter in between.
  output: "export",
  images: {
    // Static hosting has no Next.js image optimizer to resize on request, so next/image serves
    // the files in /public as they are. They are already sized for the web (none over ~420 KB).
    unoptimized: true,
  },
};

export default nextConfig;
