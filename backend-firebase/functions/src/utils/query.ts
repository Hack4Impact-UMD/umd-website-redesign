import { Request } from 'express';

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

export const parseBoolean = (value: string | undefined): boolean | undefined => {
  if (!value) return undefined;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  return undefined;
};

export const parseInteger = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const rounded = Math.floor(parsed);
  return rounded > 0 ? rounded : fallback;
};

export const parsePagination = (request: Request, defaults = { page: 1, pageSize: 25 }) => {
  const page = parseInteger(getQueryParam(request, 'pagination[page]'), defaults.page);
  const pageSize = parseInteger(
    getQueryParam(request, 'pagination[pageSize]'),
    defaults.pageSize,
  );
  return { page, pageSize };
};

export const parseProjectFilters = (request: Request) => {
  const isFeatured = parseBoolean(getQueryParam(request, 'filters[isFeatured][$eq]'));
  const isCurrentProject = parseBoolean(
    getQueryParam(request, 'filters[isCurrentProject][$eq]'),
  );
  const path = getQueryParam(request, 'filters[path][$eq]');

  return {
    isFeatured,
    isCurrentProject,
    path,
  };
};

export const parseMemberFilters = (request: Request) => {
  const memberDisplayStatus = getQueryParam(
    request,
    'filters[memberDisplayStatus][$eq]',
  );

  return {
    memberDisplayStatus,
  };
};
