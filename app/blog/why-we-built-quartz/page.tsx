'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';

export default function WhyWeBuiltQuartzPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/5">
                <div className="max-w-[800px] mx-auto px-8 py-6">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back to blog
                    </Link>
                </div>
            </header>

            {/* Article */}
            <article className="max-w-[800px] mx-auto px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-[10px] tracking-[0.3em] text-accent uppercase">Announcement</span>
                        <span className="text-white/20">·</span>
                        <span className="text-sm text-white/40">January 2025</span>
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-[36px] md:text-[48px] font-extralight tracking-[-0.04em] leading-[1.15] mb-12">
                        Why we built Quartz
                    </h1>

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        <p className="text-xl text-white/70 font-light leading-relaxed mb-8">
                            Wedding filmmakers are some of the most talented storytellers in the industry. They capture the most important day of people's lives—and then spend weeks drowning in footage.
                        </p>

                        <h2 className="text-2xl font-medium text-white mt-12 mb-4">The problem</h2>
                        <p className="text-white/60 font-light leading-relaxed mb-6">
                            After every wedding, editors face the same grind: 4TB of footage, dozens of camera angles, scattered audio sources. Hours spent scrubbing, syncing, and assembling before any creative work can even begin.
                        </p>
                        <p className="text-white/60 font-light leading-relaxed mb-6">
                            Most AI tools treat video like text—they chop and rearrange without understanding the emotional arc. They miss the subtle moments that make a wedding film special.
                        </p>

                        <h2 className="text-2xl font-medium text-white mt-12 mb-4">Our approach</h2>
                        <p className="text-white/60 font-light leading-relaxed mb-6">
                            Quartz is different. We're not trying to replace the editor—we're trying to eliminate the tedious assembly work so you can focus on craft.
                        </p>
                        <ul className="space-y-3 text-white/60 font-light mb-6">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                                <span>AI-powered culling that understands what makes a shot worth keeping</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                                <span>Automatic multi-source audio sync, even with drift</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                                <span>Structured timeline export—start with a foundation, not a blank canvas</span>
                            </li>
                        </ul>

                        <h2 className="text-2xl font-medium text-white mt-12 mb-4">Built in public</h2>
                        <p className="text-white/60 font-light leading-relaxed mb-6">
                            We've been sharing our progress on Reddit and building alongside the community. Your feedback shapes everything—from features to pricing.
                        </p>
                        <p className="text-white/60 font-light leading-relaxed">
                            This is just the beginning. We're excited to see what you create with Quartz.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-16 pt-12 border-t border-white/10">
                        <Link
                            href="/signin?next=/download"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
                        >
                            <span className="w-2 h-2 rounded-full bg-accent" />
                            Try Quartz free
                        </Link>
                    </div>
                </motion.div>
            </article>
        </div>
    );
}
