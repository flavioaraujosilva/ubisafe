import { createContext } from 'react';

export type ToastType = 'success' | 'error';

export type ToastContextValue = {
  showToast: (type: ToastType, message: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
