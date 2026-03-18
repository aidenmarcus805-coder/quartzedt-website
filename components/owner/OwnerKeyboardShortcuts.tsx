"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ownerNavigation } from "@/lib/owner/data";

export const OwnerKeyboardShortcuts = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if currently typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
          // EXCEPTION: Cmd+K focuses the claw chat input
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
              e.preventDefault();
              document.querySelector<HTMLTextAreaElement>('[data-owner-command-input="true"]')?.focus();
          }
          return;
      }

      // Route navigation Cmd+1 to Cmd+9
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'k') {
          e.preventDefault();
          document.querySelector<HTMLTextAreaElement>('[data-owner-command-input="true"]')?.focus();
          return;
        }

        const destination = ownerNavigation.find((item) => item.shortcut === e.key);

        if (destination) {
          e.preventDefault();
          router.push(destination.href);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null; // Silent global utility
};
