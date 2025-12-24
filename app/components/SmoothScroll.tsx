'use client';

import Lenis from '@studio-freight/lenis';
import { useEffect } from 'react';

// Global inertial scrolling (Camille-style smoothness) with safety:
// - respects prefers-reduced-motion
// - auto-disables whenever the app locks body scroll (hero intro)
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (prefersReduced) return;

    const lenis = new Lenis({
      // Slight inertia without feeling “floaty”.
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    // Expose for in-page anchor helpers (optional).
    window.__lenis = lenis;

    let rafId = 0;
    let lastLocked = false;

    const syncLockState = () => {
      // Our hero intro uses overflow:hidden to lock scrolling.
      const locked = document.body.style.overflow === 'hidden';
      if (locked === lastLocked) return;
      lastLocked = locked;
      if (locked) lenis.stop();
      else lenis.start();
    };

    const raf = (time: number) => {
      syncLockState();
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return null;
}


