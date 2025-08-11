import type { Attribute, Schema } from '@strapi/strapi';

export interface RolesRolesTest extends Schema.Component {
  collectionName: 'components_test_roles_tests';
  info: {
    description: '';
    displayName: 'orgRoles';
    icon: 'address-card';
  };
  attributes: {
    endDate: Attribute.Date;
    isDisplayRole: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    startDate: Attribute.Date;
    team: Attribute.String;
    title: Attribute.Enumeration<
      [
        'Executive Director',
        'Director of Product',
        'Director of Engineering',
        'Director of Education',
        'Director of Design',
        'Director of Public Relations and Outreach',
        'Director of Events',
        'Director of Recruitment',
        'Director of Finance and Sponsorship',
        'Senior Advisor',
        'Designer',
        'Product Manager',
        'Tech Lead',
        'Engineer',
        'Bootcamp'
      ]
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'roles.roles-test': RolesRolesTest;
    }
  }
}
