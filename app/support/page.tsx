'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

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
    answer: 'Check FFmpeg installation, available disk space, file permissions, and whether the target target is supported by your system.',
  },
  {
    question: 'Does footage leave my computer?',
    answer: 'Quartz is designed around local processing so wedding footage stays on your machine during the main workflow.',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#050504]">
      {/* Hero */}
      <section className="border-b border-black/5">
        <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-48">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/40">Support</p>
            <h1 className="text-[48px] sm:text-[64px] lg:text-[82px] font-extralight tracking-[-0.04em] leading-[0.95]">
              Here to help.
              <br />
              <span className="text-black/30 italic">Not hide.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[19px] md:text-[21px] font-light leading-relaxed text-black/50">
              Use support when you need answers fast. Start with the common issues below, then escalate to direct contact if the issue still blocks delivery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Support Area */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 border-b border-black/5">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          
          {/* Contact Direct */}
          <div className="rounded-[16px] border border-black/5 bg-white p-10 md:p-14 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/40 tracking-[0.08em]">Direct Access</p>
              <h2 className="mt-4 text-[36px] font-semibold tracking-[-0.02em] text-[#050504]">Get in touch</h2>
              <p className="mt-4 text-[16px] leading-[1.6] text-black/50 font-light mb-12">
                For installation blocks, export failures, or billing issues. We aim to respond by the next business day.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[12px] border border-black/5 bg-[#F5F5F0] p-6 focus-within:ring-2 focus-within:ring-black/5 transition-all">
                <p className="text-[14px] font-bold text-[#050504] uppercase tracking-[0.04em]">Email</p>
                <a href="mailto:support@quartzeditor.com" className="mt-2 text-[16px] text-black/60 hover:text-black hover:underline transition-colors block">
                  support@quartzeditor.com
                </a>
              </div>
              <div className="rounded-[12px] border border-black/5 bg-[#F5F5F0] p-6">
                <p className="text-[14px] font-bold text-[#050504] uppercase tracking-[0.04em]">Priority Time</p>
                <p className="mt-2 text-[16px] text-black/60">
                  Monday - Friday <br/> 9AM - 5PM PST
                </p>
              </div>
            </div>
          </div>

          {/* Docs & Categories */}
          <div className="rounded-[16px] border border-black/5 bg-[#F5F5F0] p-10 md:p-14">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/40">Knowledge Base</p>
              <h2 className="mt-4 text-[36px] font-semibold tracking-[-0.02em] text-[#050504]">Self-serve docs</h2>
            </div>

            <div className="mt-12 space-y-6">
              {SUPPORT_GROUPS.map((group) => (
                <div key={group.title} className="rounded-[12px] border border-black/5 bg-white p-6 md:p-8 hover:shadow-md transition-shadow">
                  <h3 className="text-[18px] font-semibold text-[#050504]">{group.title}</h3>
                  <ul className="mt-4 space-y-3 text-[15px] font-light text-black/60 list-disc list-inside">
                    {group.items.map((item) => (
                      <li key={item} className="marker:text-black/30 hover:text-black transition-colors">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/40 mb-12">Frequently Asked Questions</p>
          <div className="grid gap-6 md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.question} className="rounded-[16px] border border-black/5 bg-[#F5F5F0] p-8 md:p-10 hover:bg-black/[0.03] transition-colors">
                <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[#050504] mb-4">{item.question}</h3>
                <p className="text-[16px] font-light leading-[1.7] text-black/60">{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap gap-4">
            <Link href="/docs" className="inline-flex items-center justify-center rounded-[12px] bg-[#171717] px-8 py-4 text-[13px] font-medium text-white transition hover:bg-black">
              Search the Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
