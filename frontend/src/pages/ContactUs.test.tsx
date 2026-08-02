import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import ContactUs from './ContactUs';

describe('ContactUs', () => {
  it('preserves the chapter email, address, and external community links', () => {
    render(<MemoryRouter><ContactUs /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /student team gathered after a project presentation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'umd@hack4impact.org' })).toHaveAttribute(
      'href',
      'mailto:umd@hack4impact.org',
    );
    expect(screen.getByText('7809 Regents Drive')).toBeInTheDocument();
    const chapterLinks = screen.getByRole('list', { name: 'Chapter links' });
    expect(within(chapterLinks).getAllByRole('link')).toHaveLength(5);
    expect(within(chapterLinks).getByRole('link', { name: 'TerpLink' })).toHaveAttribute(
      'href',
      'https://terplink.umd.edu/organization/hack4impact',
    );
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});
