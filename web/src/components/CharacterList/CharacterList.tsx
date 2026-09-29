import { useCharacters } from '../../hooks/useCharacters';
import { CharacterTable } from '../CharacterTable/CharacterTable';

const PAGE_SIZE = 15;

export function CharacterList() {
  const { data, isPending, isError } = useCharacters({ page: 1, limit: PAGE_SIZE });

  if (isPending) {
    return <p role="status">Loading users...</p>;
  }

  if (isError) {
    return <p role="alert">Could not load users.</p>;
  }

  return <CharacterTable characters={data.results} />;
}
