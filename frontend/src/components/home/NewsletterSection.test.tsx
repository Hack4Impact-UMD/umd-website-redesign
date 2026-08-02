import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { defaultHomeContent } from '@/content/home';
import NewsletterSection from './NewsletterSection';

describe('NewsletterSection', () => {
  it('hides the section when no real newsletter destination is configured', () => {
    const { container } = render(<NewsletterSection content={defaultHomeContent.newsletter} />);

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /newsletter/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/subscribed successfully/i)).not.toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
    expect(screen.queryByText(/149 active members/i)).not.toBeInTheDocument();
  });

  it('keeps subscription and latest-issue destinations separate', () => {
    render(
      <NewsletterSection
        content={{
          ...defaultHomeContent.newsletter,
          mode: 'externalLink',
          linkLabel: 'Join the newsletter',
          subscribeUrl: 'https://example.org/subscribe',
          latestIssue: {
            sender: 'Hack4Impact UMD',
            title: 'Semester recap',
            summary: 'Verified chapter highlights.',
            href: 'https://example.org/latest',
          },
        }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Join the newsletter' })).toHaveAttribute(
      'href',
      'https://example.org/subscribe',
    );
    expect(screen.getByRole('link', { name: 'Read the Latest Issue' })).toHaveAttribute(
      'href',
      'https://example.org/latest',
    );
    expect(screen.getByRole('heading', { name: 'Semester recap' })).toBeInTheDocument();
    expect(screen.getByText('Hack4Impact UMD')).toBeInTheDocument();
    expect(screen.getByText('Verified chapter highlights.')).toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });
});
