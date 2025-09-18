import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/lib/i18n";
import type { Metadata } from "next";
import { baseMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return baseMetadata({
    title: "Accessly",
    description: "Accessly Access Management For Agile Teams",
    pathname: locale === "en" ? "/" : `/${locale}`,
    locale: locale as any,
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  // Enable static rendering with i18n
  setRequestLocale(locale);

  return <>{children}</>;
}
