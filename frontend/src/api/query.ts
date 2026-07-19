import type { MemberDisplayStatus } from './contracts';

export const MIN_PAGE_SIZE = 1;
export const MAX_PAGE_SIZE = 250;
export const MAX_PAGE_COUNT = 100;

export const assertPageSize = (pageSize: number) => {
  if (!Number.isInteger(pageSize) || pageSize < MIN_PAGE_SIZE || pageSize > MAX_PAGE_SIZE) {
    throw new RangeError(`pageSize must be an integer between ${MIN_PAGE_SIZE} and ${MAX_PAGE_SIZE}`);
  }
  return pageSize;
};

export type ProjectFilter =
  | { kind: 'featured'; value: boolean }
  | { kind: 'current'; value: boolean }
  | { kind: 'path'; value: string };

export const projectQuery = (page: number, pageSize: number, filter?: ProjectFilter) => {
  const query = new URLSearchParams({
    'pagination[page]': String(page),
    'pagination[pageSize]': String(assertPageSize(pageSize)),
  });

  if (filter?.kind === 'featured') query.set('filters[isFeatured][$eq]', String(filter.value));
  if (filter?.kind === 'current') query.set('filters[isCurrentProject][$eq]', String(filter.value));
  if (filter?.kind === 'path') {
    const path = filter.value.trim();
    if (!path) throw new RangeError('Project path filter cannot be empty');
    query.set('filters[path][$eq]', path);
  }
  return query;
};

export const memberQuery = (
  page: number,
  pageSize: number,
  filterStatus?: MemberDisplayStatus,
) => {
  const query = new URLSearchParams({
    'pagination[page]': String(page),
    'pagination[pageSize]': String(assertPageSize(pageSize)),
  });
  if (filterStatus) query.set('filters[memberDisplayStatus][$eq]', filterStatus);
  return query;
};
