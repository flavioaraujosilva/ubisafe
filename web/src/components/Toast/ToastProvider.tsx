import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type ToastType } from './context';
import styles from './ToastProvider.module.css';

type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastProviderProps = {
  children: ReactNode;
  duration?: number;
};

function SuccessIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ToastProvider({ children, duration = 4000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = ++nextId.current;
      setToasts((current) => [...current, { id, type, message }]);

      const timer = setTimeout(() => {
        timers.current.delete(timer);
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, duration);
      timers.current.add(timer);
    },
    [duration],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.toasts} aria-live="polite">
        {toasts.map(({ id, type, message }) => (
          <div
            key={id}
            role={type === 'error' ? 'alert' : 'status'}
            className={`${styles.toast} ${type === 'error' ? styles.error : styles.success}`}
          >
            {type === 'error' ? <ErrorIcon /> : <SuccessIcon />}
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
