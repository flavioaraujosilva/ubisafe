import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as service from '../../services/characters';
import { buildCharacter, renderWithQuery } from '../../test/utils';
import { EditCharacterModal } from './EditCharacterModal';

const rick = buildCharacter({ id: 1, name: 'Rick Sanchez' });

describe('EditCharacterModal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('abre com o nome atual preenchido', () => {
    renderWithQuery(<EditCharacterModal character={rick} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: 'Edit User' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Rick Sanchez');
  });

  it('salva o novo nome, avisa o sucesso e fecha', async () => {
    const updateSpy = vi
      .spyOn(service, 'updateCharacterName')
      .mockResolvedValue(buildCharacter({ id: 1, name: 'Rick C-137' }));
    const handleClose = vi.fn();
    renderWithQuery(<EditCharacterModal character={rick} onClose={handleClose} />);

    const input = screen.getByRole('textbox', { name: 'Name' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Rick C-137{Enter}');

    expect(await screen.findByRole('status')).toHaveTextContent('User successfully edited.');
    expect(updateSpy).toHaveBeenCalledWith(1, 'Rick C-137');
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('avisa o erro e fecha quando a edição falha', async () => {
    vi.spyOn(service, 'updateCharacterName').mockRejectedValue(new Error('Network Error'));
    const handleClose = vi.fn();
    renderWithQuery(<EditCharacterModal character={rick} onClose={handleClose} />);

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Error editing user.');
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('não deixa salvar nome em branco', async () => {
    const updateSpy = vi.spyOn(service, 'updateCharacterName');
    renderWithQuery(<EditCharacterModal character={rick} onClose={vi.fn()} />);

    const input = screen.getByRole('textbox', { name: 'Name' });
    await userEvent.clear(input);
    await userEvent.type(input, '   {Enter}');

    expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('limita o nome a 100 caracteres, como a API', () => {
    renderWithQuery(<EditCharacterModal character={rick} onClose={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('maxlength', '100');
  });

  it('cancela sem salvar', async () => {
    const updateSpy = vi.spyOn(service, 'updateCharacterName');
    const handleClose = vi.fn();
    renderWithQuery(<EditCharacterModal character={rick} onClose={handleClose} />);

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleClose).toHaveBeenCalledOnce();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('recarrega o nome quando abre para outro personagem', () => {
    const { rerender } = renderWithQuery(<EditCharacterModal character={rick} onClose={vi.fn()} />);

    rerender(<EditCharacterModal character={buildCharacter({ id: 2, name: 'Morty Smith' })} onClose={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Morty Smith');
  });
});
