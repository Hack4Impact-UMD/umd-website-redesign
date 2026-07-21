import { resolveContentDocument } from '../contracts';
import { defaultHomeContent } from './defaults';
import { homeContentSchema } from './types';

export const normalizeHomeContent = (document: unknown) =>
  resolveContentDocument(document, homeContentSchema, defaultHomeContent);
