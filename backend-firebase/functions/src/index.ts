import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { runtimeConfig } from './config';
import { cacheHeaders, sendApiError } from './utils/http';
import { getProjects } from './routes/projects';
import { getMembers } from './routes/members';
import { getContent } from './routes/content';
import { getMedia } from './routes/media';

const app = express();

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!runtimeConfig.allowedOrigins || runtimeConfig.allowedOrigins.length === 0) {
      callback(null, true);
      return;
    }

    if (!origin || runtimeConfig.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
});

app.use(express.json({ limit: '1mb' }));
app.use(corsMiddleware);

app.use((request: Request, _response: Response, next: NextFunction) => {
  logger.info('api.request', {
    method: request.method,
    path: request.path,
    query: request.query,
  });
  next();
});

app.get('/health', (_request: Request, response: Response) => {
  response.status(200).json({
    status: 'ok',
    service: 'backend-firebase-functions',
  });
});

app.get(['/projects', '/api/projects'], cacheHeaders, getProjects);
app.get(['/members', '/api/members'], cacheHeaders, getMembers);
app.get(['/content/:section', '/api/content/:section'], cacheHeaders, getContent);
app.get(
  ['/content/:section/:subsection', '/api/content/:section/:subsection'],
  cacheHeaders,
  getContent,
);
app.get(['/media/*', '/api/media/*'], getMedia);

app.use((_request: Request, response: Response) => {
  sendApiError(response, 404, 'route/not-found', 'Route not found');
});

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  logger.error('api.unhandled-error', error);

  if (error.message === 'Not allowed by CORS') {
    sendApiError(response, 403, 'cors/not-allowed', 'Origin is not allowed');
    return;
  }

  sendApiError(response, 500, 'api/unhandled-error', 'Unexpected server error');
});

export const api = onRequest(
  {
    region: runtimeConfig.apiRegion,
    memory: '512MiB',
    timeoutSeconds: 60,
  },
  app,
);
