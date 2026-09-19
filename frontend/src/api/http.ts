import type { output, ZodTypeAny } from 'zod';
import { ApiError } from './errors';

const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_RETRIES = 1;

const trimSlashes = (value: string) => value.replace(/\/+$/, '');

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * `true` while rendering on a server (Astro's static build). Read through a
 * helper so tests can stub it; Vitest's stubEnv coerces values to strings.
 */
const isServerRuntime = () => {
  const ssr: unknown = import.meta.env.SSR;
  return ssr === true || ssr === 'true';
};

/** import.meta.env first (Astro inlines it), then process.env for plain Node. */
const readServerEnv = (key: string) => {
  const inlined = (import.meta.env as Record<string, string | undefined>)[key];
  if (inlined) return inlined;
  if (typeof process !== 'undefined' && process.env) return process.env[key];
  return undefined;
};

/**
 * Plain http is accepted only for loopback hosts.
 *
 * That is not a weakened rule so much as a differently scoped one: the reason
 * to require HTTPS is that a request leaves the machine in plaintext, which a
 * loopback request never does. It is what the Firebase emulator and the e2e
 * fixture server are reachable over, and a production build pointed at
 * 127.0.0.1 fails at the first fetch anyway.
 */
const validateAbsoluteBase = (configured: string, variableName: string) => {
  try {
    const url = new URL(configured);
    const loopbackHttp = url.protocol === 'http:' && LOOPBACK_HOSTS.has(url.hostname);
    if (
      (url.protocol !== 'https:' && !loopbackHttp) ||
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
      message: `${variableName} must be an HTTPS URL (or a loopback http URL) without credentials, query, or hash.`,
      cause,
    });
  }
};

/**
 * Base for URLs that end up in rendered HTML (image `src`, links).
 *
 * Always same-origin `/api` unless explicitly overridden, so Netlify's proxy
 * and CDN stay in front of the Cloud Function. The static build must never
 * bake an absolute function URL into permanent HTML.
 */
export const getPublicApiBaseUrl = () => {
  const configured = (
    import.meta.env.PUBLIC_API_URL ?? import.meta.env.VITE_API_URL
  )?.trim();
  if (!configured || configured === '/api' || configured === '/api/') return '/api';
  return validateAbsoluteBase(configured, 'PUBLIC_API_URL');
};

/**
 * Base for requests this process issues.
 *
 * In a browser that is the public base. On a server there is no origin to be
 * relative to, so an absolute API_BASE_URL is required and its absence is a
 * hard configuration error rather than a silent fallback.
 */
export const getApiBaseUrl = () => {
  if (!isServerRuntime()) return getPublicApiBaseUrl();

  const configured = readServerEnv('API_BASE_URL')?.trim();
  if (!configured) {
    throw new ApiError({
      kind: 'config',
      message:
        'API_BASE_URL must be set to an absolute API URL when fetching on the server. ' +
        'A same-origin /api path cannot be resolved outside a browser.',
    });
  }
  // Loopback http is allowed only for the Firebase emulator and the Playwright
  // fixture server, never in a production build.
  return validateAbsoluteBase(configured, 'API_BASE_URL');
};

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, '');
  if (!normalizedPath) {
    throw new ApiError({ kind: 'config', message: 'API request path cannot be empty.' });
  }
  return `${getApiBaseUrl()}/${normalizedPath}`;
};

/** Per-request knobs shared by every loader in this directory. */
export interface ApiRequestOptions {
  signal?: AbortSignal;
  retries?: number;
  timeoutMs?: number;
}

interface ApiGetOptions<TSchema extends ZodTypeAny> extends ApiRequestOptions {
  schema: TSchema;
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

export const apiGet = async <TSchema extends ZodTypeAny>(
  path: string,
  options: ApiGetOptions<TSchema>,
): Promise<output<TSchema>> => {
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
