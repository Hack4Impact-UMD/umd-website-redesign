// Framework-free fixture payloads. Plain .mjs so e2e/mock-api/server.mjs can
// import it under Node 20 without any TypeScript loader.
//
// Under static prerendering the content API is called by Node at build time,
// before Playwright exists, so page.route() can no longer intercept it. These
// payloads are served by e2e/mock-api/server.mjs instead, and the build runs
// against it. Kept separate from fixtures.ts so the mock server can import them
// without pulling in @playwright/test.

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
      newsletterPrompt: 'Read our monthly chapter notes.',
      newsletterUrl: 'https://example.org/newsletter',
      exploreLinks: [
        { label: 'Chapter Info', href: '/aboutus' },
        { label: 'Contact Us', href: '/contactus' },
        { label: 'TerpLink', href: 'https://terplink.umd.edu/organization/hack4impact' },
      ],
      applyLinks: [{ label: 'For Students', href: '/apply/student' }],
      // Four social links plus the one https explore link make the five
      // "Chapter links" the contact page asserts.
      socialLinks: [
        { label: 'Instagram', href: 'https://instagram.com/hack4impactumd', icon: 'Instagram' },
        { label: 'GitHub', href: 'https://github.com/Hack4Impact-UMD', icon: 'Github' },
        { label: 'LinkedIn', href: 'https://linkedin.com/company/hack4impact-umd', icon: 'Linkedin' },
        { label: 'Facebook', href: 'https://facebook.com/hack4impactumd', icon: 'Facebook' },
      ],
      // Real chapter contact details: the published fixture is the single
      // dataset the whole build uses, and the contact page asserts these.
      contact: {
        addressLines: ['7809 Regents Drive', 'College Park, MD 20742'],
        email: 'umd@hack4impact.org',
      },
    },
    branding: { logo: '/assets/fixture-logo.svg' },
  },
};

export const collectionEnvelope = (data) => ({
  data,
  meta: { pagination: { page: 1, pageSize: 200, pageCount: 1, total: data.length } },
});

