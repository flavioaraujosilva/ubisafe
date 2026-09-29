import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('exibe o título da página', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Characters' })).toBeInTheDocument();
  });
});
