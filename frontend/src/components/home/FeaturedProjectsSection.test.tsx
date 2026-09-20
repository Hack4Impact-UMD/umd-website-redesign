import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ProjectEntity } from '@/api';
import FeaturedProjectsSection from './FeaturedProjectsSection';

// Projects arrive as a prop now: the page fetches them at build time.
const featuredProjects: ProjectEntity[] = [
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
];

describe('FeaturedProjectsSection', () => {
  it('shows featured projects and a route to the full library', () => {
    render(<FeaturedProjectsSection projects={featuredProjects} />);

    expect(screen.getByRole('heading', { name: 'Community Connect' })).toBeInTheDocument();
    expect(screen.getByText('Example Partner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Community Connect project' })).toHaveAttribute(
      'href',
      '/ourwork/community%2Fconnect',
    );
    expect(screen.getByRole('link', { name: 'Explore all projects' })).toHaveAttribute('href', '/ourwork');
  });
});
