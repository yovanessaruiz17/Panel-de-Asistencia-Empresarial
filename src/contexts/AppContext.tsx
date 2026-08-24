import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_COMPANY_SETTINGS } from '../constants/mockData';
import { CompanySettings } from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface AppContextType {
  settings: CompanySettings;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  isOnline: boolean;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_COMPANY_SETTINGS);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast({ type: 'success', title: 'Conexión restablecida', message: 'La aplicación está en línea.' });
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast({
        type: 'warning',
        title: 'Sin conexión',
        message: 'No podemos confirmar registros en tiempo real sin conexión a internet.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        isOnline,
        toasts,
        showToast,
        removeToast,
        isDemoMode,
        setDemoMode: setIsDemoMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
