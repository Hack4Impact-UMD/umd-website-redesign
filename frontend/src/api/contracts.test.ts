import { describe, expect, it } from 'vitest';
import { membersResponseSchema, projectsResponseSchema } from './contracts';

const legacyMember = {
  id: '255',
  attributes: {
    firstName: 'Kim',
    lastName: 'Luu',
    pronouns: 'she/her',
    memberDisplayStatus: 'Current Member',
    componentRolesArr: [
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
    ],
    avatar: { data: null },
  },
};

const pagination = { page: 1, pageSize: 250, pageCount: 1, total: 1 };

describe('legacy member role compatibility', () => {
  it('keeps a member response while removing only malformed nested roles', () => {
    const result = membersResponseSchema.parse({
      data: [legacyMember],
      meta: { pagination },
    });

    expect(result.data[0]).toMatchObject({
      id: '255',
      attributes: {
        firstName: 'Kim',
        componentRolesArr: [
          {
            title: 'Designer',
            isDisplayRole: false,
            team: 'Breastfeeding Center for Greater Washington',
          },
          {
            title: 'Director of Design',
            isDisplayRole: true,
          },
        ],
      },
    });
    expect(result.data[0].attributes.componentRolesArr[1].team).toBeUndefined();
  });

  it('applies the same tolerance to members embedded in project responses', () => {
    const result = projectsResponseSchema.parse({
      data: [{
        id: '32',
        attributes: {
          title: 'Breastfeeding Center',
          path: 'breastfeeding-center-gw',
          summary: 'Summary',
          blurb: 'Blurb',
          isFeatured: false,
          isCurrentProject: true,
          hostedProjectURL: null,
          image: { data: [] },
          members: { data: [legacyMember] },
        },
      }],
      meta: { pagination },
    });

    expect(result.data[0].attributes.members.data[0].id).toBe('255');
    expect(result.data[0].attributes.hostedProjectURL).toBeUndefined();
    expect(result.data[0].attributes.members.data[0].attributes.componentRolesArr)
      .toHaveLength(2);
  });

  it.each([
    ['a non-record role', ['Designer']],
    ['a non-boolean display flag', [{ title: 'Designer', isDisplayRole: 'yes' }]],
    ['a non-string team', [{ title: 'Designer', isDisplayRole: true, team: 42 }]],
    ['a non-string date', [{ title: 'Designer', isDisplayRole: true, startDate: 42 }]],
  ])('still rejects %s', (_description, componentRolesArr) => {
    const result = membersResponseSchema.safeParse({
      data: [{
        ...legacyMember,
        attributes: { ...legacyMember.attributes, componentRolesArr },
      }],
      meta: { pagination },
    });

    expect(result.success).toBe(false);
  });
});
