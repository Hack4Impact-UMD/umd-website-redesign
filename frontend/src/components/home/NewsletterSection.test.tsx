import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { defaultHomeContent } from '@/content/home';
import NewsletterSection from './NewsletterSection';

describe('NewsletterSection', () => {
  it('shows an honest placeholder without rendering a fake subscription form', () => {
    render(<NewsletterSection content={defaultHomeContent.newsletter} />);

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.getByText(/signup is not currently available/i)).toBeInTheDocument();
    expect(screen.queryByText(/subscribed successfully/i)).not.toBeInTheDocument();
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
  });
});
