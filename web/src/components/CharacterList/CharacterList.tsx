import { useState } from 'react';
import { useCharacters } from '../../hooks/useCharacters';
import { CharacterFilters, type AppliedFilters } from '../CharacterFilters/CharacterFilters';
import { PAGE_SIZE_OPTIONS, ListFooter } from '../ListFooter/ListFooter';
import { CharacterTable } from '../CharacterTable/CharacterTable';

export function CharacterList() {
  const [filters, setFilters] = useState<AppliedFilters>({ name: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const { data, isPending, isError } = useCharacters({ ...filters, page: page, limit: pageSize });

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
      ) : (
        <>
          <CharacterTable characters={data.results} />
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
    </>
  );
}
