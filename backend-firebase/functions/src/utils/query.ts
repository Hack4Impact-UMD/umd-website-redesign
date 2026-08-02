import { Request } from 'express';

export const MAX_PAGE_SIZE = 250;

export class QueryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QueryValidationError';
  }
}

const toUrlSearchParams = (request: Request): URLSearchParams => {
  const [, queryString = ''] = request.originalUrl.split('?');
  return new URLSearchParams(queryString);
};

export const getQueryParam = (request: Request, key: string): string | undefined => {
  const urlParams = toUrlSearchParams(request);
  const fromUrl = urlParams.get(key);
  if (fromUrl !== null) return fromUrl;

  const direct = request.query[key];
  if (typeof direct === 'string') return direct;
  if (Array.isArray(direct) && typeof direct[0] === 'string') return direct[0];
  return undefined;
};

export const parseBoolean = (
  value: string | undefined,
  fieldName = 'boolean filter',
): boolean | undefined => {
  if (value === undefined) return undefined;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  throw new QueryValidationError(`${fieldName} must be true or false`);
};

const parsePositiveInteger = (
  value: string | undefined,
  fallback: number,
  fieldName: string,
): number => {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value)) {
    throw new QueryValidationError(`${fieldName} must be a positive integer`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new QueryValidationError(`${fieldName} must be a positive integer`);
  }
  return parsed;
};

export const parsePagination = (
  request: Request,
  defaults = { page: 1, pageSize: 25 },
) => {
  const page = parsePositiveInteger(
    getQueryParam(request, 'pagination[page]'),
    defaults.page,
    'pagination[page]',
  );
  const requestedPageSize = parsePositiveInteger(
    getQueryParam(request, 'pagination[pageSize]'),
    defaults.pageSize,
    'pagination[pageSize]',
  );
  return { page, pageSize: Math.min(requestedPageSize, MAX_PAGE_SIZE) };
};

export const parseProjectFilters = (request: Request) => {
  const isFeatured = parseBoolean(
    getQueryParam(request, 'filters[isFeatured][$eq]'),
    'filters[isFeatured][$eq]',
  );
  const isCurrentProject = parseBoolean(
    getQueryParam(request, 'filters[isCurrentProject][$eq]'),
    'filters[isCurrentProject][$eq]',
  );
  const path = getQueryParam(request, 'filters[path][$eq]');

  const suppliedFilters = [isFeatured, isCurrentProject, path].filter(
    (value) => value !== undefined,
  );
  if (suppliedFilters.length > 1) {
    throw new QueryValidationError(
      'Only one project filter may be supplied per request',
    );
  }

  return { isFeatured, isCurrentProject, path };
};

export const parseMemberFilters = (request: Request) => ({
  memberDisplayStatus: getQueryParam(
    request,
    'filters[memberDisplayStatus][$eq]',
  ),
});
