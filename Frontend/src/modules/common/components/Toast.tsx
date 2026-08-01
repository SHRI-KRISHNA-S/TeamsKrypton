import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { Button } from './Button';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-indigo-500" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300',
    error: 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-300',
    warning: 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-300',
    info: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30 text-indigo-800 dark:text-indigo-300',
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg ${bgColors[type]} max-w-sm animate-slide-in-right`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-grow text-xs font-medium">{message}</div>
      <Button
        variant="ghost"
        size="sm"
        className="p-0.5 !rounded-full opacity-60 hover:opacity-100 text-current hover:bg-transparent"
        onClick={() => onClose(id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[];
  setToasts: React.Dispatch<React.SetStateAction<Omit<ToastProps, 'onClose'>[]>>;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, setToasts }) => {
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
};
