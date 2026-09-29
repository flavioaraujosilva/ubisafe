import type { PaginatedResult } from '../types/pagination';
import type { Character, CharacterStatus } from '../types/character';
import { api } from './api';

export type CharacterQuery = {
  name?: string;
  status?: CharacterStatus;
  page?: number;
  limit?: number;
};

export async function listCharacters({ name, status, page, limit }: CharacterQuery = {}) {
  const term = name?.trim();

  const { data } = await api.get<PaginatedResult<Character>>('/characters', {
    params: {
      name: term || undefined,
      status: status || undefined,
      page,
      limit,
    },
  });

  return data;
}
