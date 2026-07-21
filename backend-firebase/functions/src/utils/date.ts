import { Timestamp } from 'firebase-admin/firestore';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const toDate = (value: unknown): Date | null => {
  if (value === null || value === undefined) return null;

  if (value instanceof Timestamp) {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    if (DATE_ONLY_REGEX.test(trimmed)) {
      const date = new Date(`${trimmed}T00:00:00.000Z`);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

export const toIsoDateString = (value: unknown): string | null => {
  const date = toDate(value);
  if (!date) return null;
  return date.toISOString().slice(0, 10);
};

export const toIsoDateTimeString = (value: unknown): string | null => {
  const date = toDate(value);
  return date ? date.toISOString() : null;
};

export const toDateSortKey = (value: unknown): number | null => {
  const date = toDate(value);
  if (!date) return null;
  return date.getTime();
};
