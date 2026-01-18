'use client';

import { Button } from '@/components/ui';

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button variant="ghost" size="sm" onClick={scrollToTop}>
      ↑ Till toppen
    </Button>
  );
}
