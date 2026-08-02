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

  it('does not render fabricated testimonial people in placeholder mode', () => {
    render(<TestimonialsSection content={defaultHomeContent.testimonials} />);

    expect(screen.getByRole('status')).toHaveTextContent(/verified partner stories/i);
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

  it('shows a safe placeholder instead of unverified impact claims', () => {
    const { container } = render(
      <>
        <ImpactSection content={defaultHomeContent.impact} />
        <CommunityEventsSection />
      </>,
    );

    expect(screen.getByRole('heading', { name: 'Our Impact' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/verified impact metrics/i);
    expect(screen.queryByText('150+')).not.toBeInTheDocument();
    expect(screen.queryByText('$150K')).not.toBeInTheDocument();
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
