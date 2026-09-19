import { z } from 'zod';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './errors';
import { apiGet, buildApiUrl, getApiBaseUrl, getPublicApiBaseUrl } from './http';

describe('apiGet', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('uses same-origin /api by default and validates successful JSON', async () => {
    expect(buildApiUrl('health')).toBe('/api/health');
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ status: 'ok' }), { status: 200 }));
    await expect(apiGet('health', { schema: z.object({ status: z.literal('ok') }), fetcher })).resolves.toEqual({ status: 'ok' });
  });

  it('classifies non-JSON non-2xx responses as HTTP errors', async () => {
    const fetcher = vi.fn(async () => new Response('unavailable', { status: 503 }));
    await expect(apiGet('health', { schema: z.unknown(), retries: 0, fetcher })).rejects.toMatchObject({
      kind: 'http', status: 503, retryable: true,
    });
  });

  it('preserves the PR1 API error code and message for JSON HTTP failures', async () => {
    const fetcher = vi.fn(async () =>
      new Response(
        JSON.stringify({
          error: { code: 'query/invalid', message: 'Only one project filter is supported.' },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    await expect(
      apiGet('projects', { schema: z.unknown(), fetcher }),
    ).rejects.toMatchObject({
      kind: 'http',
      status: 400,
      code: 'query/invalid',
      message: 'Only one project filter is supported.',
      retryable: false,
    });
  });

  it('separates parsing and contract errors', async () => {
    const invalidJson = vi.fn(async () => new Response('{', { status: 200 }));
    await expect(apiGet('health', { schema: z.unknown(), fetcher: invalidJson })).rejects.toMatchObject({ kind: 'parse' });

    const wrongShape = vi.fn(async () => new Response(JSON.stringify({ status: 'bad' }), { status: 200 }));
    await expect(apiGet('health', { schema: z.object({ status: z.literal('ok') }), fetcher: wrongShape })).rejects.toMatchObject({ kind: 'contract' });
  });

  it('distinguishes caller cancellation from timeout and cleans the request up', async () => {
    const pending = vi.fn((_url: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true });
      }),
    );
    const caller = new AbortController();
    const cancelled = apiGet('health', { schema: z.unknown(), signal: caller.signal, fetcher: pending, retries: 0 });
    caller.abort();
    await expect(cancelled).rejects.toMatchObject({ kind: 'aborted' });

    await expect(apiGet('health', { schema: z.unknown(), timeoutMs: 1, fetcher: pending, retries: 0 })).rejects.toMatchObject({
      kind: 'timeout', retryable: true,
    });
  });

  it('keeps typed API errors intact', () => {
    const error = new ApiError({ kind: 'config', message: 'bad config' });
    expect(error).toMatchObject({ name: 'ApiError', kind: 'config', retryable: false });
  });

  it('uses a fresh abort controller for each retry attempt', async () => {
    const signals: AbortSignal[] = [];
    const fetcher = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
      signals.push(init?.signal as AbortSignal);
      if (signals.length === 1) throw new TypeError('offline');
      return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
    });
    await expect(
      apiGet('health', { schema: z.object({ status: z.literal('ok') }), fetcher }),
    ).resolves.toEqual({ status: 'ok' });
    expect(signals).toHaveLength(2);
    expect(signals[0]).not.toBe(signals[1]);
  });

  it.each([
    'javascript:alert(1)',
    'http://api.example.org/api',
    'https://user:pass@api.example.org/api',
    'https://api.example.org/api?token=secret',
    'not a url',
  ])('rejects unsafe VITE_API_URL override %s', (baseUrl) => {
    vi.stubEnv('VITE_API_URL', baseUrl);
    expect(() => buildApiUrl('health')).toThrow(expect.objectContaining({ kind: 'config' }));
  });

  it('accepts an HTTPS direct API override', () => {
    vi.stubEnv('VITE_API_URL', 'https://us-central1-example.cloudfunctions.net/api/');
    expect(buildApiUrl('health')).toBe(
      'https://us-central1-example.cloudfunctions.net/api/health',
    );
  });
});

describe('server-side API base resolution', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('requires an absolute API_BASE_URL when rendering on a server', () => {
    vi.stubEnv('SSR', true);
    expect(() => getApiBaseUrl()).toThrow(expect.objectContaining({ kind: 'config' }));
  });

  it('does not fall back to same-origin /api on a server', () => {
    vi.stubEnv('SSR', true);
    vi.stubEnv('VITE_API_URL', '/api');
    // /api is meaningless without an origin, so this must fail loudly rather
    // than produce an unfetchable relative URL during the build.
    expect(() => getApiBaseUrl()).toThrow(expect.objectContaining({ kind: 'config' }));
  });

  it('uses API_BASE_URL for server-side fetches', () => {
    vi.stubEnv('SSR', true);
    vi.stubEnv('API_BASE_URL', 'https://us-central1-example.cloudfunctions.net/api/');
    expect(getApiBaseUrl()).toBe('https://us-central1-example.cloudfunctions.net/api');
  });

  it.each([
    'http://api.example.org/api',
    'https://user:pass@api.example.org/api',
    'https://api.example.org/api?token=secret',
    'not a url',
  ])('rejects unsafe API_BASE_URL %s', (baseUrl) => {
    vi.stubEnv('SSR', true);
    vi.stubEnv('API_BASE_URL', baseUrl);
    expect(() => getApiBaseUrl()).toThrow(expect.objectContaining({ kind: 'config' }));
  });

  it('allows loopback http for the emulator and the e2e fixture server', () => {
    vi.stubEnv('SSR', true);
    vi.stubEnv('API_BASE_URL', 'http://127.0.0.1:5001/demo-umd-website/us-central1/api');
    expect(getApiBaseUrl()).toBe('http://127.0.0.1:5001/demo-umd-website/us-central1/api');
  });

  it('keeps the public base same-origin even when API_BASE_URL is absolute', () => {
    vi.stubEnv('SSR', true);
    vi.stubEnv('API_BASE_URL', 'https://us-central1-example.cloudfunctions.net/api');
    expect(getPublicApiBaseUrl()).toBe('/api');
  });

  it('prefers PUBLIC_API_URL over VITE_API_URL for the public base', () => {
    vi.stubEnv('VITE_API_URL', 'https://old.example.org/api');
    vi.stubEnv('PUBLIC_API_URL', 'https://new.example.org/api');
    expect(getPublicApiBaseUrl()).toBe('https://new.example.org/api');
  });
});
