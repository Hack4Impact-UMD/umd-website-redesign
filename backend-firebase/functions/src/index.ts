import { onRequest } from 'firebase-functions/v2/https';
import { createApp } from './app';
import { runtimeConfig } from './config';

const app = createApp(runtimeConfig);

export const api = onRequest(
  {
    region: runtimeConfig.apiRegion,
    memory: '512MiB',
    timeoutSeconds: 60,
  },
  app,
);
