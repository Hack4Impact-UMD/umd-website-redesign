import { resolveContentDocument } from '../contracts';
import { defaultApplyNonprofitContent, defaultApplyStudentContent } from './defaults';
import { applyNonprofitContentSchema, applyStudentContentSchema } from './types';

export const normalizeApplyStudentContent = (document: unknown) =>
  resolveContentDocument(document, applyStudentContentSchema, defaultApplyStudentContent);

export const normalizeApplyNonprofitContent = (document: unknown) =>
  resolveContentDocument(document, applyNonprofitContentSchema, defaultApplyNonprofitContent);
