'use client';

import { useLocale } from './LocaleContext';
import { translations } from './translations';

export function useTranslations() {
  const { locale } = useLocale();
  return translations[locale];
}
