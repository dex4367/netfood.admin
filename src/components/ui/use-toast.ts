import { useState, useEffect } from 'react';

// Definindo os tipos para as notificações toast
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
};

// Sistema global para manter o estado dos toasts
const toasts: { show: (props: ToastProps) => void } = {
  show: () => {}
};

// Hook para usar o sistema de toast
export const useToast = () => {
  return {
    toast: (props: ToastProps) => {
      toasts.show(props);
    }
  };
};

// Função exportada para usar fora dos componentes React
export const toast = (props: ToastProps) => {
  console.log('Toast:', props); // Para debug
  toasts.show(props);
};

// Registra a função de exibição de toast
export const registerToast = (showFn: (props: ToastProps) => void) => {
  toasts.show = showFn;
}; 