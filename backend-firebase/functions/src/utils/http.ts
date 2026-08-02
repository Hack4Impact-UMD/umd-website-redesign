import { Response } from 'express';
import { RuntimeConfig } from '../config';

export const sendApiError = (
  response: Response,
  status: number,
  code: string,
  message: string,
) => {
  response.setHeader('Cache-Control', 'no-store');
  response.status(status).json({
    error: {
      code,
      message,
    },
  });
};

export const safeJson = <T>(
  response: Response,
  payload: T,
  cacheConfig?: Pick<RuntimeConfig, 'cacheMaxAge' | 'cacheSMaxAge'>,
) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader(
    'Cache-Control',
    cacheConfig
      ? `public, max-age=${cacheConfig.cacheMaxAge}, s-maxage=${cacheConfig.cacheSMaxAge}`
      : 'no-store',
  );
  response.status(200).json(payload);
};
