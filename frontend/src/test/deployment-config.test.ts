// @vitest-environment node
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('deployment routing', () => {
  it('places the Netlify API proxy before the SPA fallback and has one redirect source', () => {
    const config = readFileSync(resolve(__dirname, '../../../netlify.toml'), 'utf8');
    const redirects = config
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
    expect(redirects).toEqual([
      {
        from: '/api/*',
        to: 'https://us-central1-umd-website-f3e79.cloudfunctions.net/api/:splat',
        status: 200,
        force: true,
      },
      { from: '/*', to: '/index.html', status: 200 },
    ]);
    expect(existsSync(resolve(__dirname, '../../public/_redirects'))).toBe(false);
  });

  it('defines separate CMS/public Hosting targets with API rewrite before SPA fallback', () => {
    const config = JSON.parse(
      readFileSync(resolve(__dirname, '../../../backend-firebase/firebase.json'), 'utf8'),
    ) as { hosting: Array<{ target: string; public: string; rewrites: Array<Record<string, unknown>> }> };
    expect(config.hosting.map(({ target }) => target)).toEqual(['cms', 'public']);
    const publicHosting = config.hosting[1];
    expect(publicHosting.public).toBe('../frontend/dist');
    expect(publicHosting.rewrites[0]).toMatchObject({
      source: '/api/**', function: { functionId: 'api', region: 'us-central1' },
    });
    expect(publicHosting.rewrites[1]).toMatchObject({ source: '**', destination: '/index.html' });

    const firebaseRc = JSON.parse(
      readFileSync(resolve(__dirname, '../../../backend-firebase/.firebaserc'), 'utf8'),
    ) as { targets?: Record<string, { hosting?: Record<string, string[]> }> };
    expect(firebaseRc.targets?.['umd-website-f3e79']?.hosting?.public).toBeUndefined();
  });
});
