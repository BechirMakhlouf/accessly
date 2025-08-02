import { getRequestConfig, RequestConfig } from 'next-intl/server';
import { INTL_FORMATS } from './formats';
import { getAppLocale } from './actions';
import { routing } from './routing';
import { hasLocale } from 'next-intl';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    hasLocale(routing.locales, requested) ?
      requested :
      await getAppLocale() || routing.defaultLocale;

  return {
    locale,
    formats: INTL_FORMATS,
    messages: (await import(`../../../messages/${locale}.json`)).default
  } as RequestConfig;
});

