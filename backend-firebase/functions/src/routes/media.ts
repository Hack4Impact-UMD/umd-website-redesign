import { Request, Response } from 'express';
import { logger } from 'firebase-functions';
import { RuntimeConfig } from '../config';
import { storage } from '../firebase';
import { sendApiError } from '../utils/http';
import { parsePublicMediaPath } from '../utils/media';

const getMediaPath = (request: Request): string | null => {
  const wildcard = (request.params as Record<string, string | undefined>)[0];
  return wildcard ? parsePublicMediaPath(wildcard) : null;
};

export const createGetMedia = (config: RuntimeConfig) =>
  async (request: Request, response: Response) => {
    const mediaPath = getMediaPath(request);
    if (!mediaPath) {
      sendApiError(response, 400, 'media/invalid-path', 'Invalid media path');
      return;
    }

    const file = storage.bucket(config.firebaseStorageBucket).file(mediaPath);

    try {
      const [exists] = await file.exists();
      if (!exists) {
        sendApiError(response, 404, 'media/not-found', 'Media not found');
        return;
      }

      const [metadata] = await file.getMetadata();
      const contentType = metadata.contentType ?? '';
      if (!contentType.startsWith('image/')) {
        sendApiError(response, 415, 'media/unsupported-type', 'Media is not an image');
        return;
      }

      response.setHeader('Content-Type', contentType);
      response.setHeader('X-Content-Type-Options', 'nosniff');
      if (contentType === 'image/svg+xml') {
        response.setHeader(
          'Content-Security-Policy',
          "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        );
      }
      response.setHeader(
        'Cache-Control',
        metadata.cacheControl || 'public, max-age=31536000, immutable',
      );

      file.createReadStream()
        .on('error', (error) => {
          logger.error('media.read.error', { mediaPath, error: String(error) });
          if (!response.headersSent) {
            sendApiError(response, 500, 'media/read-failed', 'Could not read media');
          } else {
            response.end();
          }
        })
        .pipe(response);
    } catch (error) {
      logger.error('media.read.exception', { mediaPath, error: String(error) });
      sendApiError(response, 500, 'media/read-failed', 'Could not read media');
    }
  };
