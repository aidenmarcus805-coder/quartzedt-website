'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

type Billing = 'monthly' | 'annual';

const pricing = [
  {
    name: 'STARTER',
    priceMonthly: 79,
    priceAnnual: 790, // pay 10 months, get 12
    subtitle: 'Per seat',
    description: 'Organize scenes + transcripts. Triage selects fast. Export clean XML.',
    features: [
      'Scene detection + organization',
      'Transcripts',
      'Selects / Needs Review / Trash',
      'XML export (Premiere / Resolve)',
    ],
  },
  {
    name: 'PRO',
    priceMonthly: 199,
    priceAnnual: 1990, // pay 10 months, get 12
    subtitle: 'Per seat',
    description: 'For teams shipping deliverables. Built for speed from ingest to timeline.',
    features: [
      'Everything in Starter',
      'Deliverables Pack',
      'Multicam stacks',
      'Synced audio stacks',
      'Baseline auto color',
      'Templates',
    ],
    featured: true,
  },
];

const faqs = [
  {
    q: 'What is a “seat”?',
    a: 'A seat is one editor login. You can add or remove seats any time as your team changes.',
  },
  {
    q: 'Can I upgrade or downgrade anytime?',
    a: 'Yes. You can switch plans at any time. Changes take effect on your next billing cycle.',
  },
  {
    q: 'What do you export to?',
    a: 'We export XML timelines compatible with Adobe Premiere Pro and DaVinci Resolve.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. All new users get a 7-day free trial on any plan. No credit card required to start.',
  },
  {
    q: 'Do you offer annual billing?',
    a: 'Yes. Annual billing gives you 2 months free (pay 10 months, get 12).',
  },
  {
    q: 'Do you have a founders offer?',
    a: 'Yes. Founding Pro is $149/mo per seat, locked for life, limited to 25–50 users. In exchange, you’ll share feedback and allow a testimonial/case study.',
  },
  {
    q: 'How does referrals work?',
    a: 'Pro users can refer another editor and both get 1 month free. We cap this at 6 free months per year to prevent abuse.',
  },
  {
    q: 'Do you offer a perpetual license?',
    a: 'Yes — $999/seat plus $299/year for updates & support. Contact us to purchase.',
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [billing, setBilling] = useState<Billing>('monthly');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5"
      >
        <div className="grid grid-cols-3 h-14 items-center px-8 text-[11px] tracking-[0.15em]">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 hover:opacity-50 transition-opacity">
              <ArrowLeft className="w-3 h-3" />
              BACK
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Link href="/" className="inline-flex items-center">
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
          </div>
          <div className="flex items-center justify-end gap-8">
            <Link href="/download" className="hover:opacity-50 transition-opacity">DOWNLOAD</Link>
            <Link
              href={session ? "/dashboard" : "/signin?next=/download"}
              className="p-2.5 rounded-full border border-white/20 hover:border-white hover:bg-white/10 transition-all duration-300 active:scale-95 flex items-center justify-center group/signin shadow-[0_0_20px_rgba(255,255,255,0.02)] relative"
              aria-label={session ? "Go to Dashboard" : "Sign In"}
            >
              <User className="w-4 h-4 transition-colors duration-300 bg-transparent group-hover/signin:text-accent" />
              <div className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full animate-pulse bg-accent ${session ? 'opacity-100' : 'opacity-0'}`} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] tracking-[0.4em] text-white/40"
          >
            PRICING
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[56px] md:text-[72px] font-light tracking-tight leading-none"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[18px] font-light text-white/50 max-w-xl mx-auto"
          >
            Choose the plan that fits your workflow. No hidden fees. Cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center mb-10"
          >
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] p-1">
              <button
                type="button"
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-full text-[10px] tracking-[0.25em] transition-colors ${billing === 'monthly' ? 'bg-paper text-black' : 'text-white/50 hover:text-white'
                  }`}
              >
                MONTHLY
              </button>
              <button
                type="button"
                onClick={() => setBilling('annual')}
                className={`px-5 py-2 rounded-full text-[10px] tracking-[0.25em] transition-colors ${billing === 'annual' ? 'bg-paper text-black' : 'text-white/50 hover:text-white'
                  }`}
              >
                ANNUAL <span className="text-[9px] tracking-[0.2em] opacity-70">(2 MO FREE)</span>
              </button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {pricing.map((plan, idx) => {
              const price = billing === 'annual' ? plan.priceAnnual : plan.priceMonthly;
              const period = billing === 'annual' ? '/year' : '/month';
              const subline =
                billing === 'annual' ? 'Pay 10 months, get 12' : 'Per seat · Cancel anytime';

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative p-10 md:p-12 rounded-2xl ${plan.featured ? 'bg-paper text-black' : 'bg-paper/[0.03] border border-white/10'
                    }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-10">
                      <span className="bg-black text-white text-[9px] tracking-[0.3em] px-4 py-1.5">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <p className={`text-[10px] tracking-[0.3em] ${plan.featured ? 'text-black/40' : 'text-white/40'}`}>
                    {plan.name}
                  </p>

                  <div className="mt-4 flex items-baseline">
                    <span className="text-[64px] font-light leading-none">${price}</span>
                    <span className={`text-[14px] ml-2 ${plan.featured ? 'text-black/40' : 'text-white/40'}`}>
                      {period}
                    </span>
                  </div>

                  <p className={`mt-2 text-[13px] tracking-[0.05em] ${plan.featured ? 'text-black/60' : 'text-white/60'}`}>
                    {plan.subtitle} · {subline}
                  </p>

                  <p className={`mt-6 text-[14px] leading-relaxed ${plan.featured ? 'text-black/70' : 'text-white/50'}`}>
                    {plan.description}
                  </p>

                  <div className={`mt-8 pt-8 border-t ${plan.featured ? 'border-black/10' : 'border-white/10'}`}>
                    <p className={`text-[10px] tracking-[0.2em] mb-6 ${plan.featured ? 'text-black/40' : 'text-white/40'}`}>
                      WHAT&apos;S INCLUDED
                    </p>
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.featured ? 'text-black/40' : 'text-white/40'}`} />
                          <span className={`text-[13px] ${plan.featured ? 'text-black/80' : 'text-white/70'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`mt-10 w-full py-4 rounded-full text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${plan.featured ? 'bg-black text-white hover:bg-black/80' : 'border border-white/20 hover:bg-paper hover:text-black'
                      }`}
                  >
                    START FREE TRIAL
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <p className={`mt-4 text-center text-[11px] ${plan.featured ? 'text-black/40' : 'text-white/30'}`}>
                    7-day free trial · No credit card required
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founders / Referral / Perpetual */}
      <section className="px-8 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2 rounded-2xl bg-paper text-black p-10 md:p-12"
          >
            <p className="text-[10px] tracking-[0.3em] text-black/50">FOUNDERS OFFER</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-[44px] md:text-[56px] font-light leading-none">$149</span>
              <span className="text-[13px] text-black/50">/month · per seat · locked for life</span>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-black/70">
              Founding Pro is limited to <span className="text-black/90">25–50 users</span>. In exchange, you’ll share feedback and allow a testimonial/case study.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-black text-white text-[11px] tracking-[0.2em] hover:bg-black/85 transition-colors"
            >
              APPLY FOR FOUNDERS
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl bg-paper/[0.03] border border-white/10 p-10 md:p-12"
          >
            <p className="text-[10px] tracking-[0.3em] text-white/40">REFERRALS (PRO)</p>
            <p className="mt-4 text-[16px] font-light text-white/80 leading-snug">
              1 month free for both.
            </p>
            <p className="mt-3 text-[13px] text-white/50 leading-relaxed">
              The referrer and the referred each get 1 month of Pro free. Capped at 6 free months/year.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-3 rounded-2xl bg-paper/[0.03] border border-white/10 p-10 md:p-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-white/40">PERPETUAL LICENSE (OPTIONAL)</p>
                <p className="mt-4 text-[16px] font-light text-white/80 leading-snug">
                  $999/seat + $299/year updates &amp; support
                </p>
                <p className="mt-3 text-[13px] text-white/50 leading-relaxed max-w-3xl">
                  Prefer upfront purchase? We offer a perpetual option for Pro editors who want ownership and predictable upgrades.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full border border-white/15 text-[11px] tracking-[0.2em] text-white/70 hover:text-white hover:border-white/30 transition-colors"
              >
                CONTACT SALES
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison note */}
      <section className="px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-[14px] text-white/40 leading-relaxed">
            Studios typically spend <span className="text-white/70">$5,000–$15,000/month</span> on editing labor.
            <br />
            Cutline pays for itself after a single wedding.
          </p>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="px-8 py-24 bg-paper/[0.02]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mt-4 text-[36px] font-light tracking-tight">
              Common Questions
            </h2>
          </motion.div>

          <div className="space-y-0">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-white/10 py-8"
              >
                <h3 className="text-[15px] font-medium tracking-wide">{faq.q}</h3>
                <p className="mt-3 text-[14px] text-white/50 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-[42px] font-light tracking-tight">
            Ready to Edit Less?
          </h2>
          <p className="mt-4 text-[14px] text-white/50">
            Start your free trial today. No credit card required.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 px-12 py-4 bg-paper text-black text-[11px] tracking-[0.2em] hover:bg-paper/90 transition-colors flex items-center gap-2 mx-auto"
          >
            GET STARTED
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-paper/[0.02] py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <Link href="/" className="inline-flex items-center justify-center md:justify-start">
                <Image
                  src="/logo.png?v=20251223"
                  alt="Cutline"
                  width={256}
                  height={65}
                  className="h-6 w-auto"
                  unoptimized
                />
              </Link>
              <p className="text-[11px] text-white/40 mt-2">AI Video Editing for Wedding Filmmakers</p>
            </div>
            <div className="flex items-center gap-12 text-[11px] tracking-[0.15em] text-white/40">
              <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
              <a href="#" className="hover:text-white transition-colors">TERMS</a>
              <a href="#" className="hover:text-white transition-colors">CONTACT</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-[10px] text-white/20 text-center md:text-left">
            © 2024 Quartz. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

