import test from 'node:test';
import assert from 'node:assert/strict';

import { inspectContentEnvelope } from './content-contract.mjs';
import {
  planContentDocumentMigration,
  planContentMigration,
} from './plan-content-migration.mjs';

test('legacy content is wrapped as an editable placeholder without claiming verification', () => {
  const source = { header: { title: 'Legacy title' } };
  const result = planContentDocumentMigration('home', source);

  assert.deepEqual(result, {
    action: 'wrap-as-placeholder',
    document: { mode: 'placeholder', verifiedAt: null, payload: source },
  });
  assert.deepEqual(source, { header: { title: 'Legacy title' } });
});

test('existing envelopes are never overwritten by the legacy migration', () => {
  const source = { mode: 'published', verifiedAt: '2026-08-01T12:00:00Z', payload: {} };
  assert.deepEqual(planContentDocumentMigration('about', source), {
    action: 'unchanged',
    document: source,
  });
});

test('malformed modern envelopes are surfaced for review instead of silently accepted', () => {
  const source = { mode: 'published', verifiedAt: null, payload: { header: {} } };
  assert.deepEqual(planContentDocumentMigration('about', source), {
    action: 'needs-review',
    issue: 'missing-verification',
    document: source,
  });
});

test('legacy application campaigns retain the destination but fail closed', () => {
  const result = planContentDocumentMigration('apply/nonprofit', {
    banner: { enabled: true, text: 'Fall 2025 applications are open' },
    intro: { ctaLabel: 'Apply', ctaHref: 'https://stale.example' },
    cta: { primaryLabel: 'Apply', primaryHref: 'https://stale.example' },
    testimonials: [{ name: 'Nonprofit Person' }],
  });
  const payload = result.document.payload;

  assert.equal(payload.applicationStatus.state, 'closed');
  assert.match(payload.applicationStatus.applicationUrl, /^https:\/\/docs\.google\.com\/forms\//);
  assert.deepEqual(payload.banner, { enabled: false, text: '' });
  assert.deepEqual(payload.testimonials, []);
  assert.equal(payload.intro.ctaHref, undefined);
  assert.equal(payload.cta.primaryHref, undefined);
  assert.equal(result.document.verifiedAt, null);
});

test('shared navigation destinations are added idempotently', () => {
  const first = planContentDocumentMigration('site-settings', {
    navbar: { links: [] },
    footer: { exploreLinks: [] },
  });
  const second = planContentDocumentMigration('site-settings', first.document.payload);
  const links = second.document.payload.footer.exploreLinks;

  assert.equal(links.filter(({ href }) => href === '/contactus').length, 1);
  assert.equal(links.filter(({ label }) => label === 'TerpLink').length, 1);
});

test('incomplete exports are surfaced instead of becoming empty placeholders', () => {
  assert.deepEqual(planContentDocumentMigration('home', null), {
    action: 'needs-review',
    issue: 'missing-document',
    document: null,
  });
  assert.throws(() => planContentMigration({ home: {} }), /export is missing/);
});

test('live verification rejects root-level legacy documents', () => {
  assert.deepEqual(inspectContentEnvelope({ header: {} }), {
    valid: false,
    issue: 'legacy-document',
  });
});
