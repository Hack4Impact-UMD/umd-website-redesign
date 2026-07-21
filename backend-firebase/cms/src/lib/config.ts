type Environment = Record<string, string | undefined>;

const REQUIRED_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

export const loadFirebaseConfig = (
  environment: Environment,
): Record<string, string> => {
  const missing = REQUIRED_KEYS.filter(
    (key) => !environment[key] || environment[key]?.trim() === '',
  );
  if (missing.length > 0) {
    throw new Error(`Missing Firebase CMS configuration: ${missing.join(', ')}`);
  }

  return {
    apiKey: environment.VITE_FIREBASE_API_KEY!.trim(),
    authDomain: environment.VITE_FIREBASE_AUTH_DOMAIN!.trim(),
    projectId: environment.VITE_FIREBASE_PROJECT_ID!.trim(),
    storageBucket: environment.VITE_FIREBASE_STORAGE_BUCKET!.trim(),
    messagingSenderId: environment.VITE_FIREBASE_MESSAGING_SENDER_ID!.trim(),
    appId: environment.VITE_FIREBASE_APP_ID!.trim(),
  };
};
