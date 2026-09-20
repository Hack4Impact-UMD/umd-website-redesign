import { describe, expect, it } from 'vitest';
import {
  DEFAULT_OG_IMAGE_PATH,
  STATIC_PAGE_META,
  ogImagePath,
  projectOgImagePath,
  projectOgSlug,
  staticPageOgImagePath,
} from './pageMeta';

describe('OG image paths', () => {
  it('names a card per static route, with the home page at /og/home.png', () => {
    expect(staticPageOgImagePath('/')).toBe('/og/home.png');
    expect(staticPageOgImagePath('/aboutus')).toBe('/og/aboutus.png');
    expect(staticPageOgImagePath('/apply/student')).toBe('/og/apply-student.png');
  });

  it('flattens CMS project slugs into file-safe names', () => {
    expect(projectOgSlug('camp-starfish')).toBe('camp-starfish');
    expect(projectOgSlug('CaDCActionable Water Savings')).toBe('cadcactionable-water-savings');
    expect(projectOgSlug('  Trailing & Leading  ')).toBe('trailing-leading');
    expect(projectOgImagePath('Camp Starfish')).toBe('/og/ourwork/camp-starfish.png');
  });

  it('resolves every route the site builds to the card generated for it', () => {
    for (const pathname of Object.keys(STATIC_PAGE_META)) {
      expect(ogImagePath(pathname)).toBe(
        staticPageOgImagePath(pathname as keyof typeof STATIC_PAGE_META),
      );
    }

    // Astro serves these routes with a trailing slash.
    expect(ogImagePath('/aboutus/')).toBe('/og/aboutus.png');
    expect(ogImagePath('/')).toBe('/og/home.png');

    // Project pages are matched by prefix and share the endpoint's slug rule,
    // including the percent-encoding a space in a CMS slug produces.
    expect(ogImagePath('/ourwork/camp-starfish')).toBe('/og/ourwork/camp-starfish.png');
    expect(ogImagePath('/ourwork/CaDCActionable%20Water%20Savings')).toBe(
      projectOgImagePath('CaDCActionable Water Savings'),
    );
  });

  it('falls back to the site card for routes with no card of their own', () => {
    expect(ogImagePath('/404')).toBe(DEFAULT_OG_IMAGE_PATH);
    expect(ogImagePath('/something-added-later')).toBe(DEFAULT_OG_IMAGE_PATH);
    // A project slug that is entirely punctuation has no file name to point at.
    expect(ogImagePath('/ourwork/---')).toBe(DEFAULT_OG_IMAGE_PATH);
  });
});
