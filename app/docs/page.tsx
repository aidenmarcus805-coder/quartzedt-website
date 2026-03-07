'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Cpu, Export, FolderOpen, HardDrives, ShieldCheck, Wrench } from '@phosphor-icons/react';

const DOC_SECTIONS = [
  {
    title: 'Setup and account',
    description: 'Account creation, sign-in flow, desktop connection, billing access, and onboarding prerequisites.',
    icon: ShieldCheck,
  },
  {
    title: 'Project workflow',
    description: 'Importing footage, scene detection, transcription, story generation, refinement, and edit structure.',
    icon: FolderOpen,
  },
  {
    title: 'Performance and hardware',
    description: '8GB VRAM guidance, recommended GPUs, RAM targets, storage planning, and optimization notes.',
    icon: Cpu,
  },
  {
    title: 'Exports and handoff',
    description: 'Premiere, FCPXML, MP4, FFmpeg expectations, and troubleshooting failed export pipelines.',
    icon: Export,
  },
  {
    title: 'Storage and assets',
    description: 'Proxy generation, model downloads, local media handling, and disk usage behavior.',
    icon: HardDrives,
  },
  {
    title: 'Troubleshooting',
    description: 'Common issues, recovery steps, support escalation, and diagnostic starting points.',
    icon: Wrench,
  },
];

const FAQ = [
  {
    q: 'Why is scene detection slow on first run?',
    a: 'Quartz may need to download EVA-CLIP and initialize its local analysis stack before the first full scan completes.',
  },
  {
    q: 'Can Quartz run on 8GB VRAM?',
    a: 'Yes. Performance improves when you use optimized models and keep proxy generation enabled for smoother playback.',
  },
  {
    q: 'Why did export fail?',
    a: 'Start by checking FFmpeg installation, local permissions, storage availability, and target export settings.',
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <section className="border-b border-black/5 bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-white/40">Docs</p>
            <h1 className="font-display text-5xl font-light tracking-[-0.04em] md:text-7xl">
              Technical documentation for the full Quartz workflow.
            </h1>
            <p className="mt-8 max-w-2xl text-lg font-light leading-8 text-white/65">
              Use docs when you need exact answers about installation, desktop auth, exports, model downloads,
              system requirements, or troubleshooting edge cases.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {DOC_SECTIONS.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl border border-black/7 bg-black/[0.02] p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-black">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-black/60">{section.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-black/5 bg-black/[0.015]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:px-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/40">Reference path</p>
            <h2 className="mt-4 font-display text-3xl font-light tracking-[-0.03em] md:text-5xl">
              Start with setup, then move deeper only when needed.
            </h2>
            <div className="mt-8 space-y-4 text-sm leading-7 text-black/65">
              <p>Setup and account flows should answer new-user friction.</p>
              <p>Workflow references should clarify what Quartz is doing at each AI stage.</p>
              <p>Performance, export, and troubleshooting content should reduce support load for technical failures.</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/guide" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90">
                Open guide
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/support" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-black transition hover:border-black/25 hover:bg-black/[0.03]">
                Support center
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-black/7 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/35">Common questions</p>
            <div className="mt-6 space-y-4">
              {FAQ.map((item) => (
                <div key={item.q} className="rounded-2xl border border-black/7 bg-black/[0.02] p-5">
                  <h3 className="text-base font-medium text-black">{item.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-black/60">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
