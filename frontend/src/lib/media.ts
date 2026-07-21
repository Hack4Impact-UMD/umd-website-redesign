import { getApiBaseUrl } from '@/api/http';

const SAFE_STORAGE_ROOTS = new Set(['projects', 'members', 'content']);
const ENCODED_SEPARATOR = /%2f|%5c/i;

const isSafeSegments = (value: string) => {
  if (ENCODED_SEPARATOR.test(value) || value.includes('\\')) return false;
  const segments = value.split('/').filter(Boolean);
  return segments.length > 0 && segments.every((segment) => segment !== '.' && segment !== '..');
};

const apiMediaUrl = (path: string) => {
  const suffix = path.replace(/^\/?api\/media\//, '');
  if (!isSafeSegments(suffix)) return '';
  return `${getApiBaseUrl()}/media/${suffix}`;
};

export const resolveMediaUrl = (source?: string | null) => {
  const value = source?.trim();
  if (!value) return '';
  if (ENCODED_SEPARATOR.test(value) || value.includes('\\') || /\/(?:\.{1,2})(?:\/|$)/.test(value)) {
    return '';
  }

  if (value.startsWith('/api/media/')) return apiMediaUrl(value);
  if (value.startsWith('/assets/') || value.startsWith('/src/')) {
    return isSafeSegments(value) ? value : '';
  }
  if (!value.includes('://') && !value.startsWith('/')) {
    const root = value.split('/')[0];
    return SAFE_STORAGE_ROOTS.has(root) && isSafeSegments(value) ? apiMediaUrl(value) : '';
  }

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return '';
    return url.toString();
  } catch {
    return '';
  }
};
