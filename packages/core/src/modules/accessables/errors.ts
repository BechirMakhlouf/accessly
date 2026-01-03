export const AccessableErrorCode = {
  NOT_FOUND: 'ACCESSABLE_NOT_FOUND',
  FAILED_TO_LOAD: 'ACCESSABLE_FAILED_TO_LOAD',
  FAILED_TO_CREATE: 'ACCESSABLE_FAILED_TO_CREATE',
  FAILED_TO_UPDATE: 'ACCESSABLE_FAILED_TO_UPDATE',
  FAILED_TO_DELETE: 'ACCESSABLE_FAILED_TO_DELETE',
} as const;

export type AccessableErrorCode =
  (typeof AccessableErrorCode)[keyof typeof AccessableErrorCode];
