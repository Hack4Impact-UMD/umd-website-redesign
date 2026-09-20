import { onRequest, type HttpsOptions } from 'firebase-functions/v2/https';
import { createApp } from './app';
import { API_REGION, getRuntimeConfig } from './config';

// Built on first request, not at module load: createApp() needs
// getRuntimeConfig(), which must never run during the CLI's local
// discovery pass (see the comment on getRuntimeConfig in ./config).
let app: ReturnType<typeof createApp> | undefined;
const getApp = () => (app ??= createApp(getRuntimeConfig()));

export const apiRuntimeOptions = Object.freeze({
  region: API_REGION,
  memory: '512MiB',
  timeoutSeconds: 60,
  cpu: 1,
  concurrency: 80,
  maxInstances: 3,
} satisfies HttpsOptions);

export const api = onRequest(apiRuntimeOptions, (request, response) =>
  getApp()(request, response),
);

// Rebuild triggers. Deployed separately from `api`; see backend-firebase/README.md.
export * from './triggers';
