import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { normalizeOurWorkContent } from '@/content-schema/our-work';
import OurWorkHeader from './OurWorkHeader';

// The Our Work page is an .astro template now. Its two behaviours are tested
// where they actually live: the header is a props-driven component, and
// "hidden means render nothing" is a normalizer contract rather than a DOM fact.
describe('Our Work content', () => {
  it('renders published CMS header content', () => {
    const resolved = normalizeOurWorkContent({
      mode: 'published',
      verifiedAt: '2026-08-01T12:00:00.000Z',
      payload: {
        header: {
          title: 'Verified Project Archive',
          subtitle: 'Current CMS-managed copy',
          image: '/api/media/content/our-work/header.webp',
          imageAlt: 'Verified archive artwork',
        },
      },
    });

    expect(resolved.source).toBe('published');
    render(<OurWorkHeader {...resolved.content!.header} />);

    expect(screen.getByRole('heading', { name: 'Verified Project Archive' })).toBeInTheDocument();
    expect(screen.getByText('Current CMS-managed copy')).toBeInTheDocument();
    expect(screen.getByAltText('Verified archive artwork')).toHaveAttribute(
      'src',
      '/api/media/content/our-work/header.webp',
    );
  });

  it('resolves a hidden document to no content, so the page renders an empty main', () => {
    const resolved = normalizeOurWorkContent({ mode: 'hidden' });

    expect(resolved.source).toBe('hidden');
    expect(resolved.content).toBeNull();
  });
});
