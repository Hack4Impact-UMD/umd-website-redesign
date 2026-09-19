import { resolveContentDocument } from '../contracts';
import { defaultAboutContent } from './defaults';
import { aboutContentSchema } from './types';

export const normalizeAboutContent = (document: unknown) =>
  resolveContentDocument(document, aboutContentSchema, defaultAboutContent);
