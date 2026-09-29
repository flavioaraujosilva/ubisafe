import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToast } from '../../hooks/useToast';
import { ToastProvider } from './ToastProvider';

function Trigger() {
  const { showToast } = useToast();
  return (
    <>
      <button type="button" onClick={() => showToast('success', 'User successfully deleted.')}>
        success
      </button>
      <button type="button" onClick={() => showToast('error', 'Error deleting user.')}>
        error
      </button>
    </>
  );
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('mostra o aviso de sucesso como status e o de erro como alerta', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );

    act(() => screen.getByRole('button', { name: 'success' }).click());
    act(() => screen.getByRole('button', { name: 'error' }).click());

    expect(screen.getByRole('status')).toHaveTextContent('User successfully deleted.');
    expect(screen.getByRole('alert')).toHaveTextContent('Error deleting user.');
  });

  it('some sozinho depois da duração', () => {
    render(
      <ToastProvider duration={3000}>
        <Trigger />
      </ToastProvider>,
    );

    act(() => screen.getByRole('button', { name: 'success' }).click());
    act(() => vi.advanceTimersByTime(2999));
    expect(screen.getByRole('status')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('exige o provedor para usar o hook', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useToast())).toThrow('useToast must be used within ToastProvider');
  });
});
