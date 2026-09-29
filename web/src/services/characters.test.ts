import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from './api';
import { buildCharacter } from '../test/utils';
import { updateCharacterName, deleteCharacter, listCharacters } from './characters';

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

describe('updateCharacterName', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('envia o nome sem espaços nas pontas e devolve o personagem atualizado', async () => {
    const updated = buildCharacter({ id: 1, name: 'Rick C-137' });
    const patch = vi.spyOn(api, 'patch').mockResolvedValue({ data: updated });

    const result = await updateCharacterName(1, '  Rick C-137 ');

    expect(patch).toHaveBeenCalledWith('/characters/1', { name: 'Rick C-137' });
    expect(result).toEqual(updated);
  });
});

describe('deleteCharacter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('chama o DELETE do personagem', async () => {
    const remove = vi.spyOn(api, 'delete').mockResolvedValue({ data: '' });

    await deleteCharacter(7);

    expect(remove).toHaveBeenCalledWith('/characters/7');
  });

  it('propaga o erro da requisição', async () => {
    vi.spyOn(api, 'delete').mockRejectedValue(new Error('Request failed with status code 404'));

    await expect(deleteCharacter(999)).rejects.toThrow('404');
  });
});
