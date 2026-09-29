import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

function renderModal(props: Partial<Parameters<typeof Modal>[0]> = {}) {
  return render(
    <Modal isOpen title="Delete User" actions={<button type="button">Delete</button>} onClose={vi.fn()} {...props}>
      <p>Are you sure?</p>
    </Modal>,
  );
}

describe('Modal', () => {
  it('abre como diálogo nomeado pelo título', () => {
    renderModal();

    const dialogRef = screen.getByRole('dialog', { name: 'Delete User' });
    expect(dialogRef).toHaveAttribute('open');
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('não mostra o conteúdo quando está fechado', () => {
    renderModal({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('fecha quando aberto muda para false', () => {
    const { rerender } = renderModal();

    rerender(
      <Modal isOpen={false} title="Delete User" actions={null} onClose={vi.fn()}>
        <p>Are you sure?</p>
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('pede para fechar com Esc', async () => {
    const handleClose = vi.fn();
    renderModal({ onClose: handleClose });

    screen.getByRole('dialog').dispatchEvent(new Event('cancel', { cancelable: true }));

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('pede para fechar ao clicar fora do conteúdo, mas não dentro dele', async () => {
    const handleClose = vi.fn();
    renderModal({ onClose: handleClose });

    await userEvent.click(screen.getByText('Are you sure?'));
    expect(handleClose).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('dialog'));
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('avisa o fechamento quando o navegador fecha o diálogo aberto', () => {
    const handleClose = vi.fn();
    renderModal({ onClose: handleClose });

    screen.getByRole('dialog').dispatchEvent(new Event('close'));

    expect(handleClose).toHaveBeenCalledOnce();
  });
});
