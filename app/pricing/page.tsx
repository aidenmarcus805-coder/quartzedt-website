'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User } from '@phosphor-icons/react';
import { PRICING_PLANS, SOCIAL_ADDON } from '../lib/constants/pricing';
import { SiteLogoMenu } from '../components/SiteLogoMenu';
import { NavDropdown } from '../components/NavDropdown';
import { useSession } from 'next-auth/react';
import { UserMenu } from '../components/UserMenu';

const NAV_CATEGORIES = [
  {
    label: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Downloads', href: '/downloads' },
    ],
  },
  {
    label: 'Learn',
    links: [
      { label: 'Guide', href: '/guide' },
      { label: 'Docs', href: '/docs' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    label: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Support', href: '/support' },
    ],
  },
];

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#171717] selection:bg-[#E5E5E5] selection:text-[#171717] antialiased flex flex-col items-center pb-32">
      
      {/* 1. Restored Top Navbar (Static, pill-shaped, fully functional) */}
      <nav className="fixed top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <div className="relative z-10 pointer-events-auto transition-all duration-500 flex items-center justify-between h-14 px-6 w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] lg:w-[calc(100%-8rem)] max-w-[calc(1800px-4rem)] rounded-full border backdrop-blur-xl shadow-sm bg-gray-50/60 border-black/5 text-black">
          <SiteLogoMenu darkLogoVisible={true} />
          
          <div className="hidden md:flex items-center h-full ml-8">
            {NAV_CATEGORIES.map((cat) => (
              <NavDropdown key={cat.label} category={cat} navOnLight={true} isScrolled={true} />
            ))}
          </div>

          <div className="flex-1" />
          
          <div className="flex items-center gap-3">
            <Link
              href="#waitlist"
              className="px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 bg-black text-white hover:bg-black/80 shadow-lg hover:shadow-xl"
            >
              Join Waitlist
            </Link>
            {session ? (
              <UserMenu session={session} navOnLight={true} />
            ) : (
              <Link
                href="/signin"
                className="w-8 h-8 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center group hover:bg-black/5"
              >
                <User className="w-4 h-4 transition-colors duration-300 text-black/70 group-hover:text-black" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - Ultra Clean, No Syne, DM Sans */}
      <section className="pt-[180px] pb-16 px-6 w-full text-center">
        <motion.div
           initial={{ opacity: 0, y: 16 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#A8A29E] mb-6 uppercase">
            Quartz Pricing
          </span>
          <h1 className="text-[36px] md:text-[44px] lg:text-[52px] tracking-tight font-medium text-[#050504] leading-[1.1]">
            Give your films the time they deserve.
          </h1>
        </motion.div>
      </section>

      {/* 3. Tight, Compact Cards Container mapped to "Downloads" aesthetic */}
      <section className="w-full max-w-[900px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-4 items-stretch mb-4">
          
          {/* Studio Plan (Pure Black Card with grey interiors) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[24px] bg-[#050504] p-10 md:p-12 flex flex-col shadow-xl border border-[#050504] relative overflow-hidden"
          >
            {/* Subtle highlight top border effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

            <div className="flex justify-between items-start mb-8">
               <div>
                  <h2 className="text-[20px] font-medium tracking-tight text-[#FAF9F6]">{PRICING_PLANS[1].name}</h2>
                  <p className="text-[14px] text-[#A3A3A3] mt-2 block max-w-[140px] leading-snug">{PRICING_PLANS[1].tagline}</p>
               </div>
               <div className="text-right flex flex-col items-end">
                  <span className="text-[32px] font-medium tracking-tight text-[#FAF9F6] block leading-none mb-1">${PRICING_PLANS[1].price}</span>
                  <span className="text-[12px] text-[#A3A3A3]">per month</span>
               </div>
            </div>

            {/* Inverted CTA: White Button on Black Card */}
            <Link
               href="/signup"
               className="w-full bg-[#FAF9F6] text-[#050504] rounded-xl h-12 flex items-center justify-center text-[14px] font-semibold hover:bg-[#EBEAE4] transition-colors shadow-sm"
            >
               {PRICING_PLANS[1].cta}
            </Link>

            {/* Real Screenshot Over Icons Requirement (Dark Grey Interior) */}
            <div className="w-full aspect-video bg-[#1A1A1A] rounded-xl mt-10 mb-8 overflow-hidden flex items-center justify-center shadow-inner relative border border-white/5">
                <span className="text-[#A3A3A3] text-[10px] uppercase tracking-widest font-semibold z-10 text-center px-4">Application Interface<br/>Screenshot</span>
            </div>

            <ul className="space-y-4 mt-auto">
               {PRICING_PLANS[1].features.slice(0, 4).map(f => (
                 <li key={f} className="text-[14px] text-[#D4D4D8] font-medium tracking-tight">{f}</li>
               ))}
            </ul>
          </motion.div>

          {/* Solo Plan (White Card mimicking Windows download card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
             className="rounded-[24px] bg-white p-8 md:p-10 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#EBEAE4]"
          >
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h2 className="text-[20px] font-medium tracking-tight text-[#050504]">{PRICING_PLANS[0].name}</h2>
                  <p className="text-[14px] text-[#57534E] mt-2 block max-w-[140px] leading-snug">{PRICING_PLANS[0].tagline}</p>
               </div>
               <div className="text-right flex flex-col items-end">
                  <span className="text-[32px] font-medium tracking-tight text-[#050504] block leading-none mb-1">${PRICING_PLANS[0].price}</span>
                  <span className="text-[12px] text-[#A8A29E]">per month</span>
               </div>
            </div>

            {/* IDENTICAL CTA STYLE */}
            <Link
               href="/signup"
               className="w-full bg-[#050504] text-[#FAF9F6] rounded-xl h-12 flex items-center justify-center text-[14px] font-medium hover:bg-black transition-colors shadow-sm"
            >
               {PRICING_PLANS[0].cta}
            </Link>

            <div className="w-full aspect-video bg-[#FAF9F6] rounded-xl mt-10 mb-8 overflow-hidden flex items-center justify-center shadow-inner relative border border-black/5">
                <span className="text-[#A8A29E] text-[10px] uppercase tracking-widest font-semibold z-10 text-center px-4">Application Interface<br/>Screenshot</span>
            </div>

            <ul className="space-y-4 mt-auto">
               {PRICING_PLANS[0].features.slice(0, 4).map(f => (
                 <li key={f} className="text-[14px] text-[#57534E] font-medium tracking-tight">{f}</li>
               ))}
            </ul>
          </motion.div>

        </div>

        {/* Social Addon - Extremely subdued secondary element */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[20px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E5E5E5] flex flex-col sm:flex-row items-center gap-6"
        >
           <div className="flex-1">
             <h2 className="text-[15px] font-medium tracking-tight text-[#171717]">Social Extension</h2>
             <p className="text-[13px] text-[#737373] mt-1 flex gap-2 items-center">
                <span>+${SOCIAL_ADDON.price} / mo</span>
                <span className="w-1 h-1 bg-black/10 rounded-full" />
                <span>One-click vertical exports</span>
             </p>
           </div>
           
           <button className="bg-[#171717] text-white rounded-xl px-6 h-10 flex items-center justify-center text-[13px] font-medium hover:bg-black transition-colors shadow-sm whitespace-nowrap">
              Add to plan
           </button>
        </motion.div>
      </section>

      <p className="mt-12 text-[11px] text-[#A3A3A3] text-center">
        Quartz requires macOS Monterey 12.3 or later / Windows 10 64-bit or later. <Link href="/signin" className="underline decoration-[#E5E5E5] underline-offset-4 hover:decoration-[#A3A3A3] transition-colors">Sign in to manage billing.</Link>
      </p>

    </main>
  );
}
