import type { Page } from '@playwright/test';

export * from './fixture-data.mjs';

/**
 * Runtime-only stubs.
 *
 * Content, projects and members are baked into the HTML at build time by the
 * mock API server, so nothing here intercepts them. What remains is the media
 * the browser still requests at runtime, which would otherwise 404 and trip the
 * zero-console-error assertion in the smoke suite.
 */
export const installFixtures = async (page: Page) => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="203" height="27">' +
    '<rect width="203" height="27" fill="#0069CA"/></svg>';

  await page.route(/\/assets\/fixture-logo\.svg$/, (route) =>
    route.fulfill({ status: 200, contentType: 'image/svg+xml', body: svg }),
  );
  await page.route(/\/api\/media\/.*/, (route) =>
    route.fulfill({ status: 200, contentType: 'image/svg+xml', body: svg }),
  );
};
