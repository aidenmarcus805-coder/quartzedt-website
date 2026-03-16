'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  Download,
  FilmStrip,
  Lifebuoy,
  MonitorPlay,
  Sparkle,
  VideoCamera,
} from '@phosphor-icons/react';

const GETTING_STARTED_STEPS = [
  {
    step: '01',
    title: 'Download and install Quartz Desktop',
    body: 'Install the Mac or Windows build, launch Quartz, and sign in with your account before creating your first wedding edit.',
    cta: { label: 'Open downloads', href: '/downloads' },
  },
  {
    step: '02',
    title: 'Create your first project',
    body: 'Start a new project, choose your wedding folder, and let Quartz scan video formats, metadata, and proxy previews automatically.',
    cta: { label: 'Read the docs', href: '/docs' },
  },
  {
    step: '03',
    title: 'Import footage and run the workflow',
    body: 'Move from scan to scene detection, transcription, story generation, refinement, and export with clear checkpoints at each stage.',
    cta: { label: 'Get support', href: '/support' },
  },
];

const WORKFLOW = [
  {
    title: 'Import your footage',
    description:
      'Drag in a wedding folder and Quartz organizes clips, identifies formats, and builds proxies for smoother review.',
    icon: Download,
  },
  {
    title: 'Scene detection',
    description:
      'Quartz uses EVA-CLIP to identify natural cut points and label moments like vows, speeches, first kiss, and dance floor energy.',
    icon: VideoCamera,
  },
  {
    title: 'Transcription',
    description:
      'Whisper-powered transcription turns vows, speeches, and toasts into searchable text so you can jump to the moments that matter.',
    icon: MonitorPlay,
  },
  {
    title: 'AI story generation',
    description:
      'Choose cinematic highlight, documentary, or short social formats and let Quartz assemble a first narrative pass.',
    icon: Sparkle,
  },
  {
    title: 'Refine your edit',
    description:
      'Lock favorite clips, adjust timing, replace shots, and keep creative control while AI regenerates around your choices.',
    icon: FilmStrip,
  },
  {
    title: 'Color and export',
    description:
      'Auto-match color across cameras and export to Premiere, Final Cut, or MP4 for final delivery and polish.',
    icon: CheckCircle,
  },
];

const TROUBLESHOOTING = [
  'Scene detection can feel slow on first run because Quartz may download EVA-CLIP assets.',
  '8GB VRAM systems can work well by using smaller optimized models such as Qwen3-8B-AWQ.',
  'Export failures usually point to FFmpeg setup or missing local dependencies.',
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-black">
      <section className="border-b border-black/5 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.05),transparent_40%)]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-black/45">
              Guide
            </p>
            <h1 className="font-display text-5xl font-light tracking-[-0.04em] md:text-7xl">
              Learn Quartz in the order real wedding edits happen.
            </h1>
            <p className="mt-8 max-w-2xl text-lg font-light leading-8 text-black/65 md:text-xl">
              This is the onboarding path for first-time users: install the desktop app, create a project,
              import footage, and move from raw media to a polished story without guessing what comes next.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/downloads"
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90"
              >
                Download desktop
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-black transition hover:border-black/25 hover:bg-black/[0.03]"
              >
                Technical docs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/40">Getting started</p>
            <h2 className="mt-4 font-display text-3xl font-light tracking-[-0.03em] md:text-5xl">
              Your first successful edit in three moves.
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {GETTING_STARTED_STEPS.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-black/7 bg-black/[0.02] p-8"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-black/35">Step {item.step}</p>
              <h3 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-black">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-black/60">{item.body}</p>
              <Link
                href={item.cta.href}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-black/80 transition hover:text-black"
              >
                {item.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-black/5 bg-black/[0.015]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/40">Workflow</p>
            <h2 className="mt-4 font-display text-3xl font-light tracking-[-0.03em] md:text-5xl">
              From scan to export in six clear stages.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {WORKFLOW.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-3xl border border-black/7 bg-white p-7 shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-medium tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-black/60">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:px-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-black/7 bg-black text-white p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/40">Simple explanation</p>
          <h2 className="mt-4 font-display text-3xl font-light tracking-[-0.03em] md:text-5xl">
            Quartz removes the repetitive editing work, not your taste.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">
            Import footage, let AI organize scenes, generate a first narrative pass, then refine only the
            moments that need your judgment. The goal is faster delivery with stronger consistency across every wedding.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-light">20h</p>
              <p className="mt-2 text-sm text-white/55">Traditional rough-cut workload</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-light">~3h</p>
              <p className="mt-2 text-sm text-white/55">Quartz-assisted workflow target</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-light">17h</p>
              <p className="mt-2 text-sm text-white/55">Potential hours saved per wedding</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/7 bg-black/[0.02] p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
              <Lifebuoy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-black/35">Troubleshooting</p>
              <h3 className="mt-1 text-xl font-medium tracking-[-0.02em] text-black">Start with the common blockers</h3>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {TROUBLESHOOTING.map((item) => (
              <div key={item} className="rounded-2xl border border-black/7 bg-white px-5 py-4 text-sm leading-7 text-black/65">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90"
            >
              Visit support
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-black transition hover:border-black/25 hover:bg-black/[0.03]"
            >
              Explore features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
