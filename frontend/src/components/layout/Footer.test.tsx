import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { defaultSiteSettings } from '@/content/site-settings';
import Footer from './Footer';

describe('Footer', () => {
  it('does not claim a newsletter subscription that has no provider', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /newsletter/i })).not.toBeInTheDocument();
    expect(screen.getByText(/follow our social channels/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Facebook' })).toHaveAttribute(
      'href',
      'https://facebook.com/hack4impactumd',
    );
    expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contactus');
    expect(screen.getByRole('link', { name: 'TerpLink' })).toHaveAttribute(
      'href',
      'https://terplink.umd.edu/organization/hack4impact',
    );
  });

  it('renders validated contact and newsletter settings without inventing a form', () => {
    const settings = {
      ...defaultSiteSettings,
      footer: {
        ...defaultSiteSettings.footer,
        newsletterPrompt: 'Monthly chapter notes.',
        newsletterUrl: 'https://example.org/newsletter',
        contact: { addressLines: ['College Park, Maryland'], email: 'chapter@example.org' },
      },
    };
    render(<MemoryRouter><Footer settings={settings} /></MemoryRouter>);
    expect(screen.getByText('Monthly chapter notes.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read our newsletter' })).toHaveAttribute(
      'href',
      'https://example.org/newsletter',
    );
    expect(screen.getByRole('link', { name: 'chapter@example.org' })).toHaveAttribute(
      'href',
      'mailto:chapter@example.org',
    );
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});
