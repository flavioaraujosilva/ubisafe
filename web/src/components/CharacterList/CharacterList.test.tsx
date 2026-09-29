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
    await screen.findByRole('table');

    await userEvent.type(screen.getByLabelText('Name'), 'rick');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'Alive');

    await vi.waitFor(() => {
      expect(list).toHaveBeenLastCalledWith({ name: 'rick', status: 'Alive', page: 1, limit: 15 });
    });
  });
});
