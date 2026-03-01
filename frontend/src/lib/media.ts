import { getApiBaseUrl } from '@/api/http';

const isAbsolute = (value: string) =>
  value.startsWith('http://') ||
  value.startsWith('https://') ||
  value.startsWith('data:') ||
  value.startsWith('blob:');

const toApiMediaPath = (storagePath: string) =>
  `/api/media/${storagePath
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`;

const withApiBase = (path: string) => {
  const base = getApiBaseUrl();
  if (!base) return path;
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
};

export const resolveMediaUrl = (src?: string | null) => {
  if (!src) return '';
  if (isAbsolute(src)) return src;
  if (src.startsWith('/assets/')) return src;
  if (src.startsWith('/api/media/')) return withApiBase(src);

  if (src.startsWith('/')) {
    return withApiBase(src);
  }

  return withApiBase(toApiMediaPath(src));
};
