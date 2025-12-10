'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight, Minus, Play } from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';

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
const SectionNum = ({ num }: { num: string }) => (
  <span className="text-[10px] tracking-[0.5em] text-white/20 font-light">
    {num}
  </span>
);

export default function About() {
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

  const problems = [
    { icon: '◎', title: 'Footage Overload', desc: '8+ hours of raw footage per wedding' },
    { icon: '◉', title: 'No Smart Automation', desc: 'Existing tools ignore emotion entirely' },
    { icon: '◎', title: 'Editing Burnout', desc: '50-80 hour weeks during peak season' },
    { icon: '◉', title: 'Backlog Stress', desc: '10+ weddings waiting to be edited' },
    { icon: '◎', title: 'Client Anxiety', desc: 'Couples waiting 6-12 weeks for films' },
  ];

  const breakthroughs = [
    { feature: 'Timeline Assembly', desc: 'AI structures your edit from raw footage' },
    { feature: 'Emotional Detection', desc: 'Identifies vows, laughter, tears, first looks' },
    { feature: 'Scene Recognition', desc: 'Auto-tags ceremony, reception, speeches' },
    { feature: 'Multi-cam Sync', desc: 'Aligns cameras to sub-frame precision' },
    { feature: 'Chaos → Order', desc: '500GB of footage, organized in minutes' },
  ];

  return (
    <div className="bg-black text-white min-h-screen selection:bg-white selection:text-black antialiased">
      
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[100] mix-blend-difference"
      >
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 h-24 flex items-center justify-between">
          <Link href="/" className="text-[11px] tracking-[0.5em] font-light">
            VELLUM
          </Link>
          
          <div className="hidden md:flex items-center gap-16 text-[10px] tracking-[0.4em] font-light">
            <Link href="/#work" className="hover:opacity-50 transition-opacity">WORK</Link>
            <Link href="/pricing" className="hover:opacity-50 transition-opacity">PRICING</Link>
          </div>

          <button className="text-[10px] tracking-[0.4em] font-light hover:opacity-50 transition-opacity">
            CONTACT
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-end pb-32 pt-48">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] tracking-[0.5em] text-white/30 font-light mb-8">
              OUR STORY
            </p>
            <h1 className="text-[clamp(48px,8vw,120px)] font-extralight leading-[0.95] tracking-[-0.04em] max-w-5xl">
              Built by a filmmaker.
              <br />
              <span className="text-white/40">For filmmakers.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ① How Vellum Started */}
      <section className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            {/* Left column */}
            <div className="lg:col-span-5">
              <Reveal>
                <SectionNum num="01" />
                <h2 className="text-[36px] md:text-[48px] font-extralight leading-[1.1] tracking-[-0.03em] mt-6">
                  How Vellum
                  <br />
                  <span className="text-white/40">Started</span>
                </h2>
              </Reveal>
            </div>
            
            {/* Right column */}
            <div className="lg:col-span-7 space-y-12">
              <Reveal delay={0.1}>
                <p className="text-[17px] md:text-[19px] font-light leading-[1.8] text-white/60">
                  It started with watching my dad edit wedding videos. 
                  <span className="text-white"> Weeks of work for a single film.</span> The 
                  passion was there, but the process was breaking him.
                </p>
              </Reveal>
              
              <Reveal delay={0.2}>
                <p className="text-[17px] md:text-[19px] font-light leading-[1.8] text-white/60">
                  I spoke with dozens of top wedding videographers. The story was always 
                  the same: <span className="text-white">drowning in footage, missing deadlines, 
                  losing the joy</span> that brought them to filmmaking.
                </p>
              </Reveal>
              
              <Reveal delay={0.3}>
                <div className="border-l border-white/10 pl-8 py-4">
                  <p className="text-[24px] md:text-[32px] font-extralight leading-[1.3] tracking-[-0.02em]">
                    "What if 5 weeks could become 3 days?"
                  </p>
                  <p className="text-[13px] tracking-[0.3em] text-white/30 mt-4 font-light">
                    THE QUESTION THAT STARTED EVERYTHING
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ② The Problem We Saw */}
      <section className="bg-white text-black">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <Reveal>
            <div className="mb-20">
              <SectionNum num="02" />
              <h2 className="text-[36px] md:text-[56px] font-extralight leading-[1.1] tracking-[-0.03em] mt-6">
                The problem
                <br />
                <span className="text-black/30">we couldn't ignore</span>
              </h2>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-black/5">
            {problems.map((problem, idx) => (
              <Reveal key={problem.title} delay={idx * 0.1}>
                <div className="bg-white p-8 md:p-10 h-full group hover:bg-black hover:text-white transition-all duration-500">
                  <span className="text-[32px] text-black/10 group-hover:text-white/10 transition-colors">
                    {problem.icon}
                  </span>
                  <h3 className="text-[18px] font-light mt-8 mb-4 tracking-[-0.01em]">
                    {problem.title}
                  </h3>
                  <p className="text-[14px] font-light leading-[1.7] text-black/50 group-hover:text-white/50 transition-colors">
                    {problem.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ③ Our Breakthrough Moment */}
      <section className="border-t border-white/5">
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
                    <ArrowRight className="w-5 h-5 text-white/0 group-hover:text-white/30 transition-all mt-2" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ④ Collaboration With Videographers */}
      <section className="border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <Reveal>
            <div className="text-center mb-20">
              <SectionNum num="04" />
              <h2 className="text-[36px] md:text-[56px] font-extralight leading-[1.1] tracking-[-0.03em] mt-6">
                Built with the people
                <br />
                <span className="text-white/40">who use it</span>
              </h2>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {videographerStories.map((story, idx) => (
              <Reveal key={story.name} delay={idx * 0.15}>
                <div className="bg-[#0a0a0a] p-10 md:p-14 group hover:bg-black transition-all duration-500">
                  {/* Quote */}
                  <p className="text-[19px] md:text-[22px] font-extralight leading-[1.6] tracking-[-0.01em] mb-10">
                    "{story.quote}"
                  </p>
                  
                  {/* Attribution */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[15px] font-light">{story.name}</p>
                      <p className="text-[13px] font-light text-white/40 mt-1">{story.role}</p>
                    </div>
                  </div>
                  
                  {/* Insight tag */}
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-[10px] tracking-[0.4em] text-white/30 mb-2">REQUESTED FEATURE</p>
                    <p className="text-[14px] font-light text-white/60">{story.insight}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          
          <Reveal delay={0.4}>
            <p className="text-center text-[13px] tracking-[0.3em] text-white/30 mt-16 font-light">
              100+ HOURS OF FEEDBACK SESSIONS
            </p>
          </Reveal>
        </div>
      </section>

      {/* ⑤ Our Mission Today */}
      <section className="bg-white text-black">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-40 md:py-56">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <SectionNum num="05" />
              <h2 className="text-[10px] tracking-[0.5em] text-black/30 font-light mt-6 mb-12">
                OUR MISSION
              </h2>
            </Reveal>
            
            <Reveal delay={0.2}>
              <p className="text-[32px] md:text-[48px] lg:text-[56px] font-extralight leading-[1.2] tracking-[-0.03em]">
                We believe videographers deserve to 
                <span className="text-black/30"> create, not drown in timelines.</span>
              </p>
            </Reveal>
            
            <Reveal delay={0.3}>
              <p className="text-[19px] md:text-[22px] font-light leading-[1.7] text-black/50 mt-12 max-w-2xl mx-auto">
                Vellum exists to turn weeks of work into days — 
                without losing the soul of your story.
              </p>
            </Reveal>
            
            <Reveal delay={0.4}>
              <div className="flex items-center justify-center gap-4 mt-16">
                <div className="h-[1px] w-16 bg-black/10" />
                <span className="text-[10px] tracking-[0.5em] text-black/30 font-light">
                  EST. 2024
                </span>
                <div className="h-[1px] w-16 bg-black/10" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ⑥ The Future */}
      <section className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            {/* Left */}
            <div className="lg:col-span-5">
              <Reveal>
                <SectionNum num="06" />
                <h2 className="text-[36px] md:text-[48px] font-extralight leading-[1.1] tracking-[-0.03em] mt-6">
                  The future
                  <br />
                  <span className="text-white/40">we're building</span>
                </h2>
              </Reveal>
            </div>
            
            {/* Right */}
            <div className="lg:col-span-7 space-y-16">
              <Reveal delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
                      <span className="text-[20px] font-extralight">∞</span>
                    </div>
                    <h3 className="text-[16px] font-light">No Cloud Fees</h3>
                    <p className="text-[14px] font-light text-white/40 leading-[1.7]">
                      Your footage stays on your machine. Process locally, 
                      keep your data yours.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
                      <span className="text-[20px] font-extralight">◈</span>
                    </div>
                    <h3 className="text-[16px] font-light">Local AI</h3>
                    <p className="text-[14px] font-light text-white/40 leading-[1.7]">
                      No dependence on external services. Vellum runs 
                      entirely on your hardware.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
                      <span className="text-[20px] font-extralight">△</span>
                    </div>
                    <h3 className="text-[16px] font-light">Built to Last</h3>
                    <p className="text-[14px] font-light text-white/40 leading-[1.7]">
                      Professional-grade stability. This is your business 
                      tool, not a side project.
                    </p>
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.2}>
                <div className="border border-white/10 p-10 md:p-14">
                  <p className="text-[10px] tracking-[0.4em] text-white/30 mb-6">COMING SOON</p>
                  <h3 className="text-[28px] md:text-[36px] font-extralight tracking-[-0.02em] mb-4">
                    MAX Mode
                  </h3>
                  <p className="text-[15px] font-light text-white/50 leading-[1.7] max-w-xl">
                    Full AI autonomy. Upload your footage, define your style, and Vellum 
                    delivers a complete first cut — ready for your creative polish.
                  </p>
                  
                  <button className="mt-8 group inline-flex items-center gap-4 text-[10px] tracking-[0.4em] text-white/40 hover:text-white transition-colors">
                    <Minus className="w-8 h-[1px] text-white/20 group-hover:text-white/60 transition-colors" />
                    JOIN WAITLIST
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white text-black">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-40 md:py-56">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <Reveal>
              <h2 className="text-[42px] md:text-[64px] font-extralight leading-[1.05] tracking-[-0.04em]">
                Ready to reclaim
                <br />
                <span className="text-black/30">your time?</span>
              </h2>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  href="/pricing"
                  className="px-12 py-5 bg-black text-white text-[10px] tracking-[0.4em] hover:bg-black/90 transition-colors font-light"
                >
                  VIEW PRICING
                </Link>
                <button className="px-12 py-5 border border-black/10 text-[10px] tracking-[0.4em] text-black/60 hover:text-black hover:border-black/30 transition-colors font-light">
                  SCHEDULE DEMO
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
            <div className="md:col-span-5 space-y-8">
              <span className="text-[11px] tracking-[0.5em] font-light">VELLUM</span>
              <p className="text-[15px] font-light leading-[1.8] text-white/40 max-w-md">
                AI-powered video editing engineered for filmmakers who value craft.
              </p>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8">
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.4em] text-white/20 font-light">PRODUCT</span>
                <nav className="space-y-4 text-[13px] font-light">
                  <Link href="/#work" className="block text-white/40 hover:text-white transition-colors">Features</Link>
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

