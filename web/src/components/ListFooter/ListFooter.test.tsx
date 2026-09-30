import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ListFooter } from './ListFooter';

function renderFooter(props: Partial<Parameters<typeof ListFooter>[0]> = {}) {
  return render(
    <ListFooter
      currentPage={4}
      totalPages={450}
      totalItems={6748}
      pageSize={15}
      onPageChange={vi.fn()}
      onPageSizeChange={vi.fn()}
      {...props}
    />,
  );
}

describe('ListFooter', () => {
  it('mostra o intervalo de resultados da página', () => {
    renderFooter();

    expect(screen.getByText(/Showing results/)).toHaveTextContent('Showing results 46-60 of 6748');
    expect(screen.getByText('46-60').tagName).toBe('STRONG');
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
  });

  it('avisa a nova quantidade de itens por página', async () => {
    const handlePageSizeChange = vi.fn();
    renderFooter({ onPageSizeChange: handlePageSizeChange });

    const select = screen.getByRole('combobox', { name: 'Users per page' });
    expect(select).toHaveValue('15');

    await userEvent.selectOptions(select, '30');

    expect(handlePageSizeChange).toHaveBeenCalledWith(30);
  });
});
