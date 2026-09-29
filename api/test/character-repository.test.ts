import { describe, expect, it } from 'vitest';
import { createCharacterRepository } from '../src/repositories/characters.js';
import type { Character } from '../src/types/character.js';

function buildCharacter(input: Partial<Character> & Pick<Character, 'id' | 'name'>): Character {
  return {
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: '',
    episode: [],
    url: '',
    created: '2017-11-04T18:48:46.250Z',
    ...input,
  };
}

const characters = [
  buildCharacter({ id: 1, name: 'Rick Sanchez' }),
  buildCharacter({ id: 2, name: 'Morty Smith' }),
  buildCharacter({ id: 3, name: 'Summer Smith', status: 'Dead' }),
  buildCharacter({ id: 4, name: 'Beth Smith', status: 'unknown' }),
  buildCharacter({ id: 5, name: 'Jerry Smith', status: 'Dead' }),
];

describe('createCharacterRepository', () => {
  describe('list', () => {
    it('pagina os resultados', () => {
      const repository = createCharacterRepository(characters);

      const result = repository.list({ page: 2, limit: 2 });

      expect(result.results.map((p) => p.id)).toEqual([3, 4]);
      expect(result.info).toEqual({ count: 5, pages: 3, next: 3, prev: 1 });
    });

    it('retorna next nulo na última página e prev nulo na primeira', () => {
      const repository = createCharacterRepository(characters);

      expect(repository.list({ page: 1, limit: 2 }).info.prev).toBeNull();
      expect(repository.list({ page: 3, limit: 2 }).info.next).toBeNull();
    });

    it('filtra por nome sem diferenciar maiúsculas e ignorando espaços nas pontas', () => {
      const repository = createCharacterRepository(characters);

      const result = repository.list({ name: '  SMITH ', page: 1, limit: 10 });

      expect(result.results.map((p) => p.id)).toEqual([2, 3, 4, 5]);
      expect(result.info.count).toBe(4);
    });

    it('filtra por status', () => {
      const repository = createCharacterRepository(characters);

      const result = repository.list({ status: 'Dead', page: 1, limit: 10 });

      expect(result.results.map((p) => p.id)).toEqual([3, 5]);
    });

    it('combina filtro de nome e status', () => {
      const repository = createCharacterRepository(characters);

      const result = repository.list({ name: 'smith', status: 'unknown', page: 1, limit: 10 });

      expect(result.results.map((p) => p.id)).toEqual([4]);
    });

    it('retorna lista vazia quando nada corresponde ao filtro', () => {
      const repository = createCharacterRepository(characters);

      const result = repository.list({ name: 'Birdperson', page: 1, limit: 10 });

      expect(result).toEqual({ info: { count: 0, pages: 0, next: null, prev: null }, results: [] });
    });

    it('retorna lista vazia para página além do total', () => {
      const repository = createCharacterRepository(characters);

      const result = repository.list({ page: 10, limit: 2 });

      expect(result.results).toEqual([]);
      expect(result.info).toEqual({ count: 5, pages: 3, next: null, prev: null });
    });

    it('não altera a lista original recebida', () => {
      const original = [buildCharacter({ id: 1, name: 'Rick Sanchez' })];
      const repository = createCharacterRepository(original);

      repository.list({ page: 1, limit: 10 }).results[0]!.name = 'Alterado';

      expect(original[0]!.name).toBe('Rick Sanchez');
    });
  });

  describe('updateName', () => {
    it('altera o nome e devolve o personagem atualizado', () => {
      const repository = createCharacterRepository(characters);

      const updated = repository.updateName(2, 'Morty Jr.');

      expect(updated).toMatchObject({ id: 2, name: 'Morty Jr.' });
      expect(repository.list({ name: 'morty jr', page: 1, limit: 10 }).results).toHaveLength(1);
    });

    it('retorna undefined quando o personagem não existe', () => {
      const repository = createCharacterRepository(characters);

      expect(repository.updateName(999, 'Ninguém')).toBeUndefined();
    });

    it('não altera a lista original recebida', () => {
      const repository = createCharacterRepository(characters);

      repository.updateName(1, 'Outro Rick');

      expect(characters[0]!.name).toBe('Rick Sanchez');
    });
  });
});
