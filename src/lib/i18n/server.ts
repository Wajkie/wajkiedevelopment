import { cookies } from 'next/headers';
import { translations, type Locale } from './translations';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get('locale')?.value;
  return value === 'sv' || value === 'en' ? value : 'sv';
}

export async function getTranslations() {
  const locale = await getLocale();
  return translations[locale];
}
