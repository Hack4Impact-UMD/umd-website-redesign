/**
 * Writes the legacy content envelope migration to Firestore.
 *
 * `plan-content-migration.mjs` is a file-based dry run that only prints; this
 * is the counterpart that actually writes, because nothing in the repository
 * did. It is deliberately a separate script with its own `--commit` flag:
 * "applying that plan to production requires separate explicit authorization"
 * (backend-firebase/README.md), so the default run changes nothing.
 *
 * It differs from the planner in one respect, on purpose. The planner also
 * runs `scrubApplicationCampaign`, which empties `testimonials`, disables the
 * nonprofit banner, and strips the legacy CTA hrefs -- it was written to close
 * out an application cycle, not to preserve one. This script only restructures:
 * every payload key survives untouched, and the single field it adds is the
 * `applicationStatus` the apply pages require.
 *
 * Usage:
 *   node apply-content-migration.mjs                 # dry run, prints the plan
 *   node apply-content-migration.mjs --commit        # writes to Firestore
 *
 * Credentials come from the Admin SDK, which bypasses firestore.rules. Use
 * GOOGLE_APPLICATION_CREDENTIALS, or `gcloud auth application-default login`
 * with GOOGLE_CLOUD_PROJECT=umd-website-f3e79.
 */
import { createRequire } from 'node:module';

import { inspectContentEnvelope } from './content-contract.mjs';

/**
 * Loaded on demand rather than at import time: firebase-admin lives in
 * functions/node_modules and needs credentials, neither of which a caller that
 * only wants `planWrite` should have to provide.
 */
const loadAdmin = () => {
  const require = createRequire(new URL('../functions/package.json', import.meta.url));
  return {
    ...require('firebase-admin/app'),
    getFirestore: require('firebase-admin/firestore').getFirestore,
  };
};

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT ?? 'umd-website-f3e79';

const SECTIONS = new Map([
  ['home', 'content_home'],
  ['about', 'content_about'],
  ['our-work', 'content_our_work'],
  ['apply/student', 'content_apply_student'],
  ['apply/nonprofit', 'content_apply_nonprofit'],
  ['site-settings', 'content_site_settings'],
]);

const FALLBACK_APPLICATION_URL = {
  'apply/student': 'https://apply.umd.hack4impact.org/login',
  'apply/nonprofit':
    'https://docs.google.com/forms/d/e/1FAIpQLSfaeqcwOGt3QR0h4Lmo-fwW4mA108jpeb0p06upiivwxpDArw/viewform?usp=sf_link',
};

const CLOSED_LABEL =
  'Applications are currently closed. Check back for the next application cycle.';

const isRecord = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const safeHttpsUrl = (value) => {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
};

/**
 * The live documents carry the application URL in `intro.ctaHref` and
 * `cta.primaryHref`, which exist in neither the frontend schema nor the
 * FireCMS collection -- the URL moved to `applicationStatus.applicationUrl`.
 * Reading them here keeps the editor's real link rather than assuming the
 * hardcoded default.
 *
 * The state is always `closed`. Whether a cycle is open is an editorial
 * decision that belongs to whoever is publishing, so it is made in FireCMS
 * against a visible form, not inferred here from stale content.
 */
const buildApplicationStatus = (section, payload) => {
  const applicationUrl =
    safeHttpsUrl(payload?.intro?.ctaHref) ??
    safeHttpsUrl(payload?.cta?.primaryHref) ??
    FALLBACK_APPLICATION_URL[section];

  return { state: 'closed', label: CLOSED_LABEL, applicationUrl };
};

export const planWrite = (section, document) => {
  if (!isRecord(document)) {
    return { action: 'skip', reason: 'document is missing or not an object' };
  }

  const envelope = inspectContentEnvelope(document);
  if (envelope.issue !== 'legacy-document') {
    return { action: 'skip', reason: `already an envelope (${envelope.mode ?? envelope.issue})` };
  }

  const payload = { ...document };
  const added = [];

  if (section.startsWith('apply/') && !payload.applicationStatus) {
    payload.applicationStatus = buildApplicationStatus(section, payload);
    added.push('applicationStatus');
  }

  return {
    action: 'wrap',
    added,
    document: { mode: 'placeholder', verifiedAt: null, payload },
  };
};

const main = async () => {
  const commit = process.argv.includes('--commit');
  const { initializeApp, applicationDefault, getFirestore } = loadAdmin();

  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
  const db = getFirestore();

  console.log(`project: ${PROJECT_ID}`);
  console.log(commit ? 'mode:    COMMIT (writes to Firestore)\n' : 'mode:    dry run (no writes)\n');

  const writes = [];

  for (const [section, collection] of SECTIONS) {
    const ref = db.collection(collection).doc('main');
    const snapshot = await ref.get();
    const plan = planWrite(section, snapshot.exists ? snapshot.data() : null);

    if (plan.action === 'skip') {
      console.log(`- ${section.padEnd(16)} skip    ${plan.reason}`);
      continue;
    }

    const note = plan.added.length > 0 ? `wrap + add ${plan.added.join(', ')}` : 'wrap';
    console.log(`- ${section.padEnd(16)} ${note}`);
    console.log(`  payload keys: ${Object.keys(plan.document.payload).sort().join(', ')}`);
    writes.push({ ref, section, document: plan.document });
  }

  if (writes.length === 0) {
    console.log('\nNothing to migrate.');
    return;
  }

  if (!commit) {
    console.log(`\n${writes.length} document(s) would be rewritten. Re-run with --commit to apply.`);
    return;
  }

  const batch = db.batch();
  for (const { ref, document } of writes) batch.set(ref, document);
  await batch.commit();

  console.log(`\nWrote ${writes.length} document(s).`);
  console.log('Next: open FireCMS, set the application status, then set mode=published');
  console.log('and a fresh verifiedAt on each document you want live.');
};

const invokedDirectly = process.argv[1]?.endsWith('apply-content-migration.mjs');
if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
