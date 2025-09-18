import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { locales, defaultLocale } from "@/lib/i18n";

function url(path: string) {
  const u = new URL(env.NEXT_PUBLIC_SITE_URL);
  u.pathname = path;
  return u.toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const basePaths = ["/"];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of basePaths) {
    const languageAlternates: Record<string, string> = {};
    for (const locale of locales) {
      const localizedPath = locale === defaultLocale ? path : `/${locale}${path === "/" ? "" : path}`;
      languageAlternates[locale] = url(localizedPath);
      entries.push({
        url: url(localizedPath),
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.7,
        lastModified: new Date(),
      });
    }
  }

  // Deduplicate in case we added duplicates
  const unique = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const e of entries) unique.set(e.url, e);
  return Array.from(unique.values());
}

