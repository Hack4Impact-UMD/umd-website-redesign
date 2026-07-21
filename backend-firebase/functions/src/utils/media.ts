const API_MEDIA_PREFIX = '/api/media/';
const ALLOWED_STORAGE_ROOTS = new Set(['projects', 'members', 'content']);
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const ENCODED_TRAVERSAL = /%(?:00|2e|2f|5c)/i;

const containsEncodedTraversal = (value: string): boolean => {
  let candidate = value;
  for (let depth = 0; depth < 3; depth += 1) {
    if (ENCODED_TRAVERSAL.test(candidate)) return true;
    const decoded = decodeSegment(candidate);
    if (decoded === null || decoded === candidate) return false;
    candidate = decoded;
  }
  return ENCODED_TRAVERSAL.test(candidate);
};

const decodeSegment = (segment: string): string | null => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
};

const normalizeSegments = (
  value: string,
  decode: boolean,
  requireAllowedRoot = true,
): string | null => {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('/') || CONTROL_CHARACTERS.test(trimmed)) {
    return null;
  }

  const rawSegments = trimmed.split('/');
  if (rawSegments.some((segment) => segment === '')) return null;

  const segments: string[] = [];
  for (const rawSegment of rawSegments) {
    const segment = decode ? decodeSegment(rawSegment) : rawSegment;
    if (
      segment === null ||
      segment === '' ||
      segment === '.' ||
      segment === '..' ||
      segment.includes('/') ||
      segment.includes('\\') ||
      CONTROL_CHARACTERS.test(segment) ||
      containsEncodedTraversal(rawSegment) ||
      containsEncodedTraversal(segment)
    ) {
      return null;
    }
    segments.push(segment);
  }

  if (requireAllowedRoot && !ALLOWED_STORAGE_ROOTS.has(segments[0])) {
    return null;
  }
  return segments.join('/');
};

const parseApiMediaPath = (value: string): string | null => {
  if (!value.startsWith(API_MEDIA_PREFIX)) return null;
  return normalizeSegments(value.slice(API_MEDIA_PREFIX.length), true);
};

const parseGsPath = (value: string): string | null => {
  const match = value.match(/^gs:\/\/[^/]+\/(.+)$/i);
  return match?.[1] ? normalizeSegments(match[1], true) : null;
};

const isStorageHostname = (hostname: string) =>
  hostname === 'storage.googleapis.com' ||
  hostname.endsWith('.storage.googleapis.com') ||
  hostname === 'firebasestorage.googleapis.com';

const parseStorageGoogleUrl = (url: URL): string | null => {
  if (url.hostname === 'storage.googleapis.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return normalizeSegments(parts.slice(1).join('/'), true);
  }
  if (url.hostname.endsWith('.storage.googleapis.com')) {
    return normalizeSegments(url.pathname.replace(/^\/+/, ''), true);
  }
  if (url.hostname === 'firebasestorage.googleapis.com') {
    const match = url.pathname.match(/^\/v0\/b\/[^/]+\/o\/(.+)$/);
    return match?.[1] ? normalizeSegments(match[1], true) : null;
  }
  return null;
};

const toApiMediaPath = (storagePath: string): string =>
  `${API_MEDIA_PREFIX}${storagePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`;

export const parsePublicMediaPath = (value: string): string | null =>
  normalizeSegments(value, true);

export const toPublicMediaUrl = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || CONTROL_CHARACTERS.test(trimmed)) return null;

  if (trimmed.startsWith('/assets/')) {
    const localPath = normalizeSegments(trimmed.slice(1), true, false);
    return localPath?.startsWith('assets/') ? `/${localPath}` : null;
  }

  const apiPath = parseApiMediaPath(trimmed);
  if (trimmed.startsWith(API_MEDIA_PREFIX)) {
    return apiPath ? toApiMediaPath(apiPath) : null;
  }

  const gsPath = parseGsPath(trimmed);
  if (trimmed.startsWith('gs://')) {
    return gsPath ? toApiMediaPath(gsPath) : null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    let url: URL;
    try {
      url = new URL(trimmed);
    } catch {
      return null;
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (isStorageHostname(url.hostname)) {
      const storagePath = parseStorageGoogleUrl(url);
      return storagePath ? toApiMediaPath(storagePath) : null;
    }
    return url.toString();
  }

  if (trimmed.startsWith('/')) return null;
  const rawStoragePath = normalizeSegments(trimmed, false);
  return rawStoragePath ? toApiMediaPath(rawStoragePath) : null;
};
