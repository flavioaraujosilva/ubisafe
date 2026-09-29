import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import * as service from './services/characters';
import { renderWithQuery } from './test/utils';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exibe o título e a listagem de personagens', async () => {
    vi.spyOn(service, 'listCharacters').mockResolvedValue({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    });

    renderWithQuery(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'User Management' })).toBeInTheDocument();
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });
});
