const API_MEDIA_PREFIX = '/api/media/';
const ABSOLUTE_URL_REGEX = /^https?:\/\//i;
const GS_URL_REGEX = /^gs:\/\/[^/]+\/(.+)$/i;

const normalizePath = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withoutLeadingSlash = trimmed.replace(/^\/+/, '');
  if (!withoutLeadingSlash) return null;

  const segments = withoutLeadingSlash
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) return null;
  if (segments.some((segment) => segment === '.' || segment === '..')) return null;

  return segments.join('/');
};

const decodeUriComponentSafe = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const parseApiMediaPath = (value: string): string | null => {
  if (!value.startsWith(API_MEDIA_PREFIX)) return null;
  const encodedPath = value.slice(API_MEDIA_PREFIX.length);
  const decodedPath = decodeUriComponentSafe(encodedPath);
  return normalizePath(decodedPath);
};

const parseGsPath = (value: string): string | null => {
  const match = value.match(GS_URL_REGEX);
  if (!match?.[1]) return null;
  return normalizePath(decodeUriComponentSafe(match[1]));
};

const parseStorageGoogleUrl = (value: string): string | null => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.hostname === 'storage.googleapis.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return normalizePath(decodeUriComponentSafe(parts.slice(1).join('/')));
  }

  if (url.hostname.endsWith('.storage.googleapis.com')) {
    return normalizePath(decodeUriComponentSafe(url.pathname.replace(/^\/+/, '')));
  }

  if (url.hostname === 'firebasestorage.googleapis.com') {
    const match = url.pathname.match(/^\/v0\/b\/[^/]+\/o\/(.+)$/);
    if (!match?.[1]) return null;
    return normalizePath(decodeUriComponentSafe(match[1]));
  }

  const apiIndex = url.pathname.indexOf(API_MEDIA_PREFIX);
  if (apiIndex >= 0) {
    const mediaPath = url.pathname.slice(apiIndex);
    return parseApiMediaPath(mediaPath);
  }

  return null;
};

const isAbsoluteUrl = (value: string): boolean => ABSOLUTE_URL_REGEX.test(value);

const toStoragePath = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('/assets/')) return null;

  const fromApiPath = parseApiMediaPath(trimmed);
  if (fromApiPath) return fromApiPath;

  const fromGsPath = parseGsPath(trimmed);
  if (fromGsPath) return fromGsPath;

  if (isAbsoluteUrl(trimmed)) {
    return parseStorageGoogleUrl(trimmed);
  }

  if (trimmed.startsWith('/')) {
    return null;
  }

  return normalizePath(decodeUriComponentSafe(trimmed));
};

const toApiMediaPath = (storagePath: string): string => {
  const normalized = normalizePath(storagePath);
  if (!normalized) return storagePath;

  return `${API_MEDIA_PREFIX}${normalized
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`;
};

const isExternalUrl = (value: string): boolean => {
  if (!isAbsoluteUrl(value)) return false;
  return toStoragePath(value) === null;
};

export const toPublicMediaUrl = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('/assets/')) return trimmed;
  if (trimmed.startsWith(API_MEDIA_PREFIX)) return trimmed;
  if (isExternalUrl(trimmed)) return trimmed;

  const storagePath = toStoragePath(trimmed);
  if (!storagePath) return trimmed;
  return toApiMediaPath(storagePath);
};

