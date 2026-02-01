'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Film, MessageCircle, FileText, Map, Minus, Scissors, Search, Upload, User } from 'lucide-react';

import { PRICING_PLAN } from './lib/constants/pricing';

const PLAN = PRICING_PLAN;
import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

// Dynamic import for 3D scene (client-side only)
// ShutterReveal component removed (inlined)

const CameraScene = dynamic<{
  lowPowerMode?: boolean;
  variant?: 'full' | 'gallery';
  className?: string;
}>(() => import('./components/CameraScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        {/* Minimal Quartz-themed loader */}
        <div className="relative h-[2px] w-24 overflow-hidden bg-white/10">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="h-full w-full bg-accent"
          />
        </div>
        <p className="text-[10px] tracking-[0.4em] text-white/30 font-light translate-y-2">
          INITIALIZING SCENE
        </p>
      </div>
    </div>
  )
});

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
    icon: Upload,
    start: 2,
    end: 12,
    desc: 'Deep-scan volumes. Automatic metadata extraction and proxy generation.',
  },
  {
    label: 'Cull',
    icon: Search,
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
    icon: Film,
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

const START_TRIAL_HREF = '/signin?next=/dashboard/download';
const BOOK_DEMO_HREF = '/pricing';
const SHOW_BOOK_DEMO = false;

// Shared scroll constants (blueprint-aligned)
const WORKFLOW_DOOR_SCROLL_PX = 1500; // Super Heavy mechanical scroll // Balanced: Heavy enough to feel mechanical, short enough to avoid "too much space"
const WORKFLOW_SCROLL_PX_PER_STEP = 1200;
const WORKFLOW_SCROLLS_PER_STEP = 3; // "3 scrolls to commit" feel
const WORKFLOW_STEP_MIN_DWELL_MS = 300; // minimum time to stay on a step during fast scrolling

export default function Home() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const price = billing === 'annual' ? PLAN.priceAnnual : PLAN.price;
  const originalPrice = billing === 'annual' ? PLAN.originalPriceAnnual : PLAN.originalPrice;
  const productId = billing === 'annual' ? PLAN.creemProductIdAnnual : PLAN.creemProductIdMonthly;
  const period = billing === 'annual' ? 'year' : 'mo';
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const { data: session } = useSession();

  // Nav state management
  const [navOnLight, setNavOnLight] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

      // Check if we're over the Workflow section (white)
      if (firstWhiteRef.current) {
        const workflowRect = firstWhiteRef.current.getBoundingClientRect();
        // We're in Workflow if its top is above the nav threshold and its bottom is below
        if (workflowRect.top <= NAV_THRESHOLD && workflowRect.bottom > NAV_THRESHOLD) {
          inLightZone = true;
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

      {/* Navigation - minimal, aligned to grid */}
      <motion.nav
        ref={navRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* Dual logo system: white logo for dark sections, black logo for light sections */}
            <span className="relative h-5 w-auto aspect-[256/65] shrink-0">
              {/* White logo (shown on dark backgrounds) */}
              <Image
                src="/logo.png"
                alt="Quartz Editor"
                fill
                sizes="80px"
                priority
                unoptimized
                className={`object-contain transition-opacity duration-200 ${navOnLight ? 'opacity-0' : 'opacity-100'}`}
              />
              {/* Black logo (shown on light backgrounds) */}
              <Image
                src="/logoBlack.png"
                alt=""
                aria-hidden="true"
                fill
                sizes="80px"
                priority
                unoptimized
                className={`object-contain transition-opacity duration-200 ${navOnLight ? 'opacity-100' : 'opacity-0'}`}
              />
            </span>
          </Link>

          <div
            className={`hidden md:flex items-center gap-12 text-[10px] tracking-[0.32em] font-light ${navOnLight ? 'text-black' : 'text-white'}`}
          >
            <Link href="/about" className="link-underline hover:opacity-60 transition-opacity">ABOUT</Link>
            <Link href="/pricing" className="link-underline hover:opacity-60 transition-opacity">PRICING</Link>
            <Link href="/dashboard/download" className="link-underline hover:opacity-60 transition-opacity">DOWNLOAD</Link>
          </div>

          <div
            className={`flex items-center gap-6 text-[10px] tracking-[0.32em] font-light ${navOnLight ? 'text-black' : 'text-white'}`}
          >
            {/* Only show START TRIAL if user is NOT signed in */}
            {!session && (
              <Link href={START_TRIAL_HREF} className="link-underline hover:opacity-60 transition-opacity">
                START TRIAL
              </Link>
            )}

            {/* User Profile - Avatar dropdown for signed in, simple icon for signed out */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-300 active:scale-95 ${navOnLight
                    ? 'border-black/20 hover:border-black hover:bg-black/5'
                    : 'border-white/20 hover:border-white hover:bg-white/10'
                    }`}
                  aria-label="User menu"
                >
                  {/* User Avatar - Google profile picture or first letter */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium overflow-hidden ${navOnLight ? 'bg-black/10' : 'bg-white/10'}`}>
                    {session.user?.image ? (
                      <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className={navOnLight ? 'text-black/60' : 'text-white/60'}>
                        {session.user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''} ${navOnLight ? 'text-black/50' : 'text-white/50'}`} />
                </button>

                {/* Dropdown Menu - Click to toggle with AnimatePresence */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden z-50"
                    >
                      <div className="p-1">
                        <div className="px-3 py-2 text-[10px] text-black/40 border-b border-black/5 mb-1 truncate">
                          {session.user?.email}
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-black/60 hover:text-black hover:bg-black/5 rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/download"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-black/60 hover:text-black hover:bg-black/5 rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Download
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-black/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                className={`p-2.5 rounded-full border transition-all duration-300 active:scale-95 flex items-center justify-center group/signin ${navOnLight
                  ? 'border-black/20 hover:border-black hover:bg-black/5'
                  : 'border-white/20 hover:border-white hover:bg-white/10'
                  }`}
                aria-label="Sign In"
              >
                <User className={`w-4 h-4 transition-colors duration-300 ${navOnLight ? 'text-black' : 'text-white'} group-hover/signin:text-accent`} />
              </Link>
            )}
            {SHOW_BOOK_DEMO && (
              <a href={BOOK_DEMO_HREF} className="link-underline hover:opacity-60 transition-opacity hidden xl:inline">
                BOOK DEMO
              </a>
            )}
          </div>
        </div>
      </motion.nav>



      {/* Hero - Fullscreen intro (scroll-driven) */}
      <section ref={heroRef} className="relative">
        <CameraScene lowPowerMode={lowPowerMode} variant="full" />
      </section>

      {/* Key Benefits (Black - Clean) */}
      <section className="relative bg-black text-white border-t border-white/5 py-32 overflow-hidden">
        {/* Artifacts removed per user request for clean monochrome look */}

        <div className="w-full max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 space-y-32 md:space-y-48 relative z-10">

          {/* Feature 01: Intelligent Culling */}
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12 md:mb-16"
            >
              <div className="relative z-10">
                <div className="relative w-[300px] md:w-[500px] aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#111]">
                  <Image
                    src="/wedding-culling-ui.png"
                    alt="Wedding Culling Interface"
                    fill
                    className="object-cover opacity-90"
                  />

                  {/* Flat UI Overlay: Selection Highlight */}
                  <motion.div
                    className="absolute top-[38%] left-[38%] w-[24%] h-[24%] border-2 border-accent rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Flat UI Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] shadow-sm rounded-md border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <span className="text-[10px] font-bold tracking-tight text-white uppercase">Processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl space-y-6"
            >
              <h3 className="font-display text-[32px] md:text-[48px] text-white font-extralight tracking-tight leading-[1.1]">
                Weeks of work.<br />
                <span className="text-white/40">Done in moments.</span>
              </h3>
              <p className="text-[16px] md:text-[18px] leading-[1.8] text-white/50 font-light">
                Quartz doesn&apos;t just organize; it builds. <span className="text-white/80 font-normal">Your wedding footage</span> is intelligently culled, color-corrected, and assembled into a full, solid rough cut—saving you weeks of manual labor.
              </p>
            </motion.div>
          </div>

          {/* Feature 02: Audio Sync */}
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12 md:mb-16"
            >
              <div className="relative z-10">
                <div className="relative w-[300px] md:w-[500px] aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#111]">
                  <Image
                    src="/flat-audio-sync-ui.png"
                    alt="Audio Synchronization Interface"
                    fill
                    className="object-cover opacity-90"
                  />

                  {/* Scanning Playhead - Elegant and technical */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-[1px] bg-accent/80 shadow-[0_0_15px_rgba(34,197,94,0.3)] z-20"
                    initial={{ left: "0%", opacity: 0 }}
                    whileInView={{ left: "100%", opacity: 1 }}
                    viewport={{ once: false }} // Re-run on scroll back
                    transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                  />

                  {/* "Synced" Badge */}
                  <div className="absolute top-4 right-4 z-30">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1, duration: 0.4 }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 shadow-sm rounded-full"
                    >
                      <motion.div
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-accent"
                      />
                      <span className="text-[10px] font-medium tracking-widest text-white uppercase">Synced</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl space-y-6"
            >
              <h3 className="font-display text-[32px] md:text-[48px] text-white font-extralight tracking-tight leading-[1.1]">
                Instantly synced.<br />
                <span className="text-white/40">Perfectly aligned.</span>
              </h3>
              <p className="text-[16px] md:text-[18px] leading-[1.8] text-white/50 font-light">
                Multi-cam sources, external recorders, and chaotic audio—instantly aligned. Quartz analyzes the waveform landscape to ensure every toast, vow, and laugh is perfectly in place.
              </p>
            </motion.div>
          </div>

          {/* Feature 03: Seamless Export */}
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12 md:mb-16"
            >
              <div className="relative z-10">
                <div className="relative w-[300px] md:w-[500px] aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#111]">
                  <Image
                    src="/flat-export-ui.png"
                    alt="Seamless Export Interface"
                    fill
                    className="object-cover opacity-90"
                  />

                  {/* Flat Success Toast */}
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span className="text-[11px] font-semibold text-white tracking-wide">Ready to Edit</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl space-y-6"
            >
              <h3 className="font-display text-[32px] md:text-[48px] text-white font-extralight tracking-tight leading-[1.1]">
                Creative flow,<br />
                <span className="text-white/40">unlocked.</span>
              </h3>
              <p className="text-[16px] md:text-[18px] leading-[1.8] text-white/50 font-light">
                Skip the assembly drudgery entirely. Export a fully structured, <span className="text-white/80 font-normal">color-graded</span> timeline directly to your NLE for any Highlight, Full Day, Ceremony, or Reception edit. Start with a finished foundation.
              </p>
            </motion.div>
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
                  The Workflow
                  <BleepDot className="ml-4" />
                </h2>
                <p className="mt-3 text-lg md:text-xl text-neutral-400 font-light max-w-2xl tracking-wide">
                  Automate your entire post-production pipeline.
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

                    <div className="relative aspect-[21/10]">
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
            <div className="hidden md:block">
              <Reveal delay={0.1}>
                <p className="text-black/40 text-xs tracking-widest font-mono uppercase">
                  Real solutions for real workflow pain
                </p>
              </Reveal>
            </div>
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
                      <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center flex-shrink-0 text-accent opacity-50 group-hover:opacity-100 transition-opacity">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-black/60 font-mono">{t.solution}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Stark & Direct (Black - Clean) */}
      <section ref={firstDarkRef} data-nav="light" className="relative bg-black text-white border-y border-white/5 min-h-screen flex items-center overflow-hidden">
        {/* Artifacts: Plus signs grid (Restored per user request) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15]" aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h1v1H0zM39 0h1v1h-1zM0 39h1v1H0zM39 39h1v1h-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 w-full py-32">
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
                    3 MONTHS FREE
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Right - Dark Monochrome Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Dark card - Dark Grey with White Text (Monochrome) */}
              <div className="bg-[#111] text-white rounded-2xl p-10 md:p-12 border border-white/10">

                <div className="mb-10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl md:text-7xl font-light tracking-tight text-white">${price}</span>
                    <span className="text-2xl text-white/30 line-through decoration-white/30 decoration-1">${originalPrice}</span>
                    <span className="text-xl text-white/40">/{period}</span>
                  </div>
                  <p className="text-white/40 text-sm mt-2">Billed {billing}, cancel anytime.</p>
                  <p className="text-accent/80 text-xs mt-4 font-mono uppercase tracking-wide">
                    Early Access Price · Locked in forever
                  </p>
                </div>

                <div className="space-y-4 mb-10 border-t border-white/5 pt-8">
                  {PLAN.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-white/40" />
                      <span className="text-[15px] text-white/70">{f}</span>
                    </div>
                  ))}
                </div>

                <a href={`https://creem.io/payment/${productId}`} target="_blank" rel="noopener noreferrer" className="block">
                  <button className="w-full py-4 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors">
                    Start free trial
                  </button>
                </a>
                <p className="text-center text-white/30 text-xs mt-4">
                  7 day free trial · No credit card
                </p>
              </div>
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
                <span className="text-[10px] tracking-[0.4em] text-white/20 font-light">PRODUCT</span>
                <nav className="space-y-4 text-[13px] font-light">
                  <a href="#workflow" className="block text-white/40 hover:text-white transition-colors">Workflow</a>
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
