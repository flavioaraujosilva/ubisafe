import { getRange } from '../../utils/pagination';
import { Pagination } from '../Pagination/Pagination';
import styles from './ListFooter.module.css';

export const PAGE_SIZE_OPTIONS = [15, 30, 50];

type ListFooterProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function ListFooter({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ListFooterProps) {
  const { start, end } = getRange(currentPage, pageSize, totalItems);

  return (
    <div className={styles.footer}>
      <p className={styles.results} aria-live="polite">
        Showing results{' '}
        <strong>
          {start}-{end} of {totalItems}
        </strong>
      </p>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

      <div className={styles.perPage}>
        <span aria-hidden="true">See</span>
        <select
          aria-label="Users per page"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span aria-hidden="true">per page</span>
      </div>
    </div>
  );
}
