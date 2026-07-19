import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';
import { isAbortError } from '@/api/errors';

export type ApiResourceStatus = 'loading' | 'success' | 'error';

interface ApiResourceState<T> {
  data: T | null;
  error: Error | null;
  status: ApiResourceStatus;
}

export const useApiResource = <T>(
  loader: (signal: AbortSignal) => Promise<T>,
  dependencies: DependencyList = [],
) => {
  const [state, setState] = useState<ApiResourceState<T>>({
    data: null,
    error: null,
    status: 'loading',
  });
  const [retryVersion, setRetryVersion] = useState(0);
  const requestId = useRef(0);

  const retry = useCallback(() => setRetryVersion((version) => version + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    const currentRequestId = ++requestId.current;
    setState((current) => ({ ...current, error: null, status: 'loading' }));

    loader(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted && requestId.current === currentRequestId) {
          setState({ data, error: null, status: 'success' });
        }
      })
      .catch((error: unknown) => {
        if (
          !controller.signal.aborted &&
          requestId.current === currentRequestId &&
          !isAbortError(error)
        ) {
          setState({
            data: null,
            error: error instanceof Error ? error : new Error('Unexpected API error'),
            status: 'error',
          });
        }
      });

    return () => controller.abort();
    // Callers provide a stable loader or list every value captured by it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryVersion, ...dependencies]);

  return { ...state, retry };
};
