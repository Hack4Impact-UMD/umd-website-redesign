// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(__dirname, '../../..');
const read = (path: string) => readFileSync(resolve(repoRoot, path), 'utf8');
const exists = (path: string) => existsSync(resolve(repoRoot, path));

const parseRedirects = (config: string) =>
  config
    .split('[[redirects]]')
    .slice(1)
    .map((block) =>
      Object.fromEntries(
        [...block.matchAll(/^\s*([a-z]+)\s*=\s*(?:"([^"]*)"|(\d+)|(true|false))\s*$/gm)].map(
          ([, key, stringValue, numberValue, booleanValue]) => [
            key,
            stringValue ?? (numberValue ? Number(numberValue) : booleanValue === 'true'),
          ],
        ),
      ),
    );

describe('static deployment routing', () => {
  it('keeps the API proxy and no longer ships an SPA fallback', () => {
    const config = read('netlify.toml');

    // The media proxy has to survive: Storage rules deny public reads, so
    // browser image requests still go through the Function.
    expect(parseRedirects(config)).toEqual([
      {
        from: '/api/*',
        to: 'https://us-central1-umd-website-f3e79.cloudfunctions.net/api/:splat',
        status: 200,
        force: true,
      },
    ]);
    // A catch-all to /index.html would shadow every prerendered route and the
    // 404 page, and would return 200 for URLs that do not exist.
    expect(config).not.toContain('/index.html');
    expect(config).toContain('base = "frontend"');
    expect(config).toContain('publish = "dist"');
    expect(exists('frontend/public/_redirects')).toBe(false);
  });

  it('has no hand-written index.html that would clobber the generated one', () => {
    // Astro writes dist/index.html. Anything in public/ is copied over the top
    // of it, so a stray index.html silently replaces the home page.
    expect(exists('frontend/public/index.html')).toBe(false);
    expect(exists('frontend/index.html')).toBe(false);
  });

  it('prerenders the whole site with a canonical origin and no SSR adapter', async () => {
    const { default: config } = (await import('../../astro.config.mjs')) as {
      default: { output?: string; site?: string; adapter?: unknown; integrations?: unknown[] };
    };

    // This is the contract the rest of the migration depends on: no adapter
    // means no server at request time, and no per-request API calls.
    expect(config.output).toBe('static');
    expect(config.adapter).toBeUndefined();
    expect(config.site).toBe('https://umd.hack4impact.org');
    expect(config.integrations?.length).toBeGreaterThan(0);
  });

  it('keeps generated Astro types out of git', () => {
    // astro check writes .astro/types.d.ts, and CI fails the build if
    // `git status --porcelain` is non-empty afterwards.
    expect(read('frontend/.gitignore')).toMatch(/^\.astro\/?$/m);
  });

  it('keeps Firebase Hosting as a static mirror with the API rewrite only', () => {
    const config = JSON.parse(read('backend-firebase/firebase.json')) as {
      hosting: Array<{
        target: string;
        public: string;
        cleanUrls?: boolean;
        trailingSlash?: boolean;
        rewrites: Array<Record<string, unknown>>;
      }>;
    };

    expect(config.hosting.map(({ target }) => target)).toEqual(['cms', 'public']);
    const publicHosting = config.hosting[1];
    expect(publicHosting.public).toBe('../frontend/dist');
    expect(publicHosting.rewrites).toHaveLength(1);
    expect(publicHosting.rewrites[0]).toMatchObject({
      source: '/api/**',
      function: { functionId: 'api', region: 'us-central1' },
    });
    expect(publicHosting.cleanUrls).toBe(true);
    expect(publicHosting.trailingSlash).toBe(false);

    // This target stays unmapped; Netlify remains the public host.
    const firebaseRc = JSON.parse(read('backend-firebase/.firebaserc')) as {
      targets?: Record<string, { hosting?: Record<string, string[]> }>;
    };
    expect(firebaseRc.targets?.['umd-website-f3e79']?.hosting?.public).toBeUndefined();
  });
});
