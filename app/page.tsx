'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Download, Film, Minus, Search, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for 3D scene (client-side only)
const CameraScene = dynamic<{ lowPowerMode?: boolean }>(() => import('./components/CameraScene'), { 
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

const VellumPoster = () => {
  return (
    <motion.div
      className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-white/[0.03]"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Dot grid (signature texture) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: 'center',
          opacity: 0.22,
        }}
      />

      {/* Soft vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 70% at 50% 45%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.00) 55%), linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.42) 100%)',
        }}
      />

      {/* Minimal “timeline” composition */}
      <div className="absolute inset-0 p-8 md:p-10 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-[10px] tracking-[0.5em] text-white/40 font-light">LIVE</span>
          </div>
          <span className="text-[10px] tracking-[0.4em] text-white/25 font-light">00:00:00</span>
        </div>

        <div className="mt-10 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative h-7 border border-white/10 bg-black/20 overflow-hidden">
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/6 to-white/0" />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-[61.8%] w-px bg-accent/70"
              />
              <div
                aria-hidden="true"
                className="absolute left-[18%] top-0 bottom-0 w-[18%] bg-white/5"
              />
              <div
                aria-hidden="true"
                className="absolute left-[42%] top-0 bottom-0 w-[12%] bg-white/7"
              />
              <div
                aria-hidden="true"
                className="absolute left-[70%] top-0 bottom-0 w-[16%] bg-white/5"
              />
            </div>
          ))}
        </div>

        <div className="mt-auto pt-10">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="text-[46px] md:text-[56px] font-extralight tracking-[-0.06em] leading-none text-white/90">
                47
              </div>
              <div className="mt-2 text-[10px] tracking-[0.5em] text-white/30 font-light">
                EMOTIONAL MARKERS
              </div>
            </div>
            <div className="text-right text-[10px] tracking-[0.4em] text-white/22 font-light">
              VELLUM
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const WORKFLOW_STEPS = [
  { label: 'Import', desc: 'Bring footage in. Auto-organize.', icon: Upload, start: 0.0, end: 5.5 },
  { label: 'Analyze', desc: 'Find beats, scenes, emotion.', icon: Search, start: 5.5, end: 11.0 },
  { label: 'Timeline', desc: 'Assemble the rough cut.', icon: Film, start: 11.0, end: 16.5 },
  { label: 'Export', desc: 'Premiere / Resolve ready.', icon: Download, start: 16.5, end: 22.0 },
] as const;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const firstWhiteRef = useRef<HTMLElement | null>(null);
  const philosophyRef = useRef<HTMLElement | null>(null);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [openCapabilityIdx, setOpenCapabilityIdx] = useState<number | null>(null);
  const [workflowIdx, setWorkflowIdx] = useState(0);
  const [workflowLocked, setWorkflowLocked] = useState(false);
  const [workflowHasInteracted, setWorkflowHasInteracted] = useState(false);
  const workflowIdxRef = useRef(0);
  const workflowActiveRef = useRef(false);
  const workflowLockedRef = useRef(false);
  const workflowLastStepAtRef = useRef(0);
  const workflowWheelAccumRef = useRef(0);
  const workflowTouchStartYRef = useRef<number | null>(null);
  const workflowSnapAnimatingRef = useRef(false);

  useEffect(() => {
    workflowIdxRef.current = workflowIdx;
  }, [workflowIdx]);

  // Scroll should not move the page here — it should ONLY advance the workflow left → right.
  useEffect(() => {
    let raf = 0;
    let snapRaf = 0;
    let ticking = false;
    const SNAP_PX = 250; // tolerance so you can't "miss" the section by scrolling a bit too fast
    const WORKFLOW_SNAP_OFFSET_PX = 35; // intentional: we snap slightly into the section so the stage feels “framed”

    const updateActive = () => {
      ticking = false;
      const el = firstWhiteRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Lock ONLY once the section is actually pinned (deterministic stop position).
      // This prevents "sometimes it stops higher/lower" depending on scroll speed.
      const EPS = 2;
      const nextActive = rect.top <= EPS + WORKFLOW_SNAP_OFFSET_PX && rect.bottom >= vh - EPS;
      workflowActiveRef.current = nextActive;

      // Drive a small UI “HUD” (avoid state churn by only updating on change).
      if (workflowLockedRef.current !== nextActive) {
        workflowLockedRef.current = nextActive;
        setWorkflowLocked(nextActive);
      }
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
      setWorkflowHasInteracted(true);

      setWorkflowIdx((prev) => {
        const next = Math.max(0, Math.min(WORKFLOW_STEPS.length - 1, prev + dir));
        return next;
      });
    };

    const smoothSnapTo = (targetY: number) => {
      if (workflowSnapAnimatingRef.current) return;
      workflowSnapAnimatingRef.current = true;

      const startY = window.scrollY;
      const delta = targetY - startY;
      const start = performance.now();
      const durationMs = 220;

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = easeOutCubic(t);
        window.scrollTo(0, startY + delta * eased);
        if (t < 1) {
          snapRaf = window.requestAnimationFrame(tick);
        } else {
          workflowSnapAnimatingRef.current = false;
          snapRaf = 0;
        }
      };

      snapRaf = window.requestAnimationFrame(tick);
    };

    const snapToWorkflowTop = () => {
      const el = firstWhiteRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // Snap so the workflow becomes a "checkpoint" and can't be skipped by momentum.
      // Offset is intentional framing (see WORKFLOW_SNAP_OFFSET_PX above).
      const targetY = window.scrollY + rect.top + WORKFLOW_SNAP_OFFSET_PX;
      smoothSnapTo(targetY);
      workflowActiveRef.current = true;
      workflowWheelAccumRef.current = 0;
    };

    const onWheel = (e: WheelEvent) => {
      if (workflowSnapAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      const dy = e.deltaY;
      if (dy === 0) return;

      const dir = dy > 0 ? (1 as const) : (-1 as const);
      const shouldCapture = !canExit(dir);

      // If you're entering the section (or just barely overshot it), snap + lock.
      // This prevents “missing” the checkpoint when scrolling fast AND makes the stop position deterministic.
      if (!workflowActiveRef.current) {
        const el = firstWhiteRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();

        // Only snap if this direction still has “work” to do. If you're already at an end tab,
        // allow the page to scroll through without being pulled back.
        //
        // Snap zone: once the section is close enough to "take over", we always snap to its top.
        // This avoids the inconsistent "stop point" you’re seeing.
        const inSnapZone = rect.top <= SNAP_PX;

        if (shouldCapture && dir > 0 && inSnapZone) {
          e.preventDefault();
          snapToWorkflowTop();
          return;
        }
      }

      if (!workflowActiveRef.current) return;
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
      if (workflowSnapAnimatingRef.current) {
        e.preventDefault();
        return;
      }

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

      const shouldCapture = !canExit(dir);

      // Same checkpoint behavior for keyboard scroll.
      if (!workflowActiveRef.current) {
        const el = firstWhiteRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const inSnapZone = rect.top <= SNAP_PX;

        if (shouldCapture && dir > 0 && inSnapZone) {
          e.preventDefault();
          snapToWorkflowTop();
          return;
        }
      }

      if (!workflowActiveRef.current) return;
      if (canExit(dir)) return;
      e.preventDefault();
      step(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!workflowActiveRef.current) return;
      workflowTouchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (workflowSnapAnimatingRef.current) {
        e.preventDefault();
        return;
      }

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
      if (snapRaf) window.cancelAnimationFrame(snapRaf);
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
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[11px] tracking-[0.5em] font-light">VELLUM</span>
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
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

      {/* Hero Section - 3D Monitor with integrated overlay */}
      <section ref={heroRef}>
        <CameraScene lowPowerMode={lowPowerMode} />
      </section>

      {/* Capabilities Section - Golden Ratio Grid */}
      <section id="work" className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16">
          <div className="py-24 md:py-32 border-b border-white/5">
            <Reveal>
              <div className="grid grid-cols-12 gap-10 items-end">
                <div className="col-span-12 md:col-span-7">
                  <h2 className="font-display text-[clamp(44px,4.8vw,72px)] font-extralight tracking-[-0.05em] leading-[1.02]">
                    A wedding edit, distilled
                    <span className="inline-block align-middle ml-4 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                  </h2>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p className="text-[15px] md:text-[17px] leading-[1.9] text-white/50 font-light max-w-xl">
                    Vellum pulls the vows, reactions, and rhythm out of hours of footage — so the edit stops taking weeks.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {capabilities.map((cap, idx) => (
            <Reveal key={cap.title} delay={idx * 0.1}>
              <motion.div
                layout
                className="group relative border-b border-white/5 py-16 md:py-20 cursor-pointer"
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                transition={{ duration: 0.4 }}
              >
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 w-px bg-accent/0 group-hover:bg-accent/35 transition-colors"
                />
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

          <div className="py-20 md:py-24">
            <Reveal delay={0.05}>
              <div className="flex items-center justify-between gap-8">
                <div className="text-[15px] md:text-[17px] leading-[1.9] text-white/45 font-light max-w-2xl">
                  Then watch it stitch together — the same footage, but with intention.
                </div>
                <a
                  href="#workflow"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="link-underline inline-flex items-center gap-4 text-[10px] tracking-[0.45em] text-white/40 hover:text-white transition-colors font-light shrink-0"
                >
                  THE WORKFLOW
                  <span className="text-white/35" aria-hidden="true">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" ref={firstWhiteRef} className="bg-paper text-black border-y border-black/5">
        <div className="relative h-[120vh] overflow-hidden">
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
            <div className="relative max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 h-full pt-32 md:pt-36 pb-8 md:pb-10 flex flex-col">
              {/* Title must be above everything (per blueprint) */}
              <div className="flex-none">
                <h2 className="font-display text-[clamp(64px,6.5vw,110px)] font-light tracking-[-0.06em] leading-[0.92]">
                  The Workflow
                </h2>
              </div>

              {/* Videos */}
              <div className="flex-1 mt-10 md:mt-12">
                {/* One “video row”: active expands (main), others stay as shutters on the right.
                    Advancing tabs expands the next shutter into the main video (per blueprint). */}
                <div className="relative overflow-hidden border border-black/15 bg-white shadow-[0_70px_160px_rgba(0,0,0,0.10)]">
                  {/* Workflow HUD (makes the scroll hijack feel intentional) */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
                    <div className="flex items-start justify-between p-4 md:p-5">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                        <span className="text-[10px] tracking-[0.5em] text-black/45 font-light">
                          {WORKFLOW_STEPS[workflowIdx]?.label.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] text-black/40 font-light">
                        <span>{String(workflowIdx + 1).padStart(2, '0')}</span>
                        <span className="h-[1px] w-10 bg-black/15" aria-hidden="true" />
                        <span>{String(WORKFLOW_STEPS.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>

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
                        <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/80 backdrop-blur-sm px-4 py-2">
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
                        <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/80 backdrop-blur-sm px-4 py-2">
                          <span className="h-2 w-2 rounded-full bg-black/25" aria-hidden="true" />
                          <span className="text-[10px] tracking-[0.45em] text-black/55 font-light">
                            SCROLL TO CONTINUE
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                        const rel = (idx - workflowIdx + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length; // 0..3 (active = 0)
                        const shutterRot = -28 - rel * 2.8;
                        const shutterZ = -140 - rel * 26;
                        const shutterX = 2 + rel * 1.2;

                        return (
                          <motion.button
                            key={step.label}
                            layout
                            type="button"
                            onClick={() => {
                              setWorkflowHasInteracted(true);
                              setWorkflowIdx(idx);
                            }}
                            className={`relative h-full overflow-hidden border border-black/10 bg-white focus:outline-none ${
                              isActive ? 'flex-1 min-w-0' : 'w-[44px] md:w-[52px] shrink-0'
                            }`}
                            style={{
                              order: rel,
                              transformStyle: 'preserve-3d',
                              transformOrigin: 'left center',
                            }}
                            animate={{
                              rotateY: isActive ? 0 : shutterRot,
                              rotateZ: isActive ? 0 : -0.25 * rel,
                              x: isActive ? 0 : shutterX,
                              z: isActive ? 0 : shutterZ,
                              scale: isActive ? 1 : 0.975,
                              opacity: isActive ? 1 : 0.86,
                              filter: isActive ? 'contrast(1.25) brightness(0.98)' : 'contrast(1.15) brightness(0.92)',
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
                            {/* Thickness edge (sells “blind” hinge) */}
                            <div
                              aria-hidden="true"
                              className="absolute inset-y-0 left-0 w-[10px]"
                              style={{
                                background: isActive
                                  ? 'linear-gradient(to right, rgba(0,0,0,0.10), rgba(0,0,0,0.00))'
                                  : 'linear-gradient(to right, rgba(0,0,0,0.18), rgba(0,0,0,0.00))',
                              }}
                            />
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
                <div className="relative border border-black/10 bg-paper overflow-hidden">
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1/4 bg-accent/10"
                    animate={{ x: `${workflowIdx * 100}%` }}
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  />
                  <div className="relative grid grid-cols-4">
                    {WORKFLOW_STEPS.map((step, idx) => {
                      const Icon = step.icon;

                      return (
                        <button
                          key={step.label}
                          type="button"
                          onClick={() => {
                            setWorkflowHasInteracted(true);
                            setWorkflowIdx(idx);
                          }}
                          className="px-7 py-6 md:py-7 border-r last:border-r-0 border-black/10 text-left"
                        >
                          <div className="flex items-center justify-between gap-6">
                            <div className={`text-[12px] tracking-[0.35em] font-light ${idx === workflowIdx ? 'text-black/70' : 'text-black/45'}`}>
                              {step.label.toUpperCase()}
                            </div>
                            <Icon className={`w-4 h-4 ${idx === workflowIdx ? 'text-black/45' : 'text-black/30'}`} strokeWidth={1.5} />
                          </div>
                          <div className={`mt-2 text-[12px] leading-[1.6] font-light ${idx === workflowIdx ? 'text-black/45' : 'text-black/30'}`}>
                            {step.desc}
                          </div>
                        </button>
                      );
                    })}
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
                  <VellumPoster />
              </Reveal>
            </div>
            
            {/* Right: Text (7 cols = 58.3%, close to golden) */}
            <div className="lg:col-span-7 space-y-12">
              <Reveal>
                <div className="space-y-8">
                  <h2 className="font-display text-[36px] md:text-[56px] font-extralight leading-[1.1] tracking-[-0.03em] max-w-2xl">
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
              <h2 className="font-display text-[42px] md:text-[64px] font-extralight tracking-[-0.04em] leading-[1.05]">
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
                <div className="absolute top-8 right-8 w-2 h-2 bg-accent rounded-full" />
                
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
              <h2 className="font-display text-[48px] md:text-[80px] font-extralight leading-[1.05] tracking-[-0.04em]">
                Edit less.
                <br />
                <span className="text-white/20">Create more.</span>
              </h2>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button className="group inline-flex items-center justify-center gap-3 px-12 py-5 bg-paper text-black text-[10px] tracking-[0.4em] hover:bg-paper/95 transition-all font-light hover:-translate-y-[1px] active:translate-y-0">
                  <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  START FREE TRIAL
                </button>
                <button className="group inline-flex items-center justify-center gap-3 px-12 py-5 border border-white/10 text-[10px] tracking-[0.4em] text-white/60 hover:text-white hover:border-accent/50 transition-all font-light hover:-translate-y-[1px] active:translate-y-0">
                  <span className="h-2 w-2 rounded-full bg-white/20 group-hover:bg-accent/70 transition-colors" aria-hidden="true" />
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
              <div className="flex items-center gap-2">
                <span className="text-[11px] tracking-[0.5em] font-light">VELLUM</span>
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              </div>
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
