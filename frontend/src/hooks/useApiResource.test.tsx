import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useApiResource } from './useApiResource';

describe('useApiResource', () => {
  it('exposes loading, error, and a working retry', async () => {
    const loader = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(['ready']);
    const { result } = renderHook(() => useApiResource(loader, []));

    await waitFor(() => expect(result.current.status).toBe('error'));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(['ready']);
  });

  it('aborts superseded requests and ignores stale results', async () => {
    let resolveFirst: (value: string) => void = () => undefined;
    const first = new Promise<string>((resolve) => { resolveFirst = resolve; });
    const loader = vi.fn()
      .mockImplementationOnce(() => first)
      .mockResolvedValueOnce('new');
    const { result, rerender } = renderHook(
      ({ version }) => useApiResource(loader, [version]),
      { initialProps: { version: 1 } },
    );

    rerender({ version: 2 });
    await waitFor(() => expect(result.current.data).toBe('new'));
    await act(async () => resolveFirst('stale'));
    expect(result.current.data).toBe('new');
  });
});
