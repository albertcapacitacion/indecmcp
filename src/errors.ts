export class ServiceError extends Error {
  constructor(public readonly code: string, message: string, public readonly retryable = false) {
    super(message);
  }
}

export function safeError(error: unknown) {
  return error instanceof ServiceError
    ? { code: error.code, message: error.message, retryable: error.retryable }
    : { code: "INTERNAL_ERROR", message: "The request could not be completed.", retryable: false };
}
