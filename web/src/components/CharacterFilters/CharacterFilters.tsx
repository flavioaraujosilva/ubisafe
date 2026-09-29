import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { CHARACTER_STATUSES, type CharacterStatus } from '../../types/character';
import { Button } from '../Button/Button';
import styles from './CharacterFilters.module.css';

export type AppliedFilters = {
  name: string;
  status?: CharacterStatus;
};

type CharacterFiltersProps = {
  onFilter: (filters: AppliedFilters) => void;
  debounceMs?: number;
};

const STATUS_LABELS: Record<CharacterStatus, string> = {
  Alive: 'Alive',
  Dead: 'Dead',
  unknown: 'Unknown',
};

export function CharacterFilters({ onFilter, debounceMs = 400 }: CharacterFiltersProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<CharacterStatus | ''>('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const nameId = useId();
  const statusId = useId();

  useEffect(() => () => clearTimeout(timer.current), []);

  function apply(nextName: string, nextStatus: CharacterStatus | '') {
    clearTimeout(timer.current);
    onFilter({ name: nextName.trim(), status: nextStatus || undefined });
  }

  function handleNameChange(value: string) {
    setName(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => apply(value, status), debounceMs);
  }

  function handleStatusChange(value: CharacterStatus | '') {
    setStatus(value);
    apply(name, value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    apply(name, status);
  }

  return (
    <form className={styles.filters} role="search" aria-label="Filter users" onSubmit={handleSubmit}>
      <div className={`${styles.field} ${styles.nameField}`}>
        <label htmlFor={nameId}>Name</label>
        <input
          id={nameId}
          type="search"
          autoComplete="off"
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
        />
      </div>

      <div className={`${styles.field} ${styles.statusField}`}>
        <label htmlFor={statusId}>Status</label>
        <select
          id={statusId}
          value={status}
          onChange={(event) => handleStatusChange(event.target.value as CharacterStatus | '')}
        >
          <option value="">All</option>
          {CHARACTER_STATUSES.map((option) => (
            <option key={option} value={option}>
              {STATUS_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit">Search</Button>
    </form>
  );
}
