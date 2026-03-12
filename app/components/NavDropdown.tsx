'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CaretDown } from '@phosphor-icons/react';
import { useState } from 'react';
import Link from 'next/link';

export type NavCategory = {
  label: string;
  links: { label: string; href: string }[];
};

export function NavDropdown({
  category,
  navOnLight,
  isScrolled,
}: {
  category: NavCategory;
  navOnLight: boolean;
  isScrolled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`px-4 h-full text-[13px] font-bold tracking-tight transition-colors duration-300 flex items-center gap-1.5 ${
          navOnLight
            ? 'text-black/60 hover:text-black'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <span>{category.label}</span>
        <CaretDown
          weight="bold"
          className={`w-3 h-3 transition-transform duration-300 ${
            isOpen ? 'rotate-180 opacity-100' : 'opacity-40'
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute left-[-8px] z-[110] ${
              isScrolled
                ? 'top-[calc(100%+6px)]'   /* Float below the capsule with a gap */
                : 'top-[calc(100%-20px)] pt-[4px]' /* Overlap slightly in full-width mode */
            }`}
          >
            <div
              className={`min-w-[200px] p-2 transition-all duration-500 ${
                isScrolled
                  ? `rounded-[18px] border backdrop-blur-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] ${
                      navOnLight
                        ? 'bg-white/80 border-black/[0.06] text-black'
                        : 'bg-[#1a1a1a]/80 border-white/[0.08] text-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)]'
                    }`
                  : `rounded-b-[22px] bg-transparent border-transparent text-current shadow-none`
              }`}
            >
              <div className="flex flex-col gap-0.5">
                {category.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group block px-4 py-2.5 text-[14px] font-medium rounded-[14px] transition-all duration-300 ${
                      navOnLight
                        ? 'text-black/50 hover:text-black hover:bg-black/[0.05]'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
