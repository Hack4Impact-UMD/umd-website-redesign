import type { ProjectMember } from './projectPageMapper';

/**
 * Team grouping and role resolution for a project page.
 *
 * Pure functions over mapper output, kept out of the page component so they
 * survive the page becoming an .astro template and stay unit-testable without
 * rendering anything.
 */

const PRODUCT_DESIGN_ROLES = new Set(['Product Manager', 'Designer']);
const ENGINEERING_ROLES = new Set(['Tech Lead', 'Engineer', 'Bootcamp']);

const ROLE_PRIORITY: Record<string, number> = {
  'Product Manager': 0,
  Designer: 1,
  'Tech Lead': 2,
  Engineer: 3,
  Bootcamp: 4,
};

export type TeamMemberView = {
  id: string;
  name: string;
  role: string;
  imageSrc: string | null;
};

const normalize = (value?: string) => value?.trim().toLowerCase() || '';

export function resolveProjectRole(member: ProjectMember, projectTitle: string): string | null {
  const roles = member.attributes.componentRolesArr;
  const projectKey = normalize(projectTitle);
  const matchingRole = roles.find((role) => normalize(role.team) === projectKey);

  if (matchingRole) return matchingRole.title;
  return roles.length === 1 ? roles[0].title : null;
}

const sortTeamMembers = (members: TeamMemberView[]) =>
  [...members].sort((a, b) => {
    const roleOrder = (ROLE_PRIORITY[a.role] ?? 99) - (ROLE_PRIORITY[b.role] ?? 99);
    return roleOrder || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
  });

export function groupTeamMembers(members: ProjectMember[], projectTitle: string) {
  const groups = {
    productDesign: [] as TeamMemberView[],
    engineering: [] as TeamMemberView[],
    other: [] as TeamMemberView[],
  };

  members.forEach((member) => {
    const role = resolveProjectRole(member, projectTitle);
    if (!role) return;

    const name = `${member.attributes.firstName} ${member.attributes.lastName}`.trim();
    const teamMember = {
      id: member.id,
      name,
      role,
      imageSrc: member.attributes.avatar.data?.attributes.url || null,
    };

    if (PRODUCT_DESIGN_ROLES.has(role)) groups.productDesign.push(teamMember);
    else if (ENGINEERING_ROLES.has(role)) groups.engineering.push(teamMember);
    else groups.other.push(teamMember);
  });

  return {
    productDesign: sortTeamMembers(groups.productDesign),
    engineering: sortTeamMembers(groups.engineering),
    other: sortTeamMembers(groups.other),
  };
}
