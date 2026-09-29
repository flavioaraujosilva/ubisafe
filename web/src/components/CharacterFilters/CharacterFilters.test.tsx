import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CharacterFilters } from './CharacterFilters';

describe('CharacterFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderFilters() {
    const onFilter = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<CharacterFilters onFilter={onFilter} />);
    return { onFilter, user };
  }

  it('exibe os campos com labels acessíveis', () => {
    renderFilters();

    expect(screen.getByRole('search', { name: 'Filter users' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('');
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'All',
      'Alive',
      'Dead',
      'Unknown',
    ]);
  });

  it('aplica o filtro de nome só depois de 400ms sem digitar', async () => {
    const { onFilter, user } = renderFilters();

    await user.type(screen.getByLabelText('Name'), 'rick');
    expect(onFilter).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(onFilter).toHaveBeenCalledOnce();
    expect(onFilter).toHaveBeenCalledWith({ name: 'rick', status: undefined });
  });

  it('aplica o status imediatamente mantendo o nome digitado', async () => {
    const { onFilter, user } = renderFilters();

    await user.type(screen.getByLabelText('Name'), 'morty');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'Dead');

    expect(onFilter).toHaveBeenLastCalledWith({ name: 'morty', status: 'Dead' });

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(onFilter).toHaveBeenCalledOnce();
  });

  it('aplica na hora ao clicar em Search, sem esperar o atraso', async () => {
    const { onFilter, user } = renderFilters();

    await user.type(screen.getByLabelText('Name'), '  summer ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onFilter).toHaveBeenCalledWith({ name: 'summer', status: undefined });

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(onFilter).toHaveBeenCalledOnce();
  });

  it('aplica ao pressionar Enter no campo de nome', async () => {
    const { onFilter, user } = renderFilters();

    await user.type(screen.getByLabelText('Name'), 'beth{Enter}');

    expect(onFilter).toHaveBeenCalledWith({ name: 'beth', status: undefined });
  });

  it('volta para todos os status ao escolher All', async () => {
    const { onFilter, user } = renderFilters();
    const status = screen.getByRole('combobox', { name: 'Status' });

    await user.selectOptions(status, 'Alive');
    await user.selectOptions(status, '');

    expect(onFilter).toHaveBeenLastCalledWith({ name: '', status: undefined });
  });
});
