import { Timestamp } from 'firebase-admin/firestore';
import { describe, expect, it } from 'vitest';
import { normalizeContentMedia } from '../../src/mappers/content';

describe('content control normalization', () => {
  it('normalizes CMS verification dates to API ISO strings', () => {
    const result = normalizeContentMedia('home', {
      mode: 'published',
      verifiedAt: Timestamp.fromDate(new Date('2026-07-19T12:34:56.000Z')),
      payload: { hero: { slides: [] } },
    });
    expect(result).toMatchObject({
      mode: 'published',
      verifiedAt: '2026-07-19T12:34:56.000Z',
      payload: { hero: { slides: [] } },
    });
  });

  it('preserves placeholder/hidden documents without requiring payload', () => {
    expect(normalizeContentMedia('about', { mode: 'hidden' })).toEqual({
      mode: 'hidden',
      verifiedAt: null,
    });
  });
});
