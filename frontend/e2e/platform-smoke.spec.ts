import { expect, test, type Page } from '@playwright/test';

const project = {
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

const member = {
  id: 'member-001',
  attributes: {
    firstName: 'Fixture',
    lastName: 'Member',
    memberDisplayStatus: 'Current Member',
    componentRolesArr: [{ title: 'Engineer', isDisplayRole: true }],
    avatar: { data: null },
  },
};

const envelope = (data: unknown[]) => ({
  data,
  meta: { pagination: { page: 1, pageSize: 200, pageCount: 1, total: data.length } },
});

const installFixtures = async (page: Page) => {
  await page.route(/\/api\/content\//, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: null,
        meta: { collection: 'content_fixture', documentId: 'main' },
      }),
    }),
  );
  await page.route(/\/api\/projects(?:\?|$)/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(envelope([project])) }),
  );
  await page.route(/\/api\/members(?:\?|$)/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(envelope([member])) }),
  );
};

for (const [path, heading] of [
  ['/', /Hack4Impact-UMD/i],
  ['/aboutus', /About Us/i],
  ['/ourwork', /Past Project Library/i],
  ['/ourwork/fixture-project', /Fixture Project/i],
  ['/apply/student', /Apply as a Student/i],
  ['/apply/nonprofit', /Apply as a Nonprofit/i],
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
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('home preserves its Figma section order without fabricated live capabilities', async ({ page }) => {
  await installFixtures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Hack4Impact-UMD' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Explore Our Nonprofit Partners' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Testimonials from Our Nonprofit Partners' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Check Out Our Recent Newsletter' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Past supporters' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Come Make an Impact With Us!' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Apply Now' })).toHaveAttribute('href', '/apply/student');
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('section[aria-labelledby="newsletter-heading"] img')).toHaveCount(0);
  await expect(page.getByText(/signup is not currently available/i)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('project library exposes a real retry path after an API failure', async ({ page }) => {
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
      body: JSON.stringify(envelope([project])),
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
