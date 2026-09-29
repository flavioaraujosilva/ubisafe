import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import * as service from './services/characters';
import { buildCharacter, renderWithQuery } from './test/utils';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exibe o título e a listagem de personagens', async () => {
    vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [buildCharacter({ id: 1, name: 'Rick Sanchez' })],
    });

    renderWithQuery(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'User Management' })).toBeInTheDocument();
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });
});
