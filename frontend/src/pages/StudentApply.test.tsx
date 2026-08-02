import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getContentDocument } from '@/api/content';
import { defaultApplyStudentContent, STUDENT_APPLICATION_URL } from '@/content/apply';
import StudentApply from './StudentApply';

vi.mock('@/api/content', () => ({ getContentDocument: vi.fn() }));

describe('StudentApply', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keeps the retained application destination disabled in placeholder mode', async () => {
    vi.mocked(getContentDocument).mockResolvedValue({ mode: 'placeholder' });
    render(<MemoryRouter><StudentApply /></MemoryRouter>);

    expect(await screen.findAllByRole('button', { name: 'Applications closed' })).toHaveLength(2);
    expect(screen.queryByRole('link', { name: /apply now/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Applications closed' })).not.toBeInTheDocument();
  });

  it('activates only the exact URL in a freshly verified published open state', async () => {
    vi.mocked(getContentDocument).mockResolvedValue({
      mode: 'published',
      verifiedAt: '2026-08-01T12:00:00Z',
      payload: {
        ...defaultApplyStudentContent,
        applicationStatus: {
          state: 'open',
          label: 'Applications are open.',
          applicationUrl: STUDENT_APPLICATION_URL,
        },
      },
    });
    render(<MemoryRouter><StudentApply /></MemoryRouter>);

    const links = await screen.findAllByRole('link', { name: /apply now|applications closed/i });
    expect(links).toHaveLength(3);
    links.forEach((link) => expect(link).toHaveAttribute('href', STUDENT_APPLICATION_URL));
  });
});
