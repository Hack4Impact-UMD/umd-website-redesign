import { expect, test } from '@playwright/test';
import { collectionEnvelope, installFixtures, project, publishedSiteSettings } from './fixtures';

for (const [path, heading] of [
  ['/', /Hack4Impact-UMD/i],
  ['/aboutus', /About Us/i],
  ['/ourwork', /Past Project Library/i],
  ['/ourwork/fixture-project', /Fixture Project/i],
  ['/apply', /^Students$/i],
  ['/apply/student', /^Students$/i],
  ['/apply/nonprofit', /^Nonprofits$/i],
] as const) {
  test(`${path} renders with deterministic API fixtures`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await installFixtures(page);
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('home preserves its Figma section order without fabricated live capabilities', async ({ page }) => {
  await installFixtures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Hack4Impact-UMD' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Our Impact' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Explore Our Nonprofit Partners' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Testimonials from Our Nonprofit Partners' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Participate in Student-Led Community Events' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Check Out Our Recent Newsletter' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Our Sponsors' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Come Make an Impact With Us!' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Apply Now' })).toHaveAttribute('href', '/apply/student');
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('section[aria-labelledby="newsletter-heading"] img')).toHaveCount(0);
  await expect(page.getByText(/signup is not currently available/i)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('about highlights stay within a mobile viewport', async ({ page }) => {
  await installFixtures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/aboutus');

  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('mobile navigation and Apply submenu are keyboard-readable and route correctly', async ({ page }) => {
  await installFixtures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Open Apply submenu' }).click();
  const nonprofitLink = page.locator('#mobile-navigation').getByRole('link', { name: 'For Nonprofits' });
  await expect(nonprofitLink).toBeVisible();
  await nonprofitLink.click();
  await expect(page).toHaveURL(/\/apply\/nonprofit$/);
  await expect(page.getByRole('heading', { name: 'Nonprofits' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('desktop Apply dropdown supports focus and Escape', async ({ page }) => {
  await installFixtures(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const applyLink = page.getByRole('link', { name: 'Apply' }).first();
  await applyLink.focus();
  await expect(applyLink).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'For Students' }).first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(applyLink).toHaveAttribute('aria-expanded', 'false');
});

test('published site settings update shared chrome while legacy and loading states keep defaults', async ({ page }) => {
  await installFixtures(page, { siteSettings: publishedSiteSettings });
  await page.goto('/missing-direct-link');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to Home' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('link', { name: 'Chapter Info' }).first()).toHaveAttribute('href', '/aboutus');
  await expect(page.getByText('Read our verified monthly chapter notes.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read our newsletter' })).toHaveAttribute(
    'href',
    'https://example.org/newsletter',
  );
  await expect(page.locator('form')).toHaveCount(0);
});

test('site chrome renders defaults before a delayed legacy settings response and keeps them afterward', async ({ page }) => {
  await installFixtures(page);
  let releaseResponse = () => {};
  const responseGate = new Promise<void>((resolve) => { releaseResponse = resolve; });
  await page.route(/\/api\/content\/site-settings(?:\?|$)/, async (route) => {
    await responseGate;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: { navbar: { links: [{ label: 'Legacy', href: '/legacy' }] } },
        meta: { collection: 'content_site_settings', documentId: 'main' },
      }),
    });
  });

  const response = page.waitForResponse(/\/api\/content\/site-settings(?:\?|$)/);
  await page.goto('/missing');
  await expect(page.getByRole('link', { name: 'About Us' }).first()).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  releaseResponse();
  await response;
  await expect(page.getByRole('link', { name: 'About Us' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Legacy' })).toHaveCount(0);
});

test('project library exposes a real retry path after an API failure', async ({ page }) => {
  await installFixtures(page);
  let requests = 0;
  let serveSuccess = false;
  await page.route(/\/api\/projects(?:\?|$)/, (route) => {
    requests += 1;
    if (!serveSuccess) {
      return route.fulfill({ status: 503, contentType: 'text/plain', body: 'temporarily unavailable' });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(collectionEnvelope([project])),
    });
  });

  await page.goto('/ourwork');
  await expect(page.getByRole('alert')).toContainText(/unavailable/i);
  const failedRequests = requests;
  serveSuccess = true;
  await page.getByRole('button', { name: /try again/i }).click();
  await expect(page.getByRole('heading', { name: '2025 Projects' })).toBeVisible();
  expect(failedRequests).toBeGreaterThanOrEqual(2);
  expect(requests).toBeGreaterThan(failedRequests);
});
