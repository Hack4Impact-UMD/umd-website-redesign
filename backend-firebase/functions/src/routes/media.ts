import { Request, Response } from 'express';
import { logger } from 'firebase-functions';
import { storage } from '../firebase';
import { runtimeConfig } from '../config';
import { sendApiError } from '../utils/http';

const getMediaPath = (request: Request): string | null => {
  const wildcard = (request.params as Record<string, string | undefined>)[0];
  if (!wildcard) return null;

  const decoded = decodeURIComponent(wildcard).trim();
  if (!decoded || decoded.startsWith('/') || decoded.includes('..')) {
    return null;
  }

  return decoded;
};

export const getMedia = async (request: Request, response: Response) => {
  const mediaPath = getMediaPath(request);
  if (!mediaPath) {
    sendApiError(response, 400, 'media/invalid-path', 'Invalid media path');
    return;
  }

  const bucket = runtimeConfig.firebaseStorageBucket
    ? storage.bucket(runtimeConfig.firebaseStorageBucket)
    : storage.bucket();
  const file = bucket.file(mediaPath);

  try {
    const [exists] = await file.exists();
    if (!exists) {
      sendApiError(response, 404, 'media/not-found', 'Media not found');
      return;
    }

    const [metadata] = await file.getMetadata();
    if (metadata.contentType) {
      response.setHeader('Content-Type', metadata.contentType);
    }
    response.setHeader(
      'Cache-Control',
      metadata.cacheControl || 'public, max-age=31536000, immutable',
    );

    file.createReadStream()
      .on('error', (error) => {
        logger.error('media.read.error', {
          mediaPath,
          error: String(error),
        });
        if (!response.headersSent) {
          sendApiError(response, 500, 'media/read-failed', 'Could not read media');
        } else {
          response.end();
        }
      })
      .pipe(response);
  } catch (error) {
    logger.error('media.read.exception', {
      mediaPath,
      error: String(error),
    });
    sendApiError(response, 500, 'media/read-failed', 'Could not read media');
  }
};
