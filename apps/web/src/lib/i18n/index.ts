// Types
export type { I18nMessageKey, TranslationFunction } from "./types";

// Configuration
export { defaultLocale, locales, localesInfo } from "./config";
export type { Locale } from "./config";

// Middleware
export { i18nMiddleware } from "./middleware";

// Formats
export { INTL_FORMATS } from "./formats";

// Navigation
export {
  getPathname,
  Link,
  redirect,
  usePathname,
  useRouter,
} from "./navigation";

// Routing
export { routing } from "./routing";

// Components
export { LocaleSwitcher } from "./components/locale-selector";

// Server utilities (for server contexts only)
export * from "./server";