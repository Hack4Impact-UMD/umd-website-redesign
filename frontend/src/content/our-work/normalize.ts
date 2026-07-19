import { resolveContentDocument } from '../contracts';
import { defaultOurWorkContent } from './defaults';
import { ourWorkContentSchema } from './types';

export const normalizeOurWorkContent = (document: unknown) =>
  resolveContentDocument(document, ourWorkContentSchema, defaultOurWorkContent);
