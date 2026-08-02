const CONTENT_MODES = new Set(['published', 'placeholder', 'hidden']);

const isRecord = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const inspectContentEnvelope = (document) => {
  if (!isRecord(document) || !Object.hasOwn(document, 'mode')) {
    return { valid: false, issue: 'legacy-document' };
  }
  if (!CONTENT_MODES.has(document.mode)) {
    return { valid: false, issue: 'invalid-mode' };
  }
  if (document.mode !== 'published') {
    return { valid: true, mode: document.mode };
  }
  const verifiedAt =
    typeof document.verifiedAt === 'string' ? Date.parse(document.verifiedAt) : Number.NaN;
  if (!Number.isFinite(verifiedAt)) {
    return { valid: false, issue: 'missing-verification' };
  }
  if (!isRecord(document.payload)) {
    return { valid: false, issue: 'invalid-payload' };
  }
  return { valid: true, mode: 'published' };
};
