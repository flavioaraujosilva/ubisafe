import { useEffect, useId, useRef, type ReactNode } from 'react';
import styles from './Modal.module.css';

type ModalProps = {
  isOpen: boolean;
  title: string;
  icon?: ReactNode;
  actions: ReactNode;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, title, icon, actions, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;

    if (isOpen && !element.open) element.showModal();
    if (!isOpen && element.open) element.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (isOpen) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {isOpen && (
        <div className={styles.content}>
          <h2 id={titleId} className={styles.title}>
            {icon && <span className={styles.icon}>{icon}</span>}
            {title}
          </h2>
          <div className={styles.body}>{children}</div>
          <div className={styles.actions}>{actions}</div>
        </div>
      )}
    </dialog>
  );
}
