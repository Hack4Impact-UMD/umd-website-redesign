export type ApiErrorKind =
  | 'config'
  | 'network'
  | 'http'
  | 'parse'
  | 'contract'
  | 'aborted'
  | 'timeout';

interface ApiErrorOptions {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?: string;
  retryable?: boolean;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly retryable: boolean;

  constructor({ kind, message, status, code, retryable = false, cause }: ApiErrorOptions) {
    super(message);
    if (cause !== undefined) {
      Object.defineProperty(this, 'cause', { value: cause, configurable: true });
    }
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.code = code;
    this.retryable = retryable;
  }
}

export const isAbortError = (error: unknown) =>
  error instanceof ApiError
    ? error.kind === 'aborted'
    : error instanceof DOMException && error.name === 'AbortError';

export const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'An unexpected request error occurred.';
