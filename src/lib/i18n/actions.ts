'use server';

import { cookies } from 'next/headers';
import { Locale, defaultLocale, locales } from './config';
import { hasLocale } from 'next-intl';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const APP_LOCALE_COOKIE_NAME = 'APP_LOCALE' as const;

export async function getAppLocale() {
  return (await cookies()).get(APP_LOCALE_COOKIE_NAME)?.value || defaultLocale;
}

export async function setAppLocale(locale: Locale) {
  (await cookies()).set(APP_LOCALE_COOKIE_NAME, locale);
}

/**
 * bayi:
 *  gets the locale appropriate to the page from routing or from app locale
 *  if there is no locale, it returns the default locale
 */
export async function getLocale(localParam?: string): Promise<Locale> {
  if (!hasLocale(locales, localParam))
    return localParam! as Locale;

  return defaultLocale;
}
