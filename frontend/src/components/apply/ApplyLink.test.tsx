import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ApplyLink from './ApplyLink';

describe('ApplyLink URL safety', () => {
  it('renders safe internal and HTTPS destinations as links', () => {
    const { rerender } = render(
      <MemoryRouter><ApplyLink href="/ourwork">Our work</ApplyLink></MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Our work' })).toHaveAttribute('href', '/ourwork');

    rerender(
      <MemoryRouter><ApplyLink href="https://example.org/project">Project</ApplyLink></MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Project' })).toHaveAttribute(
      'href',
      'https://example.org/project',
    );
  });

  it.each(['javascript:alert(1)', 'http://example.org', '//example.org']) (
    'does not render unsafe destination %s as a link',
    (href) => {
      render(<MemoryRouter><ApplyLink href={href}>Unsafe</ApplyLink></MemoryRouter>);
      expect(screen.queryByRole('link', { name: 'Unsafe' })).not.toBeInTheDocument();
      expect(screen.getByText('Unsafe')).toHaveAttribute('aria-disabled', 'true');
    },
  );
});
