const CONTENT_MODES = new Set(['published', 'placeholder', 'hidden']);

const CONTENT_PAYLOAD_SHAPES = {
  home: {
    hero: 'record',
    impact: 'record',
    nonprofitMap: 'record',
    testimonials: 'record',
    newsletter: 'record',
    sponsors: 'record',
    cta: 'record',
  },
  about: {
    header: 'record',
    mission: 'record',
    values: 'record',
    currentProjects: 'record',
  },
  'our-work': { header: 'record' },
  'apply/student': {
    applicationStatus: 'record',
    hero: 'record',
    intro: 'record',
    roles: 'array',
    timeline: 'record',
    testimonials: 'array',
    faq: 'record',
    cta: 'record',
  },
  'apply/nonprofit': {
    applicationStatus: 'record',
    hero: 'record',
    intro: 'record',
    criteria: 'record',
    timeline: 'record',
    testimonials: 'array',
    faq: 'record',
    cta: 'record',
  },
  'site-settings': {
    navbar: 'record',
    footer: 'record',
    branding: 'record',
  },
};

export const CONTENT_SECTIONS = Object.freeze(Object.keys(CONTENT_PAYLOAD_SHAPES));

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

export const inspectContentDocument = (section, document) => {
  const expectedShape = CONTENT_PAYLOAD_SHAPES[section];
  if (!expectedShape) return { valid: false, issue: 'unsupported-section' };

  const envelope = inspectContentEnvelope(document);
  if (!envelope.valid || envelope.mode !== 'published') return envelope;

  for (const [key, expectedType] of Object.entries(expectedShape)) {
    const value = document.payload[key];
    const valid = expectedType === 'array' ? Array.isArray(value) : isRecord(value);
    if (!valid) return { valid: false, issue: 'invalid-payload', path: key };
  }
  return envelope;
};
