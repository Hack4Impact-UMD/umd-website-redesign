import {
  AppOptions,
  App,
  applicationDefault,
  getApps,
  initializeApp,
} from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Storage, getStorage } from 'firebase-admin/storage';
import { getRuntimeConfig } from './config';

let app: App | undefined;

const getApp = (): App => {
  if (app) return app;

  const existing = getApps()[0];
  if (existing) {
    app = existing;
    return app;
  }

  const config = getRuntimeConfig();
  const appOptions: AppOptions = {
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
  };
  if (!config.isEmulator) {
    appOptions.credential = applicationDefault();
  }

  app = initializeApp(appOptions);
  return app;
};

/**
 * Forwards property access to an instance built on first use, so importing
 * this module never touches getRuntimeConfig()/getApp() at module-eval time.
 */
const lazy = <T extends object>(factory: () => T): T =>
  new Proxy({} as T, {
    get(_target, prop, _receiver) {
      const instance = factory();
      const value = Reflect.get(instance as object, prop, instance as object);
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  });

let dbInstance: Firestore | undefined;
export const db = lazy(() => (dbInstance ??= getFirestore(getApp())));

let storageInstance: Storage | undefined;
export const storage = lazy(() => (storageInstance ??= getStorage(getApp())));
