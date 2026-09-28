import { describe, expect, it } from 'vitest';
import { initialCharacters } from '../src/data/index.js';
import { CHARACTER_STATUSES } from '../src/types/character.js';

describe('initialCharacters', () => {
  it('carrega 100 personagens com ids únicos', () => {
    const ids = new Set(initialCharacters.map((character) => character.id));

    expect(initialCharacters).toHaveLength(100);
    expect(ids.size).toBe(initialCharacters.length);
  });

  it('usa apenas status válidos', () => {
    for (const character of initialCharacters) {
      expect(CHARACTER_STATUSES).toContain(character.status);
    }
  });

  it('segue o formato da Rick and Morty API', () => {
    expect(initialCharacters[0]).toMatchObject({
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      origin: { name: expect.any(String), url: expect.any(String) },
      location: { name: expect.any(String), url: expect.any(String) },
      episode: expect.any(Array),
    });
  });
});
