'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';

const PLAN = {
  price: 179,
  priceAnnual: 1790,
  features: [
    'AI scene detection',
    'Full transcripts',
    'Multicam sync',
    'XML export',
    'Same-day templates',
    'Direct support',
  ],
  creemProductId: 'prod_founding_GF7xl',
};

const UserMenu = ({ session }: { session: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full border border-black/10 hover:border-black hover:bg-black/5 transition-all">
        <User className="w-4 h-4 text-black" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-black/10 bg-white shadow-xl z-50 py-1">
            <div className="px-3 py-2 text-xs text-black/40 border-b border-black/5 mb-1">{session.user?.email}</div>
            <Link href="/dashboard" className="block px-3 py-2 text-sm text-black/70 hover:bg-black/5" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link href="/dashboard/settings" className="block px-3 py-2 text-sm text-black/70 hover:bg-black/5" onClick={() => setIsOpen(false)}>Settings</Link>
            <button onClick={() => signOut()} className="w-full text-left px-3 py-2 text-sm text-black/50 hover:text-red-500 hover:bg-black/5">Sign out</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PricingPage() {
  const { data: session } = useSession();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const price = billing === 'annual' ? PLAN.priceAnnual : PLAN.price;
  const period = billing === 'annual' ? 'year' : 'mo';

  return (
    <div className="min-h-screen relative bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Subtle dot field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          backgroundPosition: 'center',
        }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm text-black/50 hover:text-black transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <Link href="/">
            <Image src="/logo.png?v=20251223" alt="Quartz" width={100} height={25} className="h-4 w-auto invert" unoptimized />
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/download" className="text-sm text-black/50 hover:text-black transition-colors hidden md:block">Download</Link>
            {session ? <UserMenu session={session} /> : (
              <Link href="/signin?next=/pricing" className="text-sm text-black/50 hover:text-black transition-colors">Sign in</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main - Two Column */}
      <main className="min-h-screen flex items-center relative z-10">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 w-full py-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">

            {/* Left - Title + Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:sticky lg:top-24"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-sm text-black/50">Founding offer · 50 spots</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-light tracking-tight">
                One price
              </h1>

              <p className="mt-4 text-black/40">
                Lock in this rate for life.
              </p>

              {/* Billing Toggle */}
              <div className="mt-10 flex items-center p-1 bg-black/5 rounded-full border border-black/10 w-fit">
                <button
                  onClick={() => setBilling('monthly')}
                  className={`px-5 py-2 rounded-full text-sm transition-all ${billing === 'monthly' ? 'bg-white text-black shadow-sm font-medium' : 'text-black/50 hover:text-black'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling('annual')}
                  className={`px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${billing === 'annual' ? 'bg-white text-black shadow-sm font-medium' : 'text-black/50 hover:text-black'}`}
                >
                  Annual
                  <span className={`text-xs px-1.5 py-0.5 rounded ${billing === 'annual' ? 'bg-accent text-white' : 'bg-accent/10 text-accent'}`}>
                    Save 2mo
                  </span>
                </button>
              </div>

              {/* Referral */}
              <p className="mt-10 text-sm text-black/25">
                <Link href="/dashboard?tab=referrals" className="hover:text-black/50 transition-colors">
                  Refer a friend → Get a free month
                </Link>
              </p>
            </motion.div>

            {/* Right - Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/[0.03] border border-black/10 rounded-2xl p-8"
            >
              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-light tracking-tight">${price}</span>
                  <span className="text-lg text-black/40">/{period}</span>
                </div>
                <p className="mt-2 text-sm text-black/40">per seat · cancel anytime</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {PLAN.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-black/30 flex-shrink-0" />
                    <span className="text-sm text-black/60">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a href={`https://creem.io/checkout/${PLAN.creemProductId}`} target="_blank" rel="noopener noreferrer" className="block">
                <button className="group w-full py-3.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-black/90 transition-all flex items-center justify-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200" />
                  Start free trial
                </button>
              </a>
              <p className="text-center text-black/30 text-xs mt-3">7 days free · No credit card</p>
            </motion.div>

          </div>
        </div>
      </main>

    </div>
  );
}
