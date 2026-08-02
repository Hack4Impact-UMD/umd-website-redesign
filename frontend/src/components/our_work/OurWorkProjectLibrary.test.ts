import { describe, expect, it } from 'vitest';

import type { ProjectEntity } from '@/api';
import { getProjectYear, mapProject, matchesProjectSearch, sortProjects } from './OurWorkProjectLibrary';

const project = ({
  title,
  path,
  startDate,
  isCurrentProject = false,
  partnerName,
  memberName,
}: {
  title: string;
  path: string;
  startDate?: string;
  isCurrentProject?: boolean;
  partnerName?: string;
  memberName?: string;
}): ProjectEntity => ({
  id: path,
  attributes: {
    title,
    path,
    startDate,
    summary: '',
    blurb: '',
    isFeatured: false,
    isCurrentProject,
    image: { data: [] },
    nonprofit: partnerName ? { data: { id: `npo-${path}`, attributes: { name: partnerName } } } : undefined,
    members: { data: memberName ? [{
      id: `member-${path}`,
      attributes: {
        firstName: memberName.split(' ')[0],
        lastName: memberName.split(' ').slice(1).join(' '),
        memberDisplayStatus: 'Current Member',
        componentRolesArr: [],
        avatar: { data: null },
      },
    }] : [] },
  },
});

describe('project library mapping', () => {
  it('does not invent partner names or unrelated fallback imagery', () => {
    const result = mapProject(project({ title: 'A Project', path: 'a-project' }));

    expect(result.partnerName).toBeUndefined();
    expect(result.imageUrl).toBeUndefined();
  });

  it('searches by project, nonprofit, member, season, and year', () => {
    const item = mapProject(project({
      title: 'Community Portal',
      path: 'community-portal',
      startDate: '2025-09-01',
      partnerName: 'Example Nonprofit',
      memberName: 'Taylor Terp',
    }));

    expect(matchesProjectSearch(item, 'community')).toBe(true);
    expect(matchesProjectSearch(item, 'example nonprofit')).toBe(true);
    expect(matchesProjectSearch(item, 'taylor')).toBe(true);
    expect(matchesProjectSearch(item, 'fall 2025')).toBe(true);
    expect(matchesProjectSearch(item, '2025')).toBe(true);
    expect(matchesProjectSearch(item, 'missing')).toBe(false);
  });

  it('groups missing and valid dates predictably', () => {
    expect(getProjectYear('2024-03-01')).toBe('2024');
    expect(getProjectYear(undefined)).toBe('Unknown');
    expect(getProjectYear('not-a-date')).toBe('Unknown');
  });
});

describe('related project ordering', () => {
  it('orders current work first, then date, title, and path deterministically', () => {
    const projects = [
      project({ title: 'Zulu', path: 'zulu', startDate: '2024-01-01' }),
      project({ title: 'Alpha', path: 'alpha-b', startDate: '2024-01-01' }),
      project({ title: 'Alpha', path: 'alpha-a', startDate: '2024-01-01' }),
      project({ title: 'No Date', path: 'no-date', startDate: 'invalid' }),
      project({ title: 'Current', path: 'current', startDate: '2023-01-01', isCurrentProject: true }),
    ].map(mapProject);

    expect(projects.sort(sortProjects).map((item) => item.path)).toEqual([
      'current',
      'alpha-a',
      'alpha-b',
      'zulu',
      'no-date',
    ]);
  });
});
