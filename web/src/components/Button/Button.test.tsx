import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('é do tipo button por padrão para não enviar formulários sem querer', () => {
    render(<Button>Search</Button>);

    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute('type', 'button');
  });

  it('dispara o clique e repassa os atributos do botão', async () => {
    const handleClick = vi.fn();
    render(
      <Button type="submit" onClick={handleClick}>
        Search
      </Button>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(handleClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
