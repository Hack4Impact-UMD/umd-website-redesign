import {
  AppOptions,
  applicationDefault,
  getApps,
  initializeApp,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { runtimeConfig } from './config';

const appOptions: AppOptions = {
  projectId: runtimeConfig.firebaseProjectId,
  storageBucket: runtimeConfig.firebaseStorageBucket,
};

if (!runtimeConfig.isEmulator) {
  appOptions.credential = applicationDefault();
}

const app = getApps()[0] ? getApps()[0] : initializeApp(appOptions);

export const db = getFirestore(app);
export const storage = getStorage(app);
