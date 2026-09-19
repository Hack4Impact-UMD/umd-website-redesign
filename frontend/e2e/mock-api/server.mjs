/**
 * Build-time content API for the e2e suite.
 *
 * Serves the same shapes as the deployed Cloud Function, so `astro build` can
 * run against deterministic data with no live Firebase. Replaces the
 * page.route() interception that stopped applying once content moved to build
 * time.
 *
 * Fixtures are a *published* site-settings and our-work document: under static
 * prerendering one build produces one dataset, so per-test fixture variation
 * is not possible. Placeholder/legacy/hidden resolution is covered directly in
 * src/content-schema/contracts.test.ts.
 */
import { createServer } from 'node:http';

import {
  collectionEnvelope,
  currentProject,
  member,
  project,
  publishedSiteSettings,
} from '../fixture-data.mjs';

const PORT = Number(process.env.MOCK_API_PORT ?? 4319);

const publishedOurWork = {
  mode: 'published',
  verifiedAt: '2026-07-20T12:00:00.000Z',
  payload: {
    header: {
      title: 'Project Library',
      subtitle: 'Fixture-managed copy',
      image: '/api/media/content/our-work/header.webp',
      imageAlt: 'Fixture archive artwork',
    },
  },
};

// `null` and `{ mode: 'placeholder' }` both resolve to the checked-in local
// defaults, which is what the home-page section assertions expect.
const contentDocuments = {
  home: null,
  about: { mode: 'placeholder' },
  'our-work': publishedOurWork,
  'site-settings': publishedSiteSettings,
  'apply/student': { mode: 'placeholder' },
  'apply/nonprofit': { mode: 'placeholder' },
};

const json = (res, body) => {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
};

const server = createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const route = pathname.replace(/^\/api/, '').replace(/^\//, '');

  if (route === 'health') return json(res, { status: 'ok', service: 'e2e-mock-api' });
  if (route === 'projects') return json(res, collectionEnvelope([project, currentProject]));
  if (route === 'members') return json(res, collectionEnvelope([member]));

  if (route.startsWith('content/')) {
    const key = route.slice('content/'.length);
    if (key in contentDocuments) {
      return json(res, {
        data: contentDocuments[key],
        meta: { collection: `content_${key.replace(/[-/]/g, '_')}`, documentId: 'main' },
      });
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: { code: 'route/not-found', message: 'Route not found' } }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[e2e mock api] listening on http://127.0.0.1:${PORT}`);
});
