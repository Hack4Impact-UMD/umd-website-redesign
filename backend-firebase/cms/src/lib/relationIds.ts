export type RelationDiff = {
  added: string[];
  removed: string[];
};

const toNormalizedId = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const id = value.trim();
    return id.length > 0 ? id : null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (value && typeof value === 'object') {
    return toNormalizedId((value as { id?: unknown }).id);
  }
  return null;
};

export const normalizeIdArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const item of value) {
    const id = toNormalizedId(item);
    if (id && !seen.has(id)) {
      seen.add(id);
      normalized.push(id);
    }
  }
  return normalized;
};

export const diffIds = (previous: unknown, next: unknown): RelationDiff => {
  const previousIds = normalizeIdArray(previous);
  const nextIds = normalizeIdArray(next);
  const previousSet = new Set(previousIds);
  const nextSet = new Set(nextIds);
  return {
    added: nextIds.filter((id) => !previousSet.has(id)),
    removed: previousIds.filter((id) => !nextSet.has(id)),
  };
};
