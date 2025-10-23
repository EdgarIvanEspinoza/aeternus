"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface ImpersonatedUser {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
}

interface ImpersonationContextValue {
  impersonatedUser: ImpersonatedUser | null;
  setImpersonatedUser: (user: ImpersonatedUser) => void;
  clearImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationContextValue | undefined>(undefined);

const STORAGE_KEY = 'impersonationUser';

export const ImpersonationProvider = ({ children }: { children: React.ReactNode }) => {
  const [impersonatedUser, setImpersonatedUserState] = useState<ImpersonatedUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setImpersonatedUserState(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Failed to load impersonation state', e);
    }
  }, []);

  const setImpersonatedUser = useCallback((user: ImpersonatedUser) => {
    setImpersonatedUserState(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, []);

  const clearImpersonation = useCallback(() => {
    setImpersonatedUserState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ImpersonationContext.Provider value={{ impersonatedUser, setImpersonatedUser, clearImpersonation }}>
      {children}
    </ImpersonationContext.Provider>
  );
};

export const useImpersonation = () => {
  const ctx = useContext(ImpersonationContext);
  if (!ctx) throw new Error('useImpersonation must be used within ImpersonationProvider');
  return ctx;
};
