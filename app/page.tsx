'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Play, Zap, Layers, Wand2, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

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

// Text reveal animation
const TextReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  </div>
);

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
  const { scrollYProgress } = useScroll();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Parallax values
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const videoScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const capabilities = [
    { icon: Zap, title: 'AUTOSYNC™', desc: 'Multi-camera alignment with sub-frame accuracy' },
    { icon: Wand2, title: 'AUTOSELECT™', desc: 'AI identifies vows, laughter, and key moments' },
    { icon: Layers, title: 'AUTOFLOW™', desc: 'Edits shaped around emotional rhythm' },
    { icon: Volume2, title: 'AUDIO CLEANUP', desc: 'Wind, hum, and noise removed automatically' },
  ];

  return (
    <div ref={containerRef} className="bg-[#050505] text-white min-h-screen selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="flex items-center justify-between h-20 px-6 lg:px-12">
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

      {/* Hero Section - Full viewport with video */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen"
      >
        {/* Video container */}
        <motion.div 
          style={{ scale: videoScale }}
          className="absolute inset-6 lg:inset-10 top-24 rounded-2xl overflow-hidden"
        >
          {/* Video background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          
          {/* Placeholder for video - replace with actual video */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={isLoaded ? { scale: 1 } : {}}
              transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group"
            >
              <Play className="w-8 h-8 ml-1 text-white/60 group-hover:text-white transition-colors" />
            </motion.div>
          </div>
          
          {/* Subtle grid overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </motion.div>

        {/* Hero text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <TextReveal delay={0.3}>
                  <h1 className="text-[clamp(42px,10vw,140px)] font-light leading-[0.9] tracking-[-0.04em]">
                    Edit less
                  </h1>
                </TextReveal>
                <TextReveal delay={0.4}>
                  <h1 className="text-[clamp(42px,10vw,140px)] font-light leading-[0.9] tracking-[-0.04em] text-white/25">
                    Create more
                  </h1>
                </TextReveal>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 1 } : {}}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="lg:text-right lg:pb-4"
              >
                <p className="text-[15px] leading-[1.7] text-white/40 max-w-md lg:ml-auto">
                  AI-powered precision editing that transforms hours of wedding footage into cinematic stories.
                </p>
                <div className="flex lg:justify-end gap-6 mt-6">
                  <a href="#" className="text-[11px] tracking-[0.15em] flex items-center gap-2 group">
                    <span className="text-white/60 group-hover:text-white transition-colors">WATCH DEMO</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Corner decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute top-28 right-12 lg:right-16 hidden lg:block"
        >
          <div className="text-[10px] tracking-[0.3em] text-white/20 writing-mode-vertical">
            SCROLL TO EXPLORE
          </div>
        </motion.div>
      </motion.section>

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

      {/* Bento Grid Section */}
      <section className="py-24 lg:py-40 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <Reveal>
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-20 mb-16 lg:mb-24">
              <h2 className="text-[clamp(28px,4vw,48px)] font-light leading-[1.1] tracking-[-0.02em]">
                From camera to timeline<br />
                <span className="text-white/30">in minutes.</span>
              </h2>
              <p className="text-[15px] leading-[1.8] text-white/40 lg:pt-2 max-w-md">
                Our AI engine analyzes 47 emotional markers per frame. It understands context, 
                anticipates narrative beats, and crafts films that feel intentionally human.
              </p>
            </div>
          </Reveal>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large feature card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 lg:row-span-2 group relative bg-white/[0.02] rounded-2xl p-8 lg:p-12 border border-white/[0.06] hover:border-white/10 transition-colors overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 h-full flex flex-col">
                <span className="text-[10px] tracking-[0.3em] text-white/30">01</span>
                <h3 className="text-[clamp(24px,3vw,36px)] font-light mt-4 mb-4 tracking-[-0.02em]">
                  Auto-Ingest
                </h3>
                <p className="text-[14px] text-white/40 leading-relaxed max-w-md">
                  Drop your SD card. VELLUM scans, sorts, and organizes every file by camera, 
                  timestamp, and content type. No manual organization needed.
                </p>
                
                {/* Visual element */}
                <div className="mt-auto pt-12">
                  <div className="flex gap-3">
                    {[80, 110, 70, 100, 90].map((height, i) => (
                      <motion.div
                        key={i}
                        className="bg-white/[0.03] rounded-lg flex-1"
                        initial={{ height }}
                        whileHover={{ height: height + 20 }}
                        style={{ height }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Smaller feature cards */}
            {[
              { num: '02', title: 'AI Analysis', desc: 'Our engine analyzes audio peaks, facial expressions, and scene composition.' },
              { num: '03', title: 'Smart Assembly', desc: 'Receive a rough-cut timeline built around emotional beats.' },
              { num: '04', title: 'Export Ready', desc: 'Direct XML export to Premiere, Final Cut, and DaVinci Resolve.' },
              { num: '05', title: 'Audio Polish', desc: 'Automatic wind, hum, and noise removal with AI enhancement.' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group relative bg-white/[0.02] rounded-2xl p-6 lg:p-8 border border-white/[0.06] hover:border-white/10 transition-colors"
              >
                <span className="text-[10px] tracking-[0.3em] text-white/30">{feature.num}</span>
                <h3 className="text-[18px] font-light mt-3 mb-2">{feature.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-24 lg:py-32 border-t border-white/[0.06]">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          {capabilities.map((cap) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="group border-b border-white/[0.06] py-10 lg:py-14 cursor-pointer"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 hidden lg:block">
                  <cap.icon className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
                <motion.div 
                  className="col-span-12 lg:col-span-5"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-[clamp(22px,2.5vw,32px)] font-light tracking-[-0.02em] group-hover:text-white/70 transition-colors">
                    {cap.title}
                  </h3>
                </motion.div>
                <div className="col-span-10 lg:col-span-5 text-[14px] text-white/30 group-hover:text-white/50 transition-colors">
                  {cap.desc}
                </div>
                <div className="col-span-2 lg:col-span-1 flex justify-end">
                  <motion.div
                    initial={{ opacity: 0, rotate: 0 }}
                    whileHover={{ opacity: 1, rotate: 45 }}
                    className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center group-hover:border-white/30 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4 text-white/40" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-24 lg:py-32 bg-white text-black">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { value: '47', label: 'Emotion markers', suffix: '' },
              { value: '10', label: 'Hour turnaround', suffix: 'hr' },
              { value: '4K', label: 'Resolution', suffix: '' },
              { value: '99', label: 'Satisfaction rate', suffix: '%' },
            ].map((stat, idx) => (
              <Reveal key={stat.label} delay={idx * 0.1}>
                <div className="relative">
                  <div className="text-[clamp(40px,7vw,80px)] font-light tracking-[-0.03em] leading-none">
                    {stat.value}
                    <span className="text-black/20">{stat.suffix}</span>
                  </div>
                  <div className="text-[12px] tracking-[0.1em] text-black/40 mt-3 uppercase">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Asymmetric layout */}
      <section id="about" className="py-24 lg:py-40 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
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
      <section className="py-24 lg:py-32 px-6 lg:px-12 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
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
      <section className="py-32 lg:py-48 px-6 lg:px-12 relative overflow-hidden">
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
        <div className="px-6 lg:px-12 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
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
