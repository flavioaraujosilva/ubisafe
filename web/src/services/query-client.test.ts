import { describe, expect, it } from 'vitest';
import { createQueryClient } from './query-client';

describe('createQueryClient', () => {
  it('tenta de novo uma vez, não recarrega ao focar a janela e mantém os dados por 30s', () => {
    const queries = createQueryClient().getDefaultOptions().queries;

    expect(queries).toMatchObject({ retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 });
  });

  it('cria um cliente novo a cada chamada', () => {
    expect(createQueryClient()).not.toBe(createQueryClient());
  });
});
