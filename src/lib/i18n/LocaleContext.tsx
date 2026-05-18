'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Locale } from './translations';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'sv',
  setLocale: () => {},
});

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale: Locale;
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  // Start from the server-resolved locale so SSR and initial client render match.
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // After hydration, prefer localStorage (handles returning users whose cookie cleared).
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored && stored !== locale && (stored === 'sv' || stored === 'en')) {
      setLocaleState(stored);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, [locale]);

  const setLocale = (next: Locale) => {
    // Write synchronously so server components see the new value on router.refresh().
    document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem('locale', next);
    setLocaleState(next);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
