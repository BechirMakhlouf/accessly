import { I18nMessageKey } from "./i18n";

export type ServiceResult<T, E extends string = I18nMessageKey> =
  | {
      data: T;
      error?: null;
    }
  | {
      data?: null;
      error: E;
    };

/**
 * bayi: to flatten types
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
};

/**
 * makes a key or a union of keys optional
 */
export type WithOptional<T, K extends keyof T> = Prettify<
  { [P in keyof T as P extends K ? never : P]: T[P] } & {
    [P in K]?: T[P];
  }
>;

/**
 * WithRequired<T, K>
 *
 * Makes one or more keys `K` required in a type `T`.
 * - Removes the optional marker `?` for keys in `K`
 * - Keeps other keys untouched
 * - Flattens the resulting type for readability
 *
 * Example:
 *   type User = { id?: string; name?: string; email?: string };
 *   type UserWithRequiredId = WithRequired<User, "id">;
 *   // { id: string; name?: string; email?: string }
 */
export type WithRequired<T, K extends keyof T> = Prettify<
  // Keep everything except the keys we want to make required
  { [P in keyof T as P extends K ? never : P]: T[P] } & { [P in K]-?: T[P] } // Re-add those keys as required
>;

export type LooseAutocomplete<T extends string> = T | Omit<string, T>;
