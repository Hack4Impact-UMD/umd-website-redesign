import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { logger } from 'firebase-functions';
import { RuntimeConfig } from './config';
import { getContent } from './routes/content';
import { createGetMedia } from './routes/media';
import { getMembers } from './routes/members';
import { getProjects } from './routes/projects';
import { sendApiError, safeJson } from './utils/http';

const CORS_ERROR = 'cors/not-allowed';

export const createApp = (config: RuntimeConfig) => {
  const app = express();
  const allowedOrigins = new Set(config.allowedOrigins);

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  app.use((request, response, next) => {
    response.vary('Origin');
    cors({
      methods: ['GET', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['Accept', 'Content-Type'],
      maxAge: 3600,
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(CORS_ERROR));
      },
    })(request, response, next);
  });

  app.use((request: Request, _response: Response, next: NextFunction) => {
    logger.info('api.request', {
      method: request.method,
      path: request.path,
      query: request.query,
    });
    next();
  });

  app.get(['/health', '/api/health'], (_request, response) => {
    safeJson(response, {
      status: 'ok',
      service: 'backend-firebase-functions',
    });
  });

  app.get(['/projects', '/api/projects'], (request, response) =>
    getProjects(request, response, config),
  );
  app.get(['/members', '/api/members'], (request, response) =>
    getMembers(request, response, config),
  );
  app.get(['/content/:section', '/api/content/:section'], (request, response) =>
    getContent(request, response, config),
  );
  app.get(
    ['/content/:section/:subsection', '/api/content/:section/:subsection'],
    (request, response) => getContent(request, response, config),
  );
  app.get(['/media/*', '/api/media/*'], createGetMedia(config));

  app.use((_request, response) => {
    sendApiError(response, 404, 'route/not-found', 'Route not found');
  });

  app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
    logger.error('api.unhandled-error', error);
    if (error.message === CORS_ERROR) {
      sendApiError(response, 403, CORS_ERROR, 'Origin is not allowed');
      return;
    }
    sendApiError(response, 500, 'api/unhandled-error', 'Unexpected server error');
  });

  return app;
};
