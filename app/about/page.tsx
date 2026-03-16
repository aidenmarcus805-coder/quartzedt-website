'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight, Minus } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteLogoMenu } from '../components/SiteLogoMenu';

// Reveal animation wrapper
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

// Section number component
const SectionNum = ({ num, dark = false }: { num: string, dark?: boolean }) => (
  <span className={`text-[10px] tracking-[0.5em] font-light ${dark ? 'text-black/30' : 'text-white/20'}`}>
    {num}
  </span>
);

export default function About() {
  const navRef = useRef<HTMLElement | null>(null);
  const [navOnLight, setNavOnLight] = useState(false);

  const videographerStories = [
    {
      name: 'Marcus Chen',
      role: 'Wedding Cinematographer, 8 years',
      quote: 'I was spending 60+ hours per wedding. My family barely saw me during peak season.',
      insight: 'Asked for automatic highlight detection',
    },
    {
      name: 'Sarah Mitchell',
      role: 'Solo Videographer',
      quote: 'Clients would wait 8 weeks. Some stopped referring me because of turnaround times.',
      insight: 'Needed batch processing for multiple cameras',
    },
    {
      name: 'David Park',
      role: 'Studio Owner, 15 years',
      quote: 'We tried every editing tool. None understood the emotional arc of a wedding.',
      insight: 'Wanted AI that respects storytelling',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Destination Videographer',
      quote: 'I shoot 40+ weddings a year. The backlog was destroying my passion for the craft.',
      insight: 'Requested timeline auto-assembly',
    },
  ];

  const breakthroughs = [
    { feature: 'Timeline Assembly', desc: 'AI structures your edit from raw footage' },
    { feature: 'Emotional Detection', desc: 'Identifies vows, laughter, tears, first looks' },
    { feature: 'Scene Recognition', desc: 'Auto-tags ceremony, reception, speeches' },
    { feature: 'Multi-cam Sync', desc: 'Aligns cameras to sub-frame precision' },
    { feature: 'Chaos → Order', desc: '500GB of footage, organized in minutes' },
  ];

  // Nav text color: switch to black when content under the nav is a "light" section.
  useEffect(() => {
    let raf = 0;
    let last = false;

    const update = () => {
      raf = 0;
      const navH = navRef.current?.getBoundingClientRect().height ?? 96;
      const x = Math.round(window.innerWidth * 0.5);
      const y = Math.min(window.innerHeight - 1, Math.round(navH + 6));
      const el = document.elementFromPoint(x, y) as HTMLElement | null;

      let node: HTMLElement | null = el;
      let onLight = false;
      while (node && node !== document.body) {
        if (node.dataset?.nav === 'light') {
          onLight = true;
          break;
        }
        node = node.parentElement;
      }

      if (onLight !== last) {
        last = onLight;
        setNavOnLight(onLight);
      }
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bg-[#FAF9F6] text-[#050504] min-h-screen selection:bg-[#050504] selection:text-[#FAF9F6] antialiased">
      {/* Navigation */}
      <motion.nav
        ref={navRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 h-24 flex items-center justify-between">
          <SiteLogoMenu
            darkLogoVisible={navOnLight}
            darkLogoSrc="/logoBlack.png?v=20251223"
            lightLogoSrc="/logo.png?v=20251223"
            sizeClassName="h-5 w-auto aspect-[256/65]"
          />

          <div
            className={`hidden md:flex items-center gap-16 text-[10px] tracking-[0.4em] font-light ${navOnLight ? 'text-black' : 'text-white'
              }`}
          >
            <Link href="/#workflow" className="hover:opacity-50 transition-opacity">WORK</Link>
            <Link href="/pricing" className="hover:opacity-50 transition-opacity">PRICING</Link>
            <Link href="/downloads" className="hover:opacity-50 transition-opacity">DOWNLOAD</Link>
          </div>

          <Link
            href="/signin?next=/download"
            className={`text-[10px] tracking-[0.4em] font-light hover:opacity-50 transition-opacity ${navOnLight ? 'text-black' : 'text-white'
              }`}
          >
            SIGN IN
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section data-nav="light" className="min-h-screen flex flex-col justify-end pb-32 pt-48 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[clamp(48px,8vw,120px)] font-extralight leading-[0.95] tracking-[-0.04em] max-w-5xl text-[#050504]">
              Built by filmmakers.
              <br />
              <span className="text-black/30">For filmmakers.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ① How Cutline Started */}
      <section data-nav="light" className="border-t border-black/5 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            {/* Left column */}
            <div className="lg:col-span-5">
              <Reveal>
                <SectionNum num="01" dark={true} />
                <h2 className="text-[36px] md:text-[48px] font-extralight leading-[1.1] tracking-[-0.03em] mt-6 text-[#050504]">
                  How Quartz
                  <br />
                  <span className="text-black/30">Started</span>
                </h2>
              </Reveal>
            </div>

            {/* Right column */}
            <div className="lg:col-span-7 space-y-12">
              <Reveal delay={0.1}>
                <p className="text-[17px] md:text-[19px] font-light leading-[1.8] text-black/60">
                  It started with watching wedding filmmakers drown in timelines.
                  <span className="text-black"> Weeks of work for a single film.</span> The
                  passion was there, but the process was breaking them.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-[17px] md:text-[19px] font-light leading-[1.8] text-black/60">
                  I spoke with dozens of top wedding videographers. The story was always
                  the same: <span className="text-black">drowning in footage, missing deadlines,
                    losing the joy</span> that brought them to filmmaking.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="border-l border-black/10 pl-8 py-4">
                  <p className="text-[24px] md:text-[32px] font-extralight leading-[1.3] tracking-[-0.02em] text-[#050504]">
                    &ldquo;What if 5 weeks could become 3 days?&rdquo;
                  </p>
                  <p className="text-[10px] tracking-[0.3em] text-black/30 mt-4 font-semibold uppercase">
                    The question that started it all
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ② The Problem We Saw (Screenshot Approach) */}
      <section data-nav="light" className="bg-white border-y border-black/5">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <Reveal>
            <div className="mb-20">
              <SectionNum num="02" dark={true} />
              <h2 className="text-[36px] md:text-[56px] font-extralight leading-[1.1] tracking-[-0.03em] mt-6 text-[#050504]">
                The chaos
                <br />
                <span className="text-black/30">we couldn&apos;t ignore</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <Reveal delay={0.2}>
              <div className="relative w-full overflow-hidden bg-[#FAF9F6] border border-black/5 p-4 rounded-[16px]">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[8px] bg-[#F5F5F0]">
                  <Image src="/ai-timeline.png" alt="Chaotic Timeline" fill className="object-cover object-left" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="space-y-8 max-w-xl">
                <div>
                  <h3 className="text-[24px] font-semibold text-[#050504]">Footage Overload</h3>
                  <p className="text-[16px] text-black/60 mt-2 font-light leading-relaxed">
                    8+ hours of raw footage from 4 cameras and 6 mics. Just organizing everything takes an entire day.
                  </p>
                </div>
                <div>
                  <h3 className="text-[24px] font-semibold text-[#050504]">Editing Burnout</h3>
                  <p className="text-[16px] text-black/60 mt-2 font-light leading-relaxed">
                    Working 50-80 hour weeks during peak season, causing a massive backlog and high stress.
                  </p>
                </div>
                <div>
                  <h3 className="text-[24px] font-semibold text-[#050504]">The Blank Canvas</h3>
                  <p className="text-[16px] text-black/60 mt-2 font-light leading-relaxed">
                    Staring at Premiere Pro wondering where to start, wasting hours finding the emotional arc of the day.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ③ Our Breakthrough Moment */}
      <section data-nav="dark" className="bg-[#050505] text-white">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            {/* Left */}
            <div className="lg:col-span-5">
              <Reveal>
                <SectionNum num="03" />
                <h2 className="text-[36px] md:text-[48px] font-extralight leading-[1.1] tracking-[-0.03em] mt-6 mb-8">
                  The breakthrough
                </h2>
                <p className="text-[17px] font-light leading-[1.8] text-white/50">
                  We realized AI could do more than transcribe or color correct.
                  It could <span className="text-white">understand the emotional arc</span> of
                  a wedding day.
                </p>
              </Reveal>
            </div>

            {/* Right */}
            <div className="lg:col-span-7 lg:col-start-6">
              {breakthroughs.map((item, idx) => (
                <Reveal key={item.feature} delay={idx * 0.1}>
                  <div className="border-b border-white/5 py-8 group flex items-start gap-8">
                    <span className="text-[10px] tracking-[0.3em] text-white/20 mt-2 shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-[20px] md:text-[24px] font-light tracking-[-0.02em] mb-2 group-hover:text-white/70 transition-colors">
                        {item.feature}
                      </h3>
                      <p className="text-[15px] font-light text-white/40 group-hover:text-white/60 transition-colors">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ④ Collaboration With Videographers */}
      <section data-nav="dark" className="border-t border-white/5 bg-[#050505]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <Reveal>
            <div className="text-center mb-20">
              <SectionNum num="04" />
              <h2 className="text-[36px] md:text-[56px] font-extralight leading-[1.1] tracking-[-0.03em] mt-6 text-white">
                Built with the people
                <br />
                <span className="text-white/40">who use it</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {videographerStories.map((story, idx) => (
              <Reveal key={story.name} delay={idx * 0.15}>
                <div className="bg-[#050505] p-10 md:p-14 group hover:bg-[#0a0a09] transition-all duration-500">
                  {/* Quote */}
                  <p className="text-[19px] md:text-[22px] font-extralight leading-[1.6] tracking-[-0.01em] mb-10 text-white">
                    &ldquo;{story.quote}&rdquo;
                  </p>

                  {/* Attribution */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[15px] font-light text-white">{story.name}</p>
                      <p className="text-[13px] font-light text-white/40 mt-1">{story.role}</p>
                    </div>
                  </div>

                  {/* Insight tag */}
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-[10px] uppercase font-semibold tracking-[0.08em] text-white/30 mb-2">REQUESTED FEATURE</p>
                    <p className="text-[14px] font-light text-white/60">{story.insight}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30 mt-16 hover:text-white transition-colors cursor-default">
              100+ HOURS OF FEEDBACK SESSIONS
            </p>
          </Reveal>
        </div>
      </section>

      {/* ⑤ Our Mission Today */}
      <section data-nav="light" className="bg-[#FAF9F6] text-[#050504]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-40 md:py-56">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <SectionNum num="05" dark={true} />
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-black/30 mt-6 mb-12">
                OUR MISSION
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-[32px] md:text-[48px] lg:text-[56px] font-extralight leading-[1.2] tracking-[-0.03em]">
                We believe videographers deserve to
                <span className="text-black/30 italic"> create, not drown in timelines.</span>
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-[19px] md:text-[22px] font-light leading-[1.7] text-black/50 mt-12 max-w-2xl mx-auto">
                Quartz exists to turn weeks of work into days —
                without losing the soul of your story.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex items-center justify-center gap-4 mt-16">
                <div className="h-[1px] w-16 bg-black/10" />
                <span className="text-[10px] tracking-[0.5em] text-black/30 font-light">
                  EST. 2026
                </span>
                <div className="h-[1px] w-16 bg-black/10" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ⑥ The Future */}
      <section data-nav="light" className="border-t border-black/5 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            {/* Left */}
            <div className="lg:col-span-5">
              <Reveal>
                <SectionNum num="06" dark={true} />
                <h2 className="text-[36px] md:text-[48px] font-extralight leading-[1.1] tracking-[-0.03em] mt-6 text-[#050504]">
                  The future
                  <br />
                  <span className="text-black/30">we&apos;re building</span>
                </h2>
              </Reveal>
            </div>

            {/* Right */}
            <div className="lg:col-span-7 space-y-16">
              <Reveal delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <h3 className="text-[18px] font-semibold text-[#050504]">No Cloud Fees</h3>
                    <p className="text-[14px] font-light text-black/50 leading-[1.7]">
                      Your footage stays on your machine. Process locally,
                      keep your data yours.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[18px] font-semibold text-[#050504]">Local AI</h3>
                    <p className="text-[14px] font-light text-black/50 leading-[1.7]">
                      No dependence on external services. Quartz runs
                      entirely on your hardware.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[18px] font-semibold text-[#050504]">Built to Last</h3>
                    <p className="text-[14px] font-light text-black/50 leading-[1.7]">
                      Professional-grade stability. This is your business
                      tool, not a side project.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="border border-black/5 bg-white rounded-[16px] p-10 md:p-14 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-black/30 mb-6">COMING SOON</p>
                  <h3 className="text-[28px] md:text-[36px] font-extralight tracking-[-0.02em] mb-4 text-[#050504]">
                    Quartz Social
                  </h3>
                  <p className="text-[15px] font-light text-black/50 leading-[1.7] max-w-xl">
                    Full AI marketing generation. Quartz turns your edited highlights into vertical reels complete with captions and auto-posts to your socials.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-[#171717] text-white">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
            <div className="md:col-span-5 space-y-8">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/logo.png?v=20251223"
                  alt="Quartz"
                  width={256}
                  height={65}
                  className="h-6 w-auto"
                  unoptimized
                />
              </Link>
              <p className="text-[15px] font-light leading-[1.8] text-white/40 max-w-md">
                AI-powered video editing engineered for filmmakers who value craft.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8">
              <div className="space-y-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">PRODUCT</span>
                <nav className="space-y-4 text-[13px] font-light">
                  <Link href="/features" className="block text-white/40 hover:text-white transition-colors">Features</Link>
                  <Link href="/pricing" className="block text-white/40 hover:text-white transition-colors">Pricing</Link>
                  <Link href="/downloads" className="block text-white/40 hover:text-white transition-colors">Downloads</Link>
                </nav>
              </div>

              <div className="space-y-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">COMPANY</span>
                <nav className="space-y-4 text-[13px] font-light">
                  <Link href="/about" className="block text-white/40 hover:text-white transition-colors">About</Link>
                  <Link href="/support" className="block text-white/40 hover:text-white transition-colors">Support</Link>
                  <Link href="/blog" className="block text-white/40 hover:text-white transition-colors">Blog</Link>
                </nav>
              </div>

              <div className="space-y-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">LEGAL</span>
                <nav className="space-y-4 text-[13px] font-light">
                  <a href="#" className="block text-white/40 hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="block text-white/40 hover:text-white transition-colors">Terms</a>
                </nav>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-[10px] tracking-[0.3em] text-white/20 font-light uppercase">
              © 2026 Quartz
            </p>
            <div className="flex items-center gap-8 text-[10px] tracking-[0.3em] text-white/20 font-light uppercase">
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

