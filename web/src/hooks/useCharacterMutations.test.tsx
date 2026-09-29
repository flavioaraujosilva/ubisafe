import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as service from '../services/characters';
import { buildCharacter } from '../test/utils';
import { useUpdateCharacterName, useDeleteCharacter } from './useCharacterMutations';

function createTestEnv() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { invalidateSpy, wrapper };
}

describe('useUpdateCharacterName', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('edita o nome e recarrega a listagem', async () => {
    const updateSpy = vi
      .spyOn(service, 'updateCharacterName')
      .mockResolvedValue(buildCharacter({ id: 1, name: 'Rick C-137' }));
    const { invalidateSpy, wrapper } = createTestEnv();
    const { result } = renderHook(() => useUpdateCharacterName(), { wrapper });

    result.current.mutate({ id: 1, name: 'Rick C-137' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateSpy).toHaveBeenCalledWith(1, 'Rick C-137');
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['characters'] });
  });

  it('não recarrega a listagem quando a edição falha', async () => {
    vi.spyOn(service, 'updateCharacterName').mockRejectedValue(new Error('Network Error'));
    const { invalidateSpy, wrapper } = createTestEnv();
    const { result } = renderHook(() => useUpdateCharacterName(), { wrapper });

    result.current.mutate({ id: 1, name: 'Rick' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});

describe('useDeleteCharacter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exclui e recarrega a listagem', async () => {
    const deleteSpy = vi.spyOn(service, 'deleteCharacter').mockResolvedValue();
    const { invalidateSpy, wrapper } = createTestEnv();
    const { result } = renderHook(() => useDeleteCharacter(), { wrapper });

    result.current.mutate(7);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteSpy.mock.calls[0]![0]).toBe(7);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['characters'] });
  });
});
