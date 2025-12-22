'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
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

// Loop a specific segment of a video file (feels like an "edited" clip without needing multiple assets).
const SegmentVideo = ({ src, start, end, className }: { src: string; start: number; end: number; className?: string }) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const boundsRef = useRef({ start, end });

  useEffect(() => {
    boundsRef.current = { start, end };
  }, [start, end]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let safeStart = start;
    let safeEnd = end;

    const applyBoundsAndPlay = () => {
      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0) {
        safeStart = Math.max(0, Math.min(boundsRef.current.start, Math.max(0, duration - 0.1)));
        safeEnd = Math.max(safeStart + 0.15, Math.min(boundsRef.current.end, duration));
      }

      video.currentTime = safeStart;
      video.play().catch(() => {});
    };

    const onTimeUpdate = () => {
      if (video.currentTime >= safeEnd) {
        video.currentTime = safeStart;
      }
    };

    video.addEventListener('loadedmetadata', applyBoundsAndPlay);
    video.addEventListener('timeupdate', onTimeUpdate);

    // If metadata is already available, start immediately.
    if (video.readyState >= 1) {
      applyBoundsAndPlay();
    }

    return () => {
      video.removeEventListener('loadedmetadata', applyBoundsAndPlay);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.pause();
    };
  }, [src, start, end]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload noplaybackrate noremoteplayback"
      preload="metadata"
      tabIndex={-1}
      aria-hidden="true"
      className={`${className ?? ''} pointer-events-none select-none`}
    />
  );
};

type ReelOverlayType = 'sync' | 'select' | 'flow' | 'audio';

// Subtle UI overlays so the clip feels like "proof" of the feature, not random stock footage.
const ReelOverlay = ({ type }: { type: ReelOverlayType }) => {
  const waveformHeights = [8, 16, 10, 22, 14, 28, 18, 34, 20, 30, 16, 26, 12, 20, 10, 18, 8, 14];
  const selectHeights = [6, 10, 8, 14, 7, 18, 9, 22, 8, 16, 7, 20, 10, 14, 8, 12, 6, 10];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Track area near the bottom for timelines / meters */}
      <div className="absolute left-6 right-6 bottom-8 h-[84px] md:h-[96px]">
        {type === 'sync' && (
          <div className="absolute inset-0 flex flex-col justify-between py-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative h-px bg-white/10">
                {/* Shared markers (alignment) */}
                <span className="absolute -top-[2px] left-[18%] h-[5px] w-px bg-white/18" />
                <span className="absolute -top-[2px] left-[52%] h-[5px] w-px bg-white/20" />
                <span className="absolute -top-[2px] left-[78%] h-[5px] w-px bg-white/14" />
                {/* A faint “waveform” hint on the middle track */}
                {i === 1 && (
                  <span className="absolute -top-[6px] left-[30%] h-[13px] w-[40%] border-t border-white/8" />
                )}
              </div>
            ))}
          </div>
        )}

        {type === 'select' && (
          <div className="absolute inset-0 flex items-end gap-[10px] pb-2">
            {selectHeights.map((h, i) => (
              <span
                key={i}
                className={`w-px rounded-full ${i % 5 === 0 ? 'bg-white/22' : 'bg-white/10'}`}
                style={{ height: h }}
              />
            ))}
          </div>
        )}

        {type === 'flow' && (
          <div className="absolute inset-0 flex items-end gap-2 pb-2">
            {[18, 12, 22, 14, 10, 24].map((w, i) => (
              <span
                key={i}
                className={`h-[22px] border ${i === 2 ? 'border-white/18 bg-white/6' : 'border-white/10 bg-white/3'}`}
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        )}

        {type === 'audio' && (
          <div className="absolute inset-0 flex items-center gap-[10px]">
            {waveformHeights.map((h, i) => (
              <motion.span
                key={i}
                className="w-[2px] bg-white/14 rounded-full"
                initial={{ height: h }}
                animate={{ height: [h * 0.7, h, h * 0.8] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const WORKFLOW_STEPS = [
  { label: 'Import', desc: 'Bring footage in. Auto-organize.', start: 0.0, end: 5.5 },
  { label: 'Analyze', desc: 'Find beats, scenes, emotion.', start: 5.5, end: 11.0 },
  { label: 'Timeline', desc: 'Assemble the rough cut.', start: 11.0, end: 16.5 },
  { label: 'Export', desc: 'Premiere / Resolve ready.', start: 16.5, end: 22.0 },
] as const;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const firstWhiteRef = useRef<HTMLElement | null>(null);
  const philosophyRef = useRef<HTMLElement | null>(null);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [openCapabilityIdx, setOpenCapabilityIdx] = useState<number | null>(null);
  const [workflowIdx, setWorkflowIdx] = useState(0);
  const workflowIdxRef = useRef(0);
  const workflowActiveRef = useRef(false);
  const workflowLastStepAtRef = useRef(0);
  const workflowWheelAccumRef = useRef(0);
  const workflowTouchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    workflowIdxRef.current = workflowIdx;
  }, [workflowIdx]);

  // Scroll should not move the page here — it should ONLY advance the workflow left → right.
  useEffect(() => {
    let raf = 0;
    let ticking = false;

    const updateActive = () => {
      ticking = false;
      const el = firstWhiteRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Lock when the section is mostly filling the viewport (so the page scroll “stops” here).
      workflowActiveRef.current = rect.top <= vh * 0.2 && rect.bottom >= vh * 0.8;
    };

    const scheduleUpdate = () => {
      if (ticking) return;
      ticking = true;
      raf = window.requestAnimationFrame(updateActive);
    };

    const canExit = (dir: 1 | -1) => {
      const idx = workflowIdxRef.current;
      if (dir > 0 && idx >= WORKFLOW_STEPS.length - 1) return true;
      if (dir < 0 && idx <= 0) return true;
      return false;
    };

    const step = (dir: 1 | -1) => {
      const now = performance.now();
      const cooldownMs = 260;
      if (now - workflowLastStepAtRef.current < cooldownMs) return;
      workflowLastStepAtRef.current = now;

      setWorkflowIdx((prev) => {
        const next = Math.max(0, Math.min(WORKFLOW_STEPS.length - 1, prev + dir));
        return next;
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (!workflowActiveRef.current) return;
      const dy = e.deltaY;
      if (dy === 0) return;

      const dir = dy > 0 ? (1 as const) : (-1 as const);
      if (canExit(dir)) return; // Let the page scroll out at the ends.

      // Always prevent page scroll while active.
      e.preventDefault();

      // Accumulate deltas so trackpads don’t feel “twitchy”.
      const acc = workflowWheelAccumRef.current;
      if (acc !== 0 && Math.sign(acc) !== Math.sign(dy)) {
        workflowWheelAccumRef.current = 0;
      }
      workflowWheelAccumRef.current += dy;

      // ~2x scroll required to advance (per request)
      const threshold = 160;
      if (Math.abs(workflowWheelAccumRef.current) < threshold) return;

      workflowWheelAccumRef.current = 0;
      step(dir);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!workflowActiveRef.current) return;
      let dir: 1 | -1 | 0 = 0;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          dir = 1;
          break;
        case 'ArrowUp':
        case 'PageUp':
          dir = -1;
          break;
        default:
          return;
      }

      if (canExit(dir)) return;
      e.preventDefault();
      step(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!workflowActiveRef.current) return;
      workflowTouchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!workflowActiveRef.current) return;
      const startY = workflowTouchStartYRef.current;
      const y = e.touches[0]?.clientY;
      if (startY == null || y == null) return;

      const dy = startY - y;
      if (Math.abs(dy) < 28) return; // ignore micro movement (2x)

      const dir = dy > 0 ? (1 as const) : (-1 as const);
      if (canExit(dir)) return;

      e.preventDefault();
      workflowTouchStartYRef.current = y;
      step(dir);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    updateActive();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // (Removed useScroll parallax here — it causes noisy dev warnings and isn’t core to the blueprint.)

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
    {
      num: '01',
      title: 'AUTOSYNC',
      desc: 'Multi-camera alignment with sub-frame accuracy',
      demo: { src: '/videoplayback1.mp4', start: 0.0, end: 5.5 },
      reel: 'REEL 01',
      overlay: 'sync' as const,
      metric: { value: '<1', label: 'FRAME OFFSET' },
      caption: 'Waveform sync + drift correction — everything lands on the same moment.',
    },
    {
      num: '02',
      title: 'AUTOSELECT',
      desc: 'AI identifies vows, laughter, and key moments',
      demo: { src: '/videoplayback1.mp4', start: 5.5, end: 11.0 },
      reel: 'REEL 02',
      overlay: 'select' as const,
      metric: { value: '47', label: 'EMOTION MARKERS' },
      caption: 'Vows, laughter, reactions — surfaced and ranked so selects take minutes.',
    },
    {
      num: '03',
      title: 'AUTOFLOW',
      desc: 'Edits shaped around emotional rhythm',
      demo: { src: '/videoplayback1.mp4', start: 11.0, end: 16.5 },
      reel: 'REEL 03',
      overlay: 'flow' as const,
      metric: { value: '1', label: 'NARRATIVE ARC' },
      caption: 'Pacing shaped by emotion — cuts that feel authored, not templated.',
    },
    {
      num: '04',
      title: 'AUDIO CLEANUP',
      desc: 'Wind, hum, and noise removed automatically',
      demo: { src: '/videoplayback1.mp4', start: 16.5, end: 22.0 },
      reel: 'REEL 04',
      overlay: 'audio' as const,
      metric: { value: '−18', label: 'dB NOISE' },
      caption: 'Dialogue-first cleanup that keeps the room alive — no brittle artifacts.',
    },
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
                layout
                className="group border-b border-white/5 py-16 md:py-20 cursor-pointer"
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                transition={{ duration: 0.4 }}
              >
                <button
                  type="button"
                  onClick={() => setOpenCapabilityIdx((prev) => (prev === idx ? null : idx))}
                  aria-expanded={openCapabilityIdx === idx}
                  className="w-full text-left"
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
                      <motion.div
                        animate={{ rotate: openCapabilityIdx === idx ? 90 : 0, opacity: openCapabilityIdx === idx ? 0.75 : 0.28 }}
                        className="w-5 h-5 mt-1 text-white/30 group-hover:text-white/50 transition-colors shrink-0"
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openCapabilityIdx === idx && (
                    <motion.div
                      key="panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-10 md:pt-12 pb-2">
                        <div className="grid grid-cols-12 gap-8 items-start">
                          {/* 16:9 demo frame */}
                          <div className="col-span-12 md:col-span-10 md:col-start-2">
                            <div className="relative overflow-hidden border border-white/10 bg-black/35">
                              <div className="relative aspect-video">
                                {/* Grade + crop so it reads as a designed reel */}
                                <SegmentVideo
                                  src={cap.demo.src}
                                  start={cap.demo.start}
                                  end={cap.demo.end}
                                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90 scale-[1.02]"
                                />

                                {/* Editorial overlays */}
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    background:
                                      'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.68) 100%)',
                                  }}
                                />
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    background:
                                      'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.40) 100%)',
                                  }}
                                />

                                <ReelOverlay type={cap.overlay as ReelOverlayType} />

                                {/* Top label */}
                                <div className="absolute top-6 left-6 flex items-center gap-4">
                                  <span className="text-[10px] tracking-[0.5em] text-white/45 font-light">{cap.reel}</span>
                                  <span className="h-[1px] w-12 bg-white/10" />
                                  <span className="text-[10px] tracking-[0.4em] text-white/25 font-light">{cap.title}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Minimal legend below the footage (keeps the frame readable) */}
                          <div className="col-span-12 md:col-span-10 md:col-start-2 pt-8">
                            <div className="grid grid-cols-12 gap-8 items-end">
                              <div className="col-span-12 md:col-span-4">
                                <div className="text-[52px] md:text-[72px] font-extralight tracking-[-0.06em] leading-[0.85] text-white/90">
                                  {cap.metric.value}
                                </div>
                                <div className="mt-3 text-[10px] tracking-[0.55em] text-white/25 font-light">
                                  {cap.metric.label}
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-8">
                                <p className="text-[14px] md:text-[15px] leading-[1.9] text-white/50 font-light max-w-2xl">
                                  {cap.caption}
          </p>
        </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section ref={firstWhiteRef} className="bg-paper text-black border-y border-black/5">
        <div className="relative h-[150vh] overflow-hidden">
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
            <div className="relative max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 h-full pt-24 md:pt-28 pb-10 md:pb-14 flex flex-col">
              {/* Title must be above everything (per blueprint) */}
              <div className="flex-none">
                <h2 className="text-[clamp(64px,6.5vw,110px)] font-light tracking-[-0.06em] leading-[0.92]">
                  The Workflow
                </h2>
              </div>

              {/* Videos */}
              <div className="flex-1 mt-10 md:mt-12">
                {/* One “video row”: active expands (main), others stay as shutters on the right.
                    Advancing tabs expands the next shutter into the main video (per blueprint). */}
                <div className="relative overflow-hidden border border-black/15 bg-black/[0.02]">
                  <div className="relative aspect-video">
                    <motion.div
                      className="absolute inset-0 flex gap-3 p-3 md:p-4"
                      style={{
                        perspective: 1200,
                        transformStyle: 'preserve-3d',
                      }}
                      layout
                    >
                      {WORKFLOW_STEPS.map((step, idx) => {
                        const isActive = idx === workflowIdx;
                        const rel = (idx - workflowIdx + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length; // 0..3 (active = 0)
                        const shutterRot = -18 - rel * 2.2;
                        const shutterZ = -50 - rel * 14;

                        return (
                          <motion.button
                            key={step.label}
                            layout
                            type="button"
                            onClick={() => {
                              setWorkflowIdx(idx);
                            }}
                            className={`relative h-full overflow-hidden border border-black/10 bg-black/[0.02] focus:outline-none ${
                              isActive ? 'flex-1 min-w-0' : 'w-[44px] md:w-[52px] shrink-0'
                            }`}
                            style={{
                              order: rel,
                              transformStyle: 'preserve-3d',
                              transformOrigin: rel === 0 ? 'left center' : 'center center',
                            }}
                            animate={{
                              rotateY: isActive ? 0 : shutterRot,
                              z: isActive ? 0 : shutterZ,
                              scale: isActive ? 1 : 0.985,
                              opacity: isActive ? 1 : 0.88,
                            }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                            aria-label={`Select ${step.label}`}
                          >
                            <SegmentVideo
                              src="/videoplayback1.mp4"
                              start={step.start}
                              end={step.end}
                              className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-95"
                            />

                            {/* Depth / lighting */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/14" />
                            <div
                              aria-hidden="true"
                              className="absolute inset-0"
                              style={{
                                background: isActive
                                  ? 'linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.00) 28%, rgba(0,0,0,0.12) 100%)'
                                  : 'linear-gradient(115deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.00) 38%, rgba(0,0,0,0.14) 100%)',
                              }}
                            />
                            <div
                              aria-hidden="true"
                              className="absolute inset-0"
                              style={{
                                boxShadow: isActive
                                  ? 'inset 0 0 0 1px rgba(0,0,0,0.18), 0 70px 160px rgba(0,0,0,0.12)'
                                  : 'inset 0 0 0 1px rgba(0,0,0,0.10), 0 30px 90px rgba(0,0,0,0.08)',
                              }}
                            />
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Bottom strip: labels only (scroll selects left → right) */}
              <div className="flex-none mt-10 md:mt-12">
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-12 lg:col-span-10">
                    <div className="relative border border-black/10 bg-paper overflow-hidden">
                      <motion.div
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-1/4 bg-black/[0.05]"
                        animate={{ x: `${workflowIdx * 100}%` }}
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                      />
                      <div className="relative grid grid-cols-4">
                        {WORKFLOW_STEPS.map((step, idx) => (
                          <button
                            key={step.label}
                            type="button"
                            onClick={() => {
                              setWorkflowIdx(idx);
                            }}
                            className="px-6 py-5 border-r last:border-r-0 border-black/10 text-left"
                          >
                            <div className={`text-[12px] tracking-[0.35em] font-light ${idx === workflowIdx ? 'text-black/70' : 'text-black/45'}`}>
                              {step.label.toUpperCase()}
                            </div>
                            <div className={`mt-2 text-[12px] leading-[1.6] font-light ${idx === workflowIdx ? 'text-black/45' : 'text-black/30'}`}>
                              {step.desc}
                            </div>
                          </button>
                        ))}
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
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            {/* Left: Image (5 cols = 41.6%, close to golden) */}
            <div className="lg:col-span-5">
              <Reveal>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <motion.div
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
