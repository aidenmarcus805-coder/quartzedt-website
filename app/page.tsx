'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Zap, Layers, Wand2, Volume2 } from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for 3D scene (client-side only)
const CameraScene = dynamic(() => import('./components/CameraScene'), { 
  ssr: false,
  loading: () => (
    <div className="h-[200vh] flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
        <span className="text-[10px] tracking-[0.2em] text-white/30">LOADING</span>
      </div>
    </div>
  )
});

// Reveal animation wrapper
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Horizontal Marquee
const Marquee = ({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) => (
  <div className="overflow-hidden whitespace-nowrap">
    <motion.div
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      className="inline-flex"
    >
      {children}
      {children}
    </motion.div>
  </div>
);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const capabilities = [
    { icon: Zap, title: 'AUTOSYNC™', desc: 'Multi-camera alignment with sub-frame accuracy' },
    { icon: Wand2, title: 'AUTOSELECT™', desc: 'AI identifies vows, laughter, and key moments' },
    { icon: Layers, title: 'AUTOFLOW™', desc: 'Edits shaped around emotional rhythm' },
    { icon: Volume2, title: 'AUDIO CLEANUP', desc: 'Wind, hum, and noise removed automatically' },
  ];

  return (
    <div ref={containerRef} className="bg-[#050505] text-white min-h-screen selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* Navigation - always on top */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        <div className="flex items-center justify-between h-20 px-4 lg:px-8">
          <Link href="/" className="text-[13px] tracking-[0.4em] font-medium">
            VELLUM
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.15em] text-white/50">
            <a href="#capabilities" className="hover:text-white transition-colors">CAPABILITIES</a>
            <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
            <Link href="/pricing" className="hover:text-white transition-colors">PRICING</Link>
          </div>

          <a
            href="#"
            className="text-[11px] tracking-[0.15em] text-white/50 hover:text-white transition-colors flex items-center gap-2"
          >
            START TRIAL
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.nav>

      {/* Hero Section - 3D Camera with integrated overlay */}
      <section ref={heroRef}>
        <CameraScene />
      </section>

      {/* Marquee */}
      <section className="py-6 border-y border-white/[0.06]">
        <Marquee speed={50}>
          <div className="flex items-center gap-20 px-10 text-[11px] tracking-[0.25em] text-white/20">
            {['PREMIERE PRO', 'FINAL CUT', 'DAVINCI RESOLVE', 'CAPCUT PRO', 'PREMIERE PRO', 'FINAL CUT', 'DAVINCI RESOLVE', 'CAPCUT PRO'].map((item, idx) => (
              <span key={idx} className="flex items-center gap-20">
                {item}
                <span className="text-white/10">◆</span>
              </span>
            ))}
          </div>
        </Marquee>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-24 lg:py-32 border-t border-white/[0.06]">
        <div className="px-4 lg:px-8">
          {capabilities.map((cap) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="group border-b border-white/[0.06] py-8 lg:py-12 cursor-pointer"
            >
              <div className="flex items-center gap-6 lg:gap-12">
                {/* Icon */}
                <div className="hidden lg:flex w-12 shrink-0">
                  <cap.icon className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
                
                {/* Title */}
                <motion.div 
                  className="w-full lg:w-[300px] shrink-0"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-[clamp(20px,2vw,28px)] font-light tracking-[-0.02em] group-hover:text-white/70 transition-colors">
                    {cap.title}
                  </h3>
                </motion.div>
                
                {/* Description */}
                <div className="hidden lg:block flex-1 text-[14px] text-white/30 group-hover:text-white/50 transition-colors">
                  {cap.desc}
                </div>
                
                {/* Arrow */}
                <div className="shrink-0 ml-auto">
                  <motion.div
                    whileHover={{ rotate: 45 }}
                    className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center group-hover:border-white/30 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ArrowUpRight className="w-4 h-4 text-white/40" />
                  </motion.div>
                </div>
              </div>
              
              {/* Mobile description */}
              <p className="lg:hidden text-[13px] text-white/30 mt-3">{cap.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-24 lg:py-32 bg-white text-black">
        <div className="px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {[
              { value: '47', label: 'Emotion markers', suffix: '' },
              { value: '10', label: 'Hour turnaround', suffix: 'hr' },
              { value: '4K', label: 'Resolution', suffix: '' },
              { value: '99', label: 'Satisfaction rate', suffix: '%' },
            ].map((stat, idx) => (
              <Reveal key={stat.label} delay={idx * 0.1}>
                <div className="relative lg:text-center">
                  <div className="text-[clamp(48px,8vw,96px)] font-light tracking-[-0.04em] leading-none">
                    {stat.value}
                    <span className="text-black/15">{stat.suffix}</span>
                  </div>
                  <div className="text-[11px] tracking-[0.2em] text-black/40 mt-4 uppercase">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Asymmetric layout */}
      <section id="about" className="py-24 lg:py-40 px-4 lg:px-8">
        <div className="max-w-none">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Image/Visual */}
            <div className="lg:col-span-5 lg:col-start-1">
              <Reveal>
                <div className="aspect-[4/5] bg-white/[0.02] rounded-2xl overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                </div>
              </Reveal>
            </div>
            
            {/* Text content */}
            <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
              <Reveal>
                <p className="text-[10px] tracking-[0.3em] text-white/30 mb-6">ABOUT VELLUM</p>
                <h2 className="text-[clamp(28px,4vw,48px)] font-light leading-[1.15] tracking-[-0.02em]">
                  We believe editing should feel like{' '}
                  <span className="italic text-white/40">creating</span>, not labor.
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-8 text-[15px] leading-[1.9] text-white/40">
                  Our AI engine analyzes 47 emotional markers per frame. It understands context, 
                  anticipates narrative beats, and crafts films that feel intentionally human—because 
                  the best technology is invisible.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 mt-10 text-[11px] tracking-[0.15em] group"
                >
                  <span className="text-white/60 group-hover:text-white transition-colors">OUR STORY</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-1 transition-transform" />
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 lg:py-32 px-4 lg:px-8 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <h2 className="text-[clamp(32px,5vw,56px)] font-light tracking-[-0.02em]">
              One-time purchase.<br />
              <span className="text-white/30">Yours forever.</span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <div className="grid md:grid-cols-2 gap-6 mt-16">
              {/* Lite */}
              <div className="text-left p-8 lg:p-10 border border-white/[0.08] rounded-2xl hover:border-white/20 transition-colors group">
                <span className="text-[10px] tracking-[0.3em] text-white/30">LITE</span>
                <div className="mt-6 mb-8">
                  <span className="text-[48px] font-light">$79</span>
                  <span className="text-white/30 text-[14px] ml-2">one-time</span>
                </div>
                <p className="text-[14px] text-white/40 mb-8">Essential editing tools for getting started.</p>
                <button className="w-full py-4 border border-white/20 rounded-lg text-[11px] tracking-[0.15em] hover:bg-white hover:text-black transition-all">
                  BUY LITE
                </button>
              </div>

              {/* Max */}
              <div className="text-left p-8 lg:p-10 bg-white text-black rounded-2xl relative overflow-hidden">
                <span className="absolute top-4 right-4 px-3 py-1 bg-black text-white text-[9px] tracking-[0.2em] rounded-full">POPULAR</span>
                <span className="text-[10px] tracking-[0.3em] text-black/40">MAX</span>
                <div className="mt-6 mb-8">
                  <span className="text-[48px] font-light">$149</span>
                  <span className="text-black/30 text-[14px] ml-2">one-time</span>
                </div>
                <p className="text-[14px] text-black/50 mb-8">Full professional suite with all features.</p>
                <button className="w-full py-4 bg-black text-white rounded-lg text-[11px] tracking-[0.15em] hover:bg-black/80 transition-all">
                  BUY MAX
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <Link 
              href="/pricing" 
              className="inline-flex items-center gap-2 mt-10 text-[11px] tracking-[0.15em] text-white/40 hover:text-white transition-colors"
            >
              VIEW ALL OPTIONS
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 lg:py-48 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-[clamp(32px,6vw,72px)] font-light leading-[1.05] tracking-[-0.03em]">
              Ready to transform<br />
              <span className="text-white/30">your workflow?</span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-10 py-4 bg-white text-black rounded-full text-[11px] tracking-[0.15em] hover:bg-white/90 transition-colors">
                START FREE TRIAL
              </button>
              <a
                href="#"
                className="flex items-center gap-2 px-8 py-4 text-[11px] tracking-[0.15em] text-white/50 hover:text-white transition-colors"
              >
                SCHEDULE DEMO
                <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="px-4 lg:px-8 py-16 lg:py-20">
          <div className="max-w-none">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
              <div className="lg:col-span-6">
                <span className="text-[13px] tracking-[0.4em]">VELLUM</span>
                <p className="mt-4 text-[14px] text-white/30 max-w-sm leading-relaxed">
                  AI-powered video editing engineered for wedding filmmakers. Edit less. Create more.
                </p>
              </div>
              
              <div className="lg:col-span-2">
                <span className="text-[10px] tracking-[0.2em] text-white/20">PRODUCT</span>
                <div className="mt-5 space-y-3 text-[13px] text-white/40">
                  <a href="#" className="block hover:text-white transition-colors">Features</a>
                  <Link href="/pricing" className="block hover:text-white transition-colors">Pricing</Link>
                  <a href="#" className="block hover:text-white transition-colors">Changelog</a>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <span className="text-[10px] tracking-[0.2em] text-white/20">COMPANY</span>
                <div className="mt-5 space-y-3 text-[13px] text-white/40">
                  <a href="#" className="block hover:text-white transition-colors">About</a>
                  <a href="#" className="block hover:text-white transition-colors">Contact</a>
                  <a href="#" className="block hover:text-white transition-colors">Twitter</a>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <span className="text-[10px] tracking-[0.2em] text-white/20">LEGAL</span>
                <div className="mt-5 space-y-3 text-[13px] text-white/40">
                  <a href="#" className="block hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="block hover:text-white transition-colors">Terms</a>
                </div>
              </div>
            </div>
            
            <div className="mt-20 pt-8 border-t border-white/[0.06] text-[11px] text-white/20">
              © 2024 Vellum. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
