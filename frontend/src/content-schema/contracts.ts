import { z, type ZodType, type ZodTypeDef } from 'zod';

export const contentModeSchema = z.enum(['published', 'placeholder', 'hidden']);
export type ContentMode = z.infer<typeof contentModeSchema>;

export interface ContentDocument<T> {
  mode?: ContentMode;
  verifiedAt?: unknown;
  payload?: T;
}

export interface ResolvedContent<T> {
  content: T | null;
  mode: ContentMode;
  source: 'published' | 'placeholder' | 'hidden';
  verifiedAt?: string;
  issue?: 'legacy-document' | 'missing-verification' | 'invalid-payload';
}

const toVerifiedIso = (value: unknown) => {
  if (typeof value !== 'string' && !(value instanceof Date)) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

/**
 * The schema's input type is deliberately left open rather than pinned to `T`.
 * Payload schemas carry `.default()`s for keys that legacy documents predate,
 * which makes their parsed output narrower than their accepted input; tying
 * both ends to one parameter would infer `T` from the loose input side and
 * hand every caller a half-optional content type.
 */
export const resolveContentDocument = <T>(
  document: unknown,
  payloadSchema: ZodType<T, ZodTypeDef, unknown>,
  placeholder: T,
): ResolvedContent<T> => {
  if (!document || typeof document !== 'object' || !('mode' in document)) {
    return {
      content: placeholder,
      mode: 'placeholder',
      source: 'placeholder',
      issue: 'legacy-document',
    };
  }

  const candidate = document as ContentDocument<unknown>;
  const mode = contentModeSchema.safeParse(candidate.mode);
  if (!mode.success || mode.data === 'placeholder') {
    return { content: placeholder, mode: 'placeholder', source: 'placeholder' };
  }
  if (mode.data === 'hidden') {
    return { content: null, mode: 'hidden', source: 'hidden' };
  }

  const verifiedAt = toVerifiedIso(candidate.verifiedAt);
  if (!verifiedAt) {
    return {
      content: placeholder,
      mode: 'placeholder',
      source: 'placeholder',
      issue: 'missing-verification',
    };
  }

  const payload = payloadSchema.safeParse(candidate.payload);
  if (!payload.success) {
    return {
      content: placeholder,
      mode: 'placeholder',
      source: 'placeholder',
      issue: 'invalid-payload',
    };
  }

  return { content: payload.data, mode: 'published', source: 'published', verifiedAt };
};
