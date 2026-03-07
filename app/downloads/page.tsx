'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowSquareOut } from '@phosphor-icons/react';
import { SiteLogoMenu } from '../components/SiteLogoMenu';

const MAC_URL = process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_MAC_URL || '';
const WINDOWS_URL = process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_WINDOWS_URL || '';

const SYSTEM_REQUIREMENTS = [
    { label: 'macOS', value: 'Ventura 13.0 or later' },
    { label: 'Windows', value: 'Windows 10 / 11 (64-bit)' },
    { label: 'Processor', value: 'Apple Silicon or Intel x86-64' },
    { label: 'Memory', value: '8 GB RAM minimum' },
    { label: 'Storage', value: '2 GB available disk space' },
];

export default function DownloadsPage() {
    return (
        <div className="min-h-screen bg-[#f5f5f0] text-black antialiased selection:bg-black selection:text-white">

            {/* ── Navbar ─────────────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-8 md:px-14">
                <SiteLogoMenu darkLogoVisible />

                <div className="flex items-center gap-3">
                    <Link
                        href="/pricing"
                        className="text-[13px] font-medium text-black/60 hover:text-black transition-colors"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/signup?next=/dashboard/download"
                        className="ml-2 px-5 py-2 rounded-full bg-black text-white text-[13px] font-medium hover:bg-black/80 transition-colors shadow-lg"
                    >
                        Get started
                    </Link>
                </div>
            </nav>

            {/* ── Hero ───────────────────────────────────────────── */}
            <div className="relative w-full" style={{ height: '78vh', minHeight: 520 }}>
                {/* Background image */}
                <Image
                    src="/downloadpage.jpg"
                    alt="Quartz Desktop Application"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-center"
                />

                {/* Subtle vignette at bottom to blend into page */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 60%, #f5f5f0 100%)',
                    }}
                />

                {/* Centered hero text */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center px-6">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/40 mb-3"
                    >
                        Quartz Desktop
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[42px] md:text-[56px] font-light tracking-tight text-black leading-tight"
                    >
                        Download Quartz
                    </motion.h1>
                </div>
            </div>

            {/* ── Download Cards ─────────────────────────────────── */}
            <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 -mt-4">

                {/* Platform cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="grid sm:grid-cols-2 gap-4"
                >
                    {/* macOS */}
                    <a
                        href={MAC_URL || undefined}
                        aria-disabled={!MAC_URL}
                        className={`group relative flex flex-col gap-5 rounded-2xl bg-black text-white px-7 py-7 transition-all duration-300 hover:scale-[1.015] hover:shadow-2xl active:scale-[0.99] ${!MAC_URL ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                            <ArrowSquareOut className="w-5 h-5 opacity-40 group-hover:opacity-70 transition-opacity" />
                        </div>
                        <div>
                            <p className="text-[17px] font-semibold">Download for macOS</p>
                            <p className="text-sm text-white/50 mt-0.5">Apple Silicon &amp; Intel · Universal</p>
                        </div>
                    </a>

                    {/* Windows */}
                    <a
                        href={WINDOWS_URL || undefined}
                        aria-disabled={!WINDOWS_URL}
                        className={`group relative flex flex-col gap-5 rounded-2xl bg-white border border-black/10 text-black px-7 py-7 transition-all duration-300 hover:scale-[1.015] hover:shadow-xl hover:border-black/20 active:scale-[0.99] ${!WINDOWS_URL ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                            </svg>
                            <ArrowSquareOut className="w-5 h-5 opacity-30 group-hover:opacity-60 transition-opacity" />
                        </div>
                        <div>
                            <p className="text-[17px] font-semibold">Download for Windows</p>
                            <p className="text-sm text-black/40 mt-0.5">Windows 10 / 11 · 64-bit</p>
                        </div>
                    </a>
                </motion.div>

                {/* Helper text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.55 }}
                    className="text-center text-[13px] text-black/40 mt-5"
                >
                    Quartz requires macOS Ventura 13 or later / Windows 10 64-bit or later.{' '}
                    <Link href="/signup?next=/dashboard/download" className="underline underline-offset-2 hover:text-black transition-colors">
                        Sign in to connect&nbsp;your&nbsp;account.
                    </Link>
                </motion.p>

                {/* Divider */}
                <div className="mt-20 mb-12 h-px bg-black/8" />

                {/* System Requirements */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/35 mb-6">
                        System requirements
                    </p>
                    <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
                        {SYSTEM_REQUIREMENTS.map((req) => (
                            <div key={req.label} className="flex items-baseline justify-between border-b border-black/6 pb-4">
                                <span className="text-sm text-black/45">{req.label}</span>
                                <span className="text-sm font-medium text-black">{req.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </section>

            {/* ── Footer ─────────────────────────────────────────── */}
            <footer className="border-t border-black/8 py-10 px-8 md:px-14 flex items-center justify-between text-[12px] text-black/35">
                <span>&copy; {new Date().getFullYear()} Quartz</span>
                <div className="flex gap-6">
                    <Link href="/about" className="hover:text-black transition-colors">About</Link>
                    <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
                    <Link href="/support" className="hover:text-black transition-colors">Support</Link>
                </div>
            </footer>

        </div>
    );
}
