import { useEffect, useRef, useState } from 'react';
import { useCharacters } from '../../hooks/useCharacters';
import type { Character } from '../../types/character';
import { Button } from '../Button/Button';
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
  const tableRef = useRef<HTMLDivElement>(null);
  const focusTableAfterDelete = useRef(false);
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = useCharacters({ ...filters, page, limit: pageSize });

  if (data && data.info.pages > 0 && page > data.info.pages) {
    setPage(data.info.pages);
  }

  useEffect(() => {
    if (characterToDelete || !focusTableAfterDelete.current) return;

    focusTableAfterDelete.current = false;
    tableRef.current?.focus();
  }, [characterToDelete]);

  function handleFilter(nextFilters: AppliedFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function changePageSize(size: number) {
    setPageSize(size);
    setPage(1);
  }

  const hasResults = !isError && data !== undefined && data.info.count > 0;

  return (
    <div className={styles.list}>
      <div className={styles.scrollArea}>
        <CharacterFilters onFilter={handleFilter} />

        {isPending ? (
          <div role="status" className={styles.message}>
            <span className={styles.spinner} aria-hidden="true" />
            <span>Loading users...</span>
          </div>
        ) : isError ? (
          <div role="alert" className={styles.message}>
            <strong>Could not load users.</strong>
            <span>Check your connection and try again.</span>
            <Button className={styles.retry} onClick={() => refetch()} disabled={isFetching}>
              Try again
            </Button>
          </div>
        ) : !hasResults ? (
          <div role="status" className={styles.message}>
            <strong>No users found.</strong>
            <span>Try another name or status.</span>
          </div>
        ) : (
          <div className={styles.results} aria-busy={isPlaceholderData}>
            <CharacterTable
              ref={tableRef}
              characters={data.results}
              onEdit={setCharacterToEdit}
              onDelete={setCharacterToDelete}
              activeCharacterId={(characterToEdit ?? characterToDelete)?.id}
            />
          </div>
        )}
      </div>

      {hasResults && (
        <ListFooter
          currentPage={page}
          totalPages={data.info.pages}
          totalItems={data.info.count}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={changePageSize}
        />
      )}

      <EditCharacterModal character={characterToEdit} onClose={() => setCharacterToEdit(null)} />
      <DeleteCharacterModal
        character={characterToDelete}
        onClose={() => setCharacterToDelete(null)}
        onDeleted={() => {
          focusTableAfterDelete.current = true;
        }}
      />
    </div>
  );
}
