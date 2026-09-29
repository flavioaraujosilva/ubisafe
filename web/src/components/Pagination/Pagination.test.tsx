import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('marca a página atual e mostra no máximo 8 páginas', () => {
    render(<Pagination currentPage={4} totalPages={20} onPageChange={vi.fn()} />);

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Page / })).toHaveLength(8);
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 5' })).not.toHaveAttribute('aria-current');
  });

  it('desabilita First e anterior na primeira página', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'First' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Last' })).toBeEnabled();
  });

  it('desabilita Last e próxima na última página', () => {
    render(<Pagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Last' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('avisa a página escolhida em cada controle', async () => {
    const handlePageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={handlePageChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'First' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Page 7' }));
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Last' }));

    expect(handlePageChange.mock.calls).toEqual([[1], [4], [7], [6], [10]]);
  });
});
