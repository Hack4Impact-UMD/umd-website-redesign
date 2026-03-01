import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { runtimeConfig } from './config';

const app = getApps()[0]
  ? getApps()[0]
  : initializeApp({
      credential: applicationDefault(),
      projectId: runtimeConfig.firebaseProjectId,
    });

export const db = getFirestore(app);
export const storage = getStorage(app);
