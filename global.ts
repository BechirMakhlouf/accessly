import { INTL_FORMATS } from '@/lib/i18n/formats';
import messages from './messages/en.json';
import { locales } from '@/lib/i18n/config';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof locales)[number];
    Messages: typeof messages;
    Formats: typeof INTL_FORMATS;
  }
}
