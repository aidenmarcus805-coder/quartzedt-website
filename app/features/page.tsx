'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from '@phosphor-icons/react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#050504]">
      {/* Hero Section */}
      <section className="border-b border-black/5 bg-[#FAF9F6] text-[#050504]">
        <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-48">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/40">Functions</p>
            <h1 className="text-[48px] sm:text-[64px] lg:text-[82px] font-extralight tracking-[-0.04em] leading-[0.95]">
              Built for speed.
              <br />
              <span className="text-black/30 italic">Not complexity.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[19px] md:text-[21px] font-light leading-relaxed text-black/50">
              Quartz replaces the drudgery of your timeline. Here is exactly what it does, why it matters,
              and how each capability helps wedding filmmakers ship faster without losing editorial control.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 space-y-32 md:space-y-48">
        
        {/* Feature 01 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full overflow-hidden bg-white border border-black/5 p-4 rounded-[16px]"
          >
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[8px] bg-[#F5F5F0]">
              <Image src="/wedding-culling-ui.png" alt="Smart Scenes Culling" fill className="object-cover object-top" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <h2 className="text-[36px] font-semibold tracking-[-0.02em] text-[#050504] mb-6">
              Smart Scenes & AI Story Engine
            </h2>
            <p className="text-[16px] leading-[1.6] text-black/50 mb-8 font-light">
              Quartz identifies meaningful wedding moments across ceremony, vows, reactions, speeches, and dance-floor energy. Narrative assembly uses scene labels, transcripts, quality scoring, and pacing logic to create your ideal first cut.
            </p>
          </motion.div>
        </div>

        {/* Feature 02 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:order-last w-full overflow-hidden bg-white border border-black/5 p-4 rounded-[16px]"
          >
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[8px] bg-[#F5F5F0]">
              <Image src="/flat-audio-sync-ui.png" alt="Audio Synchronization" fill className="object-cover object-top" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <h2 className="text-[36px] font-semibold tracking-[-0.02em] text-[#050504] mb-6">
              Auto Sync & Alignment
            </h2>
            <p className="text-[16px] leading-[1.6] text-black/50 mb-8 font-light">
              Waveform and visual matching align multiple cameras and external audio recorders into a usable master timeline. Drop your drone shots, 4 cameras, and 6 mics in—Quartz builds the multicam.
            </p>
          </motion.div>
        </div>

        {/* Feature 03 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full overflow-hidden bg-white border border-black/5 p-4 rounded-[16px]"
          >
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[8px] bg-[#F5F5F0]">
              <Image src="/flat-export-ui.png" alt="Seamless Export" fill className="object-cover object-top" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <h2 className="text-[36px] font-semibold tracking-[-0.02em] text-[#050504] mb-6">
              NLE Integration
            </h2>
            <p className="text-[16px] leading-[1.6] text-black/50 mb-8 font-light">
              Quartz generates flawless XML timelines for Premiere Pro, Final Cut Pro, and DaVinci Resolve. The heavy lifting is done outside your editor, so you can focus entirely on the polish when you open the project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why it Matters */}
      <section className="bg-white border-y border-black/5">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-24 md:px-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/40">Philosophy</p>
            <h2 className="mt-6 text-[36px] md:text-[48px] font-extralight tracking-[-0.03em] leading-[1.05]">
              Every feature removes labor,<br />
              <span className="text-black/40">Not editorial judgment.</span>
            </h2>
            <p className="mt-8 max-w-xl text-[16px] leading-[1.8] text-black/50 font-light">
              Quartz is strongest when it handles searching, syncing, scene labeling, first-pass structure, and technical prep.
              Editors still decide pacing, taste, emotional emphasis, and the final version couples actually receive.
            </p>
          </div>

          <div className="rounded-[16px] border border-black/5 bg-[#F5F5F0] p-10 flex flex-col justify-center">
            <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#050504] mb-4">Taking the Next Step</h3>
            <div className="space-y-3 text-[14px] leading-relaxed text-black/60 mb-8">
              <p>Ready to reclaim your weekends?</p>
              <p>Download the app and start with your first 2 weddings on us.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/downloads" className="inline-flex items-center gap-2 rounded-[12px] bg-[#171717] px-6 py-3 text-[13px] font-medium text-white transition hover:bg-black">
                Download App
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-[12px] border border-black/10 bg-white px-6 py-3 text-[13px] font-medium text-black transition hover:border-black/20 hover:bg-black/[0.02]">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
