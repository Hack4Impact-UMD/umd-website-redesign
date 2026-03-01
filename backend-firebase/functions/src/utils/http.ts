import { Request, Response, NextFunction } from 'express';
import { runtimeConfig } from '../config';

export const cacheHeaders = (_request: Request, response: Response, next: NextFunction) => {
  response.setHeader(
    'Cache-Control',
    `public, max-age=${runtimeConfig.cacheMaxAge}, s-maxage=${runtimeConfig.cacheSMaxAge}`,
  );
  next();
};

export const sendApiError = (
  response: Response,
  status: number,
  code: string,
  message: string,
) => {
  response.status(status).json({
    error: {
      code,
      message,
    },
  });
};

export const safeJson = <T>(response: Response, payload: T) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.status(200).json(payload);
};
