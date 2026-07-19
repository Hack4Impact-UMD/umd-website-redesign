import { describe, expect, it } from 'vitest';
import { memberQuery, projectQuery } from './query';

describe('API query builders', () => {
  it('encodes one explicit project filter with URLSearchParams', () => {
    const query = projectQuery(2, 200, { kind: 'path', value: 'a project/path' });
    expect(query.get('pagination[page]')).toBe('2');
    expect(query.get('filters[path][$eq]')).toBe('a project/path');
    expect([...query.keys()].filter((key) => key.startsWith('filters'))).toHaveLength(1);
  });

  it('rejects invalid page sizes and empty path filters', () => {
    expect(() => memberQuery(1, 251)).toThrow(/pageSize/);
    expect(() => projectQuery(1, 100, { kind: 'path', value: ' ' })).toThrow(/empty/);
  });
});
