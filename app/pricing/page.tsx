'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const pricing = [
  {
    name: 'STARTER',
    price: '$129',
    period: '/month',
    subtitle: '2 weddings/month',
    description: 'For shooters who do 1–2 weddings per month. The perfect entry point.',
    features: [
      'Upload up to 2 weddings/month',
      'Auto-sorting',
      'Multi-cam sync',
      'Speech & vow extraction',
      'Story recommendations',
      'Rough-cut generation (10–15 min sequences)',
      'XML export for Premiere / Resolve',
    ],
  },
  {
    name: 'PRO',
    price: '$249',
    period: '/month',
    subtitle: '4 weddings/month',
    description: 'For real working videographers. This is where the magic happens.',
    features: [
      'Everything in Starter',
      '4 weddings/month',
      'Full project timeline assembly',
      'AI story building + scene ordering',
      'AI shot rating',
      'AI angle selection',
      'Music beat sync',
      'Color match',
      'Final XML for Premiere / Resolve',
      'Priority GPU processing',
    ],
    featured: true,
  },
];

const faqs = [
  {
    q: 'What counts as a "wedding"?',
    a: 'One wedding equals one event upload, regardless of the number of cameras or hours of footage. Multi-day events count as one wedding.',
  },
  {
    q: 'Can I upgrade or downgrade anytime?',
    a: 'Yes. You can switch plans at any time. Changes take effect on your next billing cycle.',
  },
  {
    q: 'What formats do you export to?',
    a: 'We export XML timelines compatible with Adobe Premiere Pro, DaVinci Resolve, and Final Cut Pro.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. All new users get a 7-day free trial on any plan. No credit card required to start.',
  },
  {
    q: 'What happens if I exceed my wedding limit?',
    a: 'You can purchase additional wedding credits at $75 each, or upgrade to the next tier.',
  },
  {
    q: 'Do you offer annual billing?',
    a: 'Yes. Annual plans save you 20%. Contact us for enterprise pricing.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
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
            <a href="#" className="hover:opacity-50 transition-opacity">LOG IN</a>
            <a href="#" className="hover:opacity-50 transition-opacity">START TRIAL</a>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] tracking-[0.4em] text-white/40"
          >
            PRICING
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-[56px] md:text-[72px] font-light tracking-tight leading-none"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-[18px] font-light text-white/50 max-w-xl mx-auto"
          >
            Choose the plan that fits your workflow. No hidden fees. Cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-8 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {pricing.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + idx * 0.15 }}
              className={`relative p-10 md:p-12 rounded-2xl ${
                plan.featured
                  ? 'bg-paper text-black'
                  : 'bg-paper/[0.03] border border-white/10'
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
                <span className="text-[64px] font-light leading-none">{plan.price}</span>
                <span className={`text-[14px] ml-2 ${plan.featured ? 'text-black/40' : 'text-white/40'}`}>
                  {plan.period}
                </span>
              </div>
              
              <p className={`mt-2 text-[13px] tracking-[0.05em] ${plan.featured ? 'text-black/60' : 'text-white/60'}`}>
                {plan.subtitle}
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
                className={`mt-10 w-full py-4 text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  plan.featured
                    ? 'bg-black text-white hover:bg-black/80'
                    : 'border border-white/20 hover:bg-paper hover:text-black'
                }`}
              >
                START FREE TRIAL
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <p className={`mt-4 text-center text-[11px] ${plan.featured ? 'text-black/40' : 'text-white/30'}`}>
                7-day free trial · No credit card required
              </p>
            </motion.div>
          ))}
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
                transition={{ delay: idx * 0.05 }}
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
            © 2024 Cutline. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

