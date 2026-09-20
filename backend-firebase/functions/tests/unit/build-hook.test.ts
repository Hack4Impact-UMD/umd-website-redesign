import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Firestore is faked with a single in-memory document. The throttle logic is
 * what matters here, not the driver: these tests assert how many builds a
 * sequence of edits produces, which is the property editors and build minutes
 * actually care about.
 */
const doc = { data: undefined as Record<string, unknown> | undefined };

const timestamp = (ms: number) => ({ toMillis: () => ms, _ms: ms });

vi.mock('../../src/firebase', () => ({
  db: {
    collection: () => ({ doc: () => ({ id: 'netlify' }) }),
    runTransaction: async (fn: (t: unknown) => Promise<unknown>) =>
      fn({
        get: async () => ({ data: () => doc.data }),
        set: (_ref: unknown, value: Record<string, unknown>) => {
          doc.data = { ...(doc.data ?? {}), ...value };
        },
      }),
  },
}));

vi.mock('firebase-admin/firestore', () => ({
  Timestamp: { fromMillis: (ms: number) => timestamp(ms) },
}));

const {
  COOLDOWN_MS,
  MAX_BUILD_AGE_MS,
  assertBuildHookUrl,
  flushPendingRebuild,
  requestRebuild,
} = await import('../../src/triggers/buildHook');

const HOOK = 'https://api.netlify.com/build_hooks/abc123';

// A realistic instant. Small values like 1_000 would sit inside the cooldown
// measured from epoch 0, which is not a state the deployed function can be in.
const T0 = Date.UTC(2026, 8, 19, 12, 0, 0);

describe('assertBuildHookUrl', () => {
  it('accepts a Netlify build hook', () => {
    expect(assertBuildHookUrl(` ${HOOK} `)).toBe(HOOK);
  });

  it.each([
    'http://api.netlify.com/build_hooks/abc123',
    'https://evil.example.org/build_hooks/abc123',
    'https://api.netlify.com/not_a_hook/abc123',
    'https://user:pass@api.netlify.com/build_hooks/abc123',
    'not a url',
  ])('rejects %s', (value) => {
    expect(() => assertBuildHookUrl(value)).toThrow(/NETLIFY_BUILD_HOOK_URL/);
  });
});

describe('rebuild throttling', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    doc.data = undefined;
    fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
  });

  it('builds immediately on the first edit', async () => {
    await expect(requestRebuild('content_home', HOOK, T0)).resolves.toBe('triggered');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(HOOK);
  });

  it('collapses a burst of saves into one build', async () => {
    const start = T0;
    const results = [];
    // An editor saving eight fields over four minutes.
    for (let i = 0; i < 8; i += 1) {
      results.push(await requestRebuild('content_home', HOOK, start + i * 30_000));
    }

    expect(results[0]).toBe('triggered');
    expect(results.slice(1)).toEqual(Array(7).fill('throttled'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('builds again once the cooldown has passed', async () => {
    await requestRebuild('content_home', HOOK, T0);
    await expect(
      requestRebuild('projects', HOOK, T0 + COOLDOWN_MS),
    ).resolves.toBe('triggered');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('flushes the edits that the cooldown deferred', async () => {
    await requestRebuild('content_home', HOOK, T0);
    await requestRebuild('content_about', HOOK, T0 + 1_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await expect(flushPendingRebuild(HOOK, T0 + COOLDOWN_MS)).resolves.toBe('triggered');
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // A burst plus its flush is two builds, never more.
    await expect(
      flushPendingRebuild(HOOK, T0 + 2 * COOLDOWN_MS),
    ).resolves.toBe('idle');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does nothing when no edit is waiting', async () => {
    await requestRebuild('content_home', HOOK, T0);
    await expect(flushPendingRebuild(HOOK, T0 + COOLDOWN_MS)).resolves.toBe('idle');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('forces a build when the last one is a day old', async () => {
    // The student application deadline is evaluated at build time, so the site
    // must not sit unbuilt indefinitely during a quiet period.
    await requestRebuild('content_home', HOOK, T0);
    await expect(
      flushPendingRebuild(HOOK, T0 + MAX_BUILD_AGE_MS),
    ).resolves.toBe('triggered');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('keeps the cooldown when Netlify rejects the request', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    await expect(requestRebuild('content_home', HOOK, T0)).rejects.toThrow(/HTTP 500/);
    // The slot is already claimed, so the next edit waits for the sweep rather
    // than retrying immediately and doubling up.
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
    await expect(requestRebuild('content_home', HOOK, T0 + 1_000)).resolves.toBe('throttled');
  });

  it('never sends the hook URL in the request body', async () => {
    await requestRebuild('content_home', HOOK, T0);
    expect(JSON.stringify(fetchMock.mock.calls[0][1].body)).not.toContain('build_hooks');
  });
});
