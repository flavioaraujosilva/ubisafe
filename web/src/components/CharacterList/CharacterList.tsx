import { useState } from 'react';
import { useCharacters } from '../../hooks/useCharacters';
import type { Character } from '../../types/character';
import { CharacterFilters, type AppliedFilters } from '../CharacterFilters/CharacterFilters';
import { PAGE_SIZE_OPTIONS, ListFooter } from '../ListFooter/ListFooter';
import { CharacterTable } from '../CharacterTable/CharacterTable';
import { DeleteCharacterModal } from '../DeleteCharacterModal/DeleteCharacterModal';
import { EditCharacterModal } from '../EditCharacterModal/EditCharacterModal';
import styles from './CharacterList.module.css';

export function CharacterList() {
  const [filters, setFilters] = useState<AppliedFilters>({ name: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [characterToEdit, setCharacterToEdit] = useState<Character | null>(null);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const { data, isPending, isError } = useCharacters({ ...filters, page, limit: pageSize });

  if (data && data.info.pages > 0 && page > data.info.pages) {
    setPage(data.info.pages);
  }

  function handleFilter(nextFilters: AppliedFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function changePageSize(size: number) {
    setPageSize(size);
    setPage(1);
  }

  return (
    <>
      <CharacterFilters onFilter={handleFilter} />

      {isPending ? (
        <p role="status">Loading users...</p>
      ) : isError ? (
        <p role="alert">Could not load users.</p>
      ) : data.info.count === 0 ? (
        <div role="status" className={styles.message}>
          <strong>No users found.</strong>
          <span>Try another name or status.</span>
        </div>
      ) : (
        <>
          <CharacterTable
            characters={data.results}
            onEdit={setCharacterToEdit}
            onDelete={setCharacterToDelete}
          />
          <ListFooter
            currentPage={page}
            totalPages={data.info.pages}
            totalItems={data.info.count}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={changePageSize}
          />
        </>
      )}

      <EditCharacterModal character={characterToEdit} onClose={() => setCharacterToEdit(null)} />
      <DeleteCharacterModal character={characterToDelete} onClose={() => setCharacterToDelete(null)} />
    </>
  );
}
