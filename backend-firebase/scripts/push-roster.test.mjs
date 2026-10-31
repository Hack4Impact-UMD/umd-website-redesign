import test from 'node:test';
import assert from 'node:assert/strict';

import { planPush, selectIds } from './push-roster.mjs';

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

test('board selection picks only Current Board Member records', () => {
  const members = {
    'kim-luu': member({ memberDisplayStatus: 'Current Board Member' }),
    'ada-lovelace': member(),
  };
  assert.deepEqual(selectIds('board', members, 'members'), ['kim-luu']);
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
    liveMembers: [
      { id: '7', data: member({ firstName: 'Old', lastName: 'Timer' }) },
      { id: '289', data: member({ firstName: 'Isa', lastName: 'Bel' }) },
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

test('live board members missing from the board in members.json are hidden', () => {
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
  assert.deepEqual(Object.keys(byId).sort(), ['2', '3'], 'Kim is unchanged; Hita is board in the data; 5 was never board');
  assert.equal(byId['2'].after.memberDisplayStatus, 'Current Member');
  assert.deepEqual(byId['3'].fields, ['memberDisplayStatus']);
  assert.equal(byId['3'].after.memberDisplayStatus, 'Former Member or Board Member');
  assert.equal(byId['3'].hidden, true);
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
