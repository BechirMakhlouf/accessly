import { INTL_FORMATS, locales } from "@/lib/i18n";
import messages from "./messages/en.d.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof locales)[number];
    Messages: typeof messages;
    Formats: typeof INTL_FORMATS;
  }
}
