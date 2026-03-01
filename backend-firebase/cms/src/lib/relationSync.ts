import type { FireCMSContext } from '@firecms/core';
import { diffIds, normalizeIdArray } from './relationAdapters';

type SyncSummary = {
  requested: number;
  updated: number;
  missing: string[];
};

type RelationSyncSummary = {
  added: SyncSummary;
  removed: SyncSummary;
};

const EMPTY_SYNC: SyncSummary = {
  requested: 0,
  updated: 0,
  missing: [],
};

const readLinkedIds = (values: unknown, fieldName: string): string[] => {
  if (!values || typeof values !== 'object') {
    return [];
  }

  return normalizeIdArray((values as Record<string, unknown>)[fieldName]);
};

const arrayEquals = (left: string[], right: string[]) => {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
};

const applyArrayLinkUpdates = async ({
  context,
  collectionPath,
  targetIds,
  fieldName,
  linkedId,
  mode,
}: {
  context: FireCMSContext;
  collectionPath: string;
  targetIds: string[];
  fieldName: string;
  linkedId: string;
  mode: 'add' | 'remove';
}): Promise<SyncSummary> => {
  const normalizedTargetIds = normalizeIdArray(targetIds);

  if (normalizedTargetIds.length === 0) {
    return EMPTY_SYNC;
  }

  const missing: string[] = [];
  let updated = 0;

  for (const targetId of normalizedTargetIds) {
    const currentEntity = await context.dataSource.fetchEntity({
      path: collectionPath,
      entityId: targetId,
    });

    if (!currentEntity) {
      missing.push(targetId);
      continue;
    }

    const currentIds = readLinkedIds(currentEntity.values, fieldName);
    const nextIds = mode === 'add'
      ? normalizeIdArray([...currentIds, linkedId])
      : currentIds.filter((id) => id !== linkedId);

    if (arrayEquals(currentIds, nextIds)) {
      continue;
    }

    await context.dataSource.saveEntity({
      path: collectionPath,
      entityId: targetId,
      status: 'existing',
      values: {
        ...(currentEntity.values as Record<string, unknown>),
        [fieldName]: nextIds,
      },
    });

    updated += 1;
  }

  return {
    requested: normalizedTargetIds.length,
    updated,
    missing,
  };
};

export const syncProjectMembers = async ({
  context,
  projectId,
  previousMemberIds,
  nextMemberIds,
}: {
  context: FireCMSContext;
  projectId: string;
  previousMemberIds: unknown;
  nextMemberIds: unknown;
}): Promise<RelationSyncSummary> => {
  const normalizedProjectId = projectId.trim();
  if (!normalizedProjectId) {
    return { added: EMPTY_SYNC, removed: EMPTY_SYNC };
  }

  const { added, removed } = diffIds(previousMemberIds, nextMemberIds);

  const [addedResult, removedResult] = await Promise.all([
    applyArrayLinkUpdates({
      context,
      collectionPath: 'members',
      targetIds: added,
      fieldName: 'projectIds',
      linkedId: normalizedProjectId,
      mode: 'add',
    }),
    applyArrayLinkUpdates({
      context,
      collectionPath: 'members',
      targetIds: removed,
      fieldName: 'projectIds',
      linkedId: normalizedProjectId,
      mode: 'remove',
    }),
  ]);

  return {
    added: addedResult,
    removed: removedResult,
  };
};

export const syncMemberProjects = async ({
  context,
  memberId,
  previousProjectIds,
  nextProjectIds,
}: {
  context: FireCMSContext;
  memberId: string;
  previousProjectIds: unknown;
  nextProjectIds: unknown;
}): Promise<RelationSyncSummary> => {
  const normalizedMemberId = memberId.trim();
  if (!normalizedMemberId) {
    return { added: EMPTY_SYNC, removed: EMPTY_SYNC };
  }

  const { added, removed } = diffIds(previousProjectIds, nextProjectIds);

  const [addedResult, removedResult] = await Promise.all([
    applyArrayLinkUpdates({
      context,
      collectionPath: 'projects',
      targetIds: added,
      fieldName: 'memberIds',
      linkedId: normalizedMemberId,
      mode: 'add',
    }),
    applyArrayLinkUpdates({
      context,
      collectionPath: 'projects',
      targetIds: removed,
      fieldName: 'memberIds',
      linkedId: normalizedMemberId,
      mode: 'remove',
    }),
  ]);

  return {
    added: addedResult,
    removed: removedResult,
  };
};
