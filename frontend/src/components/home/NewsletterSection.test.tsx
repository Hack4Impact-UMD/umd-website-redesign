import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NewsletterSection from './NewsletterSection';

describe('NewsletterSection', () => {
  it('states the actual newsletter capability without a fake success flow', () => {
    render(<NewsletterSection />);
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.getByText(/signup is not currently available/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /follow on instagram/i })).toHaveAttribute(
      'href',
      'https://instagram.com/hack4impactumd',
    );
  });
});
