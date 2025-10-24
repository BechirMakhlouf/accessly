"use server";

import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import type { Locale } from "../config";
import { defaultLocale, locales } from "../config";

// Cookie name for storing app locale
const APP_LOCALE_COOKIE_NAME = "APP_LOCALE" as const;

/**
 * Gets the app locale from cookies
 * Falls back to default locale if no cookie is found
 */
export async function getAppLocale(): Promise<Locale> {
  const cookieValue = (await cookies()).get(APP_LOCALE_COOKIE_NAME)?.value;

  if (cookieValue && hasLocale(locales, cookieValue)) {
    return cookieValue as Locale;
  }

  return defaultLocale;
}

/**
 * Sets the app locale in cookies
 */
export async function setAppLocale(locale: Locale): Promise<void> {
  (await cookies()).set(APP_LOCALE_COOKIE_NAME, locale);
}

/**
 * Gets the locale appropriate to the page from routing or from app locale
 * If there is no locale, it returns the default locale
 */
export async function getLocale(localParam?: string): Promise<Locale> {
  if (localParam && hasLocale(locales, localParam)) {
    return localParam as Locale;
  }

  return defaultLocale;
}
