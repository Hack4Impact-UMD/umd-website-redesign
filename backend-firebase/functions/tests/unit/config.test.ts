import { describe, expect, it } from 'vitest';
import { loadRuntimeConfig } from '../../src/config';

const productionEnvironment = {
  APP_FIREBASE_PROJECT_ID: 'umd-website-f3e79',
  APP_FIREBASE_STORAGE_BUCKET: 'umd-website-f3e79.firebasestorage.app',
  API_REGION: 'us-central1',
  ALLOWED_ORIGINS: 'https://umd.hack4impact.org',
};

describe('loadRuntimeConfig', () => {
  it('loads and normalizes explicit production configuration', () => {
    expect(loadRuntimeConfig(productionEnvironment)).toMatchObject({
      firebaseProjectId: 'umd-website-f3e79',
      apiRegion: 'us-central1',
      allowedOrigins: ['https://umd.hack4impact.org'],
      cacheMaxAge: 60,
      cacheSMaxAge: 300,
      isEmulator: false,
    });
  });

  it('fails fast when the production browser-origin allowlist is missing or blank', () => {
    expect(() =>
      loadRuntimeConfig({ ...productionEnvironment, ALLOWED_ORIGINS: undefined }),
    ).toThrow(/ALLOWED_ORIGINS is required/);
    expect(() =>
      loadRuntimeConfig({ ...productionEnvironment, ALLOWED_ORIGINS: '  ' }),
    ).toThrow(/ALLOWED_ORIGINS is required/);
  });

  it('provides explicit demo defaults only in the emulator', () => {
    expect(loadRuntimeConfig({ FUNCTIONS_EMULATOR: 'true' })).toMatchObject({
      firebaseProjectId: 'demo-umd-website',
      firebaseStorageBucket: 'demo-umd-website.appspot.com',
      allowedOrigins: ['http://localhost:3000'],
      isEmulator: true,
    });
  });

  it.each([
    '*',
    'https://*.hack4impact.org',
    'https://umd.hack4impact.org/path',
    'not-an-origin',
    'http://umd.hack4impact.org',
  ])('rejects unsafe origin %s', (origin) => {
    expect(() => loadRuntimeConfig({ ...productionEnvironment, ALLOWED_ORIGINS: origin })).toThrow();
  });

  it('permits local HTTP only in emulator configuration', () => {
    expect(
      loadRuntimeConfig({
        FUNCTIONS_EMULATOR: 'true',
        ALLOWED_ORIGINS: 'http://localhost:5173',
      }).allowedOrigins,
    ).toEqual(['http://localhost:5173']);
  });

  it.each([
    ['API_CACHE_MAX_AGE', '-1'],
    ['API_CACHE_MAX_AGE', '1.5'],
    ['API_CACHE_S_MAX_AGE', '86401'],
    ['API_REGION', 'invalid'],
  ])('rejects invalid %s', (key, value) => {
    expect(() => loadRuntimeConfig({ ...productionEnvironment, [key]: value })).toThrow();
  });

  it('requires project and bucket configuration outside the emulator', () => {
    expect(() => loadRuntimeConfig({ ALLOWED_ORIGINS: 'https://example.org' })).toThrow();
    expect(() =>
      loadRuntimeConfig({
        APP_FIREBASE_PROJECT_ID: 'umd-website-f3e79',
        ALLOWED_ORIGINS: 'https://example.org',
      }),
    ).toThrow();
  });
});
