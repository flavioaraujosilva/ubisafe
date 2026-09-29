import { useId, useState, type FormEvent } from 'react';
import { useUpdateCharacterName } from '../../hooks/useCharacterMutations';
import { useToast } from '../../hooks/useToast';
import type { Character } from '../../types/character';
import { Button } from '../Button/Button';
import { SearchIcon } from '../Icons/Icons';
import { Modal } from '../Modal/Modal';
import styles from './EditCharacterModal.module.css';

const MAX_NAME_LENGTH = 100;

type EditCharacterModalProps = {
  character: Character | null;
  onClose: () => void;
};

export function EditCharacterModal({ character, onClose }: EditCharacterModalProps) {
  const [name, setName] = useState(character?.name ?? '');
  const [previousCharacter, setPreviousCharacter] = useState(character);
  const { mutate, isPending } = useUpdateCharacterName();
  const { showToast } = useToast();
  const formId = useId();

  if (character !== previousCharacter) {
    setPreviousCharacter(character);
    setName(character?.name ?? '');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!character || !name.trim()) return;

    mutate(
      { id: character.id, name },
      {
        onSuccess: () => showToast('success', 'User successfully edited.'),
        onError: () => showToast('error', 'Error editing user.'),
        onSettled: onClose,
      },
    );
  }

  return (
    <Modal
      isOpen={character !== null}
      title="Edit User"
      onClose={onClose}
      actions={
        <>
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={isPending || !name.trim()}>
            Edit
          </Button>
        </>
      }
    >
      <form id={formId} className={styles.field} onSubmit={handleSubmit}>
        <SearchIcon />
        <input
          aria-label="Name"
          value={name}
          maxLength={MAX_NAME_LENGTH}
          autoComplete="off"
          onChange={(event) => setName(event.target.value)}
        />
      </form>
    </Modal>
  );
}
