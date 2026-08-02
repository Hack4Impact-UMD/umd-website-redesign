import { describe, expect, it } from 'vitest';

import {
  mapMemberToStrapiEntity,
  mapProjectToStrapiEntity,
} from '../../src/mappers/strapi';
import type { MemberRecord, ProjectRecord } from '../../src/models';

const legacyRoles: unknown[] = [
  {
    title: 'Designer',
    isDisplayRole: false,
    team: 'Breastfeeding Center for Greater Washington',
    startDate: null,
    endDate: null,
  },
  {
    title: 'Director of Design',
    isDisplayRole: true,
    team: null,
    startDate: null,
    endDate: null,
  },
  { title: null, isDisplayRole: false, team: null, startDate: null, endDate: null },
];

const member: MemberRecord = {
  id: '255',
  firstName: 'Kim',
  lastName: 'Luu',
  memberDisplayStatus: 'Current Member',
  // Firestore data can predate the current MemberRole interface.
  componentRolesArr: legacyRoles as MemberRecord['componentRolesArr'],
  projectIds: ['32'],
};

describe('Strapi compatibility mapper', () => {
  it('exposes an existing LinkedIn profile for member cards', () => {
    expect(
      mapMemberToStrapiEntity({
        id: 'member-1',
        firstName: 'Test',
        lastName: 'Member',
        linkedinUrl: 'https://www.linkedin.com/in/test-member',
        componentRolesArr: [],
        memberDisplayStatus: 'Current Board Member',
        projectIds: [],
      }).attributes.linkedinUrl,
    ).toBe('https://www.linkedin.com/in/test-member');
  });

  it('omits the legacy null-title role without dropping Kim or her valid roles', () => {
    const mappedMember = mapMemberToStrapiEntity(member);

    expect(mappedMember.attributes.componentRolesArr).toEqual([
      {
        title: 'Designer',
        isDisplayRole: false,
        team: 'Breastfeeding Center for Greater Washington',
        startDate: null,
        endDate: null,
      },
      {
        title: 'Director of Design',
        isDisplayRole: true,
        team: null,
        startDate: null,
        endDate: null,
      },
    ]);

    const project: ProjectRecord = {
      id: '32',
      title: 'Breastfeeding Center',
      path: 'breastfeeding-center-gw',
      summary: 'Summary',
      blurb: 'Blurb',
      isFeatured: false,
      isCurrentProject: true,
      image: [],
      memberIds: ['255'],
    };

    const mappedProject = mapProjectToStrapiEntity(
      project,
      new Map([[member.id, member]]),
    );

    expect(mappedMember.id).toBe('255');
    expect(mappedMember.attributes.componentRolesArr).toHaveLength(2);
    expect(mappedProject.attributes.members.data).toEqual([mappedMember]);
  });
});
