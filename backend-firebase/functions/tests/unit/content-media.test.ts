import { describe, expect, it } from 'vitest';
import { normalizeContentMedia } from '../../src/mappers/content';

describe('content media normalization', () => {
  it('replaces rejected raw media instead of leaking it', () => {
    const content = normalizeContentMedia('about', {
      header: { image: 'content/%252e%252e%252fsecret.svg' },
    });
    expect(content.header.image).toBeNull();
  });
});
