const normalizeSingleRelationId = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  const maybeId = (value as { id?: unknown }).id;
  if (typeof maybeId === 'string') {
    const trimmed = maybeId.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof maybeId === 'number' && Number.isFinite(maybeId)) {
    return String(maybeId);
  }

  const maybePath = (value as { path?: unknown }).path;
  if (typeof maybePath === 'string') {
    const path = maybePath.trim();
    if (!path) {
      return null;
    }
    const segments = path.split('/').filter(Boolean);
    return segments.length > 0 ? segments[segments.length - 1] : null;
  }

  return null;
};

export const normalizeRelationIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const entry of value) {
    const id = normalizeSingleRelationId(entry);
    if (!id || seen.has(id)) {
      continue;
    }

    seen.add(id);
    normalized.push(id);
  }

  return normalized;
};
