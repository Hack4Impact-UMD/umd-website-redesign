import type { ZodType } from 'zod';
import { ApiError } from './errors';

const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_RETRIES = 1;

const trimSlashes = (value: string) => value.replace(/\/+$/, '');

export const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (!configured || configured === '/api' || configured === '/api/') return '/api';

  try {
    const url = new URL(configured);
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      throw new Error('unsafe API base');
    }
    return trimSlashes(url.toString());
  } catch (cause) {
    throw new ApiError({
      kind: 'config',
      message: 'VITE_API_URL must be /api or an HTTPS URL without credentials, query, or hash.',
      cause,
    });
  }
};

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, '');
  if (!normalizedPath) {
    throw new ApiError({ kind: 'config', message: 'API request path cannot be empty.' });
  }
  return `${getApiBaseUrl()}/${normalizedPath}`;
};

interface ApiGetOptions<T> {
  schema: ZodType<T>;
  signal?: AbortSignal;
  retries?: number;
  timeoutMs?: number;
  fetcher?: typeof fetch;
}

const delay = (milliseconds: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ApiError({ kind: 'aborted', message: 'Request was cancelled.' }));
      return;
    }
    const finish = () => {
      signal?.removeEventListener('abort', abort);
      resolve();
    };
    const timer = globalThis.setTimeout(finish, milliseconds);
    const abort = () => {
      globalThis.clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      reject(new ApiError({ kind: 'aborted', message: 'Request was cancelled.' }));
    };
    signal?.addEventListener('abort', abort, { once: true });
  });

export const apiGet = async <T>(path: string, options: ApiGetOptions<T>): Promise<T> => {
  const retries = Math.max(0, Math.min(options.retries ?? DEFAULT_RETRIES, 2));
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetcher = options.fetcher ?? fetch;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    if (options.signal?.aborted) {
      throw new ApiError({ kind: 'aborted', message: 'Request was cancelled.' });
    }

    const controller = new AbortController();
    let timedOut = false;
    const onCallerAbort = () => controller.abort();
    options.signal?.addEventListener('abort', onCallerAbort, { once: true });
    const timeout = globalThis.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetcher(buildApiUrl(path), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        let apiCode: string | undefined;
        let apiMessage: string | undefined;
        try {
          const errorBody = (await response.json()) as {
            error?: { code?: unknown; message?: unknown };
          };
          if (typeof errorBody?.error?.code === 'string') apiCode = errorBody.error.code;
          if (typeof errorBody?.error?.message === 'string') apiMessage = errorBody.error.message;
        } catch {
          // HTTP classification does not depend on the error body being JSON.
        }
        const error = new ApiError({
          kind: 'http',
          message: apiMessage || `Request failed with HTTP ${response.status}.`,
          status: response.status,
          code: apiCode,
          retryable: response.status === 429 || response.status >= 500,
        });
        if (error.retryable && attempt < retries) {
          await delay(150 * (attempt + 1), options.signal);
          continue;
        }
        throw error;
      }

      let body: unknown;
      try {
        body = await response.json();
      } catch (cause) {
        throw new ApiError({ kind: 'parse', message: 'The API returned invalid JSON.', cause });
      }

      const result = options.schema.safeParse(body);
      if (!result.success) {
        throw new ApiError({
          kind: 'contract',
          message: 'The API response did not match the expected contract.',
          cause: result.error,
        });
      }
      return result.data;
    } catch (cause) {
      if (cause instanceof ApiError) throw cause;
      if (controller.signal.aborted) {
        const abortError = new ApiError({
          kind: timedOut ? 'timeout' : 'aborted',
          message: timedOut ? 'The request timed out.' : 'Request was cancelled.',
          retryable: timedOut,
          cause,
        });
        if (timedOut && attempt < retries) {
          await delay(150 * (attempt + 1), options.signal);
          continue;
        }
        throw abortError;
      }
      const error = new ApiError({
        kind: 'network',
        message: 'The API could not be reached.',
        retryable: true,
        cause,
      });
      if (attempt < retries) {
        await delay(150 * (attempt + 1), options.signal);
        continue;
      }
      throw error;
    } finally {
      globalThis.clearTimeout(timeout);
      options.signal?.removeEventListener('abort', onCallerAbort);
    }
  }

  throw new ApiError({ kind: 'network', message: 'The API could not be reached.' });
};
