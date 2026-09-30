import { getVisiblePages } from '../../utils/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons/Icons';
import styles from './Pagination.module.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav aria-label="Pagination" className={styles.pagination}>
      <button type="button" className={styles.edge} disabled={isFirst} onClick={() => onPageChange(1)}>
        First
      </button>
      <button
        type="button"
        className={styles.arrow}
        aria-label="Previous page"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeftIcon />
      </button>

      <ul className={styles.pages}>
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <li key={page}>
              <button
                type="button"
                className={styles.page}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={styles.arrow}
        aria-label="Next page"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRightIcon />
      </button>
      <button type="button" className={styles.edge} disabled={isLast} onClick={() => onPageChange(totalPages)}>
        Last
      </button>
    </nav>
  );
}
