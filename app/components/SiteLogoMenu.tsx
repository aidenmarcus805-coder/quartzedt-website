'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const MENU_COLUMNS = [
  {
    heading: 'Product',
    items: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Downloads', href: '/downloads' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    heading: 'Learn',
    items: [
      { label: 'Guide', href: '/guide' },
      { label: 'Docs', href: '/docs' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'About', href: '/about' },
      { label: 'Support', href: '/support' },
    ],
  },
];

type SiteLogoMenuProps = {
  darkLogoSrc?: string;
  lightLogoSrc?: string;
  darkLogoVisible?: boolean;
  sizeClassName?: string;
};

export function SiteLogoMenu({
  darkLogoSrc = '/logoBlack.png',
  lightLogoSrc = '/logo.png',
  darkLogoVisible = true,
  sizeClassName = 'h-5 w-auto aspect-[256/65]',
}: SiteLogoMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
    >
      <Link href="/" className="flex items-center pl-2 pr-3 py-2 rounded-2xl">
        <span className={`relative shrink-0 ${sizeClassName}`}>
          <Image
            src={lightLogoSrc}
            alt="Quartz Editor"
            fill
            sizes="120px"
            priority
            unoptimized
            className={`object-contain transition-opacity duration-200 ${darkLogoVisible ? 'opacity-0' : 'opacity-100'}`}
          />
          <Image
            src={darkLogoSrc}
            alt=""
            aria-hidden="true"
            fill
            sizes="120px"
            priority
            unoptimized
            className={`object-contain transition-opacity duration-200 ${darkLogoVisible ? 'opacity-100' : 'opacity-0'}`}
          />
        </span>
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-[140] mt-3 rounded-2xl border border-black/[0.08] bg-white px-6 py-5 text-black shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
            style={{ minWidth: 380 }}
          >
            {/* Columns */}
            <div className="flex gap-10">
              {MENU_COLUMNS.map((col) => (
                <div key={col.heading} className="flex flex-col gap-3">
                  <p className="text-[11px] font-semibold text-black">
                    {col.heading}
                  </p>
                  {col.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-sm text-black/40 transition-colors duration-150 hover:text-black/75"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
