import { defineConfig, devices } from '@playwright/test';

const MOCK_API_PORT = 4319;
const PREVIEW_PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://127.0.0.1:${PREVIEW_PORT}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    // Content is fetched by Node at build time, so the fixtures have to be
    // served over HTTP before the build rather than intercepted in the browser.
    {
      command: 'node e2e/mock-api/server.mjs',
      url: `http://127.0.0.1:${MOCK_API_PORT}/health`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    // preview, not dev: the 404 page, the absent SPA fallback and the emitted
    // <head> are most of what this suite now needs to exercise.
    {
      command: 'npm run build && npm run preview',
      url: `http://127.0.0.1:${PREVIEW_PORT}`,
      reuseExistingServer: false,
      timeout: 180_000,
      env: { API_BASE_URL: `http://127.0.0.1:${MOCK_API_PORT}` },
    },
  ],
});
