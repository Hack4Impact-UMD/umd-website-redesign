import { describe, expect, it } from 'vitest';

import { defaultHomeContent } from './defaults';
import { normalizeHomeContent } from './normalize';

const publishedDocument = () => ({
  mode: 'published' as const,
  verifiedAt: '2026-07-20T00:00:00.000Z',
  payload: structuredClone(defaultHomeContent),
});

describe('normalizeHomeContent', () => {
  it('fails closed to the verified fallback for a legacy document', () => {
    const result = normalizeHomeContent({ hero: { heading: 'Legacy' } });

    expect(result.source).toBe('placeholder');
    expect(result.issue).toBe('legacy-document');
    expect(result.content).toBe(defaultHomeContent);
  });

  it('renders only explicitly verified testimonials and statistics', () => {
    const document = publishedDocument();
    document.payload.testimonials = {
      ...document.payload.testimonials,
      mode: 'published',
      items: [
        { quote: 'Verified quote', name: 'Verified person', organization: 'Verified org', verified: true },
        { quote: 'Draft quote', name: 'Draft person', organization: 'Draft org', verified: false },
      ],
    };
    document.payload.newsletter = {
      ...document.payload.newsletter,
      mode: 'externalLink',
      subscribeUrl: 'https://example.org/subscribe',
      stats: [
        { value: '10', label: 'verified stat', verified: true },
        { value: '20', label: 'draft stat', verified: false },
      ],
    };

    const result = normalizeHomeContent(document);

    expect(result.source).toBe('published');
    expect(result.content?.testimonials.items.map(({ name }) => name)).toEqual(['Verified person']);
    expect(result.content?.newsletter.stats.map(({ label }) => label)).toEqual(['verified stat']);
  });

  it('downgrades sections that claim publication without displayable content', () => {
    const document = publishedDocument();
    document.payload.testimonials.mode = 'published';
    document.payload.testimonials.items = [];
    document.payload.newsletter.mode = 'externalLink';
    document.payload.sponsors.mode = 'published';
    document.payload.sponsors.tiers = [];

    const result = normalizeHomeContent(document);

    expect(result.content?.testimonials.mode).toBe('placeholder');
    expect(result.content?.newsletter.mode).toBe('placeholder');
    expect(result.content?.sponsors.mode).toBe('placeholder');
  });
});
