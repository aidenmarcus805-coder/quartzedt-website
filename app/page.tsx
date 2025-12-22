'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight, Minus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for 3D scene (client-side only)
const CameraScene = dynamic<{ lowPowerMode?: boolean }>(() => import('./components/CameraScene'), { 
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border border-white/10 border-t-white rounded-full animate-spin" />
        <span className="text-[10px] tracking-[0.5em] text-white/20">LOADING</span>
      </div>
    </div>
  )
});

// Reveal animation wrapper - more subtle
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  
  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const firstWhiteRef = useRef<HTMLElement | null>(null);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  // Switch the 3D scene into low-power mode once the first white block starts entering view.
  // This keeps the hero silky when you're up top, and saves GPU/CPU when you're scrolling content.
  useEffect(() => {
    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = firstWhiteRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // Only kick in once the hero is fully off-screen, and the first white block is entering view.
      const next = window.scrollY >= window.innerHeight && rect.top <= window.innerHeight;
      setLowPowerMode(next);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const capabilities = [
    { num: '01', title: 'AUTOSYNC', desc: 'Multi-camera alignment with sub-frame accuracy' },
    { num: '02', title: 'AUTOSELECT', desc: 'AI identifies vows, laughter, and key moments' },
    { num: '03', title: 'AUTOFLOW', desc: 'Edits shaped around emotional rhythm' },
    { num: '04', title: 'AUDIO CLEANUP', desc: 'Wind, hum, and noise removed automatically' },
  ];

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen selection:bg-white selection:text-black antialiased">
      
      {/* Navigation - minimal, aligned to grid */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="fixed top-0 left-0 right-0 z-[100] mix-blend-difference"
      >
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 h-24 flex items-center justify-between">
          <Link href="/" className="text-[11px] tracking-[0.5em] font-light">
            VELLUM
          </Link>
          
          <div className="hidden md:flex items-center gap-16 text-[10px] tracking-[0.4em] font-light">
            <a href="#work" className="hover:opacity-50 transition-opacity">WORK</a>
            <Link href="/about" className="hover:opacity-50 transition-opacity">ABOUT</Link>
            <Link href="/pricing" className="hover:opacity-50 transition-opacity">PRICING</Link>
          </div>

          <button className="text-[10px] tracking-[0.4em] font-light hover:opacity-50 transition-opacity">
            CONTACT
          </button>
        </div>
      </motion.nav>

      {/* Hero Section - 3D Monitor with integrated overlay */}
      <section ref={heroRef}>
        <CameraScene lowPowerMode={lowPowerMode} />
      </section>

      {/* Capabilities Section - Golden Ratio Grid */}
      <section id="work" className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16">
          {capabilities.map((cap, idx) => (
            <Reveal key={cap.title} delay={idx * 0.1}>
              <motion.div
                className="group border-b border-white/5 py-16 md:py-20 cursor-pointer"
                whileHover={{ backgroundColor: 'rgba(238,236,232,0.01)' }}
                transition={{ duration: 0.4 }}
              >
                {/* Grid: Number (8.3%) | Title (33.3%) | Description (58.3%) */}
                <div className="grid grid-cols-12 gap-8 items-start">
                  {/* Number - rule of thirds alignment */}
                  <div className="col-span-1">
                    <span className="text-[10px] tracking-[0.3em] text-white/20 group-hover:text-white/40 transition-colors">
                      {cap.num}
                    </span>
                  </div>
                  
                  {/* Title - golden ratio position */}
                  <div className="col-span-11 md:col-span-4">
                    <h3 className="text-[24px] md:text-[32px] font-light tracking-[-0.02em] leading-[1.1] group-hover:text-white/70 transition-colors">
                      {cap.title}
                    </h3>
                  </div>
                  
                  {/* Description - remaining space */}
                  <div className="col-span-11 col-start-2 md:col-span-7 md:col-start-6 flex items-start justify-between gap-8">
                    <p className="text-[15px] md:text-[17px] font-light leading-[1.7] text-white/40 group-hover:text-white/60 transition-colors">
                      {cap.desc}
                    </p>
                    <ArrowRight className="w-5 h-5 mt-1 text-white/0 group-hover:text-white/30 transition-all shrink-0" />
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats Row - High Contrast Inversion */}
      <section ref={firstWhiteRef} className="bg-paper text-black border-y border-black/5">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-16 lg:gap-24">
            {[
              { value: '47', label: 'EMOTION MARKERS', suffix: '' },
              { value: '<10', label: 'HOUR TURNAROUND', suffix: '' },
              { value: '99', label: 'SATISFACTION RATE', suffix: '%' },
            ].map((stat, idx) => (
              <Reveal key={stat.label} delay={idx * 0.15}>
                <div className="relative space-y-8">
                  <div className="text-[80px] md:text-[104px] font-extralight tracking-[-0.05em] leading-[0.85]">
                    {stat.value}
                    <span className="text-black/10">{stat.suffix}</span>
                  </div>
                  <div className="text-[10px] tracking-[0.5em] text-black/25 font-light">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section - Golden Ratio: 38.2% / 61.8% */}
      <section className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            {/* Left: Image (5 cols = 41.6%, close to golden) */}
            <div className="lg:col-span-5">
              <Reveal>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center grayscale"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop)',
                      filter: 'contrast(1.2) brightness(0.7)'
                    }}
                  />
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                </div>
              </Reveal>
            </div>
            
            {/* Right: Text (7 cols = 58.3%, close to golden) */}
            <div className="lg:col-span-7 space-y-12">
              <Reveal>
                <div className="space-y-8">
                  <p className="text-[10px] tracking-[0.5em] text-white/30 font-light">
                    PHILOSOPHY
                  </p>
                  <h2 className="text-[36px] md:text-[56px] font-extralight leading-[1.1] tracking-[-0.03em] max-w-2xl">
                    Technology that respects 
                    <span className="text-white/30"> the artist.</span>
                  </h2>
                </div>
              </Reveal>
              
              <Reveal delay={0.2}>
                <div className="space-y-6 max-w-xl">
                  <p className="text-[15px] md:text-[17px] font-light leading-[1.8] text-white/50">
                    Our AI analyzes 47 emotional markers per frame. It understands context, 
                    anticipates narrative beats, and crafts films that feel intentionally human.
                  </p>
                  <p className="text-[15px] md:text-[17px] font-light leading-[1.8] text-white/50">
                    Because the best technology is invisible.
                  </p>
                  
                  {/* Minimal CTA */}
                  <div className="pt-8">
                    <button className="group inline-flex items-center gap-4 text-[10px] tracking-[0.4em] text-white/40 hover:text-white transition-colors">
                      <Minus className="w-8 h-[1px] text-white/20 group-hover:text-white/60 transition-colors" />
                      LEARN MORE
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Minimal Grid */}
      <section className="bg-paper text-black border-y border-black/5">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-40">
          <Reveal>
            <div className="mb-20">
              <h2 className="text-[42px] md:text-[64px] font-extralight tracking-[-0.04em] leading-[1.05]">
                Simple pricing.<br />
                <span className="text-black/20">No subscriptions.</span>
              </h2>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-2 gap-px bg-black/5">
            {/* Lite */}
            <Reveal delay={0.1}>
              <div className="bg-paper p-12 md:p-16 group hover:bg-black hover:text-white transition-all duration-500">
                <div className="space-y-12">
                  <div>
                    <p className="text-[10px] tracking-[0.4em] text-black/30 group-hover:text-white/30 mb-8">
                      LITE
                    </p>
                    <div className="text-[64px] md:text-[80px] font-extralight tracking-[-0.04em] leading-none">
                      $79
                    </div>
                    <p className="text-[14px] text-black/40 group-hover:text-white/40 mt-4 font-light">
                      One-time purchase
                    </p>
                  </div>
                  
                  <p className="text-[15px] font-light leading-[1.7] text-black/60 group-hover:text-white/60">
                    Essential editing tools for getting started with AI-powered workflows.
                  </p>
                  
                  <button className="w-full border border-black/10 group-hover:border-white/20 py-5 text-[10px] tracking-[0.4em] hover:bg-black hover:text-white group-hover:hover:bg-paper group-hover:hover:text-black transition-all">
                    BUY LITE
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Max */}
            <Reveal delay={0.2}>
              <div className="bg-black text-white p-12 md:p-16 relative group hover:bg-paper hover:text-black transition-all duration-500">
                <div className="absolute top-8 right-8 w-2 h-2 bg-paper group-hover:bg-black rounded-full" />
                
                <div className="space-y-12">
                  <div>
                    <p className="text-[10px] tracking-[0.4em] text-white/30 group-hover:text-black/30 mb-8">
                      MAX
                    </p>
                    <div className="text-[64px] md:text-[80px] font-extralight tracking-[-0.04em] leading-none">
                      $149
                    </div>
                    <p className="text-[14px] text-white/40 group-hover:text-black/40 mt-4 font-light">
                      One-time purchase
          </p>
        </div>
                  
                  <p className="text-[15px] font-light leading-[1.7] text-white/60 group-hover:text-black/60">
                    Full professional suite with all features and priority support.
                  </p>
                  
                  <button className="w-full border border-white/20 group-hover:border-black/10 py-5 text-[10px] tracking-[0.4em] hover:bg-paper hover:text-black group-hover:hover:bg-black group-hover:hover:text-white transition-all">
                    BUY MAX
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <Reveal delay={0.3}>
            <div className="mt-16 text-center">
              <Link 
                href="/pricing" 
                className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] text-black/30 hover:text-black transition-colors group"
              >
                <Minus className="w-8 h-[1px] text-black/20 group-hover:text-black/40 transition-colors" />
                VIEW FULL COMPARISON
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Section - Centered, Minimal */}
      <section className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-40 md:py-56">
          <div className="max-w-4xl mx-auto text-center space-y-16">
            <Reveal>
              <h2 className="text-[48px] md:text-[80px] font-extralight leading-[1.05] tracking-[-0.04em]">
                Edit less.
                <br />
                <span className="text-white/20">Create more.</span>
              </h2>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button className="px-12 py-5 bg-paper text-black text-[10px] tracking-[0.4em] hover:bg-paper/90 transition-colors font-light">
                  START FREE TRIAL
                </button>
                <button className="px-12 py-5 border border-white/10 text-[10px] tracking-[0.4em] text-white/60 hover:text-white hover:border-white/30 transition-colors font-light">
                  SCHEDULE DEMO
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer - Minimal Grid */}
      <footer className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-20 md:py-24">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
            {/* Brand - 5 cols (golden ratio) */}
            <div className="md:col-span-5 space-y-8">
              <span className="text-[11px] tracking-[0.5em] font-light">VELLUM</span>
              <p className="text-[15px] font-light leading-[1.8] text-white/40 max-w-md">
                AI-powered video editing engineered for filmmakers who value craft.
              </p>
            </div>
            
            {/* Links - 7 cols */}
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8">
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.4em] text-white/20 font-light">PRODUCT</span>
                <nav className="space-y-4 text-[13px] font-light">
                  <a href="#work" className="block text-white/40 hover:text-white transition-colors">Features</a>
                  <Link href="/pricing" className="block text-white/40 hover:text-white transition-colors">Pricing</Link>
                  <a href="#" className="block text-white/40 hover:text-white transition-colors">Changelog</a>
                </nav>
              </div>
              
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.4em] text-white/20 font-light">COMPANY</span>
                <nav className="space-y-4 text-[13px] font-light">
                  <Link href="/about" className="block text-white/40 hover:text-white transition-colors">About</Link>
                  <a href="#" className="block text-white/40 hover:text-white transition-colors">Contact</a>
                  <a href="#" className="block text-white/40 hover:text-white transition-colors">Careers</a>
                </nav>
              </div>
              
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.4em] text-white/20 font-light">LEGAL</span>
                <nav className="space-y-4 text-[13px] font-light">
                  <a href="#" className="block text-white/40 hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="block text-white/40 hover:text-white transition-colors">Terms</a>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-[10px] tracking-[0.3em] text-white/20 font-light">
              © 2024 VELLUM
            </p>
            <div className="flex items-center gap-8 text-[10px] tracking-[0.3em] text-white/20 font-light">
              <a href="#" className="hover:text-white/40 transition-colors">INSTAGRAM</a>
              <a href="#" className="hover:text-white/40 transition-colors">TWITTER</a>
              <a href="#" className="hover:text-white/40 transition-colors">YOUTUBE</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
