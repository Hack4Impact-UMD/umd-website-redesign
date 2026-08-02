import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getProjects } from '@/api';
import FeaturedProjectsSection from './FeaturedProjectsSection';

vi.mock('@/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api')>()),
  getProjects: vi.fn(),
}));

describe('FeaturedProjectsSection', () => {
  beforeEach(() => {
    vi.mocked(getProjects).mockResolvedValue([
      {
        id: 'featured-1',
        attributes: {
          title: 'Community Connect',
          path: 'community/connect',
          summary: 'Summary',
          blurb: 'Blurb',
          isFeatured: true,
          isCurrentProject: true,
          nonprofit: { data: { id: 'partner-1', attributes: { name: 'Example Partner' } } },
          image: { data: [] },
          members: { data: [] },
        },
      },
    ]);
  });

  it('shows live featured projects and a route to the full library', async () => {
    render(
      <MemoryRouter>
        <FeaturedProjectsSection />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Community Connect' })).toBeInTheDocument();
    expect(screen.getByText('Example Partner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Community Connect project' })).toHaveAttribute(
      'href',
      '/ourwork/community%2Fconnect',
    );
    expect(screen.getByRole('link', { name: 'Explore all projects' })).toHaveAttribute('href', '/ourwork');
    expect(getProjects).toHaveBeenCalledWith(expect.objectContaining({
      filter: { kind: 'featured', value: true },
    }));
  });
});
