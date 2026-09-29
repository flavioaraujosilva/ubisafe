import { useDeleteCharacter } from '../../hooks/useCharacterMutations';
import { useToast } from '../../hooks/useToast';
import type { Character } from '../../types/character';
import { Button } from '../Button/Button';
import { WarningIcon } from '../Icons/Icons';
import { Modal } from '../Modal/Modal';
import styles from './DeleteCharacterModal.module.css';

type DeleteCharacterModalProps = {
  character: Character | null;
  onClose: () => void;
};

export function DeleteCharacterModal({ character, onClose }: DeleteCharacterModalProps) {
  const { mutate, isPending } = useDeleteCharacter();
  const { showToast } = useToast();

  function confirm() {
    if (!character) return;

    mutate(character.id, {
      onSuccess: () => showToast('success', 'User successfully deleted.'),
      onError: () => showToast('error', 'Error deleting user.'),
      onSettled: onClose,
    });
  }

  return (
    <Modal
      isOpen={character !== null}
      title="Delete User"
      icon={<span className={styles.icon}><WarningIcon /></span>}
      onClose={onClose}
      actions={
        <>
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirm} disabled={isPending}>
            Delete
          </Button>
        </>
      }
    >
      <p>
        Are you sure you want to delete the user “{character?.name}”? This action cannot be undone.
      </p>
    </Modal>
  );
}
