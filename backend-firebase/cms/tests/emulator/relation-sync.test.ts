import { deleteApp, initializeApp } from 'firebase/app';
import {
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  assertRelationTargetsExist,
  syncMemberProjects,
  syncProjectMembers,
} from '../../src/lib/relationSync';

const app = initializeApp({ projectId: 'demo-umd-website-relations' }, 'relations-test');
const database = getFirestore(app);

beforeAll(() => {
  connectFirestoreEmulator(database, '127.0.0.1', 8081);
});

beforeEach(async () => {
  await Promise.all(
    [
      ['members', '1'],
      ['members', '2'],
      ['members', 'missing'],
      ['projects', '10'],
      ['projects', 'missing'],
    ].map(([collection, id]) => deleteDoc(doc(database, collection, id)).catch(() => undefined)),
  );
});

afterAll(async () => deleteApp(app));

describe('atomic reverse relation sync', () => {
  it('adds/removes project links without overwriting unrelated member edits', async () => {
    const memberOne = doc(database, 'members', '1');
    const memberTwo = doc(database, 'members', '2');
    await Promise.all([
      setDoc(memberOne, { projectIds: [], title: 'preserve me' }),
      setDoc(memberTwo, { projectIds: ['10'], title: 'also preserve me' }),
    ]);
    await updateDoc(memberOne, { title: 'concurrent edit' });

    await syncProjectMembers({
      projectId: '10',
      previousMemberIds: ['2'],
      nextMemberIds: ['1', '1'],
      database,
    });

    expect((await getDoc(memberOne)).data()).toMatchObject({
      projectIds: ['10'],
      title: 'concurrent edit',
    });
    expect((await getDoc(memberTwo)).data()).toMatchObject({
      projectIds: [],
      title: 'also preserve me',
    });
  });

  it('syncs from the member side', async () => {
    await setDoc(doc(database, 'projects', '10'), { memberIds: [] });
    await syncMemberProjects({
      memberId: '1',
      previousProjectIds: [],
      nextProjectIds: ['10'],
      database,
    });
    expect((await getDoc(doc(database, 'projects', '10'))).data()?.memberIds).toEqual(['1']);
  });

  it('fails atomically when any target is missing', async () => {
    await setDoc(doc(database, 'members', '1'), { projectIds: [] });
    await expect(
      syncProjectMembers({
        projectId: '10',
        previousMemberIds: [],
        nextMemberIds: ['1', 'missing'],
        database,
      }),
    ).rejects.toThrow(/missing/);
    expect((await getDoc(doc(database, 'members', '1'))).data()?.projectIds).toEqual([]);
  });

  it('validates references before a primary CMS save', async () => {
    await expect(
      assertRelationTargetsExist({
        collectionPath: 'projects',
        targetIds: ['missing'],
        database,
      }),
    ).rejects.toThrow(/Missing projects/);
  });
});
