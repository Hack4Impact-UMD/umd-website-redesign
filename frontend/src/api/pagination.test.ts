import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMembers } from './members';

const member = (id: string) => ({
  id,
  attributes: {
    firstName: 'Test', lastName: id, memberDisplayStatus: 'Current Member',
    componentRolesArr: [], avatar: { data: null },
  },
});

afterEach(() => vi.unstubAllGlobals());

describe('collection pagination', () => {
  it('loads every reported page while preserving string IDs', async () => {
    const fetcher = vi.fn(async (request: RequestInfo | URL) => {
      const page = new URL(String(request), 'http://local').searchParams.get('pagination[page]');
      const data = page === '1' ? [member('001')] : [member('abc')];
      return new Response(JSON.stringify({
        data,
        meta: { pagination: { page: Number(page), pageSize: 200, pageCount: 2, total: 2 } },
      }));
    });
    vi.stubGlobal('fetch', fetcher);

    const result = await getMembers();
    expect(result.map(({ id }) => id)).toEqual(['001', 'abc']);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('aborts before requesting a later page', async () => {
    const controller = new AbortController();
    const fetcher = vi.fn(async () => {
      controller.abort();
      return new Response(JSON.stringify({
        data: [member('1')],
        meta: { pagination: { page: 1, pageSize: 200, pageCount: 2, total: 2 } },
      }));
    });
    vi.stubGlobal('fetch', fetcher);

    await expect(getMembers({ signal: controller.signal })).rejects.toMatchObject({ kind: 'aborted' });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
