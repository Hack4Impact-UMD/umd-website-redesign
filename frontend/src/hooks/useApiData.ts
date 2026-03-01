import { useEffect, useMemo, useState } from 'react';

interface UseApiDataState<T> {
  data: T;
  loaded: boolean;
  error: string | null;
}

export const useApiData = <T>(
  loader: () => Promise<T | null>,
  fallbackData: T,
): UseApiDataState<T> => {
  const [data, setData] = useState<T>(fallbackData);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const result = await loader();
        if (!isMounted) return;

        if (result !== null) {
          setData(result);
        }
      } catch (loadError) {
        if (!isMounted) return;
        setError(
          loadError instanceof Error ? loadError.message : 'Unexpected API error',
        );
      } finally {
        if (isMounted) {
          setLoaded(true);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [loader]);

  return useMemo(
    () => ({ data, loaded, error }),
    [data, error, loaded],
  );
};
