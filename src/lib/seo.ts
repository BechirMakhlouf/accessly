import type { Metadata } from "next";
import { env } from "@/lib/env";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

export function getSiteUrl(pathname: string = "/"): string {
  const base = new URL(env.NEXT_PUBLIC_SITE_URL);
  base.pathname = `/${pathname.replace(/^\//, "")}`;
  return base.toString();
}

export function buildAlternates(pathname: string, includeCanonical: boolean = true): Metadata["alternates"] {
  const canonical = includeCanonical ? getSiteUrl(pathname) : undefined;
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const href = getSiteUrl(`${locale === defaultLocale ? "" : `/${locale}`}${pathname === "/" ? "" : pathname}` || "/");
    languages[locale] = href;
  }
  languages["x-default"] = getSiteUrl(pathname);
  return {
    canonical,
    languages,
  };
}

export function buildOpenGraph({
  title,
  description,
  pathname = "/",
  locale = defaultLocale,
  images,
}: {
  title: string;
  description: string;
  pathname?: string;
  locale?: Locale;
  images?: string[];
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    url: getSiteUrl(pathname),
    title,
    description,
    locale,
    siteName: "Accessly",
    images,
  };
}

export function buildTwitter({
  title,
  description,
  images,
}: {
  title: string;
  description: string;
  images?: string[];
}): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title,
    description,
    images,
  };
}

export function baseMetadata({
  title,
  description,
  pathname = "/",
  images,
  locale = defaultLocale,
}: {
  title: string;
  description: string;
  pathname?: string;
  images?: string[];
  locale?: Locale;
}): Metadata {
  return {
    title,
    description,
    alternates: buildAlternates(pathname),
    openGraph: buildOpenGraph({ title, description, pathname, locale, images }),
    twitter: buildTwitter({ title, description, images }),
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    other: {
      "og:locale:alternate": locales.join(","),
    },
  } satisfies Metadata;
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((node, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: node.name,
      item: node.item,
    })),
  };
}

