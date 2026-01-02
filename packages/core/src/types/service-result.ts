export type ServiceResult<T, E = string> =
  | {
    data: T;
    error?: null;
  }
  | {
    data?: null;
    error: E;
  };
