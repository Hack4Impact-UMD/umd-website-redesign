export const SITE_NAME = 'Hack4Impact-UMD';

export const SITE_DOMAIN = 'umd.hack4impact.org';

export const DEFAULT_DESCRIPTION =
  'Hack4Impact-UMD is a student organization at the University of Maryland, College Park building nonprofit software as a tool for social good.';

export interface PageMeta {
  title: string;
  description?: string;
}

/**
 * Titles and descriptions for the routes that do not get them from the CMS.
 * Keyed by canonical path. The pages render from this map and the build-time
 * OG image generator reads the same entries, so a card cannot describe a page
 * differently from the page's own `<title>`.
 */
export const STATIC_PAGE_META = {
  '/': { title: SITE_NAME },
  '/aboutus': {
    title: 'About Us',
    description:
      'Meet the students behind Hack4Impact-UMD and the nonprofits we build software for.',
  },
  '/contactus': {
    title: 'Contact Us',
    description: 'Get in touch with Hack4Impact-UMD at the University of Maryland, College Park.',
  },
  '/ourwork': {
    title: 'Our Work',
    description: 'Explore the software Hack4Impact-UMD has built with nonprofit partners.',
  },
  '/apply/student': {
    title: 'Apply as a Student',
    description:
      'Join Hack4Impact-UMD as a student engineer, designer, product manager or tech lead.',
  },
  '/apply/nonprofit': {
    title: 'Apply as a Nonprofit',
    description: 'Partner with Hack4Impact-UMD to build free software for your nonprofit.',
  },
} as const satisfies Record<string, PageMeta>;

export type StaticPagePath = keyof typeof STATIC_PAGE_META;

/** The card served for routes with no card of their own, e.g. /404. */
export const DEFAULT_OG_IMAGE_PATH = '/og/default.png';

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

const trimTrailingSlash = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

/**
 * CMS project slugs are free text and in practice contain spaces and mixed
 * case ("CaDCActionable Water Savings"), neither of which belongs in a file
 * name that ends up in an `og:image` URL.
 */
export const projectOgSlug = (projectPath: string) =>
  projectPath
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Where a static page's card lives: '/aboutus' -> '/og/aboutus.png'. */
const staticOgSlug = (pathname: StaticPagePath) =>
  pathname === '/' ? 'home' : pathname.slice(1).replace(/\//g, '-');

export const staticPageOgImagePath = (pathname: StaticPagePath) =>
  `/og/${staticOgSlug(pathname)}.png`;

export const projectOgImagePath = (projectPath: string) =>
  `/og/ourwork/${projectOgSlug(projectPath)}.png`;

/**
 * Maps a route to the card generated for it. Routes without one — /404, and
 * anything added later that forgets to register here — fall back to the
 * site-level card rather than emitting a link to a file that does not exist.
 */
export const ogImagePath = (pathname: string): string => {
  const normalized = trimTrailingSlash(pathname);

  if (normalized in STATIC_PAGE_META) {
    return staticPageOgImagePath(normalized as StaticPagePath);
  }

  const project = normalized.match(/^\/ourwork\/(.+)$/);
  if (project) {
    const slug = projectOgSlug(decodeURIComponent(project[1]));
    if (slug) return `/og/ourwork/${slug}.png`;
  }

  return DEFAULT_OG_IMAGE_PATH;
};
