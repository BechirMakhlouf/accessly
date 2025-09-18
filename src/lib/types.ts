import { I18nMessageKey } from "./i18n";

export type ServiceResult<T> = {
    data: T;
    error?: null;
} | {
    data?: null;
    error: I18nMessageKey;
};
