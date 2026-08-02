import { Request, Response } from 'express';
import { logger } from 'firebase-functions';
import { db } from '../firebase';
import { ContentResponse } from '../models';
import { normalizeContentMedia } from '../mappers/content';
import { safeJson, sendApiError } from '../utils/http';
import { RuntimeConfig } from '../config';

const documentMap: Record<string, { collection: string; documentId: string }> = {
  home: { collection: 'content_home', documentId: 'main' },
  about: { collection: 'content_about', documentId: 'main' },
  'our-work': { collection: 'content_our_work', documentId: 'main' },
  'apply/student': { collection: 'content_apply_student', documentId: 'main' },
  'apply/nonprofit': { collection: 'content_apply_nonprofit', documentId: 'main' },
  'site-settings': { collection: 'content_site_settings', documentId: 'main' },
};

const getContentDocument = async <TData>(
  collection: string,
  documentId: string,
): Promise<ContentResponse<TData>> => {
  const snapshot = await db.collection(collection).doc(documentId).get();

  return {
    data: (snapshot.exists ? (snapshot.data() as TData) : null),
    meta: {
      collection,
      documentId,
    },
  };
};

const readContentKey = (request: Request): string => {
  const section = request.params.section;
  const maybeSubsection = request.params.subsection;
  return maybeSubsection ? `${section}/${maybeSubsection}` : section;
};

export const getContent = async (
  request: Request,
  response: Response,
  config: RuntimeConfig,
) => {
  try {
    const contentKey = readContentKey(request);
    const contentConfig = documentMap[contentKey];

    if (!contentConfig) {
      sendApiError(
        response,
        404,
        'content/not-found',
        `Unsupported content section: ${contentKey}`,
      );
      return;
    }

    const payload = await getContentDocument(
      contentConfig.collection,
      contentConfig.documentId,
    );
    const normalizedPayload = {
      ...payload,
      data: normalizeContentMedia(contentKey, payload.data),
    };

    logger.info('content.read', {
      contentKey,
      collection: contentConfig.collection,
      documentId: contentConfig.documentId,
      exists: normalizedPayload.data !== null,
    });

    safeJson(response, normalizedPayload, config);
  } catch (error) {
    logger.error('content.read.error', error as Error);
    sendApiError(response, 500, 'content/read-failed', 'Failed to fetch content');
  }
};
