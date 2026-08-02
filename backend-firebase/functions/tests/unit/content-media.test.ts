import { describe, expect, it } from 'vitest';
import { normalizeContentMedia } from '../../src/mappers/content';

describe('content media normalization', () => {
  it('replaces rejected raw media instead of leaking it', () => {
    const content = normalizeContentMedia('about', {
      header: { image: 'content/%252e%252e%252fsecret.svg' },
    });
    expect(content.header.image).toBeNull();
  });

  it('normalizes optional desktop and mobile Home hero media', () => {
    const content = normalizeContentMedia('home', {
      hero: {
        slides: [
          {
            image: 'content/content_home/main/hero-slides/desktop.webp',
            mobileImage: 'content/content_home/main/hero-slides/mobile.webp',
          },
        ],
      },
    });

    expect(content.hero.slides[0]).toMatchObject({
      image: '/api/media/content/content_home/main/hero-slides/desktop.webp',
      mobileImage: '/api/media/content/content_home/main/hero-slides/mobile.webp',
    });
  });
});
