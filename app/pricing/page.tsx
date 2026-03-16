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
import { Syne } from 'next/font/google';

const syneFont = Syne({ subsets: ['latin'] });

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

const CONTACT_TIERS = [1, 2, 4, 8, 12]; // Weddings per month tiers

export default function PricingPage() {
  const { data: session } = useSession();
  const [weddings, setWeddings] = useState([2]); // Default to 2 weddings

  const currentWeddings = weddings[0];

  const getSoloPrice = () => 79.99;
  const getStudioPrice = () => 199.99;

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
           className="max-w-5xl mx-auto"
        >
          <h1 className={`${syneFont.className} text-[36px] md:text-[52px] tracking-tighter font-semibold text-[#1a1a1a] leading-[1.1] mb-6 font-syne`}>
            Give your films the time they deserve.
          </h1>
          <p className="text-[17px] md:text-[19px] text-zinc-500 font-normal max-w-xl mx-auto leading-relaxed">
            Stop spending weekends buried in timelines. Quartz builds story-driven, NLE-ready wedding sequences while you sleep.
          </p>
        </motion.div>
      </section>

      {/* Slider Section */}
      <section className="w-full max-w-md mx-auto px-6 mb-24 text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
            <span className="text-[14px] font-syne tracking-tight text-black font-bold">{currentWeddings} weddings / month</span>
        </motion.div>
        <div className="relative group px-1">
            <Slider 
                defaultValue={[2]} 
                max={12} 
                min={1} 
                step={1} 
                value={weddings}
                onValueChange={(val) => setWeddings(Array.isArray(val) ? val : [val])}
                className="w-full"
            />
            {/* Custom Markers */}
            <div className="absolute top-8 left-0 right-0 flex justify-between px-1">
                {[1, 2, 4, 8, 12].map((mark) => (
                    <span 
                      key={mark} 
                      className={`text-[10px] font-mono transition-all duration-300 ${currentWeddings === mark ? "text-black font-bold scale-110" : "text-zinc-200"}`}
                    >
                      {mark}
                    </span>
                ))}
            </div>
        </div>
      </section>

      {/* Pricing Cards Container */}
      <section className="w-full max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          
          {/* Solo Plan */}
          <div className={`p-8 rounded-2xl bg-white border border-zinc-200 flex flex-col shadow-sm transition-opacity duration-300 ${currentWeddings > 4 ? 'opacity-50 grayscale' : 'opacity-100'}`}>
            <h2 className="text-[20px] font-bold tracking-tight mb-4">Quartz Solo</h2>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[40px] font-bold tracking-tighter">$79.99</span>
                <span className="text-zinc-500 text-sm font-medium">/mo</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                Perfect for independent wedding filmmakers. Up to 4 weddings/month.
            </p>
            
            <div className="space-y-4 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#050504]">Includes:</p>
                <div className="space-y-3">
                    {[
                      'Up to 4 weddings per month',
                      'All core features: ingest, sync, culling',
                      'Ceremony, reception, and highlight sequences',
                      'Premiere, Resolve, and FCP support',
                      'Standard processing'
                    ].map((f) => (
                        <div key={f} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                            <span className="text-sm text-zinc-500">{f}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Link href="/signup" className="mt-auto w-full bg-black text-white rounded-xl h-12 flex items-center justify-center text-[14px] font-semibold hover:bg-black/80 transition-colors">
              Start Free Trial
            </Link>
          </div>

          {/* Studio Plan - Highlighted */}
          <div className="p-8 rounded-2xl bg-[#050504] border border-[#050504] flex flex-col shadow-xl relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-zinc-400 rotate-12 opacity-50 group-hover:opacity-80 transition-opacity">
                <Sparkle weight="fill" className="w-12 h-12" />
            </div>

            <h2 className="text-[20px] font-bold tracking-tight text-white mb-4">Quartz Studio</h2>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[40px] font-bold tracking-tighter text-white">$199.99</span>
                <span className="text-zinc-400 text-sm font-medium">/mo</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                Built for small studios and multi-shooter teams. Up to 12 weddings/month.
            </p>
            
            <div className="space-y-4 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Includes:</p>
                <div className="space-y-3">
                    {[
                      'Up to 12 weddings per month',
                      'All Solo features included',
                      'Multiple team seats',
                      'Priority processing queue',
                      'Batch upload multiple weddings'
                    ].map((f) => (
                        <div key={f} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                            <span className="text-sm text-zinc-400 underline decoration-zinc-800 underline-offset-4">{f}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Link href="/signup" className="mt-auto w-full bg-white text-black rounded-xl h-12 flex items-center justify-center text-[14px] font-semibold hover:bg-zinc-200 transition-colors">
              Get Started
            </Link>
          </div>

        </div>

        {/* Social Addon - Subdued secondary element as in strategy */}
        <div className="mt-12 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center">
              <Sparkle weight="duotone" className="w-6 h-6 text-[#050504]" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold tracking-tight">Quartz Social Add-on</h3>
              <p className="text-sm text-zinc-500">Unlimited vertical reel generation from your highlights + AI captions.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">+$20.00 <span className="text-xs text-zinc-400 font-normal">/mo</span></span>
            <Link href="/signup" className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black/80 transition-colors">
              Add to Plan
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-20 text-center max-w-2xl px-6">
        <p className="text-sm font-medium text-zinc-600 mb-2">
          "Outsourcing a single wedding edit costs $250-$400. Quartz Solo handles 4 weddings for $79.99—that's under $20 per wedding."
        </p>
        <p className="text-xs text-zinc-400">
          All plans include Premiere Pro, Resolve, and Final Cut Pro support. 2 weddings free trial.
        </p>
      </div>

    </main>
  );
}
