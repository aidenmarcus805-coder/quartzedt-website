'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MusicNotes, Pulse, Scissors, Sparkle, Target, Waves } from '@phosphor-icons/react';

const FEATURES = [
  {
    title: 'Smart Scenes',
    description: 'Quartz identifies meaningful wedding moments across ceremony, vows, reactions, speeches, and dance-floor energy.',
    icon: Sparkle,
  },
  {
    title: 'Auto Sync',
    description: 'Waveform and visual matching align multiple cameras and recorders into a usable master timeline.',
    icon: Waves,
  },
  {
    title: 'AI Story Generation',
    description: 'Narrative assembly uses scene labels, transcripts, quality scoring, and pacing logic to create a first cut.',
    icon: Pulse,
  },
  {
    title: 'Beat Snapping',
    description: 'Cuts can lock to musical structure so rhythm feels intentional before detailed hand-polish begins.',
    icon: MusicNotes,
  },
  {
    title: 'Color Auto-Match',
    description: 'Quartz balances camera variation and helps create a more unified starting point across footage sources.',
    icon: Scissors,
  },
  {
    title: 'VIP Reaction Targeting',
    description: 'The story engine can favor emotionally important reactions at the right moments in the narrative arc.',
    icon: Target,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <section className="border-b border-black/5 bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-white/40">Features</p>
            <h1 className="font-display text-5xl font-light tracking-[-0.04em] md:text-7xl">
              The Quartz feature set, explained in practical editing terms.
            </h1>
            <p className="mt-8 max-w-2xl text-lg font-light leading-8 text-white/65">
              This page bridges marketing and documentation. It shows what Quartz actually does, why it matters,
              and how each capability helps wedding filmmakers ship faster without losing editorial control.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl border border-black/7 bg-black/[0.02] p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-black">{feature.title}</h2>
                <p className="mt-4 text-sm leading-7 text-black/60">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-black/5 bg-black/[0.015]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:px-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/40">Why it matters</p>
            <h2 className="mt-4 font-display text-3xl font-light tracking-[-0.03em] md:text-5xl">
              Every feature is aimed at removing timeline labor, not replacing editorial judgment.
            </h2>
            <p className="mt-8 max-w-2xl text-sm leading-8 text-black/65">
              Quartz is strongest when it handles searching, syncing, scene labeling, first-pass structure, and technical prep.
              Editors still decide pacing, taste, emotional emphasis, and the final version couples actually receive.
            </p>
          </div>

          <div className="rounded-3xl border border-black/7 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/35">Next steps</p>
            <div className="mt-6 space-y-4 text-sm leading-7 text-black/60">
              <p>Use the guide if you want the fastest path through your first project.</p>
              <p>Use docs if you need system requirements, export notes, or implementation detail.</p>
              <p>Use support if something blocks delivery and you need troubleshooting help fast.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/guide" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90">
                Read guide
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/docs" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-black transition hover:border-black/25 hover:bg-black/[0.03]">
                Open docs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
