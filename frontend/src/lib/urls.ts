const INTERNAL_PATH = /^\/(?!\/)/;

export const isSafeCtaUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (INTERNAL_PATH.test(trimmed)) return !trimmed.includes('\\');

  try {
    const url = new URL(trimmed);
    return (
      (url.protocol === 'https:' || url.protocol === 'mailto:') &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
};

export const isSafeHttpsUrl = (value: string) => {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
};
