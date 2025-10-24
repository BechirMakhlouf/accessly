import { useTranslations } from "next-intl";

export type I18nMessageKey = Parameters<ReturnType<typeof useTranslations<never>>>[0];

// Derive translation function type from next-intl
export type TranslationFunction = ReturnType<typeof useTranslations<never>>;
