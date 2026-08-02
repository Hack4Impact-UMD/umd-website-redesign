import { buildCollection, type StorageConfig } from '@firecms/core';

const TEN_MB = 10 * 1024 * 1024;

const baseImageStorage: Omit<StorageConfig, 'storagePath'> = {
  acceptedFiles: ['image/*'],
  maxSize: TEN_MB,
  storeUrl: false,
  imageResize: {
    maxWidth: 2400,
    maxHeight: 2400,
    mode: 'contain',
    format: 'original',
    quality: 85,
  },
  fileName: '{propertyKey}-{rand}.{file.ext}',
};

export const imageProperty = (name: string, storagePath: string) => ({
  dataType: 'string' as const,
  name,
  contentValidation: 'media' as const,
  storage: { ...baseImageStorage, storagePath },
});

type ContentValues = {
  mode?: 'published' | 'placeholder' | 'hidden';
  verifiedAt?: unknown;
  payload?: unknown;
  [key: string]: unknown;
};

type PayloadValidationOptions = {
  optionalPaths?: string[];
  allowEmptyStringPaths?: string[];
};

const serialized = (value: unknown) => JSON.stringify(value ?? null);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const enumIds = (property: Record<string, any>) =>
  Array.isArray(property.enumValues)
    ? property.enumValues.map((entry: unknown) =>
        isRecord(entry) && 'id' in entry ? entry.id : entry,
      )
    : [];

const safeExternalUrl = (value: string, protocols: string[]) => {
  try {
    const url = new URL(value.trim());
    return protocols.includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
};

const safeCtaUrl = (value: string) => {
  const trimmed = value.trim();
  if (/^\/(?!\/)/.test(trimmed)) return !trimmed.includes('\\');
  return safeExternalUrl(trimmed, ['https:', 'mailto:']);
};

const safeMediaUrl = (value: string) => {
  const trimmed = value.trim();
  if (/%2f|%5c/i.test(trimmed) || trimmed.includes('\\') || /\/(?:\.{1,2})(?:\/|$)/.test(trimmed)) {
    return false;
  }
  if (safeExternalUrl(trimmed, ['https:'])) return true;
  if (trimmed.startsWith('/api/media/') || trimmed.startsWith('/assets/') || trimmed.startsWith('/src/')) {
    return true;
  }
  return ['content/', 'projects/', 'members/'].some((root) => trimmed.startsWith(root));
};

const validateConfiguredValue = (
  value: unknown,
  property: Record<string, any>,
  path: string,
  optionalPaths: Set<string>,
  allowEmptyStringPaths: Set<string>,
): string | null => {
  if (value === undefined) {
    return optionalPaths.has(path) ? null : `${path} is required`;
  }
  if (value === null) return `${path} cannot be null`;

  if (property.dataType === 'map') {
    if (!isRecord(value)) return `${path} must be an object`;
    for (const [key, nestedProperty] of Object.entries(property.properties ?? {})) {
      const issue = validateConfiguredValue(
        value[key],
        nestedProperty as Record<string, any>,
        `${path}.${key}`,
        optionalPaths,
        allowEmptyStringPaths,
      );
      if (issue) return issue;
    }
    return null;
  }

  if (property.dataType === 'array') {
    if (!Array.isArray(value)) return `${path} must be an array`;
    const minimum = property.validation?.min;
    const maximum = property.validation?.max;
    if (typeof minimum === 'number' && value.length < minimum) {
      return `${path} must contain at least ${minimum} item${minimum === 1 ? '' : 's'}`;
    }
    if (typeof maximum === 'number' && value.length > maximum) {
      return `${path} must contain at most ${maximum} items`;
    }
    for (const item of value) {
      const issue = validateConfiguredValue(
        item,
        property.of as Record<string, any>,
        `${path}[]`,
        optionalPaths,
        allowEmptyStringPaths,
      );
      if (issue) return issue;
    }
    return null;
  }

  if (property.dataType === 'string') {
    if (typeof value !== 'string') return `${path} must be text`;
    if (!allowEmptyStringPaths.has(path) && value.trim().length === 0) {
      return `${path} cannot be empty`;
    }
    const allowedValues = enumIds(property);
    if (allowedValues.length > 0 && !allowedValues.includes(value)) {
      return `${path} has an unsupported value`;
    }
    if (property.url && !property.contentValidation) {
      try {
        const url = new URL(value.trim());
        if (!['https:', 'mailto:'].includes(url.protocol) || url.username || url.password) {
          return `${path} must be a safe HTTPS or email URL`;
        }
      } catch {
        return `${path} must be a valid URL`;
      }
    }
    if (property.contentValidation === 'cta' && !safeCtaUrl(value)) {
      return `${path} must be a safe internal, HTTPS, or email link`;
    }
    if (property.contentValidation === 'https' && !safeExternalUrl(value, ['https:'])) {
      return `${path} must be a safe HTTPS URL`;
    }
    if (
      property.contentValidation === 'email' &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ) {
      return `${path} must be a valid email address`;
    }
    if (property.contentValidation === 'media' && !safeMediaUrl(value)) {
      return `${path} must be a safe media path or HTTPS URL`;
    }
    return null;
  }

  if (property.dataType === 'boolean' && typeof value !== 'boolean') {
    return `${path} must be true or false`;
  }

  return null;
};

export const validateContentPayload = (
  payload: unknown,
  payloadProperties: Record<string, any>,
  options: PayloadValidationOptions = {},
) => {
  if (!isRecord(payload)) throw new Error('Published content requires a page payload.');
  const optionalPaths = new Set(options.optionalPaths ?? []);
  const allowEmptyStringPaths = new Set(options.allowEmptyStringPaths ?? []);

  for (const [key, property] of Object.entries(payloadProperties)) {
    const issue = validateConfiguredValue(
      payload[key],
      property as Record<string, any>,
      key,
      optionalPaths,
      allowEmptyStringPaths,
    );
    if (issue) throw new Error(`Published payload is invalid: ${issue}.`);
  }
};

const hasSafeOpenApplicationUrl = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') return true;
  const status = (payload as { applicationStatus?: unknown }).applicationStatus;
  if (!status || typeof status !== 'object') return true;
  const values = status as { state?: unknown; applicationUrl?: unknown };
  if (values.state !== 'open') return true;
  if (typeof values.applicationUrl !== 'string') return false;
  try {
    const url = new URL(values.applicationUrl.trim());
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
};

const verificationTime = (value: unknown): number | null => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.getTime();
  if (typeof value === 'string') {
    const time = new Date(value).getTime();
    return value.trim().length > 0 && !Number.isNaN(time) ? time : null;
  }
  if (value && typeof value === 'object' && 'toDate' in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(date.getTime()) ? null : date.getTime();
  }
  return null;
};

export const normalizeContentSave = (
  values: ContentValues,
  previousValues?: ContentValues,
  validatePayload?: (payload: unknown) => void,
): ContentValues => {
  const payloadChanged = serialized(values.payload) !== serialized(previousValues?.payload);

  if (previousValues?.mode === 'published' && values.mode !== 'published') {
    return { ...values, verifiedAt: null };
  }

  if (previousValues?.mode === 'published' && payloadChanged) {
    return { ...values, mode: 'placeholder', verifiedAt: null };
  }

  if (values.mode === 'published') {
    validatePayload?.(values.payload);
    const nextVerification = verificationTime(values.verifiedAt);
    if (nextVerification === null) {
      throw new Error('Published content requires a fresh verification date.');
    }
    const previousVerification = verificationTime(previousValues?.verifiedAt);
    if (previousValues && previousValues.mode !== 'published' && nextVerification === previousVerification) {
      throw new Error('Re-publishing content requires a new verification date.');
    }
    if (!hasSafeOpenApplicationUrl(values.payload)) {
      throw new Error('Open applications require a safe HTTPS application URL.');
    }
  }

  return values;
};

export const buildContentCollection = ({
  id,
  name,
  icon = 'article',
  payloadProperties,
  optionalPayloadPaths = [],
  allowEmptyStringPaths = [],
}: {
  id: string;
  name: string;
  icon?: string;
  payloadProperties: Record<string, any>;
  optionalPayloadPaths?: string[];
  allowEmptyStringPaths?: string[];
}) =>
  buildCollection({
    id,
    name,
    path: id,
    customId: true,
    icon,
    permissions: { read: true, create: false, edit: true, delete: false },
    propertiesOrder: ['mode', 'verifiedAt', 'payload'],
    properties: {
      mode: {
        dataType: 'string',
        name: 'Publication mode',
        description: 'Published uses the verified payload; placeholder uses the frontend default; hidden renders nothing.',
        enumValues: [
          { id: 'placeholder', label: 'Placeholder' },
          { id: 'published', label: 'Published' },
          { id: 'hidden', label: 'Hidden' },
        ],
        defaultValue: 'placeholder',
        validation: { required: true },
      },
      verifiedAt: {
        dataType: 'date',
        name: 'Verified at',
        description: 'Required for published content. Editing an already-published payload clears this value.',
      },
      payload: {
        dataType: 'map',
        name: 'Page content',
        hideFromCollection: true,
        properties: payloadProperties,
      },
    },
    callbacks: {
      onPreSave: ({ values, previousValues }) =>
        normalizeContentSave(
          values as ContentValues,
          previousValues as ContentValues,
          (payload) =>
            validateContentPayload(payload, payloadProperties, {
              optionalPaths: optionalPayloadPaths,
              allowEmptyStringPaths,
            }),
        ),
    },
  });
