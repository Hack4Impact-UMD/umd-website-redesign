import { expect, test } from '@playwright/test';
import { installFixtures } from './fixtures';

for (const [path, heading] of [
  ['/', /Building software for social good/i],
  ['/aboutus', /About us/i],
  ['/ourwork', /Project Library/i],
  ['/ourwork/fixture-project', /Fixture Project/i],
  ['/apply', /^Apply as a Student$/i],
  ['/apply/student', /^Apply as a Student$/i],
  ['/apply/nonprofit', /^Nonprofits$/i],
  ['/contactus', /^Contact us$/i],
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

  await expect(page.getByRole('heading', { name: 'Building software for social good' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Our impact' })).toBeVisible();
  await expect(page.getByText('10+')).toBeVisible();
  await expect(page.getByText('12', { exact: true })).toBeVisible();
  await expect(page.getByText('150+')).toBeVisible();
  await expect(page.getByText('400+')).toBeVisible();
  await expect(page.getByText('$150K')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Featured projects' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Where our partners are' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Student-led community events' })).toBeVisible();
  // Placeholder-only sections stay hidden until they have real content.
  await expect(page.getByText(/gathering stories from our nonprofit partners/i)).toHaveCount(0);
  await expect(page.getByText(/preparing a public archive/i)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Our sponsors' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Build with us this semester' })).toBeVisible();
  // The hero and the closing CTA share the same pair of actions.
  const studentLinks = page.getByRole('link', { name: 'Join as a student', exact: true });
  await expect(studentLinks).toHaveCount(2);
  for (const link of await studentLinks.all()) {
    await expect(link).toHaveAttribute('href', '/apply/student');
  }
  await expect(page.locator('form')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('about page stays within a mobile viewport', async ({ page }) => {
  await installFixtures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/aboutus');

  await expect(page.getByRole('heading', { name: 'About us' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('about page switches the team gallery between current members and alumni', async ({ page }) => {
  await installFixtures(page);
  await page.goto('/aboutus');

  const current = page.getByRole('tab', { name: 'Current members' });
  const alumni = page.getByRole('tab', { name: 'Alumni' });
  await expect(current).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Fixture Member' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fixture Alumnus' })).toBeHidden();

  await alumni.click();
  await expect(alumni).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Fixture Alumnus' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fixture Member' })).toBeHidden();
  await expect(page.getByRole('link', { name: 'Let us know' })).toHaveAttribute('href', '/contactus');

  await alumni.press('ArrowLeft');
  await expect(current).toBeFocused();
  await expect(current).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Fixture Member' })).toBeVisible();
});

test('contact page keeps every real contact path in its mobile redesign', async ({ page }) => {
  await installFixtures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contactus');

  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { name: 'Contact us', level: 1 })).toBeVisible();
  await expect(main.getByRole('img', { name: /student team gathered after a project presentation/i })).toBeVisible();
  await expect(main.getByRole('link', { name: 'umd@hack4impact.org' })).toHaveAttribute(
    'href',
    'mailto:umd@hack4impact.org',
  );
  await expect(main.getByText('7809 Regents Drive')).toBeVisible();
  await expect(main.getByRole('list', { name: 'Chapter links' }).getByRole('link')).toHaveCount(5);
  await expect(main.locator('form')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('footer contact details stay within the tablet viewport', async ({ page }) => {
  await installFixtures(page);
  await page.setViewportSize({ width: 780, height: 900 });
  await page.goto('/');

  await expect(page.getByRole('contentinfo')).toBeVisible();
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

test('published site settings drive the shared chrome, and unknown routes really 404', async ({ page }) => {
  await installFixtures(page);
  // No SPA fallback any more: this is Astro's 404.html, served with a real 404.
  const response = await page.goto('/missing-direct-link');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('link', { name: 'Chapter Info' }).first()).toHaveAttribute('href', '/aboutus');
  await expect(page.getByRole('link', { name: 'Contact Us' }).first()).toHaveAttribute('href', '/contactus');
  await expect(page.getByRole('link', { name: 'TerpLink' })).toHaveAttribute(
    'href',
    'https://terplink.umd.edu/organization/hack4impact',
  );
  await expect(page.getByText('Read our monthly chapter notes.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read our newsletter' })).toHaveAttribute(
    'href',
    'https://example.org/newsletter',
  );
  await expect(page.locator('form')).toHaveCount(0);
});

test('project library restores current projects and searchable project discovery', async ({ page }) => {
  await installFixtures(page);
  await page.goto('/ourwork');

  await expect(page.getByRole('heading', { name: 'Current projects' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Current Community Tool' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '2025', exact: true })).toBeVisible();

  await page.getByRole('searchbox', { name: 'Search all projects' }).fill('Fixture Member');
  await expect(page.getByRole('heading', { name: 'Current Community Tool' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fixture Project' })).toHaveCount(0);
});

test('published Our Work content replaces the local header fallback', async ({ page }) => {
  await installFixtures(page);

  await page.goto('/ourwork');
  await expect(page.getByRole('heading', { name: 'Project Library' })).toBeVisible();
  await expect(page.getByText('Fixture-managed copy')).toBeVisible();
  await expect(page.getByAltText('Fixture archive artwork')).toBeVisible();
});

test('a project with a screenshot shows it in the hero', async ({ page }) => {
  await installFixtures(page);
  await page.goto('/ourwork/fixture-project');
  await expect(page.getByRole('heading', { name: 'Fixture Project', level: 1 })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Fixture dashboard' })).toHaveAttribute(
    'src',
    '/api/media/projects/fixture-project/screenshot.png',
  );
});
