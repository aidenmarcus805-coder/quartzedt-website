'use client';


import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';

declare global {
  interface Window {
    LemonSqueezy?: {
      Url: {
        Open: (url: string) => void;
      };
    };
  }
}


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
  lsVariantId: 'ad029df4-2bb2-45b2-bfa3-038e6938eb09', // Founding Member Plan
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
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
        <User className="w-4 h-4 text-white/70" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-[#111] shadow-2xl z-50 py-1">
            <div className="px-3 py-2 text-xs text-white/40 border-b border-white/5 mb-1">{session.user?.email}</div>
            <Link href="/dashboard" className="block px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link href="/dashboard/settings" className="block px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white" onClick={() => setIsOpen(false)}>Settings</Link>
            <button onClick={() => signOut()} className="w-full text-left px-3 py-2 text-sm text-white/50 hover:text-red-400 hover:bg-white/5">Sign out</button>
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
    <div className="min-h-screen relative bg-[#0a0a0a] text-white font-sans selection:bg-white/20 selection:text-white overflow-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <Link href="/">
            <Image src="/logo.png?v=20251223" alt="Quartz" width={100} height={25} className="h-4 w-auto brightness-200 contrast-125" unoptimized />
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/download" className="text-sm text-white/50 hover:text-white transition-colors hidden md:block">Download</Link>
            {session ? <UserMenu session={session} /> : (
              <Link href="/signin?next=/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Sign in</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Background - Subtle Texture Only */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <main className="min-h-screen flex items-center relative z-10 pt-20">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 w-full py-24">
          {/* Grid layout from page.tsx */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">

            {/* Left - Title + Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky lg:top-32 relative z-10"
            >
              <div className="flex items-center gap-2 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-white/40">50 spots</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-light tracking-[-0.04em] leading-[0.9] text-white mix-blend-difference mb-8">
                Pricing.
              </h1>

              <p className="text-lg text-white/40 font-light max-w-sm leading-relaxed mb-12">
                Everything included.
              </p>

              {/* Minimal Billing Toggle */}
              <div className="flex items-center p-1 bg-white/[0.03] rounded-full border border-white/10 w-fit backdrop-blur-md">
                <button
                  onClick={() => setBilling('monthly')}
                  className={`px-6 py-2.5 rounded-full text-sm transition-all duration-300 ${billing === 'monthly' ? 'bg-white text-black font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling('annual')}
                  className={`px-6 py-2.5 rounded-full text-sm transition-all duration-300 flex items-center gap-2 ${billing === 'annual' ? 'bg-white text-black font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white'}`}
                >
                  Annual
                  <span className={`text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded ${billing === 'annual' ? 'bg-accent/10 text-accent' : 'bg-white/5 text-white/30'}`}>
                    -17%
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Right - Editorial Pricing Card (Dark Monochrome) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Dark card - Dark Grey with White Text (Monochrome) */}
              <div className="bg-[#111] text-white rounded-2xl p-10 md:p-12 border border-white/10">

                <div className="mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl md:text-7xl font-light tracking-tight text-white">${price}</span>
                    <span className="text-xl text-white/40">/{period}</span>
                  </div>
                  <p className="text-white/40 text-sm mt-2">Billed {billing}, cancel anytime.</p>
                </div>

                <div className="space-y-4 mb-10 border-t border-white/5 pt-8">
                  {PLAN.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-white/40" />
                      <span className="text-[15px] text-white/70">{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const checkoutUrl = `https://quartzedt.lemonsqueezy.com/checkout/buy/${PLAN.lsVariantId}?checkout[email]=${session?.user?.email || ''}&embed=1&checkout[dark]=1`;

                    if (window.LemonSqueezy) {
                      window.LemonSqueezy.Url.Open(checkoutUrl);
                    } else {
                      window.open(checkoutUrl, '_blank');
                    }
                  }}
                  className="w-full py-4 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors"
                >
                  Start free trial
                </button>
                <p className="text-center text-white/30 text-xs mt-4">
                  7 day free trial · No credit card
                </p>
              </div>
            </motion.div>

          </div>
        </div >
      </main >

    </div >
  );
}
