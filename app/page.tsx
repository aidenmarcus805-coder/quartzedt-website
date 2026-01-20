'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Film, Minus, Scissors, Search, Upload, User } from 'lucide-react';

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
  creemProductId: 'prod_founding_GF7xl',
};
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

// Dynamic import for 3D scene (client-side only)
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

const START_TRIAL_HREF = '/signin?next=/download';
const BOOK_DEMO_HREF = '/pricing';
const SHOW_BOOK_DEMO = false;

// Shared scroll constants (blueprint-aligned)
const WORKFLOW_DOOR_SCROLL_PX = 800;
const WORKFLOW_SCROLL_PX_PER_STEP = 1200;
const WORKFLOW_SCROLLS_PER_STEP = 3; // "3 scrolls to commit" feel
const WORKFLOW_STEP_MIN_DWELL_MS = 300; // minimum time to stay on a step during fast scrolling

export default function Home() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const price = billing === 'annual' ? PLAN.priceAnnual : PLAN.price;
  const period = billing === 'annual' ? 'year' : 'mo';
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const { data: session } = useSession();

  // Nav state management
  const [navOnLight, setNavOnLight] = useState(false);
  const firstWhiteRef = useRef<HTMLElement>(null);

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

    // Subtle scroll orchestration (blueprint)
    const onScroll = () => {
      if (!firstWhiteRef.current) return;
      const rect = firstWhiteRef.current.getBoundingClientRect();
      const doorProgress = -rect.top / WORKFLOW_DOOR_SCROLL_PX;
      const isWorkflowLocked = rect.top <= 0 && -rect.top < rect.height - window.innerHeight;

      setNavOnLight(rect.top <= 80 && -rect.top < rect.height - 80);
      setWorkflowLocked(isWorkflowLocked);

      // Handle the "garage door" slide-up
      if (workflowDoorRef.current) {
        const slide = Math.max(0, Math.min(100, doorProgress * 100));
        workflowDoorRef.current.style.transform = `translate3d(0, -${slide}%, 0)`;
      }

      // If we're in the workflow zone, calculate which step we should be on based on scroll
      if (isWorkflowLocked) {
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

  const workflowDoorRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen selection:bg-white selection:text-black antialiased">

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
            {/* Preload both logo variants so switching on light sections is instant (no "lag-behind"). */}
            <span className="relative h-5 w-auto aspect-[256/65] shrink-0">
              <Image
                src="/logo.png"
                alt="Quartz Editor"
                fill
                sizes="80px"
                priority
                unoptimized
                className={`object-contain transition-opacity duration-150 ${navOnLight ? 'opacity-0' : 'opacity-100'
                  }`}
              />
              <Image
                src="/logoBlack.png"
                alt=""
                aria-hidden="true"
                fill
                sizes="80px"
                priority
                unoptimized
                className={`object-contain transition-opacity duration-150 ${navOnLight ? 'opacity-100' : 'opacity-0'
                  }`}
              />
            </span>
          </Link>

          <div
            className={`hidden md:flex items-center gap-12 text-[10px] tracking-[0.32em] font-light ${navOnLight ? 'text-black' : 'text-white'
              }`}
          >
            <Link href="/about" className="link-underline hover:opacity-60 transition-opacity">ABOUT</Link>
            <Link href="/pricing" className="link-underline hover:opacity-60 transition-opacity">PRICING</Link>
            <Link href="/download" className="link-underline hover:opacity-60 transition-opacity">DOWNLOAD</Link>
          </div>

          <div
            className={`flex items-center gap-6 text-[10px] tracking-[0.32em] font-light ${navOnLight ? 'text-black' : 'text-white'
              }`}
          >
            <Link href={START_TRIAL_HREF} className="link-underline hover:opacity-60 transition-opacity">
              START TRIAL
            </Link>
            <Link
              href={session ? "/dashboard" : "/signin?next=/download"}
              className={`p-2.5 rounded-full border transition-all duration-300 active:scale-95 flex items-center justify-center group/signin ${navOnLight
                ? 'border-black/20 hover:border-black hover:bg-black/5'
                : 'border-white/20 hover:border-white hover:bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]'
                }`}
              aria-label={session ? "Go to Dashboard" : "Sign In"}
            >
              <User className={`w-4 h-4 transition-colors duration-300 ${navOnLight ? 'text-black' : 'text-white'} group-hover/signin:text-accent`} />
              <div className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full animate-pulse bg-accent ${session ? 'opacity-100' : 'opacity-0'}`} />
            </Link>
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

      {/* Key Benefits */}
      <section className="relative bg-black border-t border-white/5 py-32 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 space-y-32 md:space-y-48">

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
                <div className="relative w-[300px] md:w-[500px] aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#050505]">
                  <Image
                    src="/wedding-culling-ui.png"
                    alt="Wedding Culling Interface"
                    fill
                    className="object-cover opacity-95"
                  />

                  {/* Flat UI Overlay: Selection Highlight */}
                  <motion.div
                    className="absolute top-[38%] left-[38%] w-[24%] h-[24%] border-2 border-white rounded-sm"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Flat UI Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      <span className="text-[10px] font-bold tracking-tight text-black uppercase">Processing</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle Monochrome Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-white/5 blur-[80px] rounded-full pointer-events-none" />
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
                <span className="text-white/50">Done in moments.</span>
              </h3>
              <p className="text-[16px] md:text-[18px] leading-[1.8] text-white/50 font-light">
                Quartz doesn&apos;t just organize; it builds. <span className="text-white/90 font-normal">Your wedding footage</span> is intelligently culled, color-corrected, and assembled into a full, solid rough cut—saving you weeks of manual labor.
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
                <div className="relative w-[300px] md:w-[500px] aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#050505]">
                  <Image
                    src="/flat-audio-sync-ui.png"
                    alt="Audio Synchronization Interface"
                    fill
                    className="object-cover opacity-95"
                  />

                  {/* Flat Sync Line */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-[1px] bg-white"
                    style={{ left: "50%" }}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />

                  {/* Flat Sync Badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-black border border-white/20 px-3 py-1 rounded-sm shadow-xl"
                    >
                      <span className="text-[10px] font-mono text-white tracking-widest uppercase">Sync_Complete</span>
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
                Sonic precision.<br />
                <span className="text-white/50">Perfectly synced.</span>
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
                <div className="relative w-[300px] md:w-[500px] aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#050505]">
                  <Image
                    src="/flat-export-ui.png"
                    alt="Seamless Export Interface"
                    fill
                    className="object-cover opacity-95"
                  />

                  {/* Flat Success Toast */}
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                      <span className="text-[11px] font-semibold text-black tracking-wide">Ready to Edit</span>
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
                <span className="text-white/50">unlocked.</span>
              </h3>
              <p className="text-[16px] md:text-[18px] leading-[1.8] text-white/50 font-light">
                Skip the assembly drudgery entirely. Export a fully structured, <span className="text-white/90 font-normal">color-graded</span> timeline directly to your NLE for any Highlight, Full Day, Ceremony, or Reception edit. Start with a finished foundation.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Subtle dot field */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            backgroundPosition: 'center',
            opacity: 0.35,
          }}
        />
      </section>

      {/* Workflow */}
      <section
        id="workflow"
        ref={firstWhiteRef}
        data-nav="light"
        className="relative bg-paper text-black border-b border-black/5"
      >
        {/* Garage-door panel (sticks to viewport, slides up with scroll to reveal workflow) */}
        <div
          ref={workflowDoorRef}
          className="pointer-events-none sticky top-0 z-40 bg-black -mb-screen rounded-b-3xl"
          style={{ height: '100vh', transform: 'translate3d(0, 0, 0)', willChange: 'transform', marginBottom: '-100vh' }}
        >
          {/* Subtle dot field (matches hero language) */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
              backgroundPosition: 'center',
              opacity: 0.35,
            }}
          />

          {/* Bottom edge + shadow so the "door" reads as a panel */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px"
            style={{
              background: 'rgba(255,255,255,0.10)',
              boxShadow: '0 18px 60px rgba(0,0,0,0.55)',
            }}
          />
        </div>

        <div
          className="relative"
          style={{
            // Include a full step window for the last step as well (avoids “instant exit” + blank space on fast scroll).
            height: `calc(100vh + ${WORKFLOW_DOOR_SCROLL_PX + WORKFLOW_SCROLL_PX_PER_STEP * WORKFLOW_STEPS.length}px)`,
          }}
        >
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

          <div className="sticky top-0 h-screen">
            {/* Keep pinned content comfortably within the viewport (avoid clipped dock on shorter screens). */}
            <div className="relative h-full pt-24 pb-12 flex flex-col">
              {/* Title (gallery rhythm: aligned to content grid) */}
              <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 flex-none">
                <h2 className="font-display text-[clamp(56px,5.5vw,96px)] font-light tracking-[-0.06em] leading-[0.92]">
                  The Workflow
                  <BleepDot className="ml-4" />
                </h2>
              </div>

              {/* Videos */}
              <div className="flex-1 mt-4 md:mt-6 flex items-end">
                {/* Stage (same width as the rest of the site) */}
                <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 w-full">
                  {/* One “video row”: active expands (main), others stay as shutters on the right.
                      Advancing tabs expands the next shutter into the main video (per blueprint). */}
                  <div className="relative overflow-hidden bg-white shadow-[0_70px_160px_rgba(0,0,0,0.10)]">
                    {/* Workflow HUD */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
                      <div className="flex items-start justify-between p-5 md:p-6">
                        <div className="flex flex-col gap-1.5 backdrop-blur-sm bg-white/60 rounded-lg px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                            <span className="text-[11px] tracking-[0.35em] text-black/60 font-medium">
                              {WORKFLOW_STEPS[workflowIdx]?.label.toUpperCase()}
                            </span>
                          </div>
                          <p className="pl-[18px] text-[12px] leading-[1.5] text-black/40 font-light max-w-[280px]">
                            {WORKFLOW_STEPS[workflowIdx]?.desc}
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 backdrop-blur-sm bg-white/60 rounded-lg px-4 py-3">
                          <span className="text-[13px] font-medium text-black/70">{String(workflowIdx + 1).padStart(2, '0')}</span>
                          <span className="h-[1px] w-6 bg-black/20" aria-hidden="true" />
                          <span className="text-[13px] text-black/35">{String(WORKFLOW_STEPS.length).padStart(2, '0')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative aspect-[21/10]">
                      <motion.div
                        className="absolute inset-0 flex gap-[6px] p-2 md:p-3"
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

                      <AnimatePresence>
                        {workflowLocked && !workflowHasInteracted && (
                          <motion.div
                            key="workflow-hint"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="pointer-events-none absolute left-4 bottom-4 z-10"
                          >
                            <div className="inline-flex items-center gap-3 border border-black/10 bg-white/80 backdrop-blur-sm px-4 py-2">
                              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                              <span className="text-[10px] tracking-[0.45em] text-black/55 font-light">
                                SCROLL TO ADVANCE
                              </span>
                              <motion.span
                                aria-hidden="true"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.6, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
                                className="text-black/35"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </motion.span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {workflowLocked &&
                          workflowIdx === WORKFLOW_STEPS.length - 1 &&
                          workflowAdvance === WORKFLOW_SCROLLS_PER_STEP - 1 && (
                            <motion.div
                              key="workflow-exit-hint"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                              className="pointer-events-none absolute right-4 bottom-4 z-10"
                            >
                              <div className="inline-flex items-center gap-3 border border-black/10 bg-white/80 backdrop-blur-sm px-4 py-2">
                                <span className="h-2 w-2 rounded-full bg-black/25" aria-hidden="true" />
                                <span className="text-[10px] tracking-[0.45em] text-black/55 font-light">
                                  SCROLL TO CONTINUE
                                </span>
                              </div>
                            </motion.div>
                          )}
                      </AnimatePresence>
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
                                workflowAutoIdxRef.current = idx;
                                workflowAutoAdvanceRef.current = 0;
                                setWorkflowAdvance(0);
                                setWorkflowIdx(idx);

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
                              className={`group relative w-full text-left px-5 py-5 transition-all duration-200 border-r border-black/5 last:border-r-0 ${active
                                ? 'bg-white'
                                : 'bg-[#fafafa] hover:bg-white'
                                }`}
                              aria-label={`Select ${step.label}`}
                            >
                              {/* Active indicator bar */}
                              <div
                                className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${active ? 'bg-accent' : 'bg-transparent'
                                  }`}
                              />

                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${active ? 'bg-accent' : 'bg-black/20 group-hover:bg-black/30'
                                      }`}
                                    aria-hidden="true"
                                  />
                                  <span
                                    className={`text-[11px] tracking-[0.25em] font-medium transition-colors ${active ? 'text-black' : 'text-black/45 group-hover:text-black/65'
                                      }`}
                                  >
                                    {step.label.toUpperCase()}
                                  </span>
                                </div>
                                <Icon
                                  className={`h-4 w-4 transition-colors ${active ? 'text-black/60' : 'text-black/25 group-hover:text-black/40'
                                    }`}
                                  aria-hidden="true"
                                />
                              </div>

                              {/* Description - shows on active */}
                              <motion.p
                                initial={false}
                                animate={{
                                  height: active ? 'auto' : 0,
                                  opacity: active ? 1 : 0,
                                  marginTop: active ? 8 : 0,
                                }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden text-[12px] leading-[1.6] text-black/45 font-light"
                              >
                                {step.desc}
                              </motion.p>
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

      {/* Testimonials Section */}
      <section ref={philosophyRef} className="relative border-t border-white/5 bg-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-32">
          <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-24">
            <Reveal>
              <h2 className="font-display text-[42px] md:text-[64px] font-extralight tracking-[-0.04em] leading-[1.05] text-white max-w-2xl">
                Trusted by the world's best storytellers.
                <BleepDot className="ml-4" />
              </h2>
            </Reveal>
            <div className="hidden md:block pb-4">
              <Reveal delay={0.1}>
                <p className="text-white/40 text-sm tracking-widest font-light uppercase">
                  REAL FEEDBACK FROM REAL PROS
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I used to drown in 4TB of footage after every weekend. Quartz culls the junk instantly. I delivered my last three weddings in half the time.",
                author: "Elena R.",
                role: "Destination Weddings"
              },
              {
                quote: "Syncing 4 cameras and 6 mics for a ceremony used to be a nightmare. Quartz aligns it all flawlessly, even with drift. It's essential gear now.",
                author: "Marcus T.",
                role: "Luxury Wedding Films"
              },
              {
                quote: "Most AI editors chop up the emotion. Quartz actually understands the vows and speeches. I start with a solid story timeline instead of a mess.",
                author: "Sarah J.",
                role: "Wedding Editor"
              }
            ].map((t, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <div className="group relative p-10 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors duration-500 h-full">
                  <div className="absolute top-10 left-10 text-white/10 group-hover:text-white/20 transition-colors text-6xl font-serif leading-none">
                    &ldquo;
                  </div>
                  <div className="relative z-10 pt-12 space-y-8">
                    <p className="text-[17px] leading-[1.8] text-white/80 font-light">
                      {t.quote}
                    </p>
                    <div>
                      <div className="text-white font-medium mb-1">{t.author}</div>
                      <div className="text-white/40 text-[11px] tracking-widest uppercase">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Minimal Grid */}
      <section data-nav="light" className="relative bg-white text-black border-y border-black/5">
        {/* Subtle dot field (Gray for light background) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            backgroundPosition: 'center',
          }}
        />

        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 w-full py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">

            {/* Left - Title + Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-24"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-sm text-black/50">Founding offer · 50 spots</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-light tracking-tight">
                One price
              </h1>

              <p className="mt-4 text-black/40">
                Lock in this rate for life.
              </p>

              {/* Billing Toggle */}
              <div className="mt-10 flex items-center p-1 bg-black/5 rounded-full border border-black/10 w-fit">
                <button
                  onClick={() => setBilling('monthly')}
                  className={`px-5 py-2 rounded-full text-sm transition-all ${billing === 'monthly' ? 'bg-white text-black shadow-sm font-medium' : 'text-black/50 hover:text-black'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling('annual')}
                  className={`px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${billing === 'annual' ? 'bg-white text-black shadow-sm font-medium' : 'text-black/50 hover:text-black'}`}
                >
                  Annual
                  <span className={`text-xs px-1.5 py-0.5 rounded ${billing === 'annual' ? 'bg-accent text-white' : 'bg-accent/10 text-accent'}`}>
                    Save 2mo
                  </span>
                </button>
              </div>

              {/* Referral */}
              <p className="mt-10 text-sm text-black/25">
                <Link href="/dashboard?tab=referrals" className="hover:text-black/50 transition-colors">
                  Refer a friend → Get a free month
                </Link>
              </p>
            </motion.div>

            {/* Right - Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-black/[0.03] border border-black/10 rounded-2xl p-8 md:p-12 grid md:grid-cols-5 gap-12 items-center overflow-hidden"
            >
              {/* Content - 3 cols */}
              <div className="md:col-span-3 space-y-8">
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl md:text-6xl font-light tracking-tight">${price}</span>
                    <span className="text-lg text-black/40">/{period}</span>
                  </div>
                  <p className="mt-2 text-sm text-black/40">per seat · cancel anytime</p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {PLAN.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-sm text-black/70">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div>
                  <a href={`https://creem.io/checkout/${PLAN.creemProductId}`} target="_blank" rel="noopener noreferrer" className="block">
                    <button className="group w-full py-4 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200" />
                      Start free trial
                    </button>
                  </a>
                  <p className="text-center text-black/30 text-[11px] mt-3 font-medium">7 days free · No credit card</p>
                </div>
              </div>

              {/* Gallery - 2 cols (Visual filler) */}
              <div className="hidden md:block md:col-span-2 relative h-full min-h-[400px]">
                {/* Card 1 */}
                <div className="absolute top-0 right-0 w-[260px] aspect-[4/3] rounded-lg shadow-2xl shadow-black/10 border border-black/5 overflow-hidden transform rotate-3 translate-x-4 z-10 bg-white">
                  <Image
                    src="/wedding-culling-ui.png"
                    alt="Culling Interface"
                    fill
                    className="object-cover"
                  />
                  {/* Subtle gloss overlay to make it look like a screen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
                </div>

                {/* Card 2 */}
                <div className="absolute top-32 right-12 w-[240px] aspect-[4/3] rounded-lg shadow-xl shadow-black/5 border border-black/5 overflow-hidden transform -rotate-2 -translate-x-4 bg-white">
                  <Image
                    src="/flat-export-ui.png"
                    alt="Export Interface"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section - Centered, Minimal */}


      {/* Footer - Minimal Grid */}
      <footer className="border-t border-white/5">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-20">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
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
    </div>
  );
}
