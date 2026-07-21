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

  it('labels legacy sponsor assets as past supporters', () => {
    render(<SponsorsSection content={defaultHomeContent.sponsors} />);

    expect(screen.getByRole('heading', { name: 'Past supporters' })).toBeInTheDocument();
    expect(screen.getByAltText('Microsoft logo')).toBeInTheDocument();
  });

  it('renders the Figma impact row and event mosaic using local images', () => {
    const { container } = render(
      <>
        <ImpactSection />
        <CommunityEventsSection />
      </>,
    );

    expect(screen.getByRole('heading', { name: 'Our Impact' })).toBeInTheDocument();
    expect(screen.getByText('10+')).toBeInTheDocument();
    expect(screen.getByText('$150K')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /student-led community events/i })).toBeInTheDocument();
    expect(container.querySelectorAll('img')).toHaveLength(7);
  });
});
