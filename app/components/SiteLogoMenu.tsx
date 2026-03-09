'use client';

import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <Link href="/" className="relative z-[150] flex items-center pl-2 pr-3 py-2 rounded-2xl">
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
  );
}
