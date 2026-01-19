'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight, Film, Minus, Scissors, Search, Upload, User } from 'lucide-react';
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

      {/* What Cutline Does - scrollable bridge section */}
      <section className="relative bg-black">
        <div className="min-h-screen flex items-end">
          <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 pb-24 md:pb-32">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                <p className="text-[10px] tracking-[0.55em] text-white/35 font-light">
                  AI WEDDING VIDEO EDITOR
                </p>
              </div>

              <h2 className="mt-10 font-display text-[clamp(32px,3.4vw,56px)] font-extralight tracking-[-0.04em] leading-[1.08] text-white">
                Quartz turns raw wedding footage into a timeline you can finish.
              </h2>
              <p className="mt-8 text-[15px] md:text-[17px] leading-[1.9] text-white/55 font-light max-w-[62ch]">
                Sync cameras + lavs, find vows and speeches, rank reactions, shape pacing — then export a clean rough cut
                to Premiere or Resolve.
              </p>
            </div>
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
                    {/* Workflow HUD (makes the scroll hijack feel intentional) */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
                      <div className="flex items-start justify-between p-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                            <span className="text-[10px] tracking-[0.5em] text-black/45 font-light">
                              {WORKFLOW_STEPS[workflowIdx]?.label.toUpperCase()}
                            </span>
                          </div>
                          <div className="pl-5 text-[12px] leading-[1.55] text-black/35 font-light">
                            {WORKFLOW_STEPS[workflowIdx]?.desc}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] text-black/40 font-light">
                          <span>{String(workflowIdx + 1).padStart(2, '0')}</span>
                          <span className="h-[1px] w-10 bg-black/15" aria-hidden="true" />
                          <span>{String(WORKFLOW_STEPS.length).padStart(2, '0')}</span>
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

                                <div
                                  aria-hidden="true"
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    boxShadow: isActive
                                      ? 'inset 0 1px 2px rgba(255,255,255,0.88), inset 0 -8px 18px rgba(0,0,0,0.06), 0 34px 92px rgba(0,0,0,0.12)'
                                      : 'inset 0 1px 2px rgba(255,255,255,0.86), inset 0 -8px 18px rgba(0,0,0,0.05), 0 18px 54px rgba(0,0,0,0.10)',
                                  }}
                                />
                              </div>

                              {/* Right Face (Thickness) */}
                              <div
                                aria-hidden="true"
                                className="absolute top-[2px] bottom-[2px] w-[24px] bg-[#1a1a1a] rounded-r-[4px]"
                                style={{
                                  left: '100%',
                                  transformOrigin: 'left center',
                                  transform: 'rotateY(90deg)',
                                  backfaceVisibility: 'hidden',
                                }}
                              />

                              <div
                                aria-hidden="true"
                                className="absolute inset-y-0 right-0 w-px pointer-events-none"
                                style={{
                                  opacity: isActive ? 0 : 1,
                                  background: 'rgba(255,255,255,0.55)',
                                  boxShadow: 'none',
                                }}
                              />
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

                    <div className="border-t border-black/10 bg-black/10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-px">
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
                                // workflowStepLockUntilRef.current = performance.now() + WORKFLOW_STEP_MIN_DWELL_MS;

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
                              className={`group w-full text-left px-4 py-4 transition-colors ${active ? 'bg-white' : 'bg-[#f4f4f5] hover:bg-white/80'
                                }`}
                              aria-label={`Select ${step.label}`}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${active ? 'bg-accent opacity-100 scale-100' : 'bg-black/25 opacity-0 scale-75'
                                      }`}
                                    aria-hidden="true"
                                  />
                                  <span
                                    className={`text-[10px] tracking-[0.32em] md:tracking-[0.45em] font-light transition-colors whitespace-nowrap ${active ? 'text-black/80' : 'text-black/55 group-hover:text-black/70'
                                      }`}
                                  >
                                    {step.label.toUpperCase()}
                                  </span>
                                </div>
                                <Icon
                                  className={`h-4 w-4 transition-colors ${active ? 'text-black/55' : 'text-black/35 group-hover:text-black/50'
                                    }`}
                                  aria-hidden="true"
                                />
                              </div>
                              <p
                                className={`overflow-hidden text-[12px] leading-[1.55] font-light transition-all duration-200 ${active ? 'mt-2 max-h-24 opacity-100 text-black/50' : 'mt-0 max-h-0 opacity-0 text-black/35'
                                  }`}
                              >
                                {step.desc}
                              </p>
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

      {/* Philosophy Section - Golden Ratio: 38.2% / 61.8% */}
      <section ref={philosophyRef} className="relative border-t border-white/5">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            {/* Left: Image (5 cols = 41.6%, close to golden) */}
            <div className="lg:col-span-5">
              <Reveal>
                <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-white/[0.02]">
                  <Image
                    src="https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&w=1800&q=80"
                    alt="Wedding filmmaker at work"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
                </div>
              </Reveal>
            </div>

            {/* Right: Text (7 cols = 58.3%, close to golden) */}
            <div className="lg:col-span-7 space-y-12">
              <Reveal>
                <div className="space-y-8">
                  <h2 className="font-display text-[36px] md:text-[56px] font-extralight leading-[1.1] tracking-[-0.03em] max-w-2xl">
                    Technology that respects
                    <span className="text-white/30"> the artist.</span>
                    <BleepDot className="ml-4" />
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
      <section data-nav="light" className="bg-paper text-black border-y border-black/5">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-32">
          <div className="grid grid-cols-12 gap-12 items-start">
            <div className="col-span-12 lg:col-span-4">
              <Reveal>
                <div className="space-y-8">
                  <h2 className="font-display text-[42px] md:text-[64px] font-extralight tracking-[-0.04em] leading-[1.05]">
                    Simple pricing.<BleepDot className="ml-4" />
                    <br />
                    <span className="text-black/20">Two tiers. Per seat.</span>
                  </h2>
                  <p className="text-[15px] leading-[1.9] text-black/55 font-light max-w-[52ch]">
                    Start monthly. Save 2 months with annual billing. A limited founders offer fuels word-of-mouth.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <div className="grid md:grid-cols-2 gap-px bg-black/5 border border-black/5">
                {/* Starter */}
                <Reveal delay={0.1}>
                  <div className="bg-paper p-12 md:p-16 hover:bg-gray-50 transition-colors duration-300">
                    <div className="space-y-10">
                      <div>
                        <p className="text-[10px] tracking-[0.4em] text-black/30 mb-8">
                          STARTER
                        </p>
                        <div className="text-[64px] md:text-[80px] font-extralight tracking-[-0.04em] leading-none">
                          $79
                        </div>
                        <p className="text-[14px] text-black/40 mt-4 font-light">
                          /mo · per seat
                        </p>
                      </div>

                      <p className="text-[15px] font-light leading-[1.7] text-black/60">
                        Organize scenes + transcripts. Triage selects fast. Export clean XML.
                      </p>

                      <Link href={START_TRIAL_HREF} className="group inline-flex items-center justify-center gap-3 w-full rounded-full border border-black/15 py-5 text-[10px] tracking-[0.4em] hover:bg-black hover:text-white transition-all font-light">
                        <span
                          className="h-2 w-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-200"
                          aria-hidden="true"
                        />
                        START TRIAL
                      </Link>
                    </div>
                  </div>
                </Reveal>

                {/* Pro */}
                <Reveal delay={0.2}>
                  <div className="bg-black text-white p-12 md:p-16 relative group hover:bg-paper hover:text-black transition-all duration-500">
                    <div className="absolute top-8 right-8 w-2 h-2 bg-accent rounded-full" />

                    <div className="space-y-10">
                      <div>
                        <p className="text-[10px] tracking-[0.4em] text-white/30 group-hover:text-black/30 mb-8">
                          PRO
                        </p>
                        <div className="text-[64px] md:text-[80px] font-extralight tracking-[-0.04em] leading-none">
                          $199
                        </div>
                        <p className="text-[14px] text-white/40 group-hover:text-black/40 mt-4 font-light">
                          /mo · per seat
                        </p>
                      </div>

                      <p className="text-[15px] font-light leading-[1.7] text-white/60 group-hover:text-black/60">
                        Deliverables pack, multicam + audio stacks, baseline auto color, and templates.
                      </p>

                      <div className="rounded-xl border border-white/10 group-hover:border-black/10 bg-white/[0.02] group-hover:bg-black/[0.03] px-5 py-4">
                        <p className="text-[10px] tracking-[0.3em] text-white/50 group-hover:text-black/50">
                          FOUNDERS OFFER
                        </p>
                        <p className="mt-2 text-[13px] text-white/70 group-hover:text-black/70 font-light leading-relaxed">
                          Founding Pro — <span className="font-normal">$149/mo</span> per seat, locked for life (limited).
                        </p>
                      </div>

                      <Link href={START_TRIAL_HREF} className="group inline-flex items-center justify-center gap-3 w-full rounded-full border border-white/20 group-hover:border-black/15 py-5 text-[10px] tracking-[0.4em] hover:bg-paper hover:text-black group-hover:hover:bg-black group-hover:hover:text-white transition-all font-light">
                        <span
                          className="h-2 w-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-200"
                          aria-hidden="true"
                        />
                        START TRIAL
                      </Link>
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.25}>
                <div className="mt-12">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] text-black/35 hover:text-black transition-colors group"
                  >
                    <Minus className="w-8 h-[1px] text-black/25 group-hover:text-black/45 transition-colors" />
                    VIEW FULL DETAILS
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Centered, Minimal */}
      <section className="border-t border-white/5">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-32">
          <div className="max-w-4xl mx-auto text-center space-y-16">
            <Reveal>
              <h2 className="font-display text-[48px] md:text-[80px] font-extralight leading-[1.05] tracking-[-0.04em]">
                Edit less.
                <br />
                <span className="text-white/20">Create more.</span>
                <BleepDot className="ml-4" />
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href={START_TRIAL_HREF} className="group inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-paper text-black text-[10px] tracking-[0.4em] hover:bg-paper/95 transition-all font-light hover:-translate-y-[1px] active:translate-y-0">
                  <span
                    className="h-2 w-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-200"
                    aria-hidden="true"
                  />
                  START FREE TRIAL
                </Link>
                {SHOW_BOOK_DEMO && (
                  <a href={BOOK_DEMO_HREF} className="group inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full border border-white/10 text-[10px] tracking-[0.4em] text-white/60 hover:text-white hover:border-accent/50 transition-all font-light hover:-translate-y-[1px] active:translate-y-0">
                    <span
                      className="h-2 w-2 rounded-full bg-accent/70 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-200"
                      aria-hidden="true"
                    />
                    SCHEDULE DEMO
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

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
