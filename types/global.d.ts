import type Lenis from '@studio-freight/lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export {};


