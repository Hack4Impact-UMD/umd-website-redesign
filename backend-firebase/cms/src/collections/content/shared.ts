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
  storage: { ...baseImageStorage, storagePath },
});

type ContentValues = {
  mode?: 'published' | 'placeholder' | 'hidden';
  verifiedAt?: unknown;
  payload?: unknown;
  [key: string]: unknown;
};

const serialized = (value: unknown) => JSON.stringify(value ?? null);

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
): ContentValues => {
  const payloadChanged = serialized(values.payload) !== serialized(previousValues?.payload);

  if (previousValues?.mode === 'published' && values.mode !== 'published') {
    return { ...values, verifiedAt: null };
  }

  if (previousValues?.mode === 'published' && payloadChanged) {
    return { ...values, mode: 'placeholder', verifiedAt: null };
  }

  if (values.mode === 'published') {
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
}: {
  id: string;
  name: string;
  icon?: string;
  payloadProperties: Record<string, any>;
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
        normalizeContentSave(values as ContentValues, previousValues as ContentValues),
    },
  });
