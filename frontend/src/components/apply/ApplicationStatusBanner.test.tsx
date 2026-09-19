import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ApplicationStatusBanner from './ApplicationStatusBanner';

describe('ApplicationStatusBanner', () => {
  it('links only a verified open application URL', () => {
    render(
      <ApplicationStatusBanner
          status={{
            state: 'open',
            label: 'Applications are open.',
            applicationUrl: 'https://apply.example.org/current',
          }}
        />,
    );

    expect(screen.getByRole('link', { name: 'Apply now' })).toHaveAttribute(
      'href',
      'https://apply.example.org/current',
    );
  });

  it('shows a closed state without an application link', () => {
    render(
      <ApplicationStatusBanner
          status={{ state: 'closed', label: 'Applications are currently closed.' }}
        />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Applications are currently closed.');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
