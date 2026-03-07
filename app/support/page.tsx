'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChatCircleDots, Clock, Lifebuoy, Pulse, Sparkle, WarningCircle } from '@phosphor-icons/react';

const SUPPORT_GROUPS = [
  {
    title: 'Installation and setup',
    items: ['Mac and Windows install flow', 'Desktop connection issues', 'First project setup'],
  },
  {
    title: 'Performance and AI',
    items: ['8GB VRAM optimization', 'Model download issues', 'Slow scene detection'],
  },
  {
    title: 'Export and delivery',
    items: ['FFmpeg setup', 'Failed exports', 'Premiere and FCPXML handoff'],
  },
];

const FAQ = [
  {
    question: 'Why is scene detection slow?',
    answer: 'The first analysis pass can be slower because Quartz may download EVA-CLIP and build local caches before later projects speed up.',
  },
  {
    question: 'Can I run Quartz on 8GB VRAM?',
    answer: 'Yes. Use optimized models, keep proxies enabled, and avoid running unnecessary GPU-heavy apps in parallel during long jobs.',
  },
  {
    question: 'What should I check if export fails?',
    answer: 'Check FFmpeg installation, available disk space, file permissions, and whether the target export format is supported by your current setup.',
  },
  {
    question: 'Does footage leave my computer?',
    answer: 'Quartz is designed around local processing so wedding footage stays on your machine during the main workflow.',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <section className="border-b border-black/5 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),transparent)]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-black/40">Support</p>
            <h1 className="font-display text-5xl font-light tracking-[-0.04em] md:text-7xl">
              Help for setup issues, workflow blockers, and delivery problems.
            </h1>
            <p className="mt-8 max-w-2xl text-lg font-light leading-8 text-black/65">
              Use support when you need answers fast. Start with the common issues below, then escalate to direct contact if the issue still blocks delivery.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-black/7 bg-black p-10 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <ChatCircleDots className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/40">Contact</p>
                <h2 className="mt-1 text-2xl font-medium tracking-[-0.03em] text-white">Support channels</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium text-white">Email support</p>
                <p className="mt-2 text-sm leading-7 text-white/60">support@quartzeditor.com</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium text-white">Priority topics</p>
                <p className="mt-2 text-sm leading-7 text-white/60">Installation, exports, billing, and production blockers.</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Clock className="h-5 w-5 text-white/70" />
                <p className="mt-3 text-sm text-white/60">Response target: next business day</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Pulse className="h-5 w-5 text-white/70" />
                <p className="mt-3 text-sm text-white/60">Status page: planned for release visibility</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Sparkle className="h-5 w-5 text-white/70" />
                <p className="mt-3 text-sm text-white/60">Release notes: planned inside support surface</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/7 bg-black/[0.02] p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                <Lifebuoy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/35">Knowledge base</p>
                <h2 className="mt-1 text-2xl font-medium tracking-[-0.03em] text-black">Where to self-serve first</h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {SUPPORT_GROUPS.map((group) => (
                <div key={group.title} className="rounded-2xl border border-black/7 bg-white p-5">
                  <h3 className="text-base font-medium text-black">{group.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-black/60">
                    {group.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-black/[0.015]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/40">Frequently asked</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.question} className="rounded-3xl border border-black/7 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div className="flex items-start gap-3">
                  <WarningCircle className="mt-0.5 h-5 w-5 text-black/45" />
                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.02em] text-black">{item.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-black/60">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/docs" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90">
              Open docs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/guide" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-black transition hover:border-black/25 hover:bg-black/[0.03]">
              Read guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
