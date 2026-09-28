import type { PaginatedResult } from '../types/pagination.js';
import type { Character, CharacterStatus } from '../types/character.js';

export type CharacterQuery = {
  name?: string;
  status?: CharacterStatus;
  page: number;
  limit: number;
};

export function createCharacterRepository(seed: Character[]) {
  const characters = structuredClone(seed);

  function list({ name, status, page, limit }: CharacterQuery): PaginatedResult<Character> {
    const term = name?.trim().toLowerCase();

    const filtered = characters.filter(
      (character) =>
        (!term || character.name.toLowerCase().includes(term)) &&
        (!status || character.status === status),
    );

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return {
      info: {
        count: total,
        pages: totalPages,
        next: page < totalPages ? page + 1 : null,
        prev: page > 1 && page <= totalPages ? page - 1 : null,
      },
      results: filtered.slice(start, start + limit),
    };
  }

  return { list };
}

export type CharacterRepository = ReturnType<typeof createCharacterRepository>;
