import { getContentDocument, type ContentKey } from './content';
import type { MemberDisplayStatus, MemberEntity, ProjectEntity } from './contracts';
import { getMembers } from './members';
import { getProjects } from './projects';

/**
 * Build-time content loaders.
 *
 * A static build renders every page in one process, so without memoisation a
 * single build would refetch site-settings once per page (~40 times) and the
 * full projects list once per project page. With it, the whole build issues
 * roughly eight requests.
 *
 * These are deliberately not for browser use: they never expire, and a
 * long-lived tab would go stale.
 */

/**
 * More patient than a browser request. A failed fetch here fails the deploy
 * rather than degrading one page view, and Netlify keeps the previous deploy
 * live, so waiting is cheap and giving up early is not.
 */
const BUILD_FETCH = { retries: 2, timeoutMs: 20_000 } as const;

const cache = new Map<string, Promise<unknown>>();

/**
 * Caches the promise, not the value, so concurrent callers share one request.
 * Rejections stay cached on purpose: if the API is down, the build should fail
 * once rather than retry the same dead endpoint forty times.
 */
const memo = <T>(key: string, load: () => Promise<T>): Promise<T> => {
  const existing = cache.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const pending = load();
  cache.set(key, pending);
  return pending;
};

export const loadContent = (key: ContentKey) =>
  memo(`content:${key}`, () => getContentDocument(key, BUILD_FETCH));

export const loadSiteSettings = () => loadContent('site-settings');

export const loadAllProjects = (): Promise<ProjectEntity[]> =>
  memo('projects:all', () => getProjects({ pageSize: 100, ...BUILD_FETCH }));

export const loadMembers = (filterStatus: MemberDisplayStatus): Promise<MemberEntity[]> =>
  memo(`members:${filterStatus}`, () =>
    getMembers({ filterStatus, pageSize: 200, ...BUILD_FETCH }),
  );

/** Test-only: the cache is process-wide and would otherwise leak between cases. */
export const resetBuildDataCache = () => cache.clear();
