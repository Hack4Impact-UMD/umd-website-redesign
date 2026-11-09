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

/** Case, punctuation and spacing aside, so `kisses-for-kyle` matches "Kisses for Kyle". */
const normalize = (value?: string | null) =>
  value?.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() || '';

/**
 * A role's team names the project it was on, but not always by the project's
 * current title: titles get edited ("Kisses for Kyle" became "Kisses for Kyle
 * Gift Drive"), and some teams are named for the partner. So a role belongs to
 * the project when its team matches any of the project's names.
 */
export function resolveProjectRole(member: ProjectMember, projectNames: Array<string | undefined>): string | null {
  const roles = member.attributes.componentRolesArr;
  const keys = new Set(projectNames.map(normalize).filter(Boolean));
  const matchingRole = roles.find((role) => keys.has(normalize(role.team)));

  if (matchingRole) return matchingRole.title;
  return roles.length === 1 ? roles[0].title : null;
}

const sortTeamMembers = (members: TeamMemberView[]) =>
  [...members].sort((a, b) => {
    const roleOrder = (ROLE_PRIORITY[a.role] ?? 99) - (ROLE_PRIORITY[b.role] ?? 99);
    return roleOrder || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
  });

/**
 * Every member the project lists appears. One whose role on this project
 * cannot be told apart from their others is shown under other contributors
 * without a role, rather than with a guessed one.
 */
export function groupTeamMembers(members: ProjectMember[], projectNames: Array<string | undefined>) {
  const groups = {
    productDesign: [] as TeamMemberView[],
    engineering: [] as TeamMemberView[],
    other: [] as TeamMemberView[],
  };

  members.forEach((member) => {
    const role = resolveProjectRole(member, projectNames) ?? '';

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
