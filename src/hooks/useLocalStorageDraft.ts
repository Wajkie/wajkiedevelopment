import { useEffect } from 'react';

type UseLocalStorageDraftOptions<T> = {
  key: string;
  data: T;
  debounceMs?: number;
};

export function useLocalStorageDraft<T>({ key, data, debounceMs = 1000 }: UseLocalStorageDraftOptions<T>) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [key, data, debounceMs]);

  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  };

  const getDraft = (): T | null => {
    if (typeof window === 'undefined') return null;
    
    const saved = localStorage.getItem(key);
    if (!saved) return null;

    try {
      return JSON.parse(saved) as T;
    } catch {
      return null;
    }
  };

  return {
    clearDraft,
    getDraft,
  };
}
