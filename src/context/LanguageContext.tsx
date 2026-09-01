import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type LanguageMode = 'en' | 'bn' | 'both';

const STORAGE_KEY = 'handbook-language-mode';

type LanguageContextValue = {
  mode: LanguageMode;
  setMode: (mode: LanguageMode) => void;
  showEn: boolean;
  showBn: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LanguageMode>(() => {
    if (typeof window === 'undefined') return 'both';
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageMode | null;
    return saved === 'en' || saved === 'bn' || saved === 'both' ? saved : 'both';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = (next: LanguageMode) => setModeState(next);

  const value: LanguageContextValue = {
    mode,
    setMode,
    showEn: mode === 'en' || mode === 'both',
    showBn: mode === 'bn' || mode === 'both',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
