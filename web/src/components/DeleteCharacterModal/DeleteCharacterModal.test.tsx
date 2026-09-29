import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as service from '../../services/characters';
import { buildCharacter, renderWithQuery } from '../../test/utils';
import { DeleteCharacterModal } from './DeleteCharacterModal';

const rick = buildCharacter({ id: 1, name: 'Rick Sanchez' });

describe('DeleteCharacterModal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pede confirmação citando o nome do personagem', () => {
    renderWithQuery(<DeleteCharacterModal character={rick} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: 'Delete User' })).toHaveTextContent(
      'Are you sure you want to delete the user “Rick Sanchez”? This action cannot be undone.',
    );
  });

  it('não abre sem personagem selecionado', () => {
    renderWithQuery(<DeleteCharacterModal character={null} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('exclui, avisa o sucesso e fecha', async () => {
    const deleteSpy = vi.spyOn(service, 'deleteCharacter').mockResolvedValue();
    const handleClose = vi.fn();
    renderWithQuery(<DeleteCharacterModal character={rick} onClose={handleClose} />);

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(await screen.findByRole('status')).toHaveTextContent('User successfully deleted.');
    expect(deleteSpy.mock.calls[0]![0]).toBe(1);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('avisa o erro e fecha quando a exclusão falha', async () => {
    vi.spyOn(service, 'deleteCharacter').mockRejectedValue(new Error('Network Error'));
    const handleClose = vi.fn();
    renderWithQuery(<DeleteCharacterModal character={rick} onClose={handleClose} />);

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Error deleting user.');
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('cancela sem excluir', async () => {
    const deleteSpy = vi.spyOn(service, 'deleteCharacter');
    const handleClose = vi.fn();
    renderWithQuery(<DeleteCharacterModal character={rick} onClose={handleClose} />);

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleClose).toHaveBeenCalledOnce();
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});
