import { describe, expect, it } from 'vitest';
import { diffIds, normalizeIdArray } from '../../src/lib/relationAdapters';

describe('relation adapters', () => {
  it('normalizes IDs without duplicates', () => {
    expect(normalizeIdArray([' 1 ', 1, { id: '2' }, '', null])).toEqual(['1', '2']);
  });

  it('calculates stable add/remove sets', () => {
    expect(diffIds(['1', '2'], ['2', '3', '3'])).toEqual({
      added: ['3'],
      removed: ['1'],
    });
  });
});
