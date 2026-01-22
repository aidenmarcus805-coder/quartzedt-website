'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RoadmapPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/5">
                <div className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 pt-24 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <span className="px-3 py-1 text-[10px] tracking-[0.3em] text-white/60 border border-white/10 rounded-full">
                            ANNOUNCEMENT
                        </span>
                        <span className="text-[13px] text-white/40">January 2025</span>
                    </div>
                    <h1 className="font-display text-[56px] md:text-[80px] font-extralight tracking-[-0.04em] leading-[0.95] mb-8">
                        Quartz Roadmap
                    </h1>
                </motion.div>
            </section>

            {/* Why Quartz Exists */}
            <section className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-20 border-t border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid md:grid-cols-2 gap-16 items-start"
                >
                    <div>
                        <h2 className="font-display text-[36px] md:text-[48px] font-extralight tracking-[-0.03em] leading-[1.1] mb-8">
                            Why Quartz <br />
                            <span className="text-white/40">Exists</span>
                        </h2>
                    </div>
                    <div className="space-y-6">
                        <p className="text-[18px] leading-[1.8] text-white/70 font-light">
                            Wedding filmmakers are among the most disciplined storytellers working today.
                        </p>
                        <p className="text-[18px] leading-[1.8] text-white/50 font-light">
                            They capture once-in-a-lifetime moments—then disappear into weeks of technical labor before creativity can begin.
                        </p>
                        <p className="text-[20px] leading-[1.8] text-white font-light">
                            Quartz was built to change that imbalance.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* The Problem */}
            <section className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-20 border-t border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-[11px] tracking-[0.4em] text-white/40 uppercase mb-12">The Problem We're Solving</h2>

                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div>
                            <p className="text-[22px] leading-[1.6] text-white/80 font-light mb-10">
                                Every wedding delivers the same reality:
                            </p>
                            <div className="space-y-4">
                                {[
                                    'Terabytes of footage',
                                    'Multiple cameras, drifting audio, scattered formats',
                                    'Hours spent syncing, scrubbing, organizing',
                                    'Before a single creative decision is made.'
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                        className={`text-[17px] font-light ${i === 3 ? 'text-white/40 italic' : 'text-white/60'}`}
                                    >
                                        {item}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <p className="text-[18px] leading-[1.8] text-white/50 font-light">
                                Most AI tools approach video mechanically—cutting, rearranging, optimizing for efficiency.
                            </p>
                            <p className="text-[18px] leading-[1.8] text-white/50 font-light">
                                They don't understand pacing, emotion, or restraint.
                            </p>
                            <p className="text-[20px] leading-[1.8] text-white font-medium">
                                That's not acceptable for wedding films.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Placeholder Image */}
            <section className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5"
                >
                    {/* Placeholder for hero image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/10" />
                            </div>
                            <p className="text-[13px] text-white/30 tracking-wider">HERO IMAGE PLACEHOLDER</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Our Approach */}
            <section className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-20 border-t border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-[11px] tracking-[0.4em] text-white/40 uppercase mb-12">Our Approach</h2>

                    <div className="max-w-3xl mb-16">
                        <p className="text-[28px] md:text-[36px] leading-[1.3] text-white font-extralight tracking-[-0.02em] mb-4">
                            Quartz is not an editor replacement.
                        </p>
                        <p className="text-[28px] md:text-[36px] leading-[1.3] text-white/50 font-extralight tracking-[-0.02em]">
                            It's an editor amplifier.
                        </p>
                    </div>

                    <p className="text-[18px] text-white/60 font-light mb-10">
                        We focus on eliminating the friction before creativity:
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'AI-Powered Culling',
                                desc: 'Understands presence, motion, and emotional signal'
                            },
                            {
                                title: 'Automatic Audio Sync',
                                desc: 'Multi-source sync, resilient to drift and imperfect recordings'
                            },
                            {
                                title: 'Structured Exports',
                                desc: 'Begin with intention—not emptiness'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="p-6 rounded-xl bg-white/[0.02] border border-white/5"
                            >
                                <h3 className="text-[17px] font-medium text-white mb-3">{item.title}</h3>
                                <p className="text-[15px] text-white/50 font-light leading-[1.7]">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/5">
                        <p className="text-[20px] text-white/70 font-light">
                            You start with a foundation. <span className="text-white">The craft remains yours.</span>
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* What's Next */}
            <section className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-20 border-t border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-[11px] tracking-[0.4em] text-white/40 uppercase mb-12">What's Next</h2>

                    <div className="max-w-3xl mb-16">
                        <p className="text-[24px] md:text-[28px] leading-[1.4] text-white/70 font-light">
                            This roadmap marks the beginning, not the destination.
                        </p>
                    </div>

                    <p className="text-[16px] text-white/50 font-light mb-10">Our focus moving forward:</p>

                    <div className="space-y-6 max-w-xl">
                        {[
                            'Deeper emotional understanding of footage',
                            'Faster, calmer workflows',
                            'Tools that respect the editor\'s taste and restraint'
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                <span className="text-[18px] text-white/70 font-light">{item}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/5">
                        <p className="text-[20px] text-white/60 font-light">
                            Quartz will continue to evolve—<span className="text-white">but always in service of storytelling.</span>
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* CTA */}
            <section className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-32 border-t border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="font-display text-[40px] md:text-[56px] font-extralight tracking-[-0.03em] leading-[1.1] mb-6">
                        Try Quartz Free
                    </h2>
                    <p className="text-[18px] text-white/50 font-light mb-10">
                        Start your next film with structure, not stress.
                    </p>
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-[13px] font-medium tracking-wide hover:bg-white/90 transition-colors group"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </section>

            {/* Footer spacer */}
            <div className="h-24" />
        </div>
    );
}
