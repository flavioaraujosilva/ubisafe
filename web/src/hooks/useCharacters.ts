import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listCharacters, type CharacterQuery } from '../services/characters';

export function useCharacters(filters: CharacterQuery) {
  return useQuery({
    queryKey: ['characters', filters],
    queryFn: () => listCharacters(filters),
    placeholderData: keepPreviousData,
  });
}
