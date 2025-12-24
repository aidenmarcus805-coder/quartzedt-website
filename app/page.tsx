'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Download, Film, Minus, Search, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamic import for 3D scene (client-side only)
const CameraScene = dynamic<{
  lowPowerMode?: boolean;
  variant?: 'full' | 'gallery';
  className?: string;
}>(() => import('./components/CameraScene'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="w-[min(760px,92vw)]">
        <div className="relative aspect-video overflow-hidden border border-white/10 bg-white/[0.02]">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: 'center',
              opacity: 0.22,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.0) 60%), linear-gradient(to bottom, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.20) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -inset-x-40 top-[18%] h-px"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0), rgba(255,255,255,0.24), rgba(0,0,0,0))',
              animation: 'shimmer 1.6s linear infinite',
              backgroundSize: '200% 100%',
            }}
          />

          <div className="absolute left-6 bottom-6 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            <span className="text-[10px] tracking-[0.5em] text-white/35 font-light">RENDERING</span>
          </div>
        </div>
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
        initial={{ opacity: 0, y: 26, filter: 'blur(10px)', scale: 0.985 }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
        transition={{ duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Accent dot that "bleeps" twice, then fades out (guides the eye without staying noisy).
const BleepDot = ({
  className,
  delay = 0,
  sizeClass = 'h-2.5 w-2.5',
}: {
  className?: string;
  delay?: number;
  sizeClass?: string;
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className={`inline-block align-middle rounded-full bg-accent ${sizeClass} ${className ?? ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        isInView
          ? {
              opacity: [0, 1, 0.25, 1, 0],
              scale: [0.8, 1.6, 1, 1.6, 1],
            }
          : { opacity: 0, scale: 0.8 }
      }
      transition={{
        duration: 1.25,
        delay,
        times: [0, 0.16, 0.42, 0.68, 1],
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  );
};

// Loop a specific segment of a video file (feels like an "edited" clip without needing multiple assets).
const SegmentVideo = ({
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
}) => {
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

    const applyBounds = () => {
      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0) {
        safeStart = Math.max(0, Math.min(boundsRef.current.start, Math.max(0, duration - 0.1)));
        safeEnd = Math.max(safeStart + 0.15, Math.min(boundsRef.current.end, duration));
      }
    };

    const sync = () => {
      applyBounds();
      video.currentTime = safeStart;
      if (play) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const onTimeUpdate = () => {
      if (!play) return;
      if (video.currentTime >= safeEnd) {
        video.currentTime = safeStart;
      }
    };

    video.addEventListener('loadedmetadata', sync);
    video.addEventListener('timeupdate', onTimeUpdate);

    // If metadata is already available, start immediately.
    if (video.readyState >= 1) {
      sync();
    }

    return () => {
      video.removeEventListener('loadedmetadata', sync);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.pause();
    };
  }, [src, start, end, play]);

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
      {/* Explicit proof labels (kept minimal, but specific) */}
      {type === 'sync' && (
        <div className="absolute left-6 top-6 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-accent/80" aria-hidden="true" />
          <span className="text-[10px] tracking-[0.5em] text-white/55 font-light">SYNC</span>
        </div>
      )}
      {type === 'select' && (
        <div className="absolute left-6 top-6 flex flex-wrap gap-2">
          {['VOW', 'LAUGH', 'SPEECH'].map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded-full border border-white/12 bg-black/35 text-[9px] tracking-[0.35em] text-white/55 font-light"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {type === 'flow' && (
        <div className="absolute left-6 top-6 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-accent/80" aria-hidden="true" />
          <span className="text-[10px] tracking-[0.5em] text-white/55 font-light">ARC</span>
        </div>
      )}
      {type === 'audio' && (
        <div className="absolute left-6 top-6 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-accent/80" aria-hidden="true" />
          <span className="text-[10px] tracking-[0.5em] text-white/55 font-light">CLEAN</span>
          <span className="text-[10px] tracking-[0.4em] text-white/35 font-light">−18 dB</span>
        </div>
      )}

      {/* Track area near the bottom for timelines / meters */}
      <div className="absolute left-6 right-6 bottom-8 h-[84px] md:h-[96px]">
        {type === 'sync' && (
          <div className="absolute inset-0 flex flex-col justify-between py-3 pl-14">
            {['CAM A', 'CAM B', 'AUDIO'].map((label, i) => (
              <div key={i} className="relative h-px bg-white/10">
                <span className="absolute -left-14 -top-[7px] text-[9px] tracking-[0.35em] text-white/28 font-light">
                  {label}
                </span>
                {/* Shared markers (alignment) */}
                <span className="absolute -top-[2px] left-[18%] h-[5px] w-px bg-white/20" />
                <span className="absolute -top-[2px] left-[52%] h-[5px] w-px bg-accent/70" />
                <span className="absolute -top-[2px] left-[78%] h-[5px] w-px bg-white/18" />
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
            {[
              { w: 18, label: 'CEREMONY' },
              { w: 12, label: 'PORTRAITS' },
              { w: 22, label: 'TOASTS' },
              { w: 14, label: 'DANCE' },
              { w: 10, label: 'DETAILS' },
              { w: 24, label: 'EXIT' },
            ].map((seg, i) => (
              <span
                key={i}
                className={`h-[22px] border ${i === 2 ? 'border-white/18 bg-white/6' : 'border-white/10 bg-white/3'}`}
                style={{ width: `${seg.w}%` }}
              />
            ))}
            <div className="absolute inset-x-0 -bottom-1 flex justify-between">
              <span className="text-[9px] tracking-[0.35em] text-white/22 font-light">START</span>
              <span className="text-[9px] tracking-[0.35em] text-white/22 font-light">END</span>
            </div>
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
  { label: 'Import', desc: 'Bring footage in. Auto-organize.', icon: Upload, start: 0.0, end: 5.5 },
  { label: 'Scenes', desc: 'Detect scenes and key beats.', icon: Search, start: 5.5, end: 8.25 },
  { label: 'Transcribe', desc: 'Vows + speeches transcribed with speakers.', icon: Search, start: 8.25, end: 11.0 },
  { label: 'Timeline', desc: 'Assemble the rough cut.', icon: Film, start: 11.0, end: 16.5 },
  { label: 'Export', desc: 'Premiere / Resolve ready.', icon: Download, start: 16.5, end: 22.0 },
] as const;

const WORKFLOW_SCROLLS_PER_STEP = 3;
const WORKFLOW_SCROLL_PX = 120; // ~one wheel "tick" (used to map scroll distance to the 3-step peel)
const WORKFLOW_SCROLL_PX_PER_STEP = WORKFLOW_SCROLL_PX * WORKFLOW_SCROLLS_PER_STEP;
const WORKFLOW_DOOR_SCROLL_PX = 520; // scroll distance to lift the “hero door” and reveal the workflow

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const firstWhiteRef = useRef<HTMLElement | null>(null);
  const workflowDoorRef = useRef<HTMLDivElement | null>(null);
  const workflowDoorLastYRef = useRef<number>(Number.NaN);
  const philosophyRef = useRef<HTMLElement | null>(null);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [openCapabilityIdx, setOpenCapabilityIdx] = useState<number | null>(null);
  const [activeCapabilityIdx, setActiveCapabilityIdx] = useState(0);
  const [workflowIdx, setWorkflowIdx] = useState(0);
  const [workflowLocked, setWorkflowLocked] = useState(false);
  const [workflowHasInteracted, setWorkflowHasInteracted] = useState(false);
  const [workflowAdvance, setWorkflowAdvance] = useState(0); // 0..(WORKFLOW_SCROLLS_PER_STEP-1)
  const workflowAutoIdxRef = useRef(0);
  const workflowAutoAdvanceRef = useRef(0);
  const workflowAutoLockedRef = useRef(false);
  const workflowHasInteractedRef = useRef(false);

  // Workflow is now scroll-driven (no snap, no wall, no scroll hijack).
  // We map normal scroll progress through the sticky section to:
  // - step index (video)
  // - peel progress (0/3, 1/3, 2/3)
  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = firstWhiteRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Hysteresis to avoid “pin flapping” around 0px due to subpixel scroll.
      const EPS = 1;
      const pinned = rect.top <= EPS && rect.bottom >= vh - EPS;

      if (workflowAutoLockedRef.current !== pinned) {
        workflowAutoLockedRef.current = pinned;
        setWorkflowLocked(pinned);
      }

      const scrollable = el.offsetHeight - vh;
      if (scrollable <= 0) return;

      const scrolled = Math.min(scrollable, Math.max(0, -rect.top));

      // “Garage door” transition: the dark hero panel lifts up with scroll, revealing the workflow.
      // Use transforms only (no layout changes) to keep scrolling perfectly smooth.
      const doorT = Math.max(0, Math.min(1, scrolled / WORKFLOW_DOOR_SCROLL_PX));
      const doorY = -doorT * vh; // lift the panel fully out of view
      if (workflowDoorRef.current) {
        const prevY = workflowDoorLastYRef.current;
        if (!Number.isFinite(prevY) || Math.abs(prevY - doorY) >= 0.5) {
          workflowDoorLastYRef.current = doorY;
          workflowDoorRef.current.style.transform = `translate3d(0, ${doorY}px, 0)`;
        }
      }

      // Workflow step scroll should begin only after the door is fully opened.
      const scrolledForSteps = Math.max(0, scrolled - WORKFLOW_DOOR_SCROLL_PX);

      const idx = Math.min(
        WORKFLOW_STEPS.length - 1,
        Math.floor(scrolledForSteps / WORKFLOW_SCROLL_PX_PER_STEP),
      );
      const within = scrolledForSteps - idx * WORKFLOW_SCROLL_PX_PER_STEP; // 0..WORKFLOW_SCROLL_PX_PER_STEP
      const advance = Math.min(WORKFLOW_SCROLLS_PER_STEP - 1, Math.floor(within / WORKFLOW_SCROLL_PX));

      if (workflowAutoIdxRef.current !== idx) {
        workflowAutoIdxRef.current = idx;
        setWorkflowIdx(idx);
      }
      if (workflowAutoAdvanceRef.current !== advance) {
        workflowAutoAdvanceRef.current = advance;
        setWorkflowAdvance(advance);
      }

      if (!workflowHasInteractedRef.current && scrolledForSteps > 18) {
        workflowHasInteractedRef.current = true;
        setWorkflowHasInteracted(true);
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

  // (Removed useScroll parallax here — it causes noisy dev warnings and isn’t core to the blueprint.)

  // Switch the 3D scene into low-power mode once the first white block starts entering view.
  // This keeps the hero silky when you're up top, and saves GPU/CPU when you're scrolling content.
  useEffect(() => {
    let last = false;
    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = firstWhiteRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // Only kick in once the hero is fully off-screen, and the first white block is entering view.
      const next = window.scrollY >= window.innerHeight && rect.top <= window.innerHeight;
      if (next !== last) {
        last = next;
        setLowPowerMode(next);
      }
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
      title: 'CEREMONY SYNC',
      desc: 'Cameras + recorders aligned to vows and music',
      demo: { src: '/videoplayback1.mp4', start: 0.0, end: 5.5 },
      reel: 'REEL 01',
      overlay: 'sync' as const,
      metric: { value: '<1', label: 'FRAME DRIFT' },
      caption: 'Waveform sync + drift correction — vows, speeches, and music lock in.',
    },
    {
      num: '02',
      title: 'VOWS + REACTIONS',
      desc: 'Find vows, laughter, speeches — ranked by emotion',
      demo: { src: '/videoplayback1.mp4', start: 5.5, end: 11.0 },
      reel: 'REEL 02',
      overlay: 'select' as const,
      metric: { value: '47', label: 'EMOTION MARKERS' },
      caption: 'Moments surfaced and ranked — your selects become a short list.',
    },
    {
      num: '03',
      title: 'STORY ARC',
      desc: 'Pacing shaped around ceremony-to-reception rhythm',
      demo: { src: '/videoplayback1.mp4', start: 11.0, end: 16.5 },
      reel: 'REEL 03',
      overlay: 'flow' as const,
      metric: { value: '1', label: 'NARRATIVE ARC' },
      caption: 'Cuts land on feeling — not templates. You keep the voice.',
    },
    {
      num: '04',
      title: 'DIALOGUE CLEAN',
      desc: 'Lav rustle, room noise, and hum reduced automatically',
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
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center">
        <Image
              src="/logo.png?v=20251223"
              alt="Cutline"
              width={256}
              height={65}
          priority
              className="h-5 w-auto"
              unoptimized
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-16 text-[10px] tracking-[0.4em] font-light">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="link-underline hover:opacity-60 transition-opacity"
            >
              WORK
            </a>
            <Link href="/about" className="link-underline hover:opacity-60 transition-opacity">ABOUT</Link>
            <Link href="/pricing" className="link-underline hover:opacity-60 transition-opacity">PRICING</Link>
          </div>

          <button className="link-underline text-[10px] tracking-[0.4em] font-light hover:opacity-60 transition-opacity">
            CONTACT
          </button>
        </div>
      </motion.nav>

      {/* Hero - Fullscreen intro (scroll-driven) */}
      <section ref={heroRef} className="relative">
        <CameraScene lowPowerMode={lowPowerMode} variant="full" />
      </section>

      {/* Workflow */}
      <section id="workflow" ref={firstWhiteRef} className="bg-paper text-black border-b border-black/5">
        <div
          className="relative overflow-hidden"
          style={{
            height: `calc(100vh + ${WORKFLOW_DOOR_SCROLL_PX + WORKFLOW_SCROLL_PX_PER_STEP * (WORKFLOW_STEPS.length - 1)}px)`,
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

          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="relative h-full">
              {/* Garage-door panel (sticks to viewport, slides up with scroll) */}
              <div
                ref={workflowDoorRef}
                className="pointer-events-none absolute inset-0 z-30 bg-black"
                style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
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

                {/* Content that “rides” up like the hero widget */}
                <div className="relative h-full">
                  <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 h-full flex items-end pb-20 md:pb-24">
                    <div className="max-w-4xl">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                        <p className="text-[10px] tracking-[0.55em] text-white/35 font-light">
                          AI WEDDING VIDEO EDITOR
                        </p>
                      </div>

                      <h2 className="mt-10 font-display text-[clamp(32px,3.4vw,56px)] font-extralight tracking-[-0.04em] leading-[1.08] text-white">
                        Cutline turns raw wedding footage into a timeline you can finish.
                      </h2>
                      <p className="mt-8 text-[15px] md:text-[17px] leading-[1.9] text-white/55 font-light max-w-[62ch]">
                        Sync cameras + lavs, find vows and speeches, rank reactions, shape pacing — then export a clean rough cut
                        to Premiere or Resolve.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom edge + shadow so the “door” reads as a panel */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    boxShadow: '0 18px 60px rgba(0,0,0,0.55)',
                  }}
                />
              </div>

              <div className="relative h-full pt-32 pb-4 flex flex-col">
                {/* Title (gallery rhythm: aligned to content grid) */}
                <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 flex-none">
                  <h2 className="font-display text-[clamp(64px,6.5vw,110px)] font-light tracking-[-0.06em] leading-[0.92]">
                    The Workflow
                    <BleepDot className="ml-4" />
                  </h2>
                </div>

              {/* Videos */}
              <div className="flex-1 mt-8 flex items-end">
                {/* Stage (same width as the rest of the site) */}
                <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 w-full">
                  {/* One “video row”: active expands (main), others stay as shutters on the right.
                      Advancing tabs expands the next shutter into the main video (per blueprint). */}
                  <div className="relative overflow-hidden border border-black/12 bg-white shadow-[0_70px_160px_rgba(0,0,0,0.10)]">
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
                        const baseFilter = isActive ? 'contrast(1.25) brightness(0.98)' : 'contrast(1.15) brightness(0.92)';

                        let rotateY = baseRotateY;
                        let rotateZ = baseRotateZ;
                        let x = baseX;
                        let z = baseZ;
                        let scale = baseScale;
                        let opacity = baseOpacity;
                        let filter = baseFilter;

                        // “Animate on each scroll”: gradually “peek” the next/prev shutter open across 3 scrolls.
                        if (!isActive && peekTarget) {
                          const open = Math.min(0.9, peekT * 1.2); // 1/3 -> 0.4, 2/3 -> 0.8
                          rotateY = shutterRot + (0 - shutterRot) * open;
                          rotateZ = (-0.25 * rel) * (1 - open * 0.85);
                          x = shutterX * (1 - open * 0.35);
                          z = shutterZ * (1 - open * 0.35);
                          scale = 0.975 + (1 - 0.975) * (peekT * 0.55);
                          opacity = 0.86 + (1 - 0.86) * (peekT * 0.8);
                          filter = `contrast(${(1.15 + peekT * 0.18).toFixed(3)}) brightness(${(0.92 + peekT * 0.1).toFixed(3)})`;
                        }

                        return (
                          <motion.button
                            key={step.label}
                            layout
                            type="button"
                            onClick={() => {
                              setWorkflowHasInteracted(true);
                              setWorkflowAdvance(0);
                              setWorkflowIdx(idx);
                            }}
                            className={`relative h-full overflow-hidden border border-black/15 bg-[#f4f4f5] focus:outline-none ${
                              isActive ? 'flex-1 min-w-0' : 'w-[44px] md:w-[52px] shrink-0'
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
                              filter,
                            }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                            aria-label={`Select ${step.label}`}
                          >
                            {/* Display glass (slight inset bezel) */}
                            <div className="absolute inset-[3px] overflow-hidden bg-white">
                              <SegmentVideo
                                src="/videoplayback1.mp4"
                                start={step.start}
                                end={step.end}
                                play={isActive}
                                className="absolute inset-0 w-full h-full object-cover"
                              />

                              {/* Depth / lighting */}
                              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/14" />

                              {/* Subtle glass sheen */}
                              <div
                                aria-hidden="true"
                                className="absolute inset-0"
                                style={{
                                  background: isActive
                                    ? 'linear-gradient(120deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.00) 35%, rgba(0,0,0,0.10) 100%)'
                                    : 'linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.00) 42%, rgba(0,0,0,0.12) 100%)',
                                }}
                              />
                            </div>

                            {/* Bezel + shadow (Apple-ish display frame) */}
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                boxShadow: isActive
                                  ? 'inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.65), 0 40px 110px rgba(0,0,0,0.12)'
                                  : 'inset 0 0 0 1px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.65), 0 18px 60px rgba(0,0,0,0.10)',
                              }}
                            />

                            {/* Right edge (makes the stacked shutters read like displays) */}
                            <div
                              aria-hidden="true"
                              className="absolute inset-y-0 right-0 w-[12px] pointer-events-none"
                              style={{
                                background: isActive
                                  ? 'linear-gradient(to left, rgba(0,0,0,0.10), rgba(0,0,0,0.00))'
                                  : 'linear-gradient(to left, rgba(0,0,0,0.18), rgba(0,0,0,0.00))',
                              }}
                            />
                          </motion.button>
                        );
                      })}
                    </motion.div>

                    {/* Hints live on the “screen” area (not the bottom rail) */}
                    <AnimatePresence>
                      {workflowLocked && !workflowHasInteracted && (
                        <motion.div
                          key="workflow-hint"
                          initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
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
                      {workflowLocked && workflowIdx === WORKFLOW_STEPS.length - 1 && (
                        <motion.div
                          key="workflow-exit-hint"
                          initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
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

                  {/* Step dock: full-width extension (no inset / no outer padding) */}
                  <div className="border-t border-black/10 bg-black/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px">
                      {WORKFLOW_STEPS.map((step, idx) => {
                        const active = idx === workflowIdx;
                        const Icon = step.icon;
                        return (
                          <button
                            key={step.label}
                            type="button"
                            onClick={() => {
                              setWorkflowHasInteracted(true);
                              setWorkflowAdvance(0);
                              setWorkflowIdx(idx);
                            }}
                            className={`group w-full text-left px-5 py-4 transition-colors ${
                              active ? 'bg-white' : 'bg-[#f4f4f5] hover:bg-white/80'
                            }`}
                            aria-label={`Select ${step.label}`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                    active ? 'bg-accent' : 'bg-black/25 group-hover:bg-black/35'
                                  }`}
                                  aria-hidden="true"
                                />
                                <span
                                  className={`text-[10px] tracking-[0.45em] font-light transition-colors ${
                                    active ? 'text-black/80' : 'text-black/55 group-hover:text-black/70'
                                  }`}
                                >
                                  {step.label.toUpperCase()}
                                </span>
                              </div>
                              <Icon
                                className={`h-4 w-4 transition-colors ${
                                  active ? 'text-black/55' : 'text-black/35 group-hover:text-black/50'
                                }`}
                                aria-hidden="true"
                              />
                            </div>
                            <p
                              className={`mt-2 text-[12px] leading-[1.55] font-light transition-colors ${
                                active ? 'text-black/50' : 'text-black/35 group-hover:text-black/45'
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
        </div>
      </section>

      {/* Capabilities Section - Golden Ratio Grid */}
      <section id="work">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16">
          <div className="pt-20 pb-28">
            <Reveal>
              <div className="grid grid-cols-12 gap-10 items-end">
                <div className="col-span-12 md:col-span-12">
                  <h2 className="font-display text-[clamp(44px,4.8vw,72px)] font-extralight tracking-[-0.05em] leading-[1.02]">
                    A wedding edit, distilled
                    <BleepDot className="ml-4" />
                  </h2>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-12 gap-12 lg:gap-16">
            {/* Left: list */}
            <div className="col-span-12 lg:col-span-7">
              {capabilities.map((cap, idx) => {
                const isActive = activeCapabilityIdx === idx;
                const isOpen = openCapabilityIdx === idx;

                return (
                  <Reveal key={cap.title} delay={idx * 0.06}>
                    <motion.div
                      layout
                      className={`group relative border-b border-white/10 cursor-pointer ${
                        isActive ? 'bg-white/[0.02]' : ''
                      }`}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      transition={{ duration: 0.35 }}
                      onMouseEnter={() => setActiveCapabilityIdx(idx)}
                    >
                      <div
                        aria-hidden="true"
                        className={`absolute left-0 top-0 bottom-0 w-px transition-colors ${
                          isActive ? 'bg-accent/55' : 'bg-accent/0 group-hover:bg-accent/35'
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setActiveCapabilityIdx(idx);
                          setOpenCapabilityIdx((prev) => (prev === idx ? null : idx));
                        }}
                        onFocus={() => setActiveCapabilityIdx(idx)}
                        aria-expanded={isOpen}
                        className="w-full text-left py-10 pl-0 group-hover:pl-5 group-focus-within:pl-5 transition-[padding] duration-300"
                      >
                        <div className="grid grid-cols-12 gap-8 items-start">
                          <div className="col-span-1">
                            <span className="text-[10px] tracking-[0.3em] text-white/45 group-hover:text-white/70 transition-colors">
                              {cap.num}
                            </span>
                          </div>

                          <div className="col-span-11 md:col-span-4">
                            <h3 className="font-display text-[26px] md:text-[34px] font-light tracking-[-0.03em] leading-[1.05] text-white/90 group-hover:text-white transition-colors">
                              {cap.title}
                            </h3>
                          </div>

                          <div className="col-span-11 col-start-2 md:col-span-7 md:col-start-6 flex items-start justify-between gap-8">
                            <p className="text-[15px] md:text-[17px] font-light leading-[1.7] text-white/60 group-hover:text-white/80 transition-colors">
                              {cap.desc}
                            </p>

                            <motion.div
                              animate={{
                                rotate: isOpen ? 90 : 0,
                                opacity: isActive ? 0.9 : 0.55,
                                x: isActive ? 2 : 0,
                              }}
                              className="w-5 h-5 mt-1 text-white/50 group-hover:text-white/80 transition-colors shrink-0"
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <ArrowRight className="w-5 h-5" />
                            </motion.div>
                          </div>
                        </div>
                      </button>

                      {/* Mobile-only proof panel (desktop uses the sticky right panel) */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="panel"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden lg:hidden"
                          >
                            <div className="pb-10">
                              <div className="relative overflow-hidden bg-black/35">
                                <div className="relative aspect-video">
                                  <SegmentVideo
                                    src={cap.demo.src}
                                    start={cap.demo.start}
                                    end={cap.demo.end}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />
                                  <ReelOverlay type={cap.overlay as ReelOverlayType} />
                                </div>
                              </div>
                              <div className="mt-8 grid grid-cols-12 gap-8 items-end">
                                <div className="col-span-5">
                                  <div className="text-[52px] font-extralight tracking-[-0.06em] leading-[0.85] text-white/90">
                                    {cap.metric.value}
                                  </div>
                                  <div className="mt-3 text-[10px] tracking-[0.55em] text-white/30 font-light">
                                    {cap.metric.label}
                                  </div>
                                </div>
                                <div className="col-span-7">
                                  <p className="text-[14px] leading-[1.9] text-white/55 font-light">
                                    {cap.caption}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Reveal>
                );
              })}

              <div className="pt-12 pb-28">
                <Reveal delay={0.05}>
                  <div className="flex items-center justify-start gap-8">
                    <a
                      href="#workflow"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="link-underline inline-flex items-center gap-4 text-[10px] tracking-[0.45em] text-white/45 hover:text-white transition-colors font-light shrink-0"
                    >
                      THE WORKFLOW
                      <span className="text-white/40" aria-hidden="true">
                        <ArrowRight className="w-4 h-4" />
                      </span>
          </a>
        </div>
                </Reveal>
              </div>
            </div>

            {/* Right: proof (desktop) */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="sticky top-28 pt-12">
                <div className="relative overflow-hidden bg-white/[0.02]">
                  <div className="relative aspect-video">
                    <SegmentVideo
                      src={capabilities[activeCapabilityIdx]?.demo.src}
                      start={capabilities[activeCapabilityIdx]?.demo.start ?? 0}
                      end={capabilities[activeCapabilityIdx]?.demo.end ?? 4}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/45" />
                    <ReelOverlay type={capabilities[activeCapabilityIdx]?.overlay as ReelOverlayType} />

                    <div className="absolute top-6 left-6 flex items-center gap-4">
                      <span className="text-[10px] tracking-[0.5em] text-white/55 font-light">
                        {capabilities[activeCapabilityIdx]?.reel}
                      </span>
                      <span className="h-[1px] w-12 bg-white/12" aria-hidden="true" />
                      <span className="text-[10px] tracking-[0.4em] text-white/35 font-light">
                        {capabilities[activeCapabilityIdx]?.title}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-12 gap-8 items-end">
                  <div className="col-span-5">
                    <div className="text-[64px] font-extralight tracking-[-0.06em] leading-[0.85] text-white/90">
                      {capabilities[activeCapabilityIdx]?.metric.value}
                    </div>
                    <div className="mt-3 text-[10px] tracking-[0.55em] text-white/30 font-light">
                      {capabilities[activeCapabilityIdx]?.metric.label}
                    </div>
                  </div>
                  <div className="col-span-7">
                    <p className="text-[14px] leading-[1.9] text-white/55 font-light">
                      {capabilities[activeCapabilityIdx]?.caption}
                    </p>
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
      <section className="bg-paper text-black border-y border-black/5">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-32">
          <div className="grid grid-cols-12 gap-12 items-start">
            <div className="col-span-12 lg:col-span-4">
              <Reveal>
                <div className="space-y-8">
                  <h2 className="font-display text-[42px] md:text-[64px] font-extralight tracking-[-0.04em] leading-[1.05]">
                    Simple pricing.<BleepDot className="ml-4" />
                    <br />
                    <span className="text-black/20">No subscriptions.</span>
                  </h2>
                  <p className="text-[15px] leading-[1.9] text-black/55 font-light max-w-[52ch]">
                    Own it outright. No monthly fees. Built for working wedding filmmakers.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <div className="grid md:grid-cols-2 gap-px bg-black/5 border border-black/5">
                {/* Lite */}
                <Reveal delay={0.1}>
                  <div className="bg-paper p-12 md:p-16 hover:bg-gray-50 transition-colors duration-300">
                    <div className="space-y-10">
                      <div>
                        <p className="text-[10px] tracking-[0.4em] text-black/30 mb-8">
                          LITE
                        </p>
                        <div className="text-[64px] md:text-[80px] font-extralight tracking-[-0.04em] leading-none">
                          $79
                        </div>
                        <p className="text-[14px] text-black/40 mt-4 font-light">
                          One-time purchase
                        </p>
                      </div>
                      
                      <p className="text-[15px] font-light leading-[1.7] text-black/60">
                        Essential tools for getting started with AI-powered workflows.
                      </p>
                      
                      <button className="group inline-flex items-center justify-center gap-3 w-full rounded-full border border-black/15 py-5 text-[10px] tracking-[0.4em] hover:bg-black hover:text-white transition-all font-light">
                        <span
                          className="h-2 w-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-200"
                          aria-hidden="true"
                        />
                        BUY LITE
                      </button>
                    </div>
                  </div>
                </Reveal>
  
                {/* Max */}
                <Reveal delay={0.2}>
                  <div className="bg-black text-white p-12 md:p-16 relative group hover:bg-paper hover:text-black transition-all duration-500">
                    <div className="absolute top-8 right-8 w-2 h-2 bg-accent rounded-full" />
                    
                    <div className="space-y-10">
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
                      
                      <button className="group inline-flex items-center justify-center gap-3 w-full rounded-full border border-white/20 group-hover:border-black/15 py-5 text-[10px] tracking-[0.4em] hover:bg-paper hover:text-black group-hover:hover:bg-black group-hover:hover:text-white transition-all font-light">
                        <span
                          className="h-2 w-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-200"
                          aria-hidden="true"
                        />
                        BUY MAX
                      </button>
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
                    VIEW FULL COMPARISON
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
                <button className="group inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-paper text-black text-[10px] tracking-[0.4em] hover:bg-paper/95 transition-all font-light hover:-translate-y-[1px] active:translate-y-0">
                  <span
                    className="h-2 w-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-200"
                    aria-hidden="true"
                  />
                  START FREE TRIAL
                </button>
                <button className="group inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full border border-white/10 text-[10px] tracking-[0.4em] text-white/60 hover:text-white hover:border-accent/50 transition-all font-light hover:-translate-y-[1px] active:translate-y-0">
                  <span
                    className="h-2 w-2 rounded-full bg-accent/70 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-200"
                    aria-hidden="true"
                  />
                  SCHEDULE DEMO
                </button>
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
                  alt="Cutline"
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
              © 2024 CUTLINE
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
