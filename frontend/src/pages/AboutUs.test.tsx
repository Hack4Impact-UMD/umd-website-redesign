import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getContentDocument, getMembers, getProjects } from '@/api';
import { defaultAboutContent } from '@/content/about';
import AboutUs from './AboutUs';

vi.mock('@/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api')>();
  return {
    ...actual,
    getContentDocument: vi.fn(),
    getMembers: vi.fn(),
    getProjects: vi.fn(),
  };
});

const mockedGetContent = vi.mocked(getContentDocument);
const mockedGetMembers = vi.mocked(getMembers);
const mockedGetProjects = vi.mocked(getProjects);

describe('AboutUs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetContent.mockResolvedValue({
      mode: 'published',
      verifiedAt: '2026-07-20T12:00:00Z',
      payload: defaultAboutContent,
    });
    mockedGetProjects.mockResolvedValue([
      {
        id: 'project-1',
        attributes: {
          title: 'Verified Project',
          path: 'verified-project',
          summary: 'A published project summary.',
          blurb: '',
          isFeatured: true,
          isCurrentProject: true,
          image: { data: [] },
          members: { data: [] },
        },
      },
    ]);
    mockedGetMembers.mockImplementation(async (options) =>
      options?.filterStatus === 'Current Board Member'
        ? [
            {
              id: 'board-1',
              attributes: {
                firstName: 'Test',
                lastName: 'Director',
                linkedinUrl: 'https://www.linkedin.com/in/test-director',
                memberDisplayStatus: 'Current Board Member',
                componentRolesArr: [
                  { title: 'Executive Director', isDisplayRole: true },
                ],
                avatar: { data: null },
              },
            },
          ]
        : [
            {
              id: 'member-1',
              attributes: {
                firstName: 'Test',
                lastName: 'Member',
                pronouns: 'they/them',
                linkedinUrl: 'https://www.linkedin.com/in/test-member',
                memberDisplayStatus: 'Current Member',
                componentRolesArr: [
                  { title: 'Engineer', team: 'Community Connect', isDisplayRole: true },
                ],
                avatar: { data: null },
              },
            },
          ],
    );
  });

  it('renders published Firebase content with live project, board, and member data', async () => {
    render(
      <MemoryRouter>
        <AboutUs />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'About Us' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Our Mission' })).not.toBeInTheDocument();
    expect(screen.getByText(/We leverage technology for social good/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'At a Glance' })).toBeInTheDocument();
    expect(screen.getByText('Founded at UMD')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lydia Hu' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/lydia-hu/',
    );
    expect(await screen.findByRole('heading', { name: 'Verified Project' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Test Director' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Meet the Team' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test Member' })).toBeInTheDocument();
    expect(screen.getByText('they/them')).toBeInTheDocument();
    expect(screen.getByText('Community Connect')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /test member's linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/test-member',
    );
  });

  it('falls back to the safe local About copy when page content cannot be fetched', async () => {
    mockedGetContent.mockRejectedValueOnce(new Error('offline'));

    render(
      <MemoryRouter>
        <AboutUs />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'About Us' })).toBeInTheDocument();
    expect(screen.getByText(/See how we’ve grown from vision to impact/i)).toBeInTheDocument();
  });

  it('keeps published legacy content when supplemental story content is absent', async () => {
    const { story: _story, highlights: _highlights, ...legacyPayload } = defaultAboutContent;
    mockedGetContent.mockResolvedValueOnce({
      mode: 'published',
      verifiedAt: '2026-07-20T12:00:00Z',
      payload: legacyPayload,
    });

    render(
      <MemoryRouter>
        <AboutUs />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/We leverage technology for social good/i)).toBeInTheDocument();
  });
});
