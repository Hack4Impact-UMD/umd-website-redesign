import type { Request } from 'express';
import { describe, expect, it } from 'vitest';
import {
  MAX_PAGE_SIZE,
  QueryValidationError,
  parsePagination,
  parseProjectFilters,
} from '../../src/utils/query';

const requestFor = (query: string) =>
  ({ originalUrl: `/api/projects?${query}`, query: {} }) as Request;

describe('query compatibility', () => {
  it('preserves the existing pageSize=200 request', () => {
    expect(parsePagination(requestFor('pagination%5Bpage%5D=1&pagination%5BpageSize%5D=200'))).toEqual({
      page: 1,
      pageSize: 200,
    });
  });

  it('clamps larger page sizes to the compatibility ceiling', () => {
    expect(parsePagination(requestFor('pagination%5BpageSize%5D=999')).pageSize).toBe(MAX_PAGE_SIZE);
  });

  it.each(['0', '-1', 'abc', '1.5'])('rejects invalid page value %s', (value) => {
    expect(() => parsePagination(requestFor(`pagination%5Bpage%5D=${value}`))).toThrow(QueryValidationError);
  });

  it('parses a current frontend filter while ignoring fields and populate parameters', () => {
    const request = requestFor(
      'fields%5B0%5D=title&populate=image&filters%5BisCurrentProject%5D%5B%24eq%5D=true',
    );
    expect(parseProjectFilters(request)).toEqual({
      isFeatured: undefined,
      isCurrentProject: true,
      path: undefined,
    });
  });

  it('rejects invalid booleans instead of silently removing the filter', () => {
    expect(() =>
      parseProjectFilters(requestFor('filters%5BisFeatured%5D%5B%24eq%5D=maybe')),
    ).toThrow(QueryValidationError);
  });

  it('rejects combined filters that would require undeclared composite indexes', () => {
    expect(() =>
      parseProjectFilters(
        requestFor(
          'filters%5BisFeatured%5D%5B%24eq%5D=true&filters%5BisCurrentProject%5D%5B%24eq%5D=true',
        ),
      ),
    ).toThrow(QueryValidationError);
  });

  it('decodes a path filter exactly once', () => {
    expect(
      parseProjectFilters(
        requestFor('filters%5Bpath%5D%5B%24eq%5D=camp%20starfish'),
      ).path,
    ).toBe('camp starfish');
  });
});
