import { describe, expect, it } from 'vitest';

import type { ProjectMember } from '@/components/project_page/projectPageMapper';
import { groupTeamMembers, resolveProjectRole } from './ProjectPage';

const member = (
  id: string,
  roles: ProjectMember['attributes']['componentRolesArr'],
): ProjectMember => ({
  id,
  attributes: {
    firstName: id,
    lastName: 'Member',
    memberDisplayStatus: 'Current Member',
    componentRolesArr: roles,
    avatar: { data: null },
  },
});

const role = (title: string, team?: string) => ({
  title,
  team,
  isDisplayRole: true,
  startDate: null,
  endDate: null,
});

describe('project team mapping', () => {
  it('selects an exact project role and avoids ambiguous unrelated roles', () => {
    expect(resolveProjectRole(member('Exact', [role('Engineer', 'Other'), role('Designer', 'Target')]), 'Target')).toBe('Designer');
    expect(resolveProjectRole(member('Single', [role('Engineer')]), 'Target')).toBe('Engineer');
    expect(resolveProjectRole(member('Ambiguous', [role('Engineer'), role('Designer')]), 'Target')).toBeNull();
  });

  it('keeps verified roles in honest, deterministic groups', () => {
    const groups = groupTeamMembers([
      member('Zed', [role('Engineer')]),
      member('Ada', [role('Product Manager')]),
      member('Pat', [role('Community Liaison')]),
    ], 'Target');

    expect(groups.productDesign.map((item) => item.role)).toEqual(['Product Manager']);
    expect(groups.engineering.map((item) => item.role)).toEqual(['Engineer']);
    expect(groups.other.map((item) => item.role)).toEqual(['Community Liaison']);
  });
});
