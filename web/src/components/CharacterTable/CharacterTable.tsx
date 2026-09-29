import type { Character } from '../../types/character';
import { formatDate } from '../../utils/format';
import { TrashIcon } from '../Icons/Icons';
import styles from './CharacterTable.module.css';

type CharacterTableProps = {
  characters: Character[];
  onDelete: (character: Character) => void;
};

export function CharacterTable({ characters, onDelete }: CharacterTableProps) {
  return (
    <div className={styles.scroll} role="region" aria-label="Users table" tabIndex={0}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Specie</th>
            <th scope="col">Episodes</th>
            <th scope="col">Origin</th>
            <th scope="col">Created at</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((character) => (
            <tr key={character.id}>
              <td title={character.name}>{character.name}</td>
              <td>{character.status}</td>
              <td>{character.species}</td>
              <td>{character.episode.length}</td>
              <td title={character.origin.name}>{character.origin.name}</td>
              <td className={styles.lastCell}>
                {formatDate(character.created)}
                <button
                  type="button"
                  className={styles.deleteButton}
                  aria-label={`Delete ${character.name}`}
                  onClick={() => onDelete(character)}
                >
                  <TrashIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
