import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { defaultSiteSettings } from '@/content/site-settings';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('keeps the shared route contract stable', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/aboutus');
    expect(screen.getByRole('link', { name: 'Our Work' })).toHaveAttribute('href', '/ourwork');
    expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contactus');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens and closes the desktop dropdown from the keyboard', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    const applyLink = screen.getByRole('link', { name: 'Apply' });
    expect(applyLink).toHaveFocus();
    expect(applyLink).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'For Students' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(applyLink).toHaveAttribute('aria-expanded', 'false');
  });

  it('exposes the mobile submenu with explicit expanded state', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'Open Apply submenu' }));
    expect(screen.getByRole('button', { name: 'Close Apply submenu' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders validated settings supplied by the app shell', () => {
    const settings = {
      ...defaultSiteSettings,
      navbar: { links: [{ label: 'Chapter', href: '/aboutus' }] },
    };
    render(<MemoryRouter><Navbar settings={settings} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Chapter' })).toHaveAttribute('href', '/aboutus');
  });
});
