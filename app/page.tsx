'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// Smooth scroll link component
const SmoothLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <motion.a 
    href={href} 
    className={className}
    whileHover={{ opacity: 0.6 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.a>
);


// Magnetic button component
const MagneticButton = ({ children, className = '', ...props }: React.ComponentProps<typeof motion.button> & { className?: string }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.15;
    const y = (clientY - top - height / 2) * 0.15;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
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

const features = [
  { title: 'AUTOSYNC™', desc: 'Multi-camera alignment with sub-frame accuracy', num: '01' },
  { title: 'AUTOSELECT™', desc: 'AI identifies vows, laughter, and key moments', num: '02' },
  { title: 'AUTOFLOW™', desc: 'Edits shaped around emotional rhythm', num: '03' },
  { title: 'AUDIO CLEANUP', desc: 'Wind, hum, and noise removed automatically', num: '04' },
];

const stats = [
  { value: '47', label: 'EMOTION MARKERS', suffix: '' },
  { value: '10', label: 'HOUR TURNAROUND', suffix: 'hr' },
  { value: '4K', label: 'RESOLUTION', suffix: '' },
  { value: '99', label: 'SATISFACTION', suffix: '%' },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const [cursorVariant, setCursorVariant] = useState('default');
  
  // Parallax values
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Loading state
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Custom cursor
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] text-white min-h-screen selection:bg-white selection:text-black">
      {/* Custom Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed w-4 h-4 pointer-events-none z-[100] mix-blend-difference hidden lg:block"
        animate={cursorVariant}
        variants={{
          default: { scale: 1, backgroundColor: '#fff' },
          text: { scale: 3, backgroundColor: '#fff' },
          button: { scale: 2.5, backgroundColor: '#fff' },
        }}
        style={{ borderRadius: '50%', transform: 'translate(-50%, -50%)' }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 mix-blend-difference"
      >
        <div className="flex items-center justify-between h-20 px-8 lg:px-16">
          <Link href="/" className="text-[13px] tracking-[0.5em] font-medium text-white">
            VELLUM
          </Link>
          
          <div className="hidden md:flex items-center gap-12 text-[11px] tracking-[0.2em]">
            <SmoothLink href="#work" className="text-white/60 hover:text-white">WORK</SmoothLink>
            <SmoothLink href="#about" className="text-white/60 hover:text-white">ABOUT</SmoothLink>
            <Link href="/pricing" className="text-white/60 hover:text-white transition-opacity">PRICING</Link>
          </div>

          <motion.a
            href="#"
            className="text-[11px] tracking-[0.2em] text-white flex items-center gap-2"
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            whileHover={{ gap: '12px' }}
          >
            START TRIAL
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen flex flex-col justify-end pb-24 px-8 lg:px-16 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#111]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Hero content */}
        <div className="relative z-10">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-8"
          >
            <span className="text-[10px] tracking-[0.5em] text-white/40">
              AI VIDEO EDITING FOR WEDDING FILMMAKERS
            </span>
          </motion.div>

          {/* Main headline */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%' }}
              animate={isLoaded ? { y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(48px,12vw,180px)] font-light leading-[0.85] tracking-[-0.03em]"
              onMouseEnter={() => setCursorVariant('text')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              EDIT LESS.
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%' }}
              animate={isLoaded ? { y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(48px,12vw,180px)] font-light leading-[0.85] tracking-[-0.03em] text-white/20"
            >
              CREATE MORE.
            </motion.h1>
          </div>

          {/* Bottom info row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col md:flex-row md:items-end justify-between mt-16 gap-8"
          >
            <p className="text-[14px] md:text-[16px] leading-relaxed text-white/50 max-w-md">
              AI-powered precision editing that transforms hours of wedding footage 
              into cinematic stories. Built for professionals.
            </p>

            <div className="flex items-center gap-8">
              <MagneticButton
                className="group flex items-center gap-4 text-[11px] tracking-[0.2em]"
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <span className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <Play className="w-4 h-4 ml-1" />
                </span>
                WATCH REEL
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* Marquee Section */}
      <section className="py-8 border-y border-white/10 overflow-hidden">
        <Marquee speed={40}>
          <div className="flex items-center gap-16 px-8 text-[11px] tracking-[0.3em] text-white/30">
            <span>PREMIERE PRO</span>
            <span className="text-white/10">◆</span>
            <span>FINAL CUT</span>
            <span className="text-white/10">◆</span>
            <span>DAVINCI RESOLVE</span>
            <span className="text-white/10">◆</span>
            <span>CAPCUT PRO</span>
            <span className="text-white/10">◆</span>
            <span>PREMIERE PRO</span>
            <span className="text-white/10">◆</span>
            <span>FINAL CUT</span>
            <span className="text-white/10">◆</span>
            <span>DAVINCI RESOLVE</span>
            <span className="text-white/10">◆</span>
            <span>CAPCUT PRO</span>
            <span className="text-white/10">◆</span>
          </div>
        </Marquee>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="text-[clamp(48px,8vw,96px)] font-light tracking-[-0.02em] leading-none">
                  {stat.value}
                  <span className="text-white/30">{stat.suffix}</span>
                </div>
                <div className="text-[10px] tracking-[0.3em] text-white/30 mt-4">
                  {stat.label}
                </div>
                <motion.div 
                  className="absolute bottom-0 left-0 h-[1px] bg-white/20"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Full Width Image */}
      <section id="about" className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]/50 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop)'
          }}
        />
        
        <div className="relative z-20 px-8 lg:px-16 py-32 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] tracking-[0.5em] text-white/40 block mb-8">ABOUT</span>
            <h2 className="text-[clamp(32px,5vw,64px)] font-light leading-[1.1] tracking-[-0.02em]">
              We believe editing should feel like{' '}
              <span className="italic text-white/40">creating</span>, not labor.
            </h2>
            <p className="mt-12 text-[16px] leading-[1.8] text-white/50 max-w-xl">
              Our AI engine analyzes 47 emotional markers per frame. It understands context, 
              anticipates narrative beats, and crafts films that feel intentionally human—because 
              the best technology is invisible.
            </p>
            <motion.a
              href="#"
              className="inline-flex items-center gap-3 mt-12 text-[11px] tracking-[0.2em] group"
              whileHover={{ gap: '16px' }}
            >
              <span>OUR STORY</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="work" className="py-32 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <span className="text-[10px] tracking-[0.5em] text-white/40">CAPABILITIES</span>
          </motion.div>

          <div className="space-y-0">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
                className="group border-t border-white/10 py-12 cursor-pointer"
                onMouseEnter={() => setCursorVariant('text')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 text-[12px] text-white/20 font-mono">
                    {feature.num}
                  </div>
                  <motion.div 
                    className="col-span-5 lg:col-span-4"
                    whileHover={{ x: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-[clamp(24px,3vw,42px)] font-light tracking-[-0.02em] group-hover:text-white/60 transition-colors duration-500">
                      {feature.title}
                    </h3>
                  </motion.div>
                  <div className="col-span-5 lg:col-span-6 text-[14px] text-white/40 group-hover:text-white/60 transition-colors duration-500">
                    {feature.desc}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <motion.div
                      initial={{ rotate: 0, opacity: 0 }}
                      whileHover={{ rotate: 45, opacity: 1 }}
                      className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-white text-black">
        <div className="px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] tracking-[0.5em] text-black/40">PROCESS</span>
              <h2 className="mt-8 text-[clamp(36px,5vw,64px)] font-light leading-[1.05] tracking-[-0.02em]">
                Four steps to cinematic
              </h2>
              <p className="mt-8 text-[16px] leading-[1.8] text-black/50 max-w-md">
                From raw footage to timeline-ready sequences. 
                Upload, let AI work, refine, and export directly to your NLE.
              </p>
            </motion.div>

            <div className="space-y-12">
              {['Upload all cameras', 'AI builds assembly', 'Refine your edit', 'Export to NLE'].map((step, idx) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex items-start gap-8 group"
                >
                  <span className="text-[48px] font-light text-black/10 leading-none group-hover:text-black/30 transition-colors">
                    0{idx + 1}
                  </span>
                  <div className="pt-4">
                    <h3 className="text-[20px] font-light">{step}</h3>
                    <motion.div 
                      className="h-[1px] bg-black/20 mt-4 origin-left"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-8 lg:px-16 bg-[#050505]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-[10px] tracking-[0.5em] text-white/40">PRICING</span>
            <h2 className="mt-8 text-[clamp(36px,5vw,56px)] font-light tracking-[-0.02em]">
              Simple, transparent pricing
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Starter */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative border border-white/10 p-10 lg:p-12 hover:border-white/30 transition-colors duration-500"
            >
              <div className="flex items-start justify-between mb-12">
                <div>
                  <span className="text-[10px] tracking-[0.3em] text-white/40">STARTER</span>
                  <p className="text-[11px] text-white/30 mt-2">2 weddings/month</p>
                </div>
                <div className="text-right">
                  <span className="text-[48px] font-light">$129</span>
                  <span className="text-white/30 text-[14px]">/mo</span>
                </div>
              </div>
              
              <div className="space-y-4 text-[14px] text-white/50">
                {['Multi-cam sync', 'Speech extraction', 'Story recommendations', 'Rough-cut generation', 'XML export'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-12 w-full py-4 border border-white/20 text-[11px] tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500"
              >
                START FREE TRIAL
              </motion.button>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative bg-white text-black p-10 lg:p-12"
            >
              <div className="absolute top-0 right-0 px-4 py-2 bg-black text-white text-[9px] tracking-[0.3em]">
                POPULAR
              </div>
              
              <div className="flex items-start justify-between mb-12">
                <div>
                  <span className="text-[10px] tracking-[0.3em] text-black/40">PRO</span>
                  <p className="text-[11px] text-black/30 mt-2">4 weddings/month</p>
                </div>
                <div className="text-right">
                  <span className="text-[48px] font-light">$249</span>
                  <span className="text-black/30 text-[14px]">/mo</span>
                </div>
              </div>
              
              <div className="space-y-4 text-[14px] text-black/60">
                {['Everything in Starter', 'Full timeline assembly', 'AI shot rating', 'Music beat sync', 'Priority processing'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-black/40 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-12 w-full py-4 bg-black text-white text-[11px] tracking-[0.2em] hover:bg-black/80 transition-all duration-500"
              >
                START FREE TRIAL
              </motion.button>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-[12px] text-white/30"
          >
            7-day free trial. No credit card required. Cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 lg:px-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-[clamp(36px,6vw,72px)] font-light leading-[1.05] tracking-[-0.02em]">
              Ready to transform
              <br />
              <span className="text-white/30">your workflow?</span>
            </h2>
            
            <motion.div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
              <MagneticButton
                className="px-12 py-5 bg-white text-black text-[11px] tracking-[0.2em] hover:bg-white/90 transition-colors"
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                START FREE TRIAL
              </MagneticButton>
              
              <motion.a
                href="#"
                className="flex items-center gap-3 text-[11px] tracking-[0.2em] text-white/50 hover:text-white transition-colors"
                whileHover={{ gap: '16px' }}
              >
                SCHEDULE DEMO
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="px-8 lg:px-16 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-16 lg:gap-8">
              <div className="lg:col-span-2">
                <span className="text-[13px] tracking-[0.5em]">VELLUM</span>
                <p className="mt-4 text-[14px] text-white/40 max-w-sm">
                  AI-powered video editing engineered for wedding filmmakers. Edit less. Create more.
                </p>
              </div>
              
              <div>
                <span className="text-[10px] tracking-[0.3em] text-white/30">PRODUCT</span>
                <div className="mt-6 space-y-4 text-[13px] text-white/50">
                  <a href="#" className="block hover:text-white transition-colors">Features</a>
                  <Link href="/pricing" className="block hover:text-white transition-colors">Pricing</Link>
                  <a href="#" className="block hover:text-white transition-colors">Changelog</a>
                </div>
              </div>
              
              <div>
                <span className="text-[10px] tracking-[0.3em] text-white/30">COMPANY</span>
                <div className="mt-6 space-y-4 text-[13px] text-white/50">
                  <a href="#" className="block hover:text-white transition-colors">About</a>
                  <a href="#" className="block hover:text-white transition-colors">Contact</a>
                  <a href="#" className="block hover:text-white transition-colors">Twitter</a>
                </div>
              </div>
            </div>
            
            <div className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-[11px] text-white/30">
              <span>© 2024 Vellum. All rights reserved.</span>
              <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
