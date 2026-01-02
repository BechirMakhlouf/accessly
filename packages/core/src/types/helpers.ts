export type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type WithOptional<T, K extends keyof T> = Prettify<
  { [P in keyof T as P extends K ? never : P]: T[P] } & {
    [P in K]?: T[P]; }
>;

export type WithRequired<T, K extends keyof T> = Prettify<
  { [P in keyof T as P extends K ? never : P]: T[P] } & { [P in K]-?: T[P] }
>;

export type LooseAutocomplete<T extends string> = T | Omit<string, T>;
