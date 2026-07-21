import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('does not claim a newsletter subscription that has no provider', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.queryByText(/subscribed successfully/i)).not.toBeInTheDocument();
    expect(screen.getByText(/verified social channels/i)).toBeInTheDocument();
  });
});
