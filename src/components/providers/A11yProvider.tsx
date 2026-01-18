// Initialize a11y with Swedish locale
'use client';

import { useEffect } from 'react';
import { setLocale } from '@wajkie/a11y-core/locales';

export default function A11yProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set Swedish locale for accessibility messages
    setLocale('sv').catch(console.error);
  }, []);

  return <>{children}</>;
}
