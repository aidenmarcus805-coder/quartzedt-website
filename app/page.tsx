'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Download, Film, Minus, Palette, Scissors, Search, Upload } from 'lucide-react';
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
        initial={{ opacity: 0, y: 22, scale: 0.99 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
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


const WORKFLOW_STEPS = [
  { label: 'Import', desc: 'Done · Bring footage in. Auto-organize.', icon: Upload, start: 0.0, end: 5.5 },
  { label: 'Analyse', desc: 'Ready · Detect scenes and key beats.', icon: Search, start: 5.5, end: 8.25 },
  { label: 'Rough Cut', desc: 'Locked · Assemble a first-pass cut.', icon: Scissors, start: 8.25, end: 11.0 },
  { label: 'Timeline', desc: 'Locked · Tighten pacing and structure.', icon: Film, start: 11.0, end: 16.5 },
  { label: 'Color', desc: 'Locked · Baseline color and exposure match.', icon: Palette, start: 16.5, end: 19.25 },
  { label: 'Export', desc: 'Locked · Premiere / Resolve ready.', icon: Download, start: 19.25, end: 22.0 },
] as const;

const WORKFLOW_SCROLLS_PER_STEP = 3;
const WORKFLOW_SCROLL_PX = 100; // ~one wheel "tick" (used to map scroll distance to step peel)
const WORKFLOW_SCROLL_PX_PER_STEP = WORKFLOW_SCROLL_PX * WORKFLOW_SCROLLS_PER_STEP;
const WORKFLOW_DOOR_SCROLL_PX = 600; // scroll distance to lift the "hero door" and reveal the workflow
const WORKFLOW_STEP_MIN_DWELL_MS = 500; // minimum time per step before allowing forward scroll into the next one
const WORKFLOW_STEP_CLAMP_EPS_PX = 0.75; // tiny epsilon to stay inside the current step range when locked

// Primary CTAs
// - Start trial: send people through sign-in then to downloads (so it actually does something).
const START_TRIAL_HREF = '/signin?next=/download';

// Book demo: prefer a URL (Calendly/etc). Fallback to email if provided.
const BOOK_DEMO_URL = process.env.NEXT_PUBLIC_BOOK_DEMO_URL || '';
const BOOK_DEMO_EMAIL = process.env.NEXT_PUBLIC_BOOK_DEMO_EMAIL || '';
const BOOK_DEMO_BODY = `Hi,

I'd like to book a demo.

Name:
Studio:
Weddings/year:
Preferred times:
`;
const BOOK_DEMO_HREF = BOOK_DEMO_URL
  ? BOOK_DEMO_URL
  : `mailto:${BOOK_DEMO_EMAIL}?subject=${encodeURIComponent('Book a demo')}&body=${encodeURIComponent(
      BOOK_DEMO_BODY
    )}`;
const SHOW_BOOK_DEMO = Boolean(BOOK_DEMO_URL || BOOK_DEMO_EMAIL);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const firstWhiteRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const workflowDoorRef = useRef<HTMLDivElement | null>(null);
  const workflowDoorLastYRef = useRef<number>(Number.NaN);
  const philosophyRef = useRef<HTMLElement | null>(null);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [workflowIdx, setWorkflowIdx] = useState(0);
  const [workflowLocked, setWorkflowLocked] = useState(false);
  const [workflowHasInteracted, setWorkflowHasInteracted] = useState(false);
  const [workflowAdvance, setWorkflowAdvance] = useState(0); // 0..(WORKFLOW_SCROLLS_PER_STEP-1)
  const [navOnLight, setNavOnLight] = useState(false);
  const workflowAutoIdxRef = useRef(0);
  const workflowAutoAdvanceRef = useRef(0);
  const workflowAutoLockedRef = useRef(false);
  const workflowHasInteractedRef = useRef(false);
  const workflowStepLockUntilRef = useRef(0);
  const workflowDoorFullyOpenRef = useRef(false);
  const workflowBlockForwardWheelRef = useRef(false);
  const workflowHoldScrollYRef = useRef<number | null>(null);
  const workflowWheelControlRef = useRef(false);
  const workflowWheelClampMinYRef = useRef(0);
  const workflowWheelClampMaxYRef = useRef(0);
  const workflowWheelSectionMaxYRef = useRef(0);
  const workflowWheelAllowExitDownRef = useRef(false);
  const workflowWheelTargetYRef = useRef<number | null>(null);
  const workflowWheelDesiredYRef = useRef<number | null>(null);
  const workflowWheelPumpRafRef = useRef(0);

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
      const now = performance.now();
      // Hysteresis to avoid “pin flapping” around 0px due to subpixel scroll.
      const EPS = 1;
      const pinned = rect.top <= EPS && rect.bottom >= vh - EPS;
      // “Active” includes the pinned band + the exit band (when you’ve scrolled past pinned but the section
      // is still partially on-screen). We use this for clamps so fast wheel deltas can’t dump you into blank space.
      const active = rect.top <= EPS && rect.bottom > 0;

      if (workflowAutoLockedRef.current !== pinned) {
        workflowAutoLockedRef.current = pinned;
        setWorkflowLocked(pinned);
      }

      // Use a fixed scroll budget for workflow logic (matches the explicit height we set in JSX).
      // This avoids edge cases where DOM/layout changes make `el.offsetHeight` drift and can trap exit scrolling.
      const scrollable =
        WORKFLOW_DOOR_SCROLL_PX + WORKFLOW_SCROLL_PX_PER_STEP * WORKFLOW_STEPS.length;

      const sectionTopY = window.scrollY + rect.top;
      const scrolled = Math.min(scrollable, Math.max(0, window.scrollY - sectionTopY));
      const sectionMaxY = sectionTopY + scrollable;

      // "Garage door" transition: the dark hero panel lifts up with scroll, revealing the workflow.
      // The door is now position:sticky, so it naturally pins at top=0 and we translate it upward.
      const doorT = Math.max(0, Math.min(1, scrolled / WORKFLOW_DOOR_SCROLL_PX));
      const doorOpen = doorT >= 0.999;
      const doorY = -doorT * vh; // lift the panel fully out of view
      if (workflowDoorRef.current) {
        const prevY = workflowDoorLastYRef.current;
        if (!Number.isFinite(prevY) || Math.abs(prevY - doorY) >= 0.5) {
          workflowDoorLastYRef.current = doorY;
          workflowDoorRef.current.style.transform = `translate3d(0, ${doorY}px, 0)`;
        }
      }

      // Once the door is fully open, start a dwell timer for the first step so you can’t flick-scroll through.
      if (doorOpen && !workflowDoorFullyOpenRef.current) {
        workflowDoorFullyOpenRef.current = true;
        workflowStepLockUntilRef.current = now + WORKFLOW_STEP_MIN_DWELL_MS;
      } else if (!doorOpen && workflowDoorFullyOpenRef.current) {
        workflowDoorFullyOpenRef.current = false;
      }

      // Workflow step scroll should begin only after the door is fully opened.
      const scrolledForStepsRaw = Math.max(0, scrolled - WORKFLOW_DOOR_SCROLL_PX);
      const perStep = WORKFLOW_SCROLL_PX_PER_STEP;
      const lastIdx = WORKFLOW_STEPS.length - 1;
      const currentIdx = workflowAutoIdxRef.current;
      const idxRaw = Math.min(lastIdx, Math.floor(scrolledForStepsRaw / perStep));

      let nextIdx = idxRaw;
      let scrolledForSteps = scrolledForStepsRaw;
      let shouldClampScroll = false;
      let blockForwardWheel = false;

      // Rate-limit forward progress: you must “dwell” on each step before you can scroll into the next.
      // IMPORTANT: use `active` (not just `pinned`) so large scroll deltas can’t skip past the pinned band.
      if (doorOpen && active) {
        const lockUntil = workflowStepLockUntilRef.current;

        if (idxRaw > currentIdx && currentIdx < lastIdx) {
          if (now < lockUntil) {
            // Hold at the end of the current step until the dwell timer expires.
            // IMPORTANT: keep the step index pinned to the current step while locked.
            nextIdx = currentIdx;
            blockForwardWheel = true;
            const boundary = (currentIdx + 1) * perStep;
            const clamped = Math.min(scrolledForStepsRaw, boundary - WORKFLOW_STEP_CLAMP_EPS_PX);
            scrolledForSteps = clamped;
            shouldClampScroll = clamped !== scrolledForStepsRaw;
          } else {
            // Allow only ONE step forward per dwell window, then snap to the start of that step.
            nextIdx = Math.min(lastIdx, currentIdx + 1);
            scrolledForSteps = nextIdx * perStep;
            shouldClampScroll = true;
          }
        } else if (idxRaw < currentIdx) {
          // Backward is allowed immediately, but we snap to the step start to keep the UI crisp.
          nextIdx = idxRaw;
          scrolledForSteps = nextIdx * perStep;
          shouldClampScroll = true;
        }

        // If we’re on the last step, also require dwell time before allowing the user to scroll out.
        const atEnd = scrolled >= scrollable - EPS;
        if (nextIdx === lastIdx && atEnd && now < workflowStepLockUntilRef.current) {
          shouldClampScroll = true;
          blockForwardWheel = true;
        }
      }

      // Derive peel progress from the (possibly clamped) scrolled distance.
      const idx = Math.min(lastIdx, Math.max(0, nextIdx));
      const withinRaw = scrolledForSteps - idx * perStep;
      const within = Math.max(0, Math.min(perStep - 0.001, withinRaw)); // clamp to avoid negative / overflow due to float + clamps

      // Discrete peel steps can "flap" when scroll hovers around a threshold (subpixel jitter / Lenis easing),
      // causing the exact 1/3 <-> 2/3 loop you're seeing. Add hysteresis so it only flips once you cross
      // the boundary by a few px.
      const ADVANCE_HYSTERESIS_PX = 10;
      const rawAdvance = Math.min(
        WORKFLOW_SCROLLS_PER_STEP - 1,
        Math.max(0, Math.floor(within / WORKFLOW_SCROLL_PX))
      );

      const prevIdx = workflowAutoIdxRef.current;
      const idxChanged = prevIdx !== idx;

      let nextAdvance = rawAdvance;
      if (!idxChanged) {
        const prevAdvance = workflowAutoAdvanceRef.current;
        nextAdvance = prevAdvance;
        if (rawAdvance > prevAdvance) {
          const minWithin = rawAdvance * WORKFLOW_SCROLL_PX + ADVANCE_HYSTERESIS_PX;
          if (within >= minWithin) nextAdvance = rawAdvance;
        } else if (rawAdvance < prevAdvance) {
          const maxWithin = prevAdvance * WORKFLOW_SCROLL_PX - ADVANCE_HYSTERESIS_PX;
          if (within <= maxWithin) nextAdvance = rawAdvance;
        }
      }

      if (idxChanged) {
        workflowAutoIdxRef.current = idx;
        setWorkflowIdx(idx);
        // Reset dwell timer on every step change so you can’t spam through.
        workflowStepLockUntilRef.current = now + WORKFLOW_STEP_MIN_DWELL_MS;
      }
      if (workflowAutoAdvanceRef.current !== nextAdvance) {
        workflowAutoAdvanceRef.current = nextAdvance;
        setWorkflowAdvance(nextAdvance);
      }

      if (!workflowHasInteractedRef.current && scrolledForStepsRaw > 18) {
        workflowHasInteractedRef.current = true;
        setWorkflowHasInteracted(true);
      }

      // Legacy forward-wheel clamp (kept as state only). Actual wheel control + clamping is handled by the
      // workflow wheel governor below to avoid “fighting scrollTo” jitter loops.
      workflowBlockForwardWheelRef.current = false;
      workflowHoldScrollYRef.current = null;
      if (doorOpen && active && shouldClampScroll) {
        const desiredScrolled = Math.min(scrollable, Math.max(0, WORKFLOW_DOOR_SCROLL_PX + scrolledForSteps));
        const desiredY = sectionTopY + desiredScrolled;
        if (blockForwardWheel && now < workflowStepLockUntilRef.current) {
          workflowBlockForwardWheelRef.current = true;
          workflowHoldScrollYRef.current = desiredY;
        }
      }

      // Workflow wheel governor: while active, cap wheel deltas and clamp max scroll so fast flicks
      // can’t overshoot and then “snap back” (the source of the freak-out feeling).
      workflowWheelControlRef.current = active;
      workflowWheelClampMinYRef.current = sectionTopY;
      workflowWheelAllowExitDownRef.current = false;
      workflowWheelClampMaxYRef.current = sectionMaxY;
      workflowWheelSectionMaxYRef.current = sectionMaxY;

      if (active) {
        // Default max is the section’s natural end.
        let maxY = sectionMaxY;

        // After the door is open, also cap maxY to the step boundary (dwell lock) and to at most ONE step ahead
        // (prevents multi-step skipping on huge deltas).
        if (doorOpen) {
          const idxForClamp = workflowAutoIdxRef.current;
          const lockUntil = workflowStepLockUntilRef.current;
          const canAdvance = now >= lockUntil;
          const maxSteps =
            idxForClamp >= lastIdx
              ? (idxForClamp + 1) * perStep - WORKFLOW_STEP_CLAMP_EPS_PX
              : (canAdvance ? idxForClamp + 2 : idxForClamp + 1) * perStep - WORKFLOW_STEP_CLAMP_EPS_PX;

          maxY = Math.min(maxY, sectionTopY + WORKFLOW_DOOR_SCROLL_PX + maxSteps);

          // Allow exiting the workflow only when the final dwell has elapsed and we’re at the end.
          const atEnd = scrolled >= scrollable - EPS;
          if (idxForClamp === lastIdx && atEnd && canAdvance) {
            workflowWheelAllowExitDownRef.current = true;
          }
        }

        workflowWheelClampMaxYRef.current = maxY;
        // Reset target whenever constraints change drastically (prevents target “lag” on rapid flicks).
        if (workflowWheelTargetYRef.current == null) workflowWheelTargetYRef.current = window.scrollY;
      } else {
        workflowWheelTargetYRef.current = null;
        workflowWheelDesiredYRef.current = null;
        if (workflowWheelPumpRafRef.current) {
          window.cancelAnimationFrame(workflowWheelPumpRafRef.current);
          workflowWheelPumpRafRef.current = 0;
        }
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

  // Prevent “flick to finish”: when a dwell clamp is active, block forward wheel/keys so it can’t brute-force past.
  useEffect(() => {
    const deltaToPx = (e: WheelEvent) => {
      // deltaMode: 0=pixels, 1=lines, 2=pages
      if (e.deltaMode === 1) return e.deltaY * 16;
      if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
      return e.deltaY;
    };

    const computeWorkflowWheelClamp = (now: number) => {
      const topY = workflowWheelClampMinYRef.current;
      const sectionMaxY = workflowWheelSectionMaxYRef.current || workflowWheelClampMaxYRef.current;
      const scrollable = Math.max(0, sectionMaxY - topY);
      const scrolled = Math.min(scrollable, Math.max(0, window.scrollY - topY));

      const doorOpen = scrolled >= WORKFLOW_DOOR_SCROLL_PX * 0.999;
      let maxY = sectionMaxY;
      let allowExitDown = false;

      if (doorOpen) {
        const idxForClamp = workflowAutoIdxRef.current;
        const lastIdx = WORKFLOW_STEPS.length - 1;
        const perStep = WORKFLOW_SCROLL_PX_PER_STEP;
        const canAdvance = now >= workflowStepLockUntilRef.current;

        const maxSteps =
          idxForClamp >= lastIdx
            ? (idxForClamp + 1) * perStep - WORKFLOW_STEP_CLAMP_EPS_PX
            : (canAdvance ? idxForClamp + 2 : idxForClamp + 1) * perStep - WORKFLOW_STEP_CLAMP_EPS_PX;

        maxY = Math.min(maxY, topY + WORKFLOW_DOOR_SCROLL_PX + maxSteps);

        const atEnd = scrolled >= scrollable - 1;
        allowExitDown = idxForClamp === lastIdx && atEnd && canAdvance;
      }

      workflowWheelClampMaxYRef.current = maxY;
      workflowWheelAllowExitDownRef.current = allowExitDown;
      return { topY, maxY, allowExitDown };
    };

    const pumpWorkflowWheel = (now: number) => {
      workflowWheelPumpRafRef.current = 0;
      if (!workflowWheelControlRef.current) return;

      const desired = workflowWheelDesiredYRef.current;
      if (desired == null) return;

      const { topY, maxY } = computeWorkflowWheelClamp(now);
      const clamped = Math.min(maxY, Math.max(topY, desired));
      // Kill "queued" wheel intent: never keep a desiredY beyond the current clamp,
      // otherwise it will apply later (after dwell unlock) and push you into the next sections.
      workflowWheelDesiredYRef.current = clamped;

      const prevTarget = workflowWheelTargetYRef.current;
      if (typeof prevTarget !== 'number' || Math.abs(prevTarget - clamped) > 0.5) {
        workflowWheelTargetYRef.current = clamped;
        const lenis = window.__lenis;
        if (lenis?.scrollTo) {
          lenis.scrollTo(clamped, { lerp: 0.22, force: true });
        } else {
          window.scrollTo({ top: clamped, left: 0, behavior: 'auto' });
        }
      }
    };

    const schedulePump = () => {
      if (workflowWheelPumpRafRef.current) return;
      workflowWheelPumpRafRef.current = window.requestAnimationFrame(() => pumpWorkflowWheel(performance.now()));
    };

    const onWheel = (e: WheelEvent) => {
      // While workflow is “active”, we take control of wheel deltas to prevent overshoot/jitter on rapid scroll.
      if (workflowWheelControlRef.current) {
        const now = performance.now();
        const { topY, maxY, allowExitDown } = computeWorkflowWheelClamp(now);

        // Allow exiting upwards: if we're at the very top edge of the workflow section and the user scrolls up,
        // don't clamp — let the page scroll back to the previous section.
        const atTop = window.scrollY <= topY + 1;
        if (atTop && e.deltaY < 0) {
          workflowWheelTargetYRef.current = null;
          workflowWheelDesiredYRef.current = null;
          return;
        }

        // If we’re allowed to exit downwards (final dwell done), let the page scroll normally.
        if (allowExitDown && e.deltaY > 0) {
          workflowWheelTargetYRef.current = null;
          workflowWheelDesiredYRef.current = null;
          return;
        }

        e.preventDefault();
        // Important: stop other wheel listeners (including Lenis' own wheel handler) from also processing this delta.
        e.stopImmediatePropagation();

        const rawPx = deltaToPx(e);
        // Cap large deltas (mouse wheels can emit huge spikes). Keep it under one “peel tick”
        // to avoid skipping directly to 2/3 and then flapping around the threshold.
        const CAP = 160;
        const px = Math.max(-CAP, Math.min(CAP, rawPx));

        const base = workflowWheelDesiredYRef.current ?? window.scrollY;
        // Never accumulate a "desiredY" beyond the current clamp — that creates the feeling of
        // postponed scrolls that apply later after the dwell unlock.
        const unclamped = base + px;
        workflowWheelDesiredYRef.current = Math.min(maxY, Math.max(topY, unclamped));
        schedulePump();
        return;
      }

      if (!workflowBlockForwardWheelRef.current) return;
      if (performance.now() >= workflowStepLockUntilRef.current) {
        workflowBlockForwardWheelRef.current = false;
        workflowHoldScrollYRef.current = null;
        return;
      }
      if (e.deltaY <= 0) return; // allow scrolling back/up
      e.preventDefault();
      e.stopPropagation();
      const y = workflowHoldScrollYRef.current;
      if (typeof y === 'number') {
        const lenis = window.__lenis;
        if (lenis?.scrollTo) {
          lenis.scrollTo(y, { immediate: true, force: true });
        } else {
          window.scrollTo({ top: y, left: 0, behavior: 'auto' });
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!workflowBlockForwardWheelRef.current) return;
      if (performance.now() >= workflowStepLockUntilRef.current) {
        workflowBlockForwardWheelRef.current = false;
        workflowHoldScrollYRef.current = null;
        return;
      }
      if (!(e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ')) return;
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKeyDown, { capture: true });
    };
  }, []);

  // (Removed useScroll parallax here — it causes noisy dev warnings and isn’t core to the blueprint.)

  // Nav text color: switch to black when the content under the nav is a "light" section.
  // This is deterministic and avoids browser-specific quirks with mix-blend.
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

      // Workflow "garage door" is a black overlay that uses `pointer-events-none`,
      // so `elementFromPoint` can "see through" it and flip the nav to dark too early.
      // If the door still visually covers our sample point, keep the nav in dark mode (white text).
      const doorEl = workflowDoorRef.current;
      if (doorEl) {
        const r = doorEl.getBoundingClientRect();
        const coversSample = r.top <= y && r.bottom >= y && r.left <= x && r.right >= x;
        if (coversSample) onLight = false;
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
                className={`object-contain transition-opacity duration-150 ${
                  navOnLight ? 'opacity-0' : 'opacity-100'
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
                className={`object-contain transition-opacity duration-150 ${
                  navOnLight ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </span>
          </Link>
          
          <div
            className={`hidden md:flex items-center gap-12 text-[10px] tracking-[0.32em] font-light ${
              navOnLight ? 'text-black' : 'text-white'
            }`}
          >
            <a
              href="#workflow"
              onClick={(e) => {
                e.preventDefault();
                const lenis = window.__lenis;
                if (lenis?.scrollTo) {
                  lenis.scrollTo('#workflow', { duration: 1.15, offset: 0 });
                } else {
                  document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="link-underline hover:opacity-60 transition-opacity"
            >
              WORKFLOW
            </a>
            <Link href="/about" className="link-underline hover:opacity-60 transition-opacity">ABOUT</Link>
            <Link href="/pricing" className="link-underline hover:opacity-60 transition-opacity">PRICING</Link>
            <Link href="/download" className="link-underline hover:opacity-60 transition-opacity">DOWNLOAD</Link>
          </div>

          <div
            className={`flex items-center gap-6 text-[10px] tracking-[0.32em] font-light ${
              navOnLight ? 'text-black' : 'text-white'
            }`}
          >
            <Link href="/signin?next=/download" className="link-underline hover:opacity-60 transition-opacity">
              SIGN IN
            </Link>
            <Link href={START_TRIAL_HREF} className="link-underline hover:opacity-60 transition-opacity">
              START TRIAL
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
                            className={`relative h-full overflow-hidden rounded-[18px] bg-gray-100 focus:outline-none ${
                              isActive ? 'flex-1 min-w-0' : 'w-[44px] md:w-[52px] shrink-0'
                            }`}
                            style={{
                              order: rel,
                              transformStyle: 'preserve-3d',
                              transformOrigin: 'left center',
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
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
                            {/* Screen (no inset rings/lines; avoids the "glass border" look) */}
                            <div className="absolute inset-[6px] overflow-hidden rounded-[14px] bg-white">
                              <SegmentVideo
                                src="/videoplayback1.mp4"
                                start={step.start}
                                end={step.end}
                                play={isActive}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            </div>

                            {/* Bezel + depth (single-material, iPhone-ish bevel; no fake lighting gradients) */}
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                boxShadow: isActive
                                  ? 'inset 0 1px 2px rgba(255,255,255,0.88), inset 0 -8px 18px rgba(0,0,0,0.06), 0 34px 92px rgba(0,0,0,0.12)'
                                  : 'inset 0 1px 2px rgba(255,255,255,0.86), inset 0 -8px 18px rgba(0,0,0,0.05), 0 18px 54px rgba(0,0,0,0.10)',
                              }}
                            />

                            {/* Right edge (simple material break — no gradient) */}
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

                    {/* Hints live on the “screen” area (not the bottom rail) */}
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

                  {/* Step dock: full-width extension (no inset / no outer padding) */}
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
                            className={`group w-full text-left px-4 py-4 transition-colors ${
                              active ? 'bg-white' : 'bg-[#f4f4f5] hover:bg-white/80'
                            }`}
                            aria-label={`Select ${step.label}`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                                    active ? 'bg-accent opacity-100 scale-100' : 'bg-black/25 opacity-0 scale-75'
                                  }`}
                                  aria-hidden="true"
                                />
                                <span
                                  className={`text-[10px] tracking-[0.32em] md:tracking-[0.45em] font-light transition-colors whitespace-nowrap ${
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
                              className={`overflow-hidden text-[12px] leading-[1.55] font-light transition-all duration-200 ${
                                active ? 'mt-2 max-h-24 opacity-100 text-black/50' : 'mt-0 max-h-0 opacity-0 text-black/35'
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
