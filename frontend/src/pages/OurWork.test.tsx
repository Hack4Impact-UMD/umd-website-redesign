import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getContentDocument } from '@/api/content';
import OurWork from './OurWork';

vi.mock('@/api/content', () => ({ getContentDocument: vi.fn() }));
vi.mock('@/components/our_work/OurWorkProjectLibrary', () => ({
  default: () => <section aria-label="Project library" />,
}));

const mockedGetContent = vi.mocked(getContentDocument);

describe('OurWork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders published CMS header content', async () => {
    mockedGetContent.mockResolvedValue({
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

    render(<OurWork />);

    expect(await screen.findByRole('heading', { name: 'Verified Project Archive' })).toBeInTheDocument();
    expect(screen.getByText('Current CMS-managed copy')).toBeInTheDocument();
    expect(screen.getByAltText('Verified archive artwork')).toHaveAttribute(
      'src',
      '/api/media/content/our-work/header.webp',
    );
    expect(screen.getByRole('region', { name: 'Project library' })).toBeInTheDocument();
  });

  it('hides the page when the CMS document is hidden', async () => {
    mockedGetContent.mockResolvedValue({ mode: 'hidden' });

    render(<OurWork />);

    expect(await screen.findByRole('main', { name: 'Our work' })).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Project library' })).not.toBeInTheDocument();
  });
});
