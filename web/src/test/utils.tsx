import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { ToastProvider } from '../components/Toast/ToastProvider';
import type { Character } from '../types/character';

export function renderWithQuery(element: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Providers({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    );
  }

  return render(element, { wrapper: Providers });
}

export function buildCharacter(overrides: Partial<Character> & Pick<Character, 'id' | 'name'>): Character {
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
    ...overrides,
  };
}
