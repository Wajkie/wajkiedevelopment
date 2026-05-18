'use client';

import { useLocale } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const next = locale === 'sv' ? 'en' : 'sv';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        setLocale(next);
        router.refresh();
      }}
      aria-label={`Switch language to ${next.toUpperCase()}`}
      className="font-mono text-xs tracking-widest"
    >
      {next.toUpperCase()}
    </Button>
  );
}
