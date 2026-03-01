import { EntityReference } from '@firecms/core';

export type RelationDiff = {
  added: string[];
  removed: string[];
};

const toNormalizedId = (value: unknown): string | null => {
  if (value instanceof EntityReference) {
    const id = value.id.trim();
    return id.length > 0 ? id : null;
  }

  if (typeof value === 'string') {
    const id = value.trim();
    return id.length > 0 ? id : null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (value && typeof value === 'object') {
    const maybeId = (value as { id?: unknown }).id;
    if (typeof maybeId === 'string') {
      const id = maybeId.trim();
      return id.length > 0 ? id : null;
    }
    if (typeof maybeId === 'number' && Number.isFinite(maybeId)) {
      return String(maybeId);
    }
  }

  return null;
};

const toReferencePath = (value: unknown): string | null => {
  if (value instanceof EntityReference) {
    const path = value.path.trim();
    return path.length > 0 ? path : null;
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  const maybePath = (value as { path?: unknown }).path;
  if (typeof maybePath !== 'string') {
    return null;
  }

  const path = maybePath.trim();
  return path.length > 0 ? path : null;
};

export const normalizeIdArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const item of value) {
    const id = toNormalizedId(item);
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    normalized.push(id);
  }

  return normalized;
};

export const idsToReferences = (ids: unknown, path: string): EntityReference[] => {
  return normalizeIdArray(ids).map((id) => new EntityReference(id, path));
};

export const referencesToIds = (value: unknown): string[] => {
  return normalizeIdArray(value);
};

export const normalizeReferences = (value: unknown, fallbackPath: string): EntityReference[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: EntityReference[] = [];

  for (const item of value) {
    const id = toNormalizedId(item);
    if (!id) {
      continue;
    }

    const path = toReferencePath(item) ?? fallbackPath;
    const dedupeKey = `${path}/${id}`;
    if (seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    normalized.push(new EntityReference(id, path));
  }

  return normalized;
};

export const diffIds = (previous: unknown, next: unknown): RelationDiff => {
  const previousIds = normalizeIdArray(previous);
  const nextIds = normalizeIdArray(next);

  const previousSet = new Set(previousIds);
  const nextSet = new Set(nextIds);

  const added = nextIds.filter((id) => !previousSet.has(id));
  const removed = previousIds.filter((id) => !nextSet.has(id));

  return { added, removed };
};
