'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Check, User, Sparkle } from '@phosphor-icons/react';
import { SiteLogoMenu } from '../components/SiteLogoMenu';
import { NavDropdown } from '../components/NavDropdown';
import { useSession } from 'next-auth/react';
import { UserMenu } from '../components/UserMenu';
import { Slider } from "@/components/ui/slider";

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

const CONTACT_TIERS = [1, 5, 10, 15, 1000]; // 1K to 1M (represented as 1000K)

export default function PricingPage() {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState([5]); // Default to 5K

  const currentContacts = contacts[0];

  const getPrice = (base: number) => {
    // Simple logic to scale price with volume
    if (currentContacts <= 5) return base;
    if (currentContacts <= 10) return base + 20;
    if (currentContacts <= 15) return base + 40;
    return base + 200; // 1M tier
  };

  return (
    <main className="min-h-screen bg-white text-[#050504] selection:bg-[#E5E5E5] selection:text-[#050504] antialiased flex flex-col items-center pb-32">
      
      {/* Navbar - Kept for consistency */}
      <nav className="fixed top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <div className="relative z-10 pointer-events-auto transition-all duration-500 flex items-center justify-between h-14 px-6 w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] lg:w-[calc(100%-8rem)] max-w-[calc(1800px-4rem)] rounded-full border backdrop-blur-xl shadow-sm bg-white/60 border-black/5">
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
              className="px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 bg-black text-white hover:bg-black/80"
            >
              Join Waitlist
            </Link>
            {session ? (
              <UserMenu session={session} navOnLight={true} />
            ) : (
              <Link
                href="/signin"
                className="w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center group hover:bg-black/5"
              >
                <User className="w-4 h-4 text-black/70 group-hover:text-black" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-[160px] pb-12 px-6 w-full text-center">
        <motion.div
           initial={{ opacity: 0, y: 16 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="max-w-2xl mx-auto"
        >
          <h1 className="text-[44px] md:text-[56px] tracking-tighter font-bold text-[#050504] leading-[1.05] mb-4">
            Start your journey today
          </h1>
          <p className="text-[16px] md:text-[18px] text-zinc-500 font-normal max-w-lg mx-auto leading-relaxed">
            Start creating realtime design experiences for free. Upgrade for extra features and collaboration with your team.
          </p>
        </motion.div>
      </section>

      {/* Slider Section */}
      <section className="w-full max-w-2xl mx-auto px-6 mb-20 text-center">
        <div className="mb-6">
            <span className="text-sm font-medium text-zinc-500">{currentContacts === 1000 ? '1M' : `${currentContacts}K`} contacts/month</span>
        </div>
        <div className="relative pt-2 pb-8">
            <Slider 
                defaultValue={[5]} 
                max={15} 
                min={1} 
                step={1} 
                value={contacts}
                onValueChange={(val: number[]) => setContacts(val)}
                className="w-full"
            />
            {/* Custom Markers */}
            <div className="absolute top-10 left-0 right-0 flex justify-between px-1">
                {['1K', '5K', '10K', '15K', '1M'].map((mark) => (
                    <span key={mark} className="text-[11px] font-mono text-zinc-400 uppercase tracking-tighter">{mark}</span>
                ))}
            </div>
        </div>
      </section>

      {/* Pricing Cards Container */}
      <section className="w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Essential Plan */}
          <div className="p-8 rounded-2xl bg-white border border-zinc-200 flex flex-col shadow-sm">
            <h2 className="text-[20px] font-bold tracking-tight mb-4">Essential</h2>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[40px] font-bold tracking-tighter">${getPrice(19)}</span>
                <span className="text-zinc-500 text-sm font-medium">/mo</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                For power users who want access to creative features.
            </p>
            
            <div className="space-y-4 mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-[#050504]">Includes:</p>
                <div className="space-y-3">
                    {['Unlimited workspace boards', 'Unlimited viewers', 'Unlimited project templates'].map((f) => (
                        <div key={f} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                            <span className="text-sm text-zinc-500">{f}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Premium Plan - Highlighted */}
          <div className="p-8 rounded-2xl bg-[#050504] border border-[#050504] flex flex-col shadow-xl relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-zinc-400 rotate-12 opacity-50">
                <Sparkle weight="fill" className="w-12 h-12" />
            </div>

            <h2 className="text-[20px] font-bold tracking-tight text-white mb-4">Premium</h2>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[40px] font-bold tracking-tighter text-white">${getPrice(29)}</span>
                <span className="text-zinc-400 text-sm font-medium">/mo</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                For creative organizations that need full control & support.
            </p>
            
            <div className="space-y-4 mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Includes:</p>
                <div className="space-y-3">
                    {['Unlimited workspace boards', 'Unlimited viewers', 'Unlimited project templates'].map((f) => (
                        <div key={f} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                            <span className="text-sm text-zinc-400 underline decoration-zinc-800 underline-offset-4">{f}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-2xl bg-white border border-zinc-200 flex flex-col shadow-sm">
            <h2 className="text-[20px] font-bold tracking-tight mb-4">Enterprise</h2>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[40px] font-bold tracking-tighter">${getPrice(59)}</span>
                <span className="text-zinc-500 text-sm font-medium">/mo</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                For creative organizations that need full control & support.
            </p>
            
            <div className="space-y-4 mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-[#050504]">Includes:</p>
                <div className="space-y-3">
                    {['Unlimited workspace boards', 'Unlimited viewers', 'Unlimited project templates'].map((f) => (
                        <div key={f} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                            <span className="text-sm text-zinc-500">{f}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

        </div>
      </section>

      <p className="mt-20 text-xs text-zinc-400 text-center max-w-lg">
        Pricing scales with your team size and data volume. All plans include 256-bit SSL encryption and daily backups.
      </p>

    </main>
  );
}
