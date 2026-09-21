/**
 * Backs up and restores the six `content_*` documents.
 *
 * `apply-content-migration.mjs` writes with `set()`, which replaces a document
 * rather than merging into it, so the flat legacy keys are gone the moment it
 * commits. This captures them first, straight from Firestore rather than from
 * the public API: the API rewrites media fields through `toPublicMediaUrl`, so
 * a backup taken from it would restore rewritten URLs instead of the stored
 * storage paths.
 *
 * Usage:
 *   node backup-content.mjs                    # back up to a timestamped dir
 *   node backup-content.mjs --out <dir>        # back up to a chosen dir
 *   node backup-content.mjs --restore <dir>    # restore every document in dir
 *
 * Credentials come from the Admin SDK, which bypasses firestore.rules. Use
 * GOOGLE_APPLICATION_CREDENTIALS, or `gcloud auth application-default login`
 * with GOOGLE_CLOUD_PROJECT=umd-website-f3e79.
 */
import { createRequire } from 'node:module';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const loadAdmin = () => {
  const require = createRequire(new URL('../functions/package.json', import.meta.url));
  return {
    ...require('firebase-admin/app'),
    ...require('firebase-admin/firestore'),
  };
};

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT ?? 'umd-website-f3e79';

const COLLECTIONS = [
  'content_home',
  'content_about',
  'content_our_work',
  'content_apply_student',
  'content_apply_nonprofit',
  'content_site_settings',
];

/**
 * Firestore hands back Timestamp instances, which `JSON.stringify` flattens to
 * `{_seconds, _nanoseconds}` -- readable, but no longer a Timestamp on the way
 * back in. Tagging them keeps a restore byte-for-byte faithful, which matters
 * for `verifiedAt` on any document that has already been published.
 */
const encode = (value, Timestamp) => {
  if (value instanceof Timestamp) return { __type__: 'timestamp', value: value.toDate().toISOString() };
  if (Array.isArray(value)) return value.map((entry) => encode(entry, Timestamp));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, encode(v, Timestamp)]));
  }
  return value;
};

const decode = (value, Timestamp) => {
  if (Array.isArray(value)) return value.map((entry) => decode(entry, Timestamp));
  if (value && typeof value === 'object') {
    if (value.__type__ === 'timestamp') return Timestamp.fromDate(new Date(value.value));
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decode(v, Timestamp)]));
  }
  return value;
};

const argValue = (flag) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? null : process.argv[index + 1] ?? null;
};

const backup = async (db, Timestamp, outDir) => {
  await mkdir(outDir, { recursive: true });
  const manifest = { project: PROJECT_ID, takenAt: new Date().toISOString(), documents: [] };

  for (const collection of COLLECTIONS) {
    const snapshot = await db.collection(collection).doc('main').get();
    if (!snapshot.exists) {
      console.log(`- ${collection.padEnd(24)} MISSING (not backed up)`);
      manifest.documents.push({ collection, documentId: 'main', exists: false });
      continue;
    }

    const data = encode(snapshot.data(), Timestamp);
    const file = path.join(outDir, `${collection}.json`);
    await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);

    const keys = Object.keys(data).sort();
    const shape = keys.includes('payload') ? 'envelope' : 'legacy (flat)';
    console.log(`- ${collection.padEnd(24)} ${String(keys.length).padStart(2)} keys  ${shape}`);
    manifest.documents.push({ collection, documentId: 'main', exists: true, keys });
  }

  await writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nBacked up to ${outDir}`);
  console.log(`Restore with: node backup-content.mjs --restore ${outDir}`);
};

const restore = async (db, Timestamp, dir) => {
  const files = (await readdir(dir)).filter(
    (name) => name.endsWith('.json') && name !== 'manifest.json',
  );
  if (files.length === 0) throw new Error(`No document backups found in ${dir}`);

  const batch = db.batch();
  for (const file of files) {
    const collection = path.basename(file, '.json');
    if (!COLLECTIONS.includes(collection)) {
      throw new Error(`Refusing to restore unexpected collection: ${collection}`);
    }
    const data = decode(JSON.parse(await readFile(path.join(dir, file), 'utf8')), Timestamp);
    batch.set(db.collection(collection).doc('main'), data);
    console.log(`- ${collection.padEnd(24)} restored`);
  }
  await batch.commit();
  console.log(`\nRestored ${files.length} document(s) from ${dir}`);
};

const main = async () => {
  const { initializeApp, applicationDefault, getFirestore, Timestamp } = loadAdmin();
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
  const db = getFirestore();

  console.log(`project: ${PROJECT_ID}\n`);

  const restoreDir = argValue('--restore');
  if (restoreDir) return restore(db, Timestamp, path.resolve(restoreDir));

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.resolve(
    argValue('--out') ?? new URL(`./output-content-backup/${stamp}`, import.meta.url).pathname,
  );
  return backup(db, Timestamp, outDir);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
