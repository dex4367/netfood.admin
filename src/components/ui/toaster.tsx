'use client';

import { useState, useEffect } from 'react';
import { ToastProps, registerToast } from './use-toast';

export function Toaster() {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const showToast = (props: ToastProps) => {
      const id = counter;
      setCounter(prev => prev + 1);
      
      setToasts(prev => [...prev, { ...props, id }]);
      
      // Remover automaticamente após o duration
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, props.duration || 5000);
    };

    registerToast(showToast);
  }, [counter]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`rounded-md shadow-md p-4 transition-all animate-in fade-in slide-in-from-bottom-5 ${
            toast.variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          {toast.title && (
            <h3 className="font-medium">{toast.title}</h3>
          )}
          {toast.description && (
            <p className="text-sm mt-1">{toast.description}</p>
          )}
        </div>
      ))}
    </div>
  );
} 