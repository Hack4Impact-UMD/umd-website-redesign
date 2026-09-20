import { defineString } from 'firebase-functions/params';

export interface RuntimeConfig {
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  cacheMaxAge: number;
  cacheSMaxAge: number;
  allowedOrigins: readonly string[];
  isEmulator: boolean;
}

type Environment = Record<string, string | undefined>;

const DEFAULT_EMULATOR_PROJECT_ID = 'demo-umd-website';
const DEFAULT_REGION = 'us-central1';
const MAX_CACHE_AGE_SECONDS = 86_400;

/**
 * Used directly as `region:` in trigger/https declarations, which are
 * evaluated locally by the Firebase CLI before .env is loaded (see
 * loadRuntimeConfig below). A `firebase-functions` param resolves through the
 * CLI's own .env-aware pipeline instead of a raw process.env read, so the
 * declared region is correct even during that local discovery pass.
 */
export const API_REGION = defineString('API_REGION', { default: DEFAULT_REGION });

const readBoundedInteger = (
  environment: Environment,
  name: string,
  fallback: number,
): number => {
  const value = environment[name];
  if (value === undefined || value.trim() === '') return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > MAX_CACHE_AGE_SECONDS) {
    throw new Error(
      `${name} must be an integer between 0 and ${MAX_CACHE_AGE_SECONDS}`,
    );
  }
  return parsed;
};

const normalizeOrigin = (rawOrigin: string, isEmulator: boolean): string => {
  const value = rawOrigin.trim();
  if (!value || value.includes('*')) {
    throw new Error('ALLOWED_ORIGINS entries must be non-empty exact origins');
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid ALLOWED_ORIGINS entry: ${value}`);
  }

  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const validProtocol = url.protocol === 'https:' || (isEmulator && isLocalhost && url.protocol === 'http:');
  const isExactOrigin =
    url.origin === value.replace(/\/$/, '') &&
    url.username === '' &&
    url.password === '' &&
    (url.pathname === '/' || url.pathname === '') &&
    url.search === '' &&
    url.hash === '';

  if (!validProtocol || !isExactOrigin) {
    throw new Error(`ALLOWED_ORIGINS entry must be an exact HTTPS origin: ${value}`);
  }

  return url.origin;
};

const readAllowedOrigins = (
  environment: Environment,
  isEmulator: boolean,
): readonly string[] => {
  const rawOrigins = environment.ALLOWED_ORIGINS;
  if (rawOrigins === undefined || rawOrigins.trim() === '') {
    if (isEmulator) return ['http://localhost:3000'];
    throw new Error(
      'ALLOWED_ORIGINS is required outside the emulator and must include each browser origin that calls the API',
    );
  }

  return Array.from(
    new Set(
      rawOrigins
        .split(',')
        .map((origin) => normalizeOrigin(origin, isEmulator)),
    ),
  );
};

const validateBucket = (bucket: string): string => {
  const normalized = bucket.trim();
  if (!normalized || normalized.includes('/') || normalized.includes('://')) {
    throw new Error('APP_FIREBASE_STORAGE_BUCKET must be a Storage bucket name');
  }
  return normalized;
};

export const loadRuntimeConfig = (
  environment: Environment = process.env,
): RuntimeConfig => {
  const isEmulator =
    environment.FUNCTIONS_EMULATOR === 'true' ||
    Boolean(environment.FIREBASE_EMULATOR_HUB);

  const firebaseProjectId = (
    environment.APP_FIREBASE_PROJECT_ID ||
    environment.GOOGLE_CLOUD_PROJECT ||
    environment.GCLOUD_PROJECT ||
    (isEmulator ? DEFAULT_EMULATOR_PROJECT_ID : '')
  ).trim();

  if (!firebaseProjectId || (!isEmulator && firebaseProjectId.startsWith('demo-'))) {
    throw new Error('A non-demo Firebase project ID is required outside the emulator');
  }

  const defaultEmulatorBucket = `${firebaseProjectId}.appspot.com`;
  const rawBucket =
    environment.APP_FIREBASE_STORAGE_BUCKET ||
    (isEmulator ? defaultEmulatorBucket : '');
  if (!rawBucket) {
    throw new Error('APP_FIREBASE_STORAGE_BUCKET is required outside the emulator');
  }

  return {
    firebaseProjectId,
    firebaseStorageBucket: validateBucket(rawBucket),
    cacheMaxAge: readBoundedInteger(environment, 'API_CACHE_MAX_AGE', 60),
    cacheSMaxAge: readBoundedInteger(environment, 'API_CACHE_S_MAX_AGE', 300),
    allowedOrigins: readAllowedOrigins(environment, isEmulator),
    isEmulator,
  };
};

/**
 * Reads and validates config from process.env, memoized after the first
 * call. Never call this at module scope: at deploy time the Firebase CLI
 * loads .env into the *deployed function's* environment, not into the local
 * process that statically analyzes this codebase to discover triggers, so a
 * module-scope call throws even though the same env is fine once the
 * function actually runs (see the .env storage-bucket deploy failure this
 * was written to fix).
 */
let cachedRuntimeConfig: RuntimeConfig | undefined;
export const getRuntimeConfig = (): RuntimeConfig => {
  if (!cachedRuntimeConfig) {
    cachedRuntimeConfig = loadRuntimeConfig();
  }
  return cachedRuntimeConfig;
};
