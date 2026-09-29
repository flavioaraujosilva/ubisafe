import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from './api';
import { listCharacters } from './characters';

const emptyResponse = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
};

describe('listCharacters', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('busca em /personagens repassando os filtros', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValue({ data: emptyResponse });

    const result = await listCharacters({ name: 'rick', status: 'Alive', page: 2, limit: 10 });

    expect(get).toHaveBeenCalledWith('/characters', {
      params: { name: 'rick', status: 'Alive', page: 2, limit: 10 },
    });
    expect(result).toEqual(emptyResponse);
  });

  it('não envia nome em branco nem status vazio', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValue({ data: emptyResponse });

    await listCharacters({ name: '   ', page: 1 });

    expect(get).toHaveBeenCalledWith('/characters', {
      params: { name: undefined, status: undefined, page: 1, limit: undefined },
    });
  });

  it('remove espaços nas pontas do nome', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValue({ data: emptyResponse });

    await listCharacters({ name: '  morty ' });

    expect(get.mock.calls[0]![1]!.params).toMatchObject({ name: 'morty' });
  });

  it('propaga o erro da requisição', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Network Error'));

    await expect(listCharacters()).rejects.toThrow('Network Error');
  });
});
