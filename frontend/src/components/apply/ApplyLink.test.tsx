import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ApplyLink from './ApplyLink';

describe('ApplyLink URL safety', () => {
  it('renders safe internal and HTTPS destinations as links', () => {
    const { rerender } = render(
      <ApplyLink href="/ourwork">Our work</ApplyLink>,
    );
    expect(screen.getByRole('link', { name: 'Our work' })).toHaveAttribute('href', '/ourwork');

    rerender(
      <ApplyLink href="https://example.org/project">Project</ApplyLink>,
    );
    expect(screen.getByRole('link', { name: 'Project' })).toHaveAttribute(
      'href',
      'https://example.org/project',
    );
  });

  it.each(['javascript:alert(1)', 'http://example.org', '//example.org']) (
    'does not render unsafe destination %s as a link',
    (href) => {
      render(<ApplyLink href={href}>Unsafe</ApplyLink>);
      expect(screen.queryByRole('link', { name: 'Unsafe' })).not.toBeInTheDocument();
      expect(screen.getByText('Unsafe')).toHaveAttribute('aria-disabled', 'true');
    },
  );
});
