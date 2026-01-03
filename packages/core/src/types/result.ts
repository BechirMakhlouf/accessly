export type Ok<T> = { data: T; error: null };
export type Err<E extends string> = { data: null; error: E };
export type Result<T, E extends string> = Ok<T> | Err<E>;

export function ok<T>(data: T): Ok<T> {
  return { data, error: null };
}

export function err<E extends string>(error: E): Result<never, E> {
  return { data: null, error };
}

export type InferErrors<T> = T extends { error: infer E }
  ? E extends null
    ? never
    : E
  : never;

export type InferData<T> = T extends { data: infer D }
  ? D extends null
    ? never
    : D
  : never;
