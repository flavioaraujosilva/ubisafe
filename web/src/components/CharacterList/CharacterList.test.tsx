import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as service from '../../services/characters';
import { buildCharacter, renderWithQuery } from '../../test/utils';
import { CharacterList } from './CharacterList';

describe('CharacterList', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('busca a primeira página com 15 itens e exibe os personagens', async () => {
    const list = vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [buildCharacter({ id: 1, name: 'Rick Sanchez' })],
    });

    renderWithQuery(<CharacterList />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading users...');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(list).toHaveBeenCalledWith({ name: '', page: 1, limit: 15 });
  });

  it('exibe mensagem de erro quando a API falha', async () => {
    vi.spyOn(service, 'listCharacters').mockRejectedValue(new Error('Network Error'));

    renderWithQuery(<CharacterList />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load users.');
  });

  it('busca novamente com os filtros aplicados', async () => {
    const list = vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    });
    renderWithQuery(<CharacterList />);
    await screen.findByText('No users found.');

    await userEvent.type(screen.getByLabelText('Name'), 'rick');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'Alive');

    await vi.waitFor(() => {
      expect(list).toHaveBeenLastCalledWith({ name: 'rick', status: 'Alive', page: 1, limit: 15 });
    });
  });

  it('busca a página escolhida e volta para a primeira ao filtrar', async () => {
    const list = vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 45, pages: 3, next: 2, prev: null },
      results: [buildCharacter({ id: 1, name: 'Rick Sanchez' })],
    });
    renderWithQuery(<CharacterList />);
    await screen.findByRole('table');

    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));

    await vi.waitFor(() => {
      expect(list).toHaveBeenLastCalledWith({ name: '', page: 2, limit: 15 });
    });
    expect(screen.getByText(/Showing results/)).toHaveTextContent('16-30 of 45');

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'Dead');

    await vi.waitFor(() => {
      expect(list).toHaveBeenLastCalledWith({ name: '', status: 'Dead', page: 1, limit: 15 });
    });
  });

  it('volta para a primeira página ao mudar a quantidade por página', async () => {
    const list = vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 100, pages: 7, next: 2, prev: null },
      results: [buildCharacter({ id: 1, name: 'Rick Sanchez' })],
    });
    renderWithQuery(<CharacterList />);
    await screen.findByRole('table');

    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Users per page' }), '50');

    await vi.waitFor(() => {
      expect(list).toHaveBeenLastCalledWith({ name: '', page: 1, limit: 50 });
    });
  });

  it('abre a confirmação pela lixeira e recarrega a lista depois de excluir', async () => {
    const list = vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [buildCharacter({ id: 1, name: 'Rick Sanchez' })],
    });
    vi.spyOn(service, 'deleteCharacter').mockResolvedValue();
    renderWithQuery(<CharacterList />);

    await userEvent.click(await screen.findByRole('button', { name: 'Delete Rick Sanchez' }));
    expect(screen.getByRole('dialog', { name: 'Delete User' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(await screen.findByRole('status')).toHaveTextContent('User successfully deleted.');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await vi.waitFor(() => expect(list).toHaveBeenCalledTimes(2));
    expect(screen.getByRole('region', { name: 'Users table' })).toHaveFocus();
  });

  it('volta para a última página quando a atual fica vazia depois de excluir', async () => {
    let totalPages = 3;
    const list = vi.spyOn(service, 'listCharacters').mockImplementation(async ({ page = 1 } = {}) => ({
      info: { count: totalPages * 15, pages: totalPages, next: null, prev: null },
      results: page <= totalPages ? [buildCharacter({ id: page, name: `Character ${page}` })] : [],
    }));
    vi.spyOn(service, 'deleteCharacter').mockImplementation(async () => {
      totalPages = 2;
    });
    renderWithQuery(<CharacterList />);

    await userEvent.click(await screen.findByRole('button', { name: 'Page 3' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Delete Character 3' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(await screen.findByRole('cell', { name: 'Character 2' })).toBeInTheDocument();
    expect(list).toHaveBeenLastCalledWith({ name: '', page: 2, limit: 15 });
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('abre a edição com duplo clique e recarrega a lista depois de salvar', async () => {
    const list = vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [buildCharacter({ id: 1, name: 'Rick Sanchez' })],
    });
    const updateSpy = vi
      .spyOn(service, 'updateCharacterName')
      .mockResolvedValue(buildCharacter({ id: 1, name: 'Rick C-137' }));
    renderWithQuery(<CharacterList />);

    await userEvent.dblClick(await screen.findByRole('cell', { name: 'Rick Sanchez' }));
    const input = screen.getByRole('textbox', { name: 'Name' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Rick C-137{Enter}');

    expect(await screen.findByRole('status')).toHaveTextContent('User successfully edited.');
    expect(updateSpy).toHaveBeenCalledWith(1, 'Rick C-137');
    await vi.waitFor(() => expect(list).toHaveBeenCalledTimes(2));
  });

  it('abre a edição com Enter na linha sem enviar o formulário junto', async () => {
    vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [buildCharacter({ id: 1, name: 'Rick Sanchez' })],
    });
    const updateSpy = vi.spyOn(service, 'updateCharacterName');
    renderWithQuery(<CharacterList />);

    const row = (await screen.findByRole('cell', { name: 'Rick Sanchez' })).closest('tr')!;
    row.focus();
    await userEvent.keyboard('{Enter}');

    expect(screen.getByRole('dialog', { name: 'Edit User' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Rick Sanchez');
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('mostra o estado vazio sem tabela nem paginação quando não há resultados', async () => {
    vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    });

    renderWithQuery(<CharacterList />);

    const message = await screen.findByText('No users found.');
    expect(message.closest('[role="status"]')).toHaveTextContent('No users found.Try another name or status.');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument();
  });

  it('tenta carregar de novo pelo botão de erro', async () => {
    const list = vi
      .spyOn(service, 'listCharacters')
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValue({
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [buildCharacter({ id: 1, name: 'Rick Sanchez' })],
      });
    renderWithQuery(<CharacterList />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load users.');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('cell', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(list).toHaveBeenCalledTimes(2);
  });

  it('mantém a tabela atual marcada como ocupada enquanto troca de página', async () => {
    let finishPageTwo: () => void = () => {};
    vi.spyOn(service, 'listCharacters').mockImplementation(({ page = 1 } = {}) => {
      const response = {
        info: { count: 30, pages: 2, next: null, prev: null },
        results: [buildCharacter({ id: page, name: `Character ${page}` })],
      };
      if (page === 1) return Promise.resolve(response);
      return new Promise((resolve) => {
        finishPageTwo = () => resolve(response);
      });
    });
    renderWithQuery(<CharacterList />);

    await userEvent.click(await screen.findByRole('button', { name: 'Page 2' }));

    const table = screen.getByRole('table');
    expect(table.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('cell', { name: 'Character 1' })).toBeInTheDocument();

    finishPageTwo();

    expect(await screen.findByRole('cell', { name: 'Character 2' })).toBeInTheDocument();
    expect(screen.getByRole('table').closest('[aria-busy]')).toHaveAttribute('aria-busy', 'false');
  });

  it('não mexe no foco quando a exclusão é cancelada', async () => {
    vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [buildCharacter({ id: 1, name: 'Rick Sanchez' })],
    });
    renderWithQuery(<CharacterList />);

    await userEvent.click(await screen.findByRole('button', { name: 'Delete Rick Sanchez' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('region', { name: 'Users table' })).not.toHaveFocus();
  });
});
