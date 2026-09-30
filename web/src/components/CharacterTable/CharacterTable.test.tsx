import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { buildCharacter } from '../../test/utils';
import { CharacterTable } from './CharacterTable';

describe('CharacterTable', () => {
  it('exibe o cabeçalho com as colunas do design', () => {
    render(<CharacterTable characters={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    const columns = screen.getAllByRole('columnheader').map((column) => column.textContent);
    expect(columns).toEqual(['Name', 'Status', 'Specie', 'Episodes', 'Origin', 'Created at']);
  });

  it('exibe uma row por personagem com os dados formatados', () => {
    const characters = [
      buildCharacter({ id: 1, name: 'Rick Sanchez' }),
      buildCharacter({
        id: 2,
        name: 'Morty Smith',
        status: 'Dead',
        species: 'Alien',
        episode: ['1', '2', '3'],
        origin: { name: 'unknown', url: '' },
        created: '2020-01-31T10:00:00.000Z',
      }),
    ];

    render(<CharacterTable characters={characters} onEdit={vi.fn()} onDelete={vi.fn()} />);

    const [, first, second] = screen.getAllByRole('row');
    expect(within(first!).getAllByRole('cell').map((c) => c.textContent)).toEqual([
      'Rick Sanchez',
      'Alive',
      'Human',
      '2',
      'Earth (C-137)',
      '04/11/2017',
    ]);
    expect(within(second!).getAllByRole('cell').map((c) => c.textContent)).toEqual([
      'Morty Smith',
      'Dead',
      'Alien',
      '3',
      'unknown',
      '31/01/2020',
    ]);
  });

  it('permite rolar a tabela pelo teclado em telas pequenas', () => {
    render(<CharacterTable characters={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole('region', { name: 'Users table' })).toHaveAttribute('tabindex', '0');
  });

  it('pede a exclusão do personagem pela lixeira da row', async () => {
    const handleDelete = vi.fn();
    const morty = buildCharacter({ id: 2, name: 'Morty Smith' });
    render(<CharacterTable characters={[buildCharacter({ id: 1, name: 'Rick Sanchez' }), morty]} onEdit={vi.fn()} onDelete={handleDelete} />);

    await userEvent.click(screen.getByRole('button', { name: 'Delete Morty Smith' }));

    expect(handleDelete).toHaveBeenCalledWith(morty);
  });

  it('pede a edição com duplo clique ou Enter na row', async () => {
    const handleEdit = vi.fn();
    const rick = buildCharacter({ id: 1, name: 'Rick Sanchez' });
    render(<CharacterTable characters={[rick]} onEdit={handleEdit} onDelete={vi.fn()} />);
    const row = screen.getAllByRole('row')[1]!;

    await userEvent.dblClick(within(row).getByRole('cell', { name: 'Rick Sanchez' }));
    row.focus();
    await userEvent.keyboard('{Enter}');

    expect(handleEdit.mock.calls).toEqual([[rick], [rick]]);
  });

  it('não pede a edição quando o Enter é na lixeira', async () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    render(<CharacterTable characters={[buildCharacter({ id: 1, name: 'Rick Sanchez' })]} onEdit={handleEdit} onDelete={handleDelete} />);

    screen.getByRole('button', { name: 'Delete Rick Sanchez' }).focus();
    await userEvent.keyboard('{Enter}');

    expect(handleDelete).toHaveBeenCalledOnce();
    expect(handleEdit).not.toHaveBeenCalled();
  });

  it('destaca a linha do personagem ativo', () => {
    render(
      <CharacterTable
        characters={[buildCharacter({ id: 1, name: 'Rick Sanchez' }), buildCharacter({ id: 2, name: 'Morty Smith' })]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        activeCharacterId={2}
      />,
    );

    const [, rick, morty] = screen.getAllByRole('row');
    expect(morty!.className).toMatch(/active/);
    expect(rick!.className).not.toMatch(/active/);
  });
});
