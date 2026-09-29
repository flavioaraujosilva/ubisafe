import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { Character } from '../types/character';

export function renderWithQuery(element: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(<QueryClientProvider client={queryClient}>{element}</QueryClientProvider>);
}

export function buildCharacter(input: Partial<Character> & Pick<Character, 'id' | 'name'>): Character {
  return {
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    image: '',
    episode: ['1', '2'],
    url: '',
    created: '2017-11-04T18:48:46.250Z',
    ...input,
  };
}
