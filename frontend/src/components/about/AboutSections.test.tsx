import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { MemberEntity, ProjectEntity } from '@/api';
import { defaultAboutContent, normalizeAboutContent } from '@/content-schema/about';
import AboutSections from './AboutSections';

// The page fetches at build time now, so these tests drive the view directly
// instead of mocking three API modules.
const currentProjects: ProjectEntity[] = [
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
];

const boardMembers: MemberEntity[] = [
  {
    id: 'board-1',
    attributes: {
      firstName: 'Test',
      lastName: 'Director',
      linkedinUrl: 'https://www.linkedin.com/in/test-director',
      memberDisplayStatus: 'Current Board Member',
      componentRolesArr: [{ title: 'Executive Director', isDisplayRole: true }],
      avatar: { data: null },
    },
  },
];

const teamMembers: MemberEntity[] = [
  {
    id: 'member-1',
    attributes: {
      firstName: 'Test',
      lastName: 'Member',
      pronouns: 'they/them',
      linkedinUrl: 'https://www.linkedin.com/in/test-member',
      memberDisplayStatus: 'Current Member',
      componentRolesArr: [{ title: 'Engineer', team: 'Community Connect', isDisplayRole: true }],
      avatar: { data: null },
    },
  },
];

type ResolvedAboutContent = NonNullable<ReturnType<typeof normalizeAboutContent>['content']>;

const renderWith = (content: ResolvedAboutContent) =>
  render(
    <AboutSections
      content={content}
      currentProjects={currentProjects}
      boardMembers={boardMembers}
      teamMembers={teamMembers}
    />,
  );

describe('AboutSections', () => {
  it('renders published content with project, board and member data', () => {
    renderWith(normalizeAboutContent({
      mode: 'published',
      verifiedAt: '2026-07-20T12:00:00Z',
      payload: defaultAboutContent,
    }).content!);

    expect(screen.getByRole('heading', { name: 'About Us' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Our Mission' })).not.toBeInTheDocument();
    expect(screen.getByText(/We leverage technology for social good/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'At a Glance' })).toBeInTheDocument();
    expect(screen.getByText('Founded at UMD')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lydia Hu' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/lydia-hu/',
    );
    expect(screen.getByRole('heading', { name: 'Verified Project' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test Director' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Meet the Team' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test Member' })).toBeInTheDocument();
    expect(screen.getByText('they/them')).toBeInTheDocument();
    expect(screen.getByText('Community Connect')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /test member's linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/test-member',
    );
  });

  it('renders the safe local copy when the document resolves to a placeholder', () => {
    const resolved = normalizeAboutContent({ mode: 'placeholder' });
    expect(resolved.source).toBe('placeholder');

    renderWith(resolved.content!);

    expect(screen.getByRole('heading', { name: 'About Us' })).toBeInTheDocument();
    expect(screen.getByText(/See how we’ve grown from vision to impact/i)).toBeInTheDocument();
  });

  it('keeps published copy when supplemental story content is absent', () => {
    const { story: _story, highlights: _highlights, ...legacyPayload } = defaultAboutContent;
    const resolved = normalizeAboutContent({
      mode: 'published',
      verifiedAt: '2026-07-20T12:00:00Z',
      payload: legacyPayload,
    });

    renderWith(resolved.content!);

    expect(screen.getByText(/We leverage technology for social good/i)).toBeInTheDocument();
  });
});
