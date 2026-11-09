import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { createRequire } from 'node:module';

import { planPush, readProjectImages, selectIds } from './push-roster.mjs';

// sharp comes from the frontend, as in push-roster.mjs.
const sharp = createRequire(new URL('../../frontend/package.json', import.meta.url))('sharp');

const member = (overrides) => ({
  firstName: 'Ada',
  lastName: 'Lovelace',
  memberDisplayStatus: 'Current Member',
  isBootcamp: false,
  projectIds: [],
  componentRolesArr: [],
  avatar: null,
  ...overrides,
});

const project = (overrides) => ({
  title: 'Sustainable Saratoga',
  path: 'sustainable-saratoga',
  startDate: '2026-09-01',
  summary: '',
  blurb: '',
  isFeatured: false,
  isCurrentProject: true,
  memberIds: [],
  image: [],
  ...overrides,
});

const plan = (overrides) =>
  planPush({
    members: {},
    projects: {},
    liveMembers: [],
    liveProjects: [],
    selectedMemberIds: [],
    selectedProjectIds: [],
    ...overrides,
  });

test('board and team selections pick records by display status', () => {
  const members = {
    'kim-luu': member({ memberDisplayStatus: 'Current Board Member' }),
    'ada-lovelace': member(),
  };
  assert.deepEqual(selectIds('board', members, 'members'), ['kim-luu']);
  assert.deepEqual(selectIds('team', members, 'members'), ['ada-lovelace']);
  assert.deepEqual(selectIds('all', members, 'members'), ['ada-lovelace', 'kim-luu']);
  assert.deepEqual(selectIds(null, members, 'members'), []);
  assert.throws(() => selectIds('kim-luu,nobody', members, 'members'), /Unknown members.*nobody/);
});

test('a member matching a live name keeps its ID and merges roles as history', () => {
  const live = {
    firstName: 'Kim ',
    lastName: 'Luu',
    pronouns: 'she/her',
    memberDisplayStatus: 'Current Member',
    avatar: { url: 'members/255/avatar.jpg' },
    projectIds: ['26'],
    componentRolesArr: [
      { title: 'Designer', isDisplayRole: true, team: ' SeedMoney' },
      { title: 'Executive Director', isDisplayRole: false, team: null },
    ],
  };
  const { writes } = plan({
    members: {
      'kim-luu': member({
        firstName: 'Kim',
        lastName: 'Luu',
        memberDisplayStatus: 'Current Board Member',
        componentRolesArr: [{ title: 'Executive Director', isDisplayRole: true }],
        avatar: { url: 'https://drive.google.com/open?id=abc', alt: 'Headshot of Kim Luu' },
      }),
    },
    liveMembers: [{ id: '255', data: live }],
    selectedMemberIds: ['kim-luu'],
  });

  assert.equal(writes.length, 1);
  const [write] = writes;
  assert.equal(write.id, '255');
  assert.equal(write.after.memberDisplayStatus, 'Current Board Member');
  assert.equal(write.after.pronouns, 'she/her');
  assert.deepEqual(write.after.projectIds, ['26']);
  assert.deepEqual(write.after.avatar, { url: 'members/255/avatar.jpg' }, 'Drive avatar must not replace a live one');
  assert.deepEqual(write.after.componentRolesArr, [
    { title: 'Designer', isDisplayRole: false, team: ' SeedMoney' },
    { title: 'Executive Director', isDisplayRole: true, team: null },
  ]);
});

test('new members get the next numeric IDs in a stable order and no Drive avatar', () => {
  const { writes, warnings } = plan({
    members: {
      'zed-zee': member({ firstName: 'Zed', lastName: 'Zee' }),
      'amy-ay': member({
        firstName: 'Amy',
        lastName: 'Ay',
        avatar: { url: 'https://drive.google.com/open?id=abc', alt: 'x' },
      }),
    },
    // Former members, so the roster rule leaves them alone.
    liveMembers: [
      { id: '7', data: member({ firstName: 'Old', lastName: 'Timer', memberDisplayStatus: 'Former Member or Board Member' }) },
      { id: '289', data: member({ firstName: 'Isa', lastName: 'Bel', memberDisplayStatus: 'Former Member or Board Member' }) },
    ],
    selectedMemberIds: ['amy-ay', 'zed-zee'],
  });

  assert.deepEqual(writes.map((write) => [write.id, write.label, write.before]), [
    ['290', 'Amy Ay', null],
    ['291', 'Zed Zee', null],
  ]);
  assert.equal(writes[0].after.avatar, null);
  assert.match(warnings.join('\n'), /Amy Ay: Drive headshot not uploaded yet; no avatar/);
});

test('links to projects that are neither live nor pushed are dropped and reported', () => {
  const { writes, warnings } = plan({
    members: { 'ada-lovelace': member({ projectIds: ['kisses-for-kyle'] }) },
    projects: { 'kisses-for-kyle': project({ title: 'Kisses for Kyle', path: 'kisses-for-kyle' }) },
    selectedMemberIds: ['ada-lovelace'],
  });

  assert.deepEqual(writes[0].after.projectIds, []);
  assert.match(warnings.join('\n'), /kisses-for-kyle is not in Firestore or this push/);
});

test('both sides of a relation are written, including an unselected live document', () => {
  const liveProject = {
    title: 'Hack4Impact-UMD Application Portal',
    path: 'applicationportal',
    memberIds: [{ id: '125', path: 'members/125' }],
  };
  const { writes } = plan({
    members: {
      'ada-lovelace': member({ projectIds: ['applicationportal', 'sustainable-saratoga'] }),
    },
    projects: {
      applicationportal: project({ title: 'Hack4Impact-UMD Application Portal', path: 'applicationportal' }),
      'sustainable-saratoga': project({ memberIds: ['ada-lovelace'] }),
    },
    liveProjects: [{ id: '30', data: liveProject }],
    selectedMemberIds: ['ada-lovelace'],
    selectedProjectIds: ['sustainable-saratoga'],
  });

  const byPath = Object.fromEntries(writes.map((write) => [`${write.collection}/${write.id}`, write]));
  assert.deepEqual(Object.keys(byPath).sort(), ['members/1', 'projects/30', 'projects/31']);
  assert.deepEqual(byPath['members/1'].after.projectIds, ['30', '31']);
  assert.deepEqual(byPath['projects/31'].after.memberIds, ['1']);
  assert.equal(byPath['projects/30'].reciprocalOnly, true);
  assert.deepEqual(byPath['projects/30'].after.memberIds, ['125', '1']);
  assert.deepEqual(byPath['projects/31'].after.startDate, {
    __type__: 'timestamp',
    value: '2026-09-01T00:00:00.000Z',
  });
});

test('an unselected live document that already links back is not rewritten', () => {
  const { writes } = plan({
    members: { 'ada-lovelace': member({ memberDisplayStatus: 'Current Board Member' }) },
    liveMembers: [{ id: '1', data: member({ projectIds: ['30'] }) }],
    liveProjects: [
      { id: '30', data: { title: 'Portal', path: 'portal', memberIds: [{ __type__: 'reference', path: 'members/1' }] } },
    ],
    selectedMemberIds: ['ada-lovelace'],
  });
  assert.deepEqual(writes.map((write) => `${write.collection}/${write.id}`), ['members/1']);
});

test('live current members take their members.json status, or become former when missing', () => {
  const board = { memberDisplayStatus: 'Current Board Member' };
  const { writes } = plan({
    members: {
      'kim-luu': member({ firstName: 'Kim', lastName: 'Luu', ...board }),
      'nate-james': member({ firstName: 'Nate', lastName: 'James' }),
      'hita-thota': member({ firstName: 'Hita', lastName: 'Thota', ...board }),
    },
    liveMembers: [
      { id: '1', data: member({ firstName: 'Kim', lastName: 'Luu', ...board }) },
      { id: '2', data: member({ firstName: 'Nate', lastName: 'James', ...board }) },
      { id: '3', data: member({ firstName: 'Old', lastName: 'Director', ...board, pronouns: 'they/them' }) },
      { id: '4', data: member({ firstName: 'Hita', lastName: 'Thota', ...board }) },
      { id: '5', data: member({ firstName: 'Some', lastName: 'Member' }) },
    ],
    selectedMemberIds: ['kim-luu'],
  });

  const byId = Object.fromEntries(writes.map((write) => [write.id, write]));
  assert.deepEqual(Object.keys(byId).sort(), ['2', '3', '5'], 'Kim is unchanged; Hita is board in the data');
  assert.equal(byId['2'].after.memberDisplayStatus, 'Current Member');
  assert.deepEqual(byId['3'].fields, ['memberDisplayStatus']);
  assert.equal(byId['3'].after.memberDisplayStatus, 'Former Member or Board Member');
  assert.equal(byId['3'].hidden, true);
  // Not on the board, but not on the roster either.
  assert.equal(byId['5'].after.memberDisplayStatus, 'Former Member or Board Member');
});

test('a projects-only push leaves the board alone', () => {
  const { writes } = plan({
    projects: { 'sustainable-saratoga': project() },
    liveMembers: [{ id: '3', data: member({ memberDisplayStatus: 'Current Board Member' }) }],
    selectedProjectIds: ['sustainable-saratoga'],
  });
  assert.deepEqual(writes.map((write) => write.collection), ['projects']);
});

test('a local headshot replaces the avatar and is uploaded only when it changed', () => {
  const localAvatars = {
    'ada-lovelace': { file: '/tmp/ada-lovelace.webp', fileName: 'avatar-abc123.webp', mimeType: 'image/webp' },
  };
  const json = member({ avatar: { url: 'https://drive.google.com/open?id=x', alt: 'Headshot of Ada Lovelace' } });
  const first = plan({
    members: { 'ada-lovelace': json },
    liveMembers: [{ id: '7', data: member({ avatar: { url: 'members/7/avatar.jpg' } }) }],
    selectedMemberIds: ['ada-lovelace'],
    localAvatars,
  });

  assert.deepEqual(first.uploads, [
    { file: '/tmp/ada-lovelace.webp', path: 'members/7/avatar-abc123.webp', contentType: 'image/webp' },
  ]);
  assert.deepEqual(first.writes[0].after.avatar, {
    url: 'members/7/avatar-abc123.webp',
    alt: 'Headshot of Ada Lovelace',
    mimeType: 'image/webp',
  });
  assert.deepEqual(first.warnings, [], 'no Drive warning when a local headshot is used');

  const rerun = plan({
    members: { 'ada-lovelace': json },
    liveMembers: [{ id: '7', data: first.writes[0].after }],
    selectedMemberIds: ['ada-lovelace'],
    localAvatars,
  });
  assert.deepEqual(rerun.uploads, []);
  assert.deepEqual(rerun.writes, []);
});

test('an update that changes nothing is not written', () => {
  const data = member({ componentRolesArr: [{ title: 'Engineer', isDisplayRole: true }] });
  const { writes } = plan({
    members: { 'ada-lovelace': data },
    liveMembers: [{ id: '3', data }],
    selectedMemberIds: ['ada-lovelace'],
  });
  assert.deepEqual(writes, []);
});

test('a selected record matching two live documents is refused', () => {
  assert.throws(
    () =>
      plan({
        members: { 'ada-lovelace': member() },
        liveMembers: [
          { id: '1', data: member() },
          { id: '2', data: member() },
        ],
        selectedMemberIds: ['ada-lovelace'],
      }),
    /member ada-lovelace matches more than one live document/,
  );
});

const image = (kind, hash, ext = 'png') => ({
  file: `/images/${kind}.${ext}`,
  fileName: `${kind}-${hash}.${ext}`,
  mimeType: ext === 'png' ? 'image/png' : 'image/webp',
});

test('a project logo replaces the first image and the screenshots are stored in order with their sizes', () => {
  const liveData = {
    title: 'Seed Money',
    path: 'seedmoney',
    isCurrentProject: true,
    image: [
      { url: 'projects/7/old-logo.png', alt: 'old' },
      { url: 'projects/7/extra.png', alt: 'extra' },
    ],
    screenshots: [{ url: 'projects/7/screenshot-same.webp', alt: 'kept' }],
    memberIds: [],
  };
  const { writes, uploads } = plan({
    projects: { seedmoney: project({ title: 'Seed Money', path: 'seedmoney', nonprofitName: 'SeedMoney' }) },
    liveProjects: [{ id: '7', data: liveData }],
    selectedProjectIds: ['seedmoney'],
    localProjectImages: {
      seedmoney: {
        logo: image('logo', 'abc'),
        screenshots: [
          { ...image('screenshot', 'same', 'webp'), width: 1900, height: 1000 },
          { ...image('screenshot', 'two', 'webp'), width: 390, height: 844 },
        ],
      },
    },
  });

  assert.deepEqual(writes[0].after.image, [
    { url: 'projects/7/logo-abc.png', alt: 'SeedMoney logo', mimeType: 'image/png' },
    { url: 'projects/7/extra.png', alt: 'extra' },
  ]);
  assert.equal(writes[0].after.imageAltText, 'SeedMoney logo');
  assert.deepEqual(writes[0].after.screenshots, [
    { url: 'projects/7/screenshot-same.webp', alt: 'Screenshot 1 of Seed Money', mimeType: 'image/webp', width: 1900, height: 1000 },
    { url: 'projects/7/screenshot-two.webp', alt: 'Screenshot 2 of Seed Money', mimeType: 'image/webp', width: 390, height: 844 },
  ]);
  // The first screenshot is already at its content-hashed path, so it is not uploaded again.
  assert.deepEqual(uploads.map((upload) => upload.path), ['projects/7/logo-abc.png', 'projects/7/screenshot-two.webp']);
});

test('live current projects that are not current in projects.json are retired', () => {
  const { writes } = plan({
    projects: {
      seedmoney: project({ title: 'Seed Money', path: 'seedmoney' }),
      'kisses-for-kyle': project({ title: 'Kisses for Kyle', path: 'kisses-for-kyle', isCurrentProject: false }),
    },
    liveProjects: [
      { id: '1', data: { title: 'Old Current', path: 'old-current', isCurrentProject: true, memberIds: ['9'] } },
      { id: '2', data: { title: 'Kisses for Kyle', path: 'kisses-for-kyle', isCurrentProject: true, memberIds: [] } },
      { id: '3', data: { title: 'Already Past', path: 'already-past', isCurrentProject: false, memberIds: [] } },
      { id: '4', data: { title: 'Seed Money', path: 'seedmoney', isCurrentProject: true, memberIds: [] } },
    ],
    selectedProjectIds: ['seedmoney'],
  });

  const byId = Object.fromEntries(writes.filter((write) => write.retired).map((write) => [write.id, write]));
  // 1 is not in projects.json; 2 is there but not current; 3 is already past; 4 is pushed as current.
  assert.deepEqual(Object.keys(byId).sort(), ['1', '2']);
  assert.equal(writes.find((write) => write.id === '4').after.isCurrentProject, true);
  for (const id of ['1', '2']) {
    assert.deepEqual(byId[id].fields, ['isCurrentProject']);
    assert.equal(byId[id].after.isCurrentProject, false);
    assert.equal(byId[id].retired, true);
  }
  assert.deepEqual(byId['1'].after.memberIds, ['9'], 'members stay linked');
});

test('a members-only push leaves projects alone', () => {
  const { writes } = plan({
    members: { 'ada-lovelace': member() },
    liveProjects: [{ id: '1', data: { title: 'Old Current', path: 'old-current', isCurrentProject: true, memberIds: [] } }],
    selectedMemberIds: ['ada-lovelace'],
  });
  assert.deepEqual(writes.map((write) => write.collection), ['members']);
});

test('project image folders are read by project ID, with screenshots in numeric order', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'project-images-'));
  try {
    await mkdir(path.join(dir, 'seedmoney'));
    await mkdir(path.join(dir, 'kisses-for-kyle'));
    const blank = (width, height) => sharp({ create: { width, height, channels: 3, background: '#ffffff' } });
    await blank(40, 20).png().toFile(path.join(dir, 'seedmoney', 'logo.png'));
    // Either separator works.
    await blank(39, 84).webp().toFile(path.join(dir, 'seedmoney', 'screenshot-10.webp'));
    await blank(190, 100).jpeg().toFile(path.join(dir, 'seedmoney', 'screenshot_2.jpg'));
    const projects = { seedmoney: project(), 'kisses-for-kyle': project() };

    const images = await readProjectImages(dir, projects);
    assert.deepEqual(Object.keys(images), ['seedmoney']);
    assert.match(images.seedmoney.logo.fileName, /^logo-[0-9a-f]{12}\.png$/);
    assert.deepEqual(
      images.seedmoney.screenshots.map((shot) => [shot.index, shot.mimeType, shot.width, shot.height]),
      [[2, 'image/jpeg', 190, 100], [10, 'image/webp', 39, 84]],
    );

    await writeFile(path.join(dir, 'seedmoney', 'cover.png'), 'x');
    await assert.rejects(readProjectImages(dir, projects), /Unexpected file seedmoney\/cover\.png/);
    await rm(path.join(dir, 'seedmoney', 'cover.png'));

    await mkdir(path.join(dir, 'nobody'));
    await assert.rejects(readProjectImages(dir, projects), /Folder nobody does not match a project ID/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
