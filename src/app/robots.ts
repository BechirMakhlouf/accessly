import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = new URL(env.NEXT_PUBLIC_SITE_URL).origin;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

