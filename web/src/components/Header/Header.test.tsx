import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('exibe o título como heading principal da página', () => {
    render(<Header title="User Management" />);

    expect(screen.getByRole('banner')).toContainElement(
      screen.getByRole('heading', { level: 1, name: 'User Management' }),
    );
  });
});
