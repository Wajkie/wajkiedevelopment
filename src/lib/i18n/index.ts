export { LocaleProvider, useLocale } from './LocaleContext';
export { useTranslations } from './useTranslations';
export { translations, type Locale, type Translations } from './translations';

/** Interpolate {key} placeholders in a translation string. */
export function t(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}
