"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const OwnerKeyboardShortcuts = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if currently typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
          // EXCEPTION: Cmd+K focuses the claw chat input
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
              e.preventDefault();
              document.querySelector<HTMLInputElement>('input[placeholder*="Ask Fleet"]')?.focus();
          }
          return;
      }

      // Route Navigation Cmd+1 to Cmd+6
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
           case '1': e.preventDefault(); router.push('/dashboard/owner/marketing'); break;
           case '2': e.preventDefault(); router.push('/dashboard/owner/code'); break;
           case '3': e.preventDefault(); router.push('/dashboard/owner/social'); break;
           case '4': e.preventDefault(); router.push('/dashboard/owner/product'); break;
           case '5': e.preventDefault(); router.push('/dashboard/owner/seo'); break;
           case '6': e.preventDefault(); router.push('/dashboard/owner/experiments'); break;
           case 'k': 
              e.preventDefault();
              document.querySelector<HTMLInputElement>('input[placeholder*="Ask Fleet"]')?.focus();
              break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null; // Silent global utility
};
