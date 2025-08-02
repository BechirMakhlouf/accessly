import { useTranslations } from "next-intl";

export type I18nMessageKey = Parameters<ReturnType<typeof useTranslations<never>>>[0];
