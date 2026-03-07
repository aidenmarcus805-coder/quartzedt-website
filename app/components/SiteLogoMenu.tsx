'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const MENU_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Blog', href: '/blog' },
  { label: 'Guide', href: '/guide' },
  { label: 'Docs', href: '/docs' },
  { label: 'Features', href: '/features' },
  { label: 'Support', href: '/support' },
  { label: 'Dashboard', href: '/dashboard' },
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
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-[140] mt-4 w-[320px] rounded-[28px] border border-black/10 bg-white p-3 text-black shadow-[0_24px_80px_rgba(0,0,0,0.14)] backdrop-blur-xl"
          >
            <div className="px-3 pb-3 pt-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-black/35">Explore Quartz</p>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Quick access to every major surface on the site.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-black/75 transition hover:border-black/10 hover:bg-black/[0.03] hover:text-black"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
