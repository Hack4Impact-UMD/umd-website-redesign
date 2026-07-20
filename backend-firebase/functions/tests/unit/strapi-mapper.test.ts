import { describe, expect, it } from 'vitest';

import { mapMemberToStrapiEntity } from '../../src/mappers/strapi';

describe('member API mapper', () => {
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
});
