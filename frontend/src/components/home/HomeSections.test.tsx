import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { defaultHomeContent } from '@/content/home';
import CommunityEventsSection from './CommunityEventsSection';
import ImpactSection from './ImpactSection';
import NonprofitMapSection from './NonprofitMapSection';
import SponsorsSection from './SponsorsSection';
import TestimonialsSection from './TestimonialsSection';

describe('Home sections', () => {
  it('routes the verified map card to its project detail page', () => {
    render(
      <MemoryRouter>
        <NonprofitMapSection content={defaultHomeContent.nonprofitMap} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Camp Starfish' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Project' })).toHaveAttribute(
      'href',
      '/ourwork/camp-starfish',
    );
  });

  it('does not render testimonial placeholders when stories are unavailable', () => {
    render(<TestimonialsSection content={defaultHomeContent.testimonials} />);

    expect(screen.queryByRole('heading', { name: /testimonials/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/nonprofit person/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/organization name/i)).not.toBeInTheDocument();
  });

  it('presents legacy sponsor assets in the Figma sponsor section', () => {
    render(
      <MemoryRouter>
        <SponsorsSection content={defaultHomeContent.sponsors} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Our Sponsors' })).toBeInTheDocument();
    expect(screen.getByAltText('Microsoft logo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /interested in sponsoring or partnering/i })).toHaveAttribute(
      'href',
      '/contactus',
    );
  });

  it('restores the retained impact metrics', () => {
    const { container } = render(
      <>
        <ImpactSection content={defaultHomeContent.impact} />
        <CommunityEventsSection />
      </>,
    );

    expect(screen.getByRole('heading', { name: 'Our Impact' })).toBeInTheDocument();
    expect(screen.getByText('10+')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('150+')).toBeInTheDocument();
    expect(screen.getByText('400+')).toBeInTheDocument();
    expect(screen.getByText('$150K')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /student-led community events/i })).toBeInTheDocument();
    expect(container.querySelectorAll('img')).toHaveLength(7);
  });

  it('renders only verified published impact metrics', () => {
    render(
      <ImpactSection
        content={{
          mode: 'published',
          heading: 'Verified Impact',
          placeholderMessage: 'Metrics unavailable.',
          stats: [
            { value: '32', label: 'Projects', verified: true },
            { value: '999', label: 'Unverified claim', verified: false },
          ],
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Verified Impact' })).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.queryByText('999')).not.toBeInTheDocument();
  });
});
