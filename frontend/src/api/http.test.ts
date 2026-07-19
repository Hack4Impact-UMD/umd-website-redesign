import { z } from 'zod';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './errors';
import { apiGet, buildApiUrl } from './http';

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
