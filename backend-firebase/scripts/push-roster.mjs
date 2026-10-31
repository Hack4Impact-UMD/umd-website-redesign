/**
 * Pushes the members and projects produced by `convert-roster.mjs` to
 * Firestore.
 *
 * The JSON files key records by slug; Firestore keys them by the numeric IDs
 * carried over from Strapi. A record whose name (members) or path (projects)
 * matches a live document updates that document in place, keeping its ID and
 * merging into it; anything else is created under the next free numeric ID.
 *
 * Merging never removes data: live roles are kept (no longer the display
 * role), live relations are kept, and a live avatar is kept unless the JSON
 * carries one that can be served. Google Drive avatars cannot, so they are
 * skipped until headshots are uploaded to Storage.
 *
 * FireCMS keeps `members.projectIds` and `projects.memberIds` in step through
 * save callbacks that do not run for Admin SDK writes, so this script updates
 * the other side of every relation itself. A relation to a record that is
 * neither live nor part of this push is dropped and reported.
 *
 * Any push that selects members also treats members.json as the whole current
 * board: a live board member who is not a board member there is hidden from
 * the board (see the HIDE lines of a dry run).
 *
 * Usage:
 *   node push-roster.mjs --members board                  # dry run, board members only
 *   node push-roster.mjs --members kim-luu,hita-thota     # dry run, chosen members
 *   node push-roster.mjs --members all --projects all     # dry run, everything
 *   node push-roster.mjs --members board --commit         # writes to Firestore
 *   node push-roster.mjs --restore <backup.json>          # dry run of a restore
 *   node push-roster.mjs --restore <backup.json> --commit
 *
 * --members takes `all`, `board`, or comma-separated member IDs from
 * members.json; --projects takes `all` or project IDs from projects.json.
 * --members-file and --projects-file override the default data/ paths.
 *
 * --avatars <dir> takes headshots named `<member-id>.webp` (or .jpg/.png).
 * Each selected member with a file there gets it uploaded to
 * `members/<firestore-id>/avatar-<content-hash>.<ext>`, replacing their avatar;
 * an unchanged file is not uploaded again. Uploads run before any document is
 * written, and old headshots are not deleted.
 *   node push-roster.mjs --members board --avatars ../../data/headshots-board
 *
 * Before committing, every document the push touches is saved to
 * scripts/output-roster-backup/, and the printed --restore command puts them
 * back (deleting any document the push created).
 *
 * Credentials come from the Admin SDK, which bypasses firestore.rules. Use
 * GOOGLE_APPLICATION_CREDENTIALS, or `gcloud auth application-default login`
 * with GOOGLE_CLOUD_PROJECT=umd-website-f3e79.
 */
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const loadAdmin = () => {
  const require = createRequire(new URL('../functions/package.json', import.meta.url));
  return {
    ...require('firebase-admin/app'),
    ...require('firebase-admin/firestore'),
    ...require('firebase-admin/storage'),
  };
};

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT ?? 'umd-website-f3e79';
/** Matches APP_FIREBASE_STORAGE_BUCKET, which the API serves /api/media from. */
const STORAGE_BUCKET = process.env.STORAGE_BUCKET ?? `${PROJECT_ID}.firebasestorage.app`;
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const COLLECTIONS = new Set(['members', 'projects']);
const BOARD_STATUS = 'Current Board Member';
const FORMER_STATUS = 'Former Member or Board Member';

/** Firestore allows 500 writes per batch; stay under it. */
const BATCH_SIZE = 450;

/**
 * Live documents are planned in an encoded, JSON-safe form so the planner is
 * pure and a backup restores Timestamps and references faithfully.
 */
export const encode = (value, { Timestamp, DocumentReference }) => {
  if (value instanceof Timestamp) return { __type__: 'timestamp', value: value.toDate().toISOString() };
  if (value instanceof DocumentReference) return { __type__: 'reference', path: value.path };
  if (Array.isArray(value)) return value.map((entry) => encode(entry, { Timestamp, DocumentReference }));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, encode(entry, { Timestamp, DocumentReference })]),
    );
  }
  return value;
};

const decode = (value, { Timestamp, db }) => {
  if (Array.isArray(value)) return value.map((entry) => decode(entry, { Timestamp, db }));
  if (value && typeof value === 'object') {
    if (value.__type__ === 'timestamp') return Timestamp.fromDate(new Date(value.value));
    if (value.__type__ === 'reference') return db.doc(value.path);
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, decode(entry, { Timestamp, db })]),
    );
  }
  return value;
};

const toTimestamp = (isoDate) => ({
  __type__: 'timestamp',
  value: new Date(`${isoDate}T00:00:00.000Z`).toISOString(),
});

const nameKey = (record) =>
  `${record.firstName ?? ''} ${record.lastName ?? ''}`.toLowerCase().replace(/\s+/g, ' ').trim();

/** Mirrors normalizeRelationIds in functions/src/utils/relations.ts. */
const toRelationId = (value) => {
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (value && typeof value === 'object') {
    if (typeof value.id === 'string' || typeof value.id === 'number') return toRelationId(value.id);
    if (typeof value.path === 'string') return value.path.split('/').filter(Boolean).pop() ?? null;
  }
  return null;
};

const relationIds = (value) => [
  ...new Set((Array.isArray(value) ? value : []).map(toRelationId).filter(Boolean)),
];

const union = (...lists) => [...new Set(lists.flat())];

export const selectIds = (spec, records, kind) => {
  if (!spec) return [];
  if (spec === 'all') return Object.keys(records).sort();
  if (spec === 'board' && kind === 'members') {
    return Object.keys(records)
      .filter((id) => records[id].memberDisplayStatus === BOARD_STATUS)
      .sort();
  }

  const ids = spec.split(',').map((id) => id.trim()).filter(Boolean);
  const unknown = ids.filter((id) => !records[id]);
  if (unknown.length > 0) throw new Error(`Unknown ${kind} in selection: ${unknown.join(', ')}`);
  return [...new Set(ids)].sort();
};

const nextIdAllocator = (liveIds) => {
  let next = Math.max(0, ...liveIds.map(Number).filter(Number.isInteger)) + 1;
  return () => String(next++);
};

const roleKey = (role) =>
  `${String(role.title ?? '').trim().toLowerCase()}|${String(role.team ?? '').trim().toLowerCase()}`;

/**
 * Live roles stay as history and lose display status; a JSON role that
 * matches one (same title and team) takes its display flag instead of being
 * added twice.
 */
const mergeRoles = (liveRoles, jsonRoles) => {
  const pending = new Map(jsonRoles.map((role) => [roleKey(role), role]));
  const kept = (Array.isArray(liveRoles) ? liveRoles : [])
    .filter((role) => role && typeof role.title === 'string')
    .map((role) => {
      const match = pending.get(roleKey(role));
      pending.delete(roleKey(role));
      return { ...role, isDisplayRole: match ? match.isDisplayRole : false };
    });
  return [...kept, ...[...pending.values()].map((role) => ({ ...role }))];
};

const isDriveUrl = (url) => /^https?:\/\/(drive|docs)\.google\.com\//i.test(url ?? '');

/**
 * Plans every write without touching Firestore. Live documents are passed as
 * `[{ id, data }]` with `data` already encoded.
 */
export const planPush = ({
  members,
  projects,
  liveMembers,
  liveProjects,
  selectedMemberIds,
  selectedProjectIds,
  localAvatars = {},
}) => {
  const warnings = [];
  const uploads = [];
  const selectedMembers = new Set(selectedMemberIds);
  const selectedProjects = new Set(selectedProjectIds);

  const liveMemberByName = new Map();
  for (const live of liveMembers) {
    const key = nameKey(live.data);
    liveMemberByName.set(key, liveMemberByName.has(key) ? 'ambiguous' : live);
  }
  const liveProjectByPath = new Map();
  for (const live of liveProjects) {
    const key = String(live.data.path ?? '').trim().toLowerCase();
    if (key) liveProjectByPath.set(key, liveProjectByPath.has(key) ? 'ambiguous' : live);
  }

  // Resolve where every JSON record lives in Firestore, selected or not, so
  // relations can be pointed at the right IDs. Unselected records that are
  // not live resolve to null: there is nothing to link to yet.
  const resolve = (records, selected, findLive, allocate, kind) => {
    const targets = new Map();
    for (const jsonId of Object.keys(records).sort()) {
      const live = findLive(records[jsonId]);
      if (live === 'ambiguous') {
        if (selected.has(jsonId)) throw new Error(`${kind} ${jsonId} matches more than one live document`);
        targets.set(jsonId, null);
      } else if (live) {
        targets.set(jsonId, { id: live.id, live: live.data });
      } else {
        targets.set(jsonId, selected.has(jsonId) ? { id: allocate(), live: null } : null);
      }
    }
    return targets;
  };

  const memberTargets = resolve(
    members,
    selectedMembers,
    (record) => liveMemberByName.get(nameKey(record)),
    nextIdAllocator(liveMembers.map((live) => live.id)),
    'member',
  );
  const projectTargets = resolve(
    projects,
    selectedProjects,
    (record) => liveProjectByPath.get(record.path.trim().toLowerCase()),
    nextIdAllocator(liveProjects.map((live) => live.id)),
    'project',
  );

  const linkTo = (targets, ids, owner, kind) =>
    ids
      .map((jsonId) => {
        const target = targets.get(jsonId);
        if (!target) warnings.push(`${owner}: ${kind} ${jsonId} is not in Firestore or this push; link skipped`);
        return target?.id;
      })
      .filter(Boolean);

  const writes = new Map();
  const putWrite = (collection, id, before, after, label) =>
    writes.set(`${collection}/${id}`, { collection, id, before, after, label });

  for (const jsonId of selectedMemberIds) {
    const json = members[jsonId];
    const { id, live } = memberTargets.get(jsonId);
    const label = `${json.firstName} ${json.lastName}`;

    const doc = live ? structuredClone(live) : {};
    doc.firstName = json.firstName;
    doc.lastName = json.lastName;
    doc.memberDisplayStatus = json.memberDisplayStatus;
    doc.isBootcamp = json.isBootcamp;
    doc.componentRolesArr = mergeRoles(live?.componentRolesArr, json.componentRolesArr);
    doc.projectIds = union(relationIds(live?.projectIds), linkTo(projectTargets, json.projectIds, label, 'project'));
    if (json.pronouns) doc.pronouns = json.pronouns;
    if (json.linkedinUrl) doc.linkedinUrl = json.linkedinUrl;

    const localAvatar = localAvatars[jsonId];
    if (localAvatar) {
      const url = `members/${id}/${localAvatar.fileName}`;
      if (live?.avatar?.url !== url) uploads.push({ file: localAvatar.file, path: url, contentType: localAvatar.mimeType });
      doc.avatar = { url, alt: json.avatar?.alt ?? `Headshot of ${label}`, mimeType: localAvatar.mimeType };
    } else if (json.avatar && isDriveUrl(json.avatar.url)) {
      warnings.push(`${label}: Drive headshot not uploaded yet; ${live?.avatar ? 'live avatar kept' : 'no avatar'}`);
    } else if (json.avatar) {
      doc.avatar = { ...json.avatar };
    }
    if (!('avatar' in doc)) doc.avatar = null;

    putWrite('members', id, live, doc, label);
  }

  for (const jsonId of selectedProjectIds) {
    const json = projects[jsonId];
    const { id, live } = projectTargets.get(jsonId);

    const doc = live ? structuredClone(live) : {};
    doc.title = json.title;
    doc.path = json.path;
    doc.startDate = json.startDate ? toTimestamp(json.startDate) : (live?.startDate ?? null);
    doc.summary = json.summary || live?.summary || '';
    doc.blurb = json.blurb || live?.blurb || '';
    doc.isFeatured = json.isFeatured;
    doc.isCurrentProject = json.isCurrentProject;
    doc.image = json.image.length > 0 ? json.image : (live?.image ?? []);
    doc.memberIds = union(relationIds(live?.memberIds), linkTo(memberTargets, json.memberIds, json.title, 'member'));
    for (const field of ['nonprofitName', 'repoURL', 'hostedProjectURL', 'imageAltText']) {
      if (json[field]) doc[field] = json[field];
    }

    putWrite('projects', id, live, doc, json.title);
  }

  // members.json is the whole current board. A live board member who is not
  // on it is hidden from the board: they take their members.json status if
  // they have one, otherwise they become a former member. Only the status
  // changes, so they stay on the project pages they belong to.
  if (selectedMemberIds.length > 0) {
    const jsonByLiveId = new Map(
      [...memberTargets]
        .filter(([, target]) => target?.live)
        .map(([jsonId, target]) => [target.id, members[jsonId]]),
    );
    for (const live of liveMembers) {
      if (live.data.memberDisplayStatus !== BOARD_STATUS || writes.has(`members/${live.id}`)) continue;
      const json = jsonByLiveId.get(live.id);
      if (json?.memberDisplayStatus === BOARD_STATUS) continue;

      const after = { ...structuredClone(live.data), memberDisplayStatus: json?.memberDisplayStatus ?? FORMER_STATUS };
      writes.set(`members/${live.id}`, {
        collection: 'members',
        id: live.id,
        before: live.data,
        after,
        label: `${live.data.firstName ?? ''} ${live.data.lastName ?? ''}`.trim(),
        reciprocalOnly: true,
        hidden: true,
      });
    }
  }

  // Close every relation from the other side. A target that is being written
  // already has its side; a live target that is not gets the ID added.
  const liveById = {
    members: new Map(liveMembers.map((live) => [live.id, live.data])),
    projects: new Map(liveProjects.map((live) => [live.id, live.data])),
  };
  const addReciprocal = (collection, id, field, linkedId) => {
    const key = `${collection}/${id}`;
    const existing = writes.get(key);
    const live = liveById[collection].get(id);
    if (!existing && !live) return;
    // Leave an unselected document alone when it already links back, even if
    // only through a legacy reference: rewriting it would change nothing.
    if (!existing && relationIds(live[field]).includes(linkedId)) return;

    const write = existing ?? {
      collection,
      id,
      before: live,
      after: structuredClone(live),
      label: collection === 'members' ? nameKey(live) : live.title,
      reciprocalOnly: true,
    };
    write.after[field] = union(relationIds(write.after[field]), [linkedId]);
    writes.set(key, write);
  };

  for (const write of [...writes.values()]) {
    if (write.reciprocalOnly) continue;
    if (write.collection === 'members') {
      for (const projectId of write.after.projectIds) addReciprocal('projects', projectId, 'memberIds', write.id);
    } else {
      for (const memberId of write.after.memberIds) addReciprocal('members', memberId, 'projectIds', write.id);
    }
  }

  const changes = [...writes.values()]
    .map((write) => ({ ...write, fields: changedFields(write.before, write.after) }))
    .filter((write) => write.before === null || write.fields.length > 0);

  return { writes: changes, uploads, warnings };
};

const changedFields = (before, after) =>
  [...new Set([...Object.keys(before ?? {}), ...Object.keys(after)])]
    .filter((key) => JSON.stringify(before?.[key]) !== JSON.stringify(after[key]))
    .sort();

const preview = (value) => {
  const text = value === undefined ? '(unset)' : JSON.stringify(value);
  return text.length > 140 ? `${text.slice(0, 137)}...` : text;
};

const printPlan = ({ writes, uploads, warnings }) => {
  for (const upload of uploads) {
    console.log(`UPLOAD ${path.relative(REPO_ROOT, upload.file)} -> ${upload.path}`);
  }
  for (const write of writes) {
    const action =
      write.before === null ? 'CREATE' : write.hidden ? 'HIDE  ' : write.reciprocalOnly ? 'LINK  ' : 'UPDATE';
    console.log(`${action} ${write.collection}/${write.id}  ${write.label}`);
    for (const field of write.fields) {
      if (write.before === null) {
        console.log(`    ${field}: ${preview(write.after[field])}`);
      } else {
        console.log(`    ${field}: ${preview(write.before[field])}`);
        console.log(`    ${' '.repeat(field.length)}  -> ${preview(write.after[field])}`);
      }
    }
  }
  if (warnings.length > 0) {
    console.log('');
    for (const warning of warnings) console.log(`warning: ${warning}`);
  }
};

const argValue = (flag) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? null : process.argv[index + 1] ?? null;
};

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

const AVATAR_TYPES = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };

/**
 * Reads `<member-id>.<ext>` headshots from a directory. The storage file name
 * carries a content hash, so re-pushing the same image maps to the same path
 * and is skipped rather than uploaded again.
 */
const readLocalAvatars = async (dir, members) => {
  const avatars = {};
  for (const name of (await readdir(dir)).sort()) {
    const ext = path.extname(name).toLowerCase();
    const memberId = path.basename(name, path.extname(name));
    if (!AVATAR_TYPES[ext]) throw new Error(`Unsupported headshot type: ${name}`);
    if (!members[memberId]) throw new Error(`Headshot ${name} does not match a member ID in members.json`);
    if (avatars[memberId]) throw new Error(`More than one headshot for ${memberId}`);

    const file = path.join(dir, name);
    const hash = createHash('sha256').update(await readFile(file)).digest('hex').slice(0, 12);
    avatars[memberId] = { file, fileName: `avatar-${hash}${ext === '.jpeg' ? '.jpg' : ext}`, mimeType: AVATAR_TYPES[ext] };
  }
  return avatars;
};

const commitWrites = async (db, Timestamp, operations) => {
  for (let start = 0; start < operations.length; start += BATCH_SIZE) {
    const batch = db.batch();
    for (const { collection, id, data } of operations.slice(start, start + BATCH_SIZE)) {
      const ref = db.collection(collection).doc(id);
      if (data === null) batch.delete(ref);
      else batch.set(ref, decode(data, { Timestamp, db }));
    }
    await batch.commit();
  }
};

const push = async ({ db, bucket, Timestamp, DocumentReference, commit }) => {
  const membersFile = path.resolve(argValue('--members-file') ?? path.join(REPO_ROOT, 'data/members.json'));
  const projectsFile = path.resolve(argValue('--projects-file') ?? path.join(REPO_ROOT, 'data/projects.json'));
  const [members, projects] = await Promise.all([readJson(membersFile), readJson(projectsFile)]);

  const selectedMemberIds = selectIds(argValue('--members'), members, 'members');
  const selectedProjectIds = selectIds(argValue('--projects'), projects, 'projects');
  if (selectedMemberIds.length === 0 && selectedProjectIds.length === 0) {
    throw new Error('Nothing selected: pass --members and/or --projects (see the usage comment)');
  }
  console.log(`selected: ${selectedMemberIds.length} member(s), ${selectedProjectIds.length} project(s)\n`);

  const readCollection = async (name) =>
    (await db.collection(name).get()).docs.map((doc) => ({
      id: doc.id,
      data: encode(doc.data(), { Timestamp, DocumentReference }),
    }));
  const [liveMembers, liveProjects] = await Promise.all([readCollection('members'), readCollection('projects')]);

  const avatarsDir = argValue('--avatars');
  const localAvatars = avatarsDir ? await readLocalAvatars(path.resolve(avatarsDir), members) : {};

  const plan = planPush({
    members,
    projects,
    liveMembers,
    liveProjects,
    selectedMemberIds,
    selectedProjectIds,
    localAvatars,
  });
  printPlan(plan);

  if (plan.writes.length === 0) {
    console.log('\nNothing to write.');
    return;
  }
  if (!commit) {
    console.log(
      `\n${plan.writes.length} document(s) would be written and ${plan.uploads.length} headshot(s) uploaded. ` +
        'Re-run with --commit to apply.',
    );
    return;
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = fileURLToPath(new URL(`./output-roster-backup/${stamp}.json`, import.meta.url));
  await mkdir(path.dirname(backupFile), { recursive: true });
  const backup = {
    project: PROJECT_ID,
    takenAt: new Date().toISOString(),
    documents: plan.writes.map(({ collection, id, before }) => ({ collection, id, before })),
  };
  await writeFile(backupFile, `${JSON.stringify(backup, null, 2)}\n`);
  console.log(`\nBacked up ${backup.documents.length} document(s) to ${backupFile}`);

  // Upload before writing, so no document ever points at a missing file. Old
  // headshots are left in place, so a restore still finds them.
  for (const upload of plan.uploads) {
    await bucket.upload(upload.file, {
      destination: upload.path,
      contentType: upload.contentType,
      metadata: { cacheControl: 'public, max-age=31536000, immutable' },
    });
  }
  if (plan.uploads.length > 0) console.log(`Uploaded ${plan.uploads.length} headshot(s) to ${bucket.name}.`);

  await commitWrites(
    db,
    Timestamp,
    plan.writes.map(({ collection, id, after }) => ({ collection, id, data: after })),
  );
  console.log(`Wrote ${plan.writes.length} document(s).`);
  console.log(`Undo with: node push-roster.mjs --restore ${backupFile} --commit`);
};

const restore = async ({ db, Timestamp, commit }, file) => {
  const backup = await readJson(file);
  if (backup.project !== PROJECT_ID) {
    throw new Error(`Backup is for ${backup.project}, but this run targets ${PROJECT_ID}`);
  }
  for (const { collection, id, before } of backup.documents) {
    if (!COLLECTIONS.has(collection)) throw new Error(`Refusing to restore unexpected collection: ${collection}`);
    console.log(`${before === null ? 'DELETE ' : 'RESTORE'} ${collection}/${id}`);
  }

  if (!commit) {
    console.log(`\n${backup.documents.length} document(s) would be restored. Re-run with --commit to apply.`);
    return;
  }
  await commitWrites(
    db,
    Timestamp,
    backup.documents.map(({ collection, id, before }) => ({ collection, id, data: before })),
  );
  console.log(`\nRestored ${backup.documents.length} document(s) from ${file}`);
};

const main = async () => {
  const commit = process.argv.includes('--commit');
  const { initializeApp, applicationDefault, getFirestore, getStorage, Timestamp, DocumentReference } = loadAdmin();
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID, storageBucket: STORAGE_BUCKET });
  const db = getFirestore();
  const bucket = getStorage().bucket();

  console.log(`project: ${PROJECT_ID}`);
  console.log(commit ? 'mode:    COMMIT (writes to Firestore)\n' : 'mode:    dry run (no writes)\n');

  const restoreFile = argValue('--restore');
  if (restoreFile) return restore({ db, Timestamp, commit }, path.resolve(restoreFile));
  return push({ db, bucket, Timestamp, DocumentReference, commit });
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
