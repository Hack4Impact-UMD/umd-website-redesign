import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import ContactUs from './ContactUs';

describe('ContactUs', () => {
  it('preserves the chapter email, address, and external community links', () => {
    render(<MemoryRouter><ContactUs /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'umd@hack4impact.org' })).toHaveAttribute(
      'href',
      'mailto:umd@hack4impact.org',
    );
    expect(screen.getByText('7809 Regents Drive')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'TerpLink' })).toHaveAttribute(
      'href',
      'https://terplink.umd.edu/organization/hack4impact',
    );
  });
});
