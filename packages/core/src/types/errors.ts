export const CommonErrors = {
  unauthorized: "common.unauthorized",
  networkError: "common.networkError",
  validationFailed: "common.validationFailed",
  unexpectedError: "common.unexpectedError",
} as const;

export type CommonError = (typeof CommonErrors)[keyof typeof CommonErrors];
