import { onRequest, type HttpsOptions } from 'firebase-functions/v2/https';
import { createApp } from './app';
import { runtimeConfig } from './config';

const app = createApp(runtimeConfig);

export const apiRuntimeOptions = Object.freeze({
  region: runtimeConfig.apiRegion,
  memory: '512MiB',
  timeoutSeconds: 60,
  cpu: 1,
  concurrency: 80,
  maxInstances: 3,
} satisfies HttpsOptions);

export const api = onRequest(apiRuntimeOptions, app);

// Rebuild triggers. Deployed separately from `api`; see backend-firebase/README.md.
export * from './triggers';
