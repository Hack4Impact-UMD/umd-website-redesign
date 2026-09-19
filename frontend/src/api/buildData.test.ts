import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from './errors';

vi.mock('./content', () => ({ getContentDocument: vi.fn() }));
vi.mock('./projects', () => ({ getProjects: vi.fn() }));
vi.mock('./members', () => ({ getMembers: vi.fn() }));

import { getContentDocument } from './content';
import { getMembers } from './members';
import { getProjects } from './projects';
import {
  loadAllProjects,
  loadContent,
  loadMembers,
  loadSiteSettings,
  resetBuildDataCache,
} from './buildData';

describe('build-time data loaders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetBuildDataCache();
  });
  afterEach(() => resetBuildDataCache());

  it('issues one request no matter how many pages ask for the same document', async () => {
    vi.mocked(getContentDocument).mockResolvedValue({ mode: 'placeholder' });

    // Stands in for ~40 pages each rendering the shared chrome.
    await Promise.all(Array.from({ length: 40 }, () => loadSiteSettings()));

    expect(getContentDocument).toHaveBeenCalledTimes(1);
    expect(getContentDocument).toHaveBeenCalledWith('site-settings', {
      retries: 2,
      timeoutMs: 20_000,
    });
  });

  it('shares a single in-flight request between concurrent callers', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    vi.mocked(getContentDocument).mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }) as ReturnType<typeof getContentDocument>,
    );

    const first = loadContent('home');
    const second = loadContent('home');
    resolveFetch({ mode: 'placeholder' });

    await expect(Promise.all([first, second])).resolves.toEqual([
      { mode: 'placeholder' },
      { mode: 'placeholder' },
    ]);
    expect(getContentDocument).toHaveBeenCalledTimes(1);
  });

  it('caches each content key separately', async () => {
    vi.mocked(getContentDocument).mockResolvedValue({ mode: 'placeholder' });

    await loadContent('home');
    await loadContent('about');
    await loadContent('home');

    expect(getContentDocument).toHaveBeenCalledTimes(2);
  });

  it('reuses one projects fetch across getStaticPaths and every project page', async () => {
    vi.mocked(getProjects).mockResolvedValue([]);

    await loadAllProjects();
    await Promise.all(Array.from({ length: 32 }, () => loadAllProjects()));

    expect(getProjects).toHaveBeenCalledTimes(1);
  });

  it('caches members per display status', async () => {
    vi.mocked(getMembers).mockResolvedValue([]);

    await loadMembers('Current Member');
    await loadMembers('Current Member');
    await loadMembers('Current Board Member');

    expect(getMembers).toHaveBeenCalledTimes(2);
  });

  it('propagates transport failures so the build fails instead of shipping defaults', async () => {
    const failure = new ApiError({ kind: 'network', message: 'The API could not be reached.' });
    vi.mocked(getContentDocument).mockRejectedValue(failure);

    // resolveContentDocument degrades bad *content* to placeholders on purpose,
    // but an unreachable API is not bad content. If this resolved, a build
    // during an outage would bake placeholder copy into permanent HTML.
    await expect(loadContent('home')).rejects.toThrow(failure);
  });

  it('does not retry an endpoint that already failed this build', async () => {
    vi.mocked(getContentDocument).mockRejectedValue(
      new ApiError({ kind: 'network', message: 'down' }),
    );

    await expect(loadContent('home')).rejects.toThrow();
    await expect(loadContent('home')).rejects.toThrow();

    expect(getContentDocument).toHaveBeenCalledTimes(1);
  });
});
