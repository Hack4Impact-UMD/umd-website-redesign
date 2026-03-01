const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && apiUrl.trim().length > 0) {
    return trimTrailingSlash(apiUrl.trim());
  }

  const legacyRoot = import.meta.env.VITE_ROOT_URL;
  if (legacyRoot && legacyRoot.trim().length > 0) {
    return trimTrailingSlash(legacyRoot.trim());
  }

  return '';
};

const buildUrl = (path: string) => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return path;

  if (path.startsWith('/')) {
    return `${baseUrl}${path}`;
  }

  return `${baseUrl}/${path}`;
};

export const apiGet = async <T>(path: string): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
};
