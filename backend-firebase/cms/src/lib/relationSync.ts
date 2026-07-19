import {
  Firestore,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  writeBatch,
} from 'firebase/firestore';
import { diffIds, normalizeIdArray } from './relationIds';

type RelationOperation = {
  collectionPath: 'members' | 'projects';
  entityId: string;
  fieldName: 'projectIds' | 'memberIds';
  linkedId: string;
  mode: 'add' | 'remove';
};

const getDatabase = (database?: Firestore) => database ?? getFirestore();

export const assertRelationTargetsExist = async ({
  collectionPath,
  targetIds,
  database,
}: {
  collectionPath: 'members' | 'projects';
  targetIds: unknown;
  database?: Firestore;
}): Promise<void> => {
  const db = getDatabase(database);
  const normalizedIds = normalizeIdArray(targetIds);
  const snapshots = await Promise.all(
    normalizedIds.map((entityId) => getDoc(doc(db, collectionPath, entityId))),
  );
  const missing = normalizedIds.filter((_entityId, index) => !snapshots[index].exists());
  if (missing.length > 0) {
    throw new Error(
      `Missing ${collectionPath} relation target(s): ${missing.join(', ')}`,
    );
  }
};

const applyRelationOperations = async (
  operations: RelationOperation[],
  database?: Firestore,
): Promise<void> => {
  if (operations.length === 0) return;
  const db = getDatabase(database);

  const snapshots = await Promise.all(
    operations.map((operation) =>
      getDoc(doc(db, operation.collectionPath, operation.entityId)),
    ),
  );
  const missing = operations
    .filter((_operation, index) => !snapshots[index].exists())
    .map((operation) => `${operation.collectionPath}/${operation.entityId}`);
  if (missing.length > 0) {
    throw new Error(`Missing relation target(s): ${missing.join(', ')}`);
  }

  const batch = writeBatch(db);
  operations.forEach((operation) => {
    const target = doc(db, operation.collectionPath, operation.entityId);
    batch.update(target, {
      [operation.fieldName]: operation.mode === 'add'
        ? arrayUnion(operation.linkedId)
        : arrayRemove(operation.linkedId),
    });
  });
  await batch.commit();
};

export const syncProjectMembers = async ({
  projectId,
  previousMemberIds,
  nextMemberIds,
  database,
}: {
  projectId: string;
  previousMemberIds: unknown;
  nextMemberIds: unknown;
  database?: Firestore;
}): Promise<void> => {
  const normalizedProjectId = projectId.trim();
  if (!normalizedProjectId) return;
  const { added, removed } = diffIds(previousMemberIds, nextMemberIds);
  await applyRelationOperations(
    [
      ...added.map((entityId): RelationOperation => ({
        collectionPath: 'members',
        entityId,
        fieldName: 'projectIds',
        linkedId: normalizedProjectId,
        mode: 'add',
      })),
      ...removed.map((entityId): RelationOperation => ({
        collectionPath: 'members',
        entityId,
        fieldName: 'projectIds',
        linkedId: normalizedProjectId,
        mode: 'remove',
      })),
    ],
    database,
  );
};

export const syncMemberProjects = async ({
  memberId,
  previousProjectIds,
  nextProjectIds,
  database,
}: {
  memberId: string;
  previousProjectIds: unknown;
  nextProjectIds: unknown;
  database?: Firestore;
}): Promise<void> => {
  const normalizedMemberId = memberId.trim();
  if (!normalizedMemberId) return;
  const { added, removed } = diffIds(previousProjectIds, nextProjectIds);
  await applyRelationOperations(
    [
      ...added.map((entityId): RelationOperation => ({
        collectionPath: 'projects',
        entityId,
        fieldName: 'memberIds',
        linkedId: normalizedMemberId,
        mode: 'add',
      })),
      ...removed.map((entityId): RelationOperation => ({
        collectionPath: 'projects',
        entityId,
        fieldName: 'memberIds',
        linkedId: normalizedMemberId,
        mode: 'remove',
      })),
    ],
    database,
  );
};
