import { useState } from 'react';
import { useCharacters } from '../../hooks/useCharacters';
import { CharacterFilters, type AppliedFilters } from '../CharacterFilters/CharacterFilters';
import { CharacterTable } from '../CharacterTable/CharacterTable';

const PAGE_SIZE = 15;

export function CharacterList() {
  const [filters, setFilters] = useState<AppliedFilters>({ name: '' });
  const { data, isPending, isError } = useCharacters({ ...filters, page: 1, limit: PAGE_SIZE });

  return (
    <>
      <CharacterFilters onFilter={setFilters} />

      {isPending ? (
        <p role="status">Loading users...</p>
      ) : isError ? (
        <p role="alert">Could not load users.</p>
      ) : (
        <CharacterTable characters={data.results} />
      )}
    </>
  );
}
