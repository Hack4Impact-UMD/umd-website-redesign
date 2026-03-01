const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOrigins = (value: string | undefined): string[] | null => {
  if (!value) return null;
  const origins = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return origins.length > 0 ? origins : null;
};

export const runtimeConfig = {
  firebaseProjectId:
    process.env.APP_FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT,
  firebaseStorageBucket: process.env.APP_FIREBASE_STORAGE_BUCKET,
  apiRegion: process.env.API_REGION || 'us-central1',
  cacheMaxAge: parseNumber(process.env.API_CACHE_MAX_AGE, 60),
  cacheSMaxAge: parseNumber(process.env.API_CACHE_S_MAX_AGE, 300),
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
};
