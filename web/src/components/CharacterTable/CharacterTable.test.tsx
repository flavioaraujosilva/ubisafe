import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { buildCharacter } from '../../test/utils';
import { CharacterTable } from './CharacterTable';

describe('CharacterTable', () => {
  it('exibe o cabeçalho com as colunas do design', () => {
    render(<CharacterTable characters={[]} />);

    const columns = screen.getAllByRole('columnheader').map((column) => column.textContent);
    expect(columns).toEqual(['Name', 'Status', 'Specie', 'Episodes', 'Origin', 'Created at']);
  });

  it('exibe uma linha por personagem com os dados formatados', () => {
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

    render(<CharacterTable characters={characters} />);

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
    render(<CharacterTable characters={[]} />);

    expect(screen.getByRole('region', { name: 'Users table' })).toHaveAttribute('tabindex', '0');
  });
});
