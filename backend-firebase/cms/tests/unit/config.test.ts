import { describe, expect, it } from 'vitest';
import { loadFirebaseConfig } from '../../src/lib/config';

const validEnvironment = {
  VITE_FIREBASE_API_KEY: 'public-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'demo.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'demo-project',
  VITE_FIREBASE_STORAGE_BUCKET: 'demo-project.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123',
  VITE_FIREBASE_APP_ID: 'app-id',
};

describe('CMS Firebase configuration', () => {
  it('returns a complete Firebase options object', () => {
    expect(loadFirebaseConfig(validEnvironment)).toMatchObject({
      projectId: 'demo-project',
      authDomain: 'demo.firebaseapp.com',
    });
  });

  it('names every missing setting before Firebase initialization', () => {
    expect(() => loadFirebaseConfig({})).toThrow(
      /VITE_FIREBASE_API_KEY.*VITE_FIREBASE_APP_ID/,
    );
  });
});
