'use client';

import { useEffect } from 'react';

export function ScrollToTopOnLoad() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Prevent the browser from restoring the previous scroll position on reload.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // Run immediately, then once more on the next tick to beat any late restoration.
    toTop();
    const t = window.setTimeout(toTop, 0);

    return () => window.clearTimeout(t);
  }, []);

  return null;
}


