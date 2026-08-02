import type { Page } from '@playwright/test';

export const project = {
  id: 'project-001',
  attributes: {
    title: 'Fixture Project',
    path: 'fixture-project',
    startDate: '2025-09-01',
    summary: 'Fixture summary',
    blurb: 'Fixture project details.',
    isFeatured: true,
    isCurrentProject: false,
    repoURL: 'https://github.com/Hack4Impact-UMD',
    hostedProjectURL: 'https://example.org',
    imageAltText: 'Fixture project',
    nonprofit: { data: { id: 'npo-1', attributes: { name: 'Fixture Nonprofit' } } },
    image: { data: [] },
    members: { data: [] },
  },
};

export const member = {
  id: 'member-001',
  attributes: {
    firstName: 'Fixture',
    lastName: 'Member',
    memberDisplayStatus: 'Current Member',
    componentRolesArr: [{ title: 'Engineer', isDisplayRole: true }],
    avatar: { data: null },
  },
};

export const currentProject = {
  ...project,
  id: 'project-002',
  attributes: {
    ...project.attributes,
    title: 'Current Community Tool',
    path: 'current-community-tool',
    startDate: '2026-01-15',
    isCurrentProject: true,
    nonprofit: { data: { id: 'npo-2', attributes: { name: 'Current Partner' } } },
    members: { data: [member] },
  },
};

export const publishedSiteSettings = {
  mode: 'published',
  verifiedAt: '2026-07-20T12:00:00.000Z',
  payload: {
    navbar: {
      links: [
        { label: 'Chapter Info', href: '/aboutus' },
        { label: 'Projects', href: '/ourwork' },
        { label: 'Contact Us', href: '/contactus' },
        {
          label: 'Apply',
          href: '/apply/student',
          dropdown: [
            { label: 'For Students', href: '/apply/student' },
            { label: 'For Nonprofits', href: '/apply/nonprofit' },
          ],
        },
      ],
    },
    footer: {
      newsletterPrompt: 'Read our verified monthly chapter notes.',
      newsletterUrl: 'https://example.org/newsletter',
      exploreLinks: [
        { label: 'Chapter Info', href: '/aboutus' },
        { label: 'Contact Us', href: '/contactus' },
        { label: 'TerpLink', href: 'https://terplink.umd.edu/organization/hack4impact' },
      ],
      applyLinks: [{ label: 'For Students', href: '/apply/student' }],
      socialLinks: [
        { label: 'GitHub', href: 'https://github.com/Hack4Impact-UMD', icon: 'Github' },
      ],
      contact: {
        addressLines: ['College Park, Maryland'],
        email: 'chapter@example.org',
      },
    },
    branding: { logo: '/assets/fixture-logo.svg' },
  },
};

export const collectionEnvelope = (data: unknown[]) => ({
  data,
  meta: { pagination: { page: 1, pageSize: 200, pageCount: 1, total: data.length } },
});

interface FixtureOptions {
  siteSettings?: unknown;
  ourWork?: unknown;
  projects?: unknown[];
}

export const installFixtures = async (page: Page, options: FixtureOptions = {}) => {
  const contentDocuments: Record<string, unknown> = {
    home: null,
    about: { mode: 'placeholder' },
    'our-work': options.ourWork ?? { mode: 'placeholder' },
    'site-settings': options.siteSettings ?? { mode: 'placeholder' },
  };

  await page.route(/\/api\/content\/(home|about|our-work|site-settings)(?:\?|$)/, (route) => {
    const key = route.request().url().match(/\/content\/(home|about|our-work|site-settings)/)?.[1] ?? 'home';
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: contentDocuments[key],
        meta: {
          collection: `content_${key.replace('-', '_')}`,
          documentId: 'main',
        },
      }),
    });
  });
  await page.route(/\/api\/content\/apply\/(student|nonprofit)$/, (route) => {
    const key = route.request().url().endsWith('/student') ? 'student' : 'nonprofit';
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: { mode: 'placeholder' },
        meta: { collection: `content_apply_${key}`, documentId: 'main' },
      }),
    });
  });
  await page.route(/\/api\/projects(?:\?|$)/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(collectionEnvelope(options.projects ?? [project, currentProject])),
    }),
  );
  await page.route(/\/api\/members(?:\?|$)/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(collectionEnvelope([member])) }),
  );
  await page.route(/\/assets\/fixture-logo\.svg$/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="203" height="27"><rect width="203" height="27" fill="#0069CA"/></svg>',
    }),
  );
};
