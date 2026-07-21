import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('keeps the shared route contract stable', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'About Us' })[0]).toHaveAttribute('href', '/aboutus');
    expect(screen.getAllByRole('link', { name: 'Our Work' })[0]).toHaveAttribute('href', '/ourwork');
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });
});
