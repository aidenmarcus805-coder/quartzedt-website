'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight, CaretDown, Check, FilmStrip, Minus, Scissors, MagnifyingGlass, UploadSimple, User } from '@phosphor-icons/react';

// PRICING_PLAN and PLAN removed

import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import EmailWaitlist from './components/EmailWaitlist';
import { SiteLogoMenu } from './components/SiteLogoMenu';

const NAV_CATEGORIES = [
  {
    label: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
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

function NavDropdown({ category, navOnLight, isScrolled }: { category: typeof NAV_CATEGORIES[0]; navOnLight: boolean; isScrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`px-4 h-full text-[13px] font-bold tracking-tight transition-colors duration-300 flex items-center gap-1.5 ${navOnLight ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'
          }`}
      >
        <span>{category.label}</span>
        <CaretDown
          weight="bold"
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180 opacity-100' : 'opacity-40'}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute top-[calc(100%-24px)] left-[-8px] pt-[4px] z-[110]`}
          >
            <div
              className={`min-w-[200px] p-2 rounded-b-[22px] transition-all duration-500 ${isScrolled
                ? `border backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ${navOnLight
                  ? 'bg-white/40 border-black/[0.05] text-black'
                  : 'bg-[#0a0a0a]/40 border-white/[0.08] text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]'
                }`
                : 'bg-transparent border-transparent text-current shadow-none'
                }`}
            >
              <div className="flex flex-col gap-0.5">
                {category.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group block px-4 py-2.5 text-[14px] font-medium rounded-[14px] transition-all duration-300 ${navOnLight
                      ? 'text-black/50 hover:text-black hover:bg-black/[0.04]'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                      }`}
                  >
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Dynamic import for 3D scene (client-side only)
// ShutterReveal component removed (inlined)

const CameraScene = dynamic<{
  lowPowerMode?: boolean;
  variant?: 'full' | 'gallery';
  className?: string;
}>(() => import('./components/CameraScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black z-0" />
});

import { useProgress } from '@react-three/drei';

function GlobalLoader() {
  const { progress } = useProgress();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black pointer-events-none"
        >
          {/* Minimalist animated camera aperture icon */}
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: [1, 0.92, 1],
              rotate: [0, 60, 120],
            }}
            transition={{
              opacity: { duration: 0.6, ease: "easeOut" },
              scale: {
                duration: 2.4,
                repeat: Infinity,
                ease: [0.16, 1, 0.3, 1],
              },
              rotate: {
                duration: 2.4,
                repeat: Infinity,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
          >
            {/* 6-blade camera iris */}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <motion.path
                key={angle}
                d="M50 50 L50 12 A38 38 0 0 1 82.9 31 Z"
                fill="white"
                style={{
                  transformOrigin: '50px 50px',
                  transform: `rotate(${angle}deg)`,
                }}
              />
            ))}
            {/* Center hole */}
            <circle cx="50" cy="50" r="14" fill="black" />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Reveal animation wrapper - more subtle
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

// Accent dot that "bleeps" twice, then fades out (guides the eye without staying noisy).
function BleepDot({
  className,
  delay = 0,
  sizeClass = 'h-2.5 w-2.5',
}: {
  className?: string;
  delay?: number;
  sizeClass?: string;
}) {
  return (
    <div className={`relative inline-block ${sizeClass} ${className}`}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.2, 1, 1.2, 1],
          opacity: [0, 0.8, 1, 0.8, 0],
        }}
        transition={{
          duration: 2.2,
          delay,
          times: [0, 0.15, 0.3, 0.45, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute inset-0 rounded-full bg-accent"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 2.8], opacity: [0.4, 0] }}
        transition={{ duration: 1.4, delay: delay + 0.1, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full border border-accent"
      />
    </div>
  );
}

// Loop a specific segment of a video file (feels like an "edited" clip without needing multiple assets).
function SegmentVideo({
  src,
  start,
  end,
  className,
  play = true,
}: {
  src: string;
  start: number;
  end: number;
  className?: string;
  play?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applyBounds = () => {
      if (video.currentTime < start || video.currentTime >= end) {
        video.currentTime = start;
      }
    };

    const sync = () => {
      if (play) {
        video.play().catch(() => { });
        applyBounds();
      } else {
        video.pause();
      }
    };

    const onTimeUpdate = () => {
      if (video.currentTime >= end) {
        video.currentTime = start;
      }
    };

    sync();
    video.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [play, start, end]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      muted
      playsInline
      loop={false}
      style={{ filter: 'grayscale(0.15) contrast(1.05)' }} // subtly technical
    />
  );
}



const WORKFLOW_STEPS = [
  {
    label: 'Ingest',
    icon: UploadSimple,
    start: 2,
    end: 12,
    desc: 'Deep-scan volumes. Automatic metadata extraction and proxy generation.',
  },
  {
    label: 'Cull',
    icon: MagnifyingGlass,
    start: 24,
    end: 34,
    desc: 'AI detects highlights, triage selects, and filters junk in seconds.',
  },
  {
    label: 'Sync',
    icon: Minus,
    start: 46,
    end: 56,
    desc: 'Sample-accurate audio-visual alignment across every camera and lav.',
  },
  {
    label: 'Assemble',
    icon: FilmStrip,
    start: 68,
    end: 78,
    desc: 'Smart-cutting based on emotional context and narrative structure.',
  },
  {
    label: 'Polish',
    icon: Scissors,
    start: 90,
    end: 100,
    desc: 'Fine-tune pacing. Automated multicam switching based on audio cues.',
  },
  {
    label: 'Finish',
    icon: ArrowLeft,
    start: 112,
    end: 122,
    desc: 'One-click export to Premiere or DaVinci Resolve timelines.',
  },
];

const START_TRIAL_HREF = '/downloads';
const BOOK_DEMO_HREF = '#waitlist';
const SHOW_BOOK_DEMO = false;

// Shared scroll constants (blueprint-aligned)
const WORKFLOW_DOOR_SCROLL_PX = 1500; // Super Heavy mechanical scroll // Balanced: Heavy enough to feel mechanical, short enough to avoid "too much space"
const WORKFLOW_SCROLL_PX_PER_STEP = 1200;
const WORKFLOW_SCROLLS_PER_STEP = 3; // "3 scrolls to commit" feel
const WORKFLOW_STEP_MIN_DWELL_MS = 300; // minimum time to stay on a step during fast scrolling

export default function Home() {
  // Billing state removed
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const { data: session } = useSession();

  // Nav state management
  const [navOnLight, setNavOnLight] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const firstWhiteRef = useRef<HTMLElement>(null);
  const firstDarkRef = useRef<HTMLElement>(null);

  // Workflow state (blueprint logic)
  const [workflowIdx, setWorkflowIdx] = useState(0);
  const [workflowAdvance, setWorkflowAdvance] = useState(0);
  const [workflowLocked, setWorkflowLocked] = useState(false);
  const [workflowHasInteracted, setWorkflowHasInteracted] = useState(false);

  // Refs for logic to avoid stale closure in wheel listeners
  const workflowIdxRef = useRef(0);
  const workflowAdvanceRef = useRef(0);
  const workflowLockedRef = useRef(false);
  const workflowHasInteractedRef = useRef(false);
  const workflowStepLockUntilRef = useRef(0);
  const isScrollingToStepRef = useRef(false);
  const workflowAutoIdxRef = useRef(0);
  const workflowAutoAdvanceRef = useRef(0);

  // Sync state -> refs
  useEffect(() => {
    workflowIdxRef.current = workflowIdx;
    workflowAdvanceRef.current = workflowAdvance;
    workflowLockedRef.current = workflowLocked;
    workflowHasInteractedRef.current = workflowHasInteracted;
  }, [workflowIdx, workflowAdvance, workflowLocked, workflowHasInteracted]);

  const [lowPowerMode, setLowPowerMode] = useState(false);

  // Handle scroll for HUD state and color toggling
  useEffect(() => {
    // Detect low-power mode or high-res screens
    const detectPerformance = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) setLowPowerMode(true);
    };
    detectPerformance();

    const onScroll = () => {
      // Robust range-based nav color toggling:
      // Black Nav Text active when over ANY white section (Workflow OR Problems we solve)
      // White Nav Text active when over any black section
      const NAV_THRESHOLD = 80; // pixels from top where nav sits

      let inLightZone = false;
      let inWorkflowZone = false;

      // Check if we're over the Hero section (light gray) up to 90vh scroll
      if (heroRef.current) {
        if (window.scrollY < window.innerHeight * 0.9) {
          inLightZone = true;
        }
      }

      // Check if we're over the Workflow section (white)
      if (!inLightZone && firstWhiteRef.current) {
        const workflowRect = firstWhiteRef.current.getBoundingClientRect();
        // We're in Workflow if its top is above the nav threshold and its bottom is below
        if (workflowRect.top <= NAV_THRESHOLD && workflowRect.bottom > NAV_THRESHOLD) {
          inLightZone = true;
          inWorkflowZone = true;
        }
      }

      // Check if we're over the Problems we solve section (white)
      if (!inLightZone && philosophyRef.current) {
        const problemsRect = philosophyRef.current.getBoundingClientRect();
        if (problemsRect.top <= NAV_THRESHOLD && problemsRect.bottom > NAV_THRESHOLD) {
          inLightZone = true;
        }
      }

      setNavOnLight(inLightZone);

      // Relax the navbar (larger, transparent) if we're in the initial hero OR in the workflow zone
      const scrolledPastHero = window.scrollY > window.innerHeight * 0.9;
      setIsScrolled(scrolledPastHero && !inWorkflowZone);

      if (!firstWhiteRef.current) return;
      const rect = firstWhiteRef.current.getBoundingClientRect();
      const doorProgress = -rect.top / WORKFLOW_DOOR_SCROLL_PX;
      const isWorkflowLocked = rect.top <= 0 && -rect.top < rect.height - window.innerHeight;

      setWorkflowLocked(isWorkflowLocked);

      // Update Shutter Animation (driven by CSS variable)
      // Progress 0 = Closed (at top of section), 1 = Open (scroll past specific threshold)
      const rawShutterProgress = Math.max(0, Math.min(1, doorProgress));

      // Cinematic Easing: Ease-in-out (smoothstep) -> starts slow, speeds up, slows down
      // rS^2 * (3 - 2*rS)
      const shutterProgress = rawShutterProgress * rawShutterProgress * (3 - 2 * rawShutterProgress);
      // Make opacity stay solid longer (pow 20) then fade out quickly at the end
      const shutterOpacity = 1 - Math.pow(shutterProgress, 20);

      if (containerRef.current) {
        containerRef.current.style.setProperty('--shutter-progress', shutterProgress.toString());
        containerRef.current.style.setProperty('--shutter-opacity', shutterOpacity.toString());
      }

      // Animate content reveal: Just scale and opacity, NO movement (fixing "land perfectly" issue)
      if (workflowContentRef.current) {
        // Reveal starts earlier
        const rawProgress = Math.max(0, Math.min(1, (doorProgress - 0.1) / 0.9));
        const revealProgress = 1 - Math.pow(1 - rawProgress, 3);

        const scale = 0.94 + (revealProgress * 0.06);
        const opacity = revealProgress;

        // Removed Y translation so it doesn't feel like you have to "catch up" to it
        workflowContentRef.current.style.transform = `scale(${scale})`;
        workflowContentRef.current.style.opacity = `${opacity}`;
      }

      // If we're in the workflow zone, calculate which step we should be on based on scroll
      if (isWorkflowLocked) {
        // Guard: Don't update index if we are programmatically scrolling to a step (avoids "fast-forward" glitch)
        if (isScrollingToStepRef.current) return;

        const workflowScroll = -rect.top - WORKFLOW_DOOR_SCROLL_PX;
        if (workflowScroll > 0) {
          const rawIdx = Math.floor(workflowScroll / WORKFLOW_SCROLL_PX_PER_STEP);
          const idx = Math.max(0, Math.min(WORKFLOW_STEPS.length - 1, rawIdx));
          const stepScroll = workflowScroll % WORKFLOW_SCROLL_PX_PER_STEP;
          const advance = Math.min(WORKFLOW_SCROLLS_PER_STEP - 1, Math.floor((stepScroll / WORKFLOW_SCROLL_PX_PER_STEP) * WORKFLOW_SCROLLS_PER_STEP));

          if (idx !== workflowIdxRef.current) setWorkflowIdx(idx);
          if (advance !== workflowAdvanceRef.current) setWorkflowAdvance(advance);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  const workflowContentRef = useRef<HTMLDivElement>(null);
  const shutterContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="bg-white text-black min-h-screen selection:bg-black selection:text-white antialiased">
      <GlobalLoader />

      {/* Navigation - Cinema Bar (Pro Tech) */}
      <motion.nav
        ref={navRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none"
      >
        <div
          className={`relative z-10 pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between
            ${isScrolled
              ? `h-14 px-6 w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] lg:w-[calc(100%-8rem)] max-w-[calc(1800px-4rem)] md:max-w-[calc(1800px-6rem)] lg:max-w-[calc(1800px-8rem)] rounded-full border backdrop-blur-xl shadow-sm ${navOnLight
                ? 'bg-gray-50/40 border-black/5 text-black'
                : 'bg-neutral-900/40 border-white/5 text-white'
              }`
              : `h-20 px-7 md:px-11 lg:px-14 w-full max-w-[1800px] bg-transparent border-transparent ${navOnLight ? 'text-black' : 'text-white'
              }`
            }
          `}
        >
          {/* Left: Logo */}
          <SiteLogoMenu darkLogoVisible={navOnLight} />

          {/* Center: Persistent Categories */}
          <div className="hidden md:flex items-center h-full ml-8">
            {NAV_CATEGORIES.map((cat) => (
              <NavDropdown key={cat.label} category={cat} navOnLight={navOnLight} isScrolled={isScrolled} />
            ))}
          </div>

          <div className="flex-1" />

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="#waitlist"
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${navOnLight
                ? 'bg-black text-white hover:bg-black/80 shadow-lg hover:shadow-xl'
                : 'bg-white text-black hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]'
                }`}
            >
              Join Waitlist
            </Link>

            {/* User Profile */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center justify-center rounded-full transition-transform active:scale-95"
                  aria-label="User menu"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium overflow-hidden ring-1 ${navOnLight ? 'bg-black/5 ring-black/10' : 'bg-white/10 ring-white/20'
                    }`}>
                    {session.user?.image ? (
                      <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className={navOnLight ? 'text-black/60' : 'text-white/60'}>
                        {session.user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-60 bg-white border border-neutral-200/60 rounded-xl shadow-xl overflow-hidden z-50 origin-top-right backdrop-blur-xl"
                    >
                      <div className="p-1.5">
                        <div className="px-3 py-2 text-xs text-neutral-500 border-b border-neutral-100 mb-1 truncate font-mono">
                          {session.user?.email}
                        </div>
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-left"
                        >
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/signin?next=/dashboard/download"
                className={`w-8 h-8 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center group/signin ${navOnLight ? 'hover:bg-black/10' : 'hover:bg-white/10'
                  }`}
                aria-label="Sign In"
              >
                <User className={`w-4 h-4 transition-colors duration-300 ${navOnLight ? 'text-black/70' : 'text-white/70'} group-hover/signin:text-accent`} />
              </Link>
            )}
          </div>
        </div>
      </motion.nav>



      {/* Hero - Fullscreen intro Sticky Curtain */}
      <section ref={heroRef} data-nav="light" className="sticky top-0 h-screen w-full z-0 overflow-hidden">
        <CameraScene lowPowerMode={lowPowerMode} variant="full" />

        {/* Helper overlay for text contrast if needed, though scene is dark */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="absolute inset-0 z-10 pointer-events-none" />
      </section>

      {/* iPhone-style transparent notch transition sliding over sticky Hero */}
      <div className="relative z-10 w-full h-[8vh] md:h-[12vh] text-[#050505] fill-current pointer-events-none -mb-1">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full block">
          {/* Ultra-tight iPhone X style notch with mechanical corners and 1px safety offset */}
          <path d="M0,100 L0,1 L340,1 C355,1 358,2 360,10 L366,42 C370,58 380,64 410,64 L590,64 C620,64 630,58 634,42 L640,10 C642,2 645,1 660,1 L1000,1 L1000,100 Z" />
        </svg>
      </div>

      {/* 01 // THE ENGINE - Asymmetrical Editorial Intro */}
      <section className="relative z-10 bg-[#050505] text-white pt-32 pb-32 md:pt-48 md:pb-48 px-6 md:px-12 lg:px-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 w-full">
          {/* Editorial Intro content starts directly */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            {/* Left Column: Minimalist Editorial Text */}
            <div className="lg:col-span-6 space-y-16">
              <Reveal>
                <div className="space-y-4">
                  <h2 className="text-[48px] sm:text-[64px] lg:text-[82px] font-extralight leading-[0.95] tracking-tight text-white/95">
                    An autonomous<br />
                    <span className="text-white/30 italic">editing engine.</span>
                  </h2>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="max-w-md space-y-8">
                  <p className="text-[19px] md:text-[21px] leading-relaxed text-white/40 font-light">
                    Quartz transforms raw multicam chaos into structured narratives. Not a plugin—a standalone leap in post-production.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6 relative flex justify-end items-center -mr-12 lg:-mr-32">
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full aspect-square max-w-[840px] group"
              >
                <video
                  src="/element1.mp4"
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits (Awwwards Editorial) */}
      <section className="relative bg-[#050505] text-white border-t border-white/5 py-32 md:py-48 overflow-hidden">
        {/* Artifacts removed per user request for clean monochrome look */}

        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 space-y-40 md:space-y-64 relative z-10">

          {/* Feature 01: Intelligent Culling */}
          <div className="relative pt-8 md:pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="relative z-10 w-full mb-8 lg:mb-0">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#111]">
                    <Image
                      src="/wedding-culling-ui.png"
                      alt="Wedding Culling Interface"
                      fill
                      className="object-cover opacity-90"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl"
              >
                <h3 className="font-light text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight text-white mb-8 text-balance">
                  Weeks of work.<br />
                  <span className="text-white/30 italic block mt-2">Done in moments.</span>
                </h3>
                <div className="max-w-md">
                  <p className="font-light text-[18px] md:text-[20px] leading-[1.6] text-white/50">
                    Intelligent assembly. Raw footage is automatically culled and structured into a rough cut in seconds.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Feature 02: Audio Sync */}
          <div className="relative pt-16 md:pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="relative z-10 w-full mb-8 lg:mb-0">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#111]">
                    <Image
                      src="/flat-audio-sync-ui.png"
                      alt="Audio Synchronization Interface"
                      fill
                      className="object-cover opacity-90"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl lg:justify-self-end text-left lg:pr-12 lg:order-first"
              >
                <h3 className="font-light text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight text-white mb-8 text-balance">
                  Instantly synced.<br />
                  <span className="text-white/30 italic block mt-2">Perfectly aligned.</span>
                </h3>
                <div className="max-w-md">
                  <p className="font-light text-[18px] md:text-[20px] leading-[1.6] text-white/50">
                    Waveform analysis that handles the drift for you. Multi-cam sources and external recorders, unified in one click.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Feature 03: Seamless Export */}
          <div className="relative pt-16 md:pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="relative z-10 w-full mb-8 lg:mb-0">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#111]">
                    <Image
                      src="/flat-export-ui.png"
                      alt="Seamless Export Interface"
                      fill
                      className="object-cover opacity-90"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl lg:justify-self-start text-left lg:pl-12"
              >
                <h3 className="font-light text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight text-white mb-8 text-balance">
                  Creative flow,<br />
                  <span className="text-white/30 italic block mt-2">Unlocked.</span>
                </h3>
                <div className="max-w-md">
                  <p className="font-light text-[18px] md:text-[20px] leading-[1.6] text-white/50">
                    Skip the assembly drudgery. Move directly to your NLE with a fully structured foundation. Edit for craft, not for organization.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section
        id="workflow"
        ref={firstWhiteRef}
        data-nav="light"
        className="relative bg-paper text-black border-b border-black/5"
      >


        <div
          className="relative"
          style={{
            // Include a full step window for the last step as well (avoids “instant exit” + blank space on fast scroll).
            height: `calc(100vh + ${WORKFLOW_DOOR_SCROLL_PX + WORKFLOW_SCROLL_PX_PER_STEP * WORKFLOW_STEPS.length}px)`,
          }}
        >
          {/* Shutter Layer - Sticky on top of content (SVG Aperture) */}
          <div
            ref={shutterContainerRef}
            className="sticky top-0 h-screen w-full z-50 pointer-events-none overflow-hidden flex items-center justify-center"
            style={{
              opacity: 'var(--shutter-opacity, 1)',
            }}
          >
            {/* 8 Blades - Squares that translate outward. 
                 Start: 8 squares meeting at center.
                 End: They move outward radially.
             */}
            {/* SVG Mask Shutter - Guaranteed clean geometry + Mechanical lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <mask id="irisMask">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  {/* The Hole: An Octagon that rotates and scales */}
                  <polygon
                    points="29.29,0 70.71,0 100,29.29 100,70.71 70.71,100 29.29,100 0,70.71 0,29.29"
                    fill="black"
                    style={{
                      transformOrigin: '50% 50%',
                      transform: 'rotate(calc(var(--shutter-progress, 0) * 720deg)) scale(calc(var(--shutter-progress, 0) * 20))',
                    }}
                  />
                </mask>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="#000000" mask="url(#irisMask)" />

              {/* Cosmetic Blade Edges - Adds "Mechanical" texture to avoid "flat cube" look */}
              <g
                style={{
                  transformOrigin: '50% 50%',
                  transform: 'rotate(calc(var(--shutter-progress, 0) * 720deg)) scale(calc(var(--shutter-progress, 0) * 20))',
                  opacity: 0.15,
                  pointerEvents: 'none',
                }}
              >
                {/* 8 Spiral Lines radiating from the octagon vertices */}
                {/* Vertices: 
                    1: 29.29,0
                    2: 70.71,0
                    3: 100,29.29
                    etc.
                */}
                <path d="M 70.71,0 L 100,-50" stroke="white" strokeWidth="0.5" />
                <path d="M 100,29.29 L 150,0" stroke="white" strokeWidth="0.5" />
                <path d="M 100,70.71 L 150,100" stroke="white" strokeWidth="0.5" />
                <path d="M 70.71,100 L 100,150" stroke="white" strokeWidth="0.5" />
                <path d="M 29.29,100 L 0,150" stroke="white" strokeWidth="0.5" />
                <path d="M 0,70.71 L -50,100" stroke="white" strokeWidth="0.5" />
                <path d="M 0,29.29 L -50,0" stroke="white" strokeWidth="0.5" />
                <path d="M 29.29,0 L 0,-50" stroke="white" strokeWidth="0.5" />
              </g>
            </svg>

          </div>
          {/* Dotted background (keep) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)',
                backgroundSize: '26px 26px',
                backgroundPosition: 'center',
                WebkitMaskImage:
                  'radial-gradient(circle at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 78%)',
                maskImage:
                  'radial-gradient(circle at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 78%)',
              }}
            />
          </div>

          <div ref={workflowContentRef} className="sticky top-0 h-screen z-0 -mt-[100vh]" style={{ willChange: 'transform, opacity' }}>
            {/* Keep pinned content comfortably within the viewport (avoid clipped dock on shorter screens). */}
            <div className="relative h-full pt-24 pb-12 flex flex-col">
              {/* Title (gallery rhythm: aligned to content grid) */}
              <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 flex-none w-full text-left">
                <h2 className="font-display text-[clamp(56px,5.5vw,96px)] font-light tracking-[-0.06em] leading-[0.92]">
                  The Workflow.
                </h2>
                <p className="mt-3 text-lg md:text-xl text-neutral-400 font-light max-w-2xl tracking-wide">
                  Automated from intake to timeline.
                </p>
              </div>

              {/* Videos */}
              <div className="flex-1 mt-4 md:mt-6 flex items-center">
                {/* Stage (same width as the rest of the site) */}
                <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 w-full">
                  {/* One “video row”: active expands (main), others stay as shutters on the right.
                      Advancing tabs expands the next shutter into the main video (per blueprint). */}
                  <div className="relative overflow-hidden bg-transparent">
                    {/* HUD Removed per user request */}

                    <div className="relative aspect-[21.5/10]">
                      <motion.div
                        className="absolute inset-0 flex gap-[6px]"
                        style={{
                          perspective: 1200,
                          transformStyle: 'preserve-3d',
                        }}
                        layout
                      >
                        {WORKFLOW_STEPS.map((step, idx) => {
                          const isActive = idx === workflowIdx;
                          const len = WORKFLOW_STEPS.length;
                          const rel = (idx - workflowIdx + len) % len; // active=0, next=1, prev=len-1
                          const shutterRot = -28 - rel * 2.8;
                          const shutterZ = -140 - rel * 26;
                          const shutterX = 2 + rel * 1.2;
                          // “Animate on each scroll”: peel the back/right shutter as you scroll (both directions),
                          // then commit the step change on the 3rd scroll.
                          const peekTarget = workflowLocked && workflowAdvance > 0 && rel === len - 1;
                          const peekT = peekTarget ? workflowAdvance / WORKFLOW_SCROLLS_PER_STEP : 0;

                          const baseRotateY = isActive ? 0 : shutterRot;
                          const baseRotateZ = isActive ? 0 : -0.25 * rel;
                          const baseX = isActive ? 0 : shutterX;
                          const baseZ = isActive ? 0 : shutterZ;
                          const baseScale = isActive ? 1 : 0.975;
                          const baseOpacity = isActive ? 1 : 0.86;

                          let rotateY = baseRotateY;
                          let rotateZ = baseRotateZ;
                          let x = baseX;
                          let z = baseZ;
                          let scale = baseScale;
                          let opacity = baseOpacity;

                          // “Animate on each scroll”: gradually “peek” the next/prev shutter open across 3 scrolls.
                          if (!isActive && peekTarget) {
                            const open = Math.min(0.9, peekT * 1.2); // 1/3 -> 0.4, 2/3 -> 0.8
                            rotateY = shutterRot + (0 - shutterRot) * open;
                            rotateZ = (-0.25 * rel) * (1 - open * 0.85);
                            x = shutterX * (1 - open * 0.35);
                            z = shutterZ * (1 - open * 0.35);
                            scale = 0.975 + (1 - 0.975) * (peekT * 0.55);
                            opacity = 0.86 + (1 - 0.86) * (peekT * 0.8);
                          }

                          return (
                            <motion.button
                              key={step.label}
                              layout
                              type="button"
                              onClick={() => {
                                const now = performance.now();
                                workflowHasInteractedRef.current = true;
                                setWorkflowHasInteracted(true);
                                workflowAutoIdxRef.current = idx;
                                workflowAutoAdvanceRef.current = 0;
                                setWorkflowAdvance(0);
                                setWorkflowIdx(idx);
                                workflowStepLockUntilRef.current = now + WORKFLOW_STEP_MIN_DWELL_MS;

                                const el = firstWhiteRef.current;
                                if (el) {
                                  const topY = window.scrollY + el.getBoundingClientRect().top;
                                  const targetY = topY + WORKFLOW_DOOR_SCROLL_PX + idx * WORKFLOW_SCROLL_PX_PER_STEP;
                                  const lenis = window.__lenis;
                                  if (lenis?.scrollTo) {
                                    lenis.scrollTo(targetY, { duration: 0.8 });
                                  } else {
                                    window.scrollTo({ top: targetY, left: 0, behavior: 'smooth' });
                                  }
                                }
                              }}
                              className={`relative h-full focus:outline-none ${isActive ? 'flex-1 min-w-0' : 'w-[44px] md:w-[52px] shrink-0'
                                }`}
                              style={{
                                order: rel,
                                transformStyle: 'preserve-3d',
                                transformOrigin: 'left center',
                              }}
                              animate={{
                                rotateY,
                                rotateZ,
                                x,
                                z,
                                scale,
                                opacity,
                              }}
                              transition={{ type: 'spring', stiffness: 170, damping: 26, mass: 1.1 }}
                              aria-label={`Select ${step.label}`}
                            >
                              {/* Front Face */}
                              <div
                                className="absolute inset-0 overflow-hidden rounded-[18px] bg-gray-100"
                                style={{ backfaceVisibility: 'hidden' }}
                              >
                                <div className="absolute inset-[6px] overflow-hidden rounded-[14px] bg-white">
                                  <SegmentVideo
                                    src="/videoplayback1.mp4"
                                    start={step.start}
                                    end={step.end}
                                    play={isActive}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                </div>

                                {/* Inner shadow */}
                                <div
                                  aria-hidden="true"
                                  className="absolute inset-0 pointer-events-none rounded-[18px]"
                                  style={{
                                    boxShadow: isActive
                                      ? 'inset 0 1px 2px rgba(255,255,255,0.88), inset 0 -8px 18px rgba(0,0,0,0.06)'
                                      : 'inset 0 1px 2px rgba(255,255,255,0.86), inset 0 -8px 18px rgba(0,0,0,0.08)',
                                  }}
                                />

                                {/* Bottom Description Bar (Inset "pill" style) */}
                                {isActive && (
                                  <motion.div
                                    key={`desc-${step.label}`}
                                    initial={{ opacity: 0, y: 40, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                      duration: 0.5,
                                      ease: [0.23, 1, 0.32, 1], // "Quart" ease out 
                                      delay: 0.3 // Wait for card to settle before popping (ensures visibility)
                                    }}
                                    className="absolute inset-x-2 bottom-2 z-20"
                                  >
                                    <div className="bg-black/90 backdrop-blur-md text-white px-4 py-3 flex items-center justify-between border border-white/5 rounded-[12px] overflow-hidden">
                                      <div className="flex items-center gap-4">
                                        <motion.span
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: 0.45, type: "spring", stiffness: 300, damping: 20 }}
                                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse"
                                        />
                                        <p className="text-[13px] font-light tracking-wide text-white/90 truncate">
                                          {step.desc}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-3 text-[11px] tracking-widest font-mono text-white/40 shrink-0">
                                        <span className="text-white">{String(idx + 1).padStart(2, '0')}</span>
                                        <span className="h-px w-8 bg-white/20" />
                                        <span>{String(WORKFLOW_STEPS.length).padStart(2, '0')}</span>
                                      </div>

                                      {/* Technical sheen effect */}
                                      <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "200%" }}
                                        transition={{ duration: 1.2, ease: "linear", delay: 0.4 }}
                                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                                      />
                                    </div>
                                  </motion.div>
                                )}
                              </div>

                              {/* Edge bar for depth */}
                              {!isActive && (
                                <div
                                  aria-hidden="true"
                                  className="absolute top-[3px] bottom-[3px] w-[14px] rounded-r-[14px]"
                                  style={{
                                    right: '-4px',
                                    zIndex: -1,
                                    background: '#d4d4d8',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    backgroundImage: 'linear-gradient(to right, #e4e4e7, #d4d4d8)',
                                  }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </motion.div>

                      {/* Bottom Description Bar Removed (Moved inside card) */}
                    </div>

                    <div className="border-t border-black/8">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                        {WORKFLOW_STEPS.map((step, idx) => {
                          const active = idx === workflowIdx;
                          const Icon = step.icon;
                          return (
                            <button
                              key={step.label}
                              type="button"
                              onClick={() => {
                                workflowHasInteractedRef.current = true;
                                setWorkflowHasInteracted(true);

                                // Lock scroll updates
                                isScrollingToStepRef.current = true;

                                workflowAutoIdxRef.current = idx;
                                workflowAutoAdvanceRef.current = 0;
                                setWorkflowAdvance(0);
                                setWorkflowIdx(idx);

                                const el = firstWhiteRef.current;
                                if (el) {
                                  const topY = window.scrollY + el.getBoundingClientRect().top;
                                  const targetY = topY + WORKFLOW_DOOR_SCROLL_PX + idx * WORKFLOW_SCROLL_PX_PER_STEP;
                                  const lenis = window.__lenis;

                                  const DURATION = 1.0; // slightly slower for better jump feel

                                  if (lenis?.scrollTo) {
                                    lenis.scrollTo(targetY, { duration: DURATION, lock: true });
                                  } else {
                                    window.scrollTo({ top: targetY, left: 0, behavior: 'smooth' });
                                  }

                                  // Unlock after scroll finishes
                                  setTimeout(() => {
                                    isScrollingToStepRef.current = false;
                                  }, DURATION * 1000 + 100);
                                }
                              }}
                              className={`group relative w-full text-left px-5 py-4 transition-all duration-300 border-r border-black/5 last:border-r-0 ${active
                                ? 'opacity-100'
                                : 'opacity-40 hover:opacity-70'
                                }`}
                              aria-label={`Select ${step.label}`}
                            >
                              {/* Active indicator bar */}
                              <div
                                className={`absolute top-0 left-0 right-0 h-[1px] transition-all duration-300 ${active ? 'bg-black' : 'bg-transparent'
                                  }`}
                              />

                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`text-[11px] tracking-[0.2em] font-medium transition-colors ${active ? 'text-black' : 'text-black'
                                      }`}
                                  >
                                    {step.label.toUpperCase()}
                                  </span>
                                </div>
                                <Icon
                                  className={`h-3.5 w-3.5 transition-colors ${active ? 'text-black' : 'text-black'
                                    }`}
                                  aria-hidden="true"
                                />
                              </div>

                              {/* Description removed from here, moved to black bar */}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems we solve */}
      <section ref={philosophyRef} className="relative border-t border-black/5 bg-white text-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-12 mb-20">
            <Reveal>
              <h2 className="font-display text-[42px] md:text-[64px] font-extralight tracking-[-0.04em] leading-[1.05] text-black">
                The problems we solve.
              </h2>
            </Reveal>
          </div>

          <div className="space-y-0 border-t border-black/10">
            {[
              {
                pain: "Drowning in footage",
                desc: "4TB of clips after every weekend. Hours spent scrubbing for the good shots.",
                solution: "AI-powered culling finds highlights instantly."
              },
              {
                pain: "Audio sync nightmares",
                desc: "4 cameras, 6 mics, ceremony drift. Manual alignment takes forever.",
                solution: "Automatic multi-source alignment, even with drift."
              },
              {
                pain: "Starting from scratch",
                desc: "Every edit begins with a blank timeline. Hours of assembly before creativity.",
                solution: "Export a structured rough cut in minutes."
              }
            ].map((t, i) => (
              <Reveal key={i} delay={0.1}>
                <div className="group relative border-b border-black/10 transition-colors hover:bg-black/[0.02]">
                  <div className="py-12 md:py-16 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-4">
                      <h3 className="text-2xl md:text-3xl font-light text-black group-hover:text-black/90 transition-colors">
                        {t.pain}
                      </h3>
                    </div>
                    <div className="md:col-span-4">
                      <p className="text-lg text-black/50 font-light leading-relaxed max-w-sm">
                        {t.desc}
                      </p>
                    </div>
                    <div className="md:col-span-4 flex items-center gap-3 pt-1 md:pt-0">
                      <span className="text-sm text-black/40 font-mono">— {t.solution}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist - Stark & Direct (Black - Clean) */}
      <section id="waitlist" ref={firstDarkRef} data-nav="light" className="relative bg-black text-white border-y border-white/5 min-h-[80vh] flex items-center justify-center overflow-hidden">


        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Column: Text & Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12 text-left"
            >
              <h2 className="text-5xl md:text-7xl font-extralight tracking-[-0.04em] leading-[0.95] text-white mix-blend-difference">
                Join the waitlist.
              </h2>

              <p className="text-lg text-white/40 font-light max-w-md leading-relaxed">
                Available for select studios and agencies.
              </p>

              <div className="max-w-md">
                <EmailWaitlist />
              </div>
            </motion.div>

            {/* Right Column: UI Element MP4 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative aspect-square md:aspect-video lg:aspect-square w-full group overflow-hidden"
            >
              <video
                src="/element1.mp4"
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Centered, Minimal */}


      {/* Footer - Minimal Grid */}
      <footer className="relative bg-black text-white border-t border-white/5 py-24 md:py-32">
        {/* Subtle dot field (white dots on black) - matched to other dark sections */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.1]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: 'center',
          }}
        />

        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-24 mb-24">
            {/* Brand - 5 cols (golden ratio) */}
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

            {/* Links - 7 cols */}
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8">
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.4em] text-white/10 font-light">Product</span>
                <nav className="space-y-4 text-[13px] font-light">
                  <a href="#workflow" className="block text-white/40 hover:text-white transition-colors">Workflow</a>
                  <Link href="#waitlist" className="block text-white/40 hover:text-white transition-colors">Waitlist</Link>
                  <a href="#" className="block text-white/40 hover:text-white transition-colors">Changelog</a>
                </nav>
              </div>

              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.4em] text-white/10 font-light">Company</span>
                <nav className="space-y-4 text-[13px] font-light">
                  <Link href="/about" className="block text-white/40 hover:text-white transition-colors">About</Link>
                  <a href="#" className="block text-white/40 hover:text-white transition-colors">Contact</a>
                  <a href="#" className="block text-white/40 hover:text-white transition-colors">Careers</a>
                </nav>
              </div>

              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.4em] text-white/10 font-light">Legal</span>
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
              © 2024 QUARTZ
            </p>
            <div className="flex items-center gap-8 text-[10px] tracking-[0.3em] text-white/20 font-light">
              <a href="#" className="hover:text-white/40 transition-colors">INSTAGRAM</a>
              <a href="#" className="hover:text-white/40 transition-colors">TWITTER</a>
              <a href="#" className="hover:text-white/40 transition-colors">YOUTUBE</a>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}
