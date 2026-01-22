'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, LogOut, ExternalLink, ChevronDown, User, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DESKTOP_SCHEME = process.env.NEXT_PUBLIC_DESKTOP_SCHEME || 'quartz';

// Plan names mapping (database value -> display name)
const PLAN_LABELS: Record<string, string> = {
    'free': 'Free Trial',
    'starter': 'Starter Plan',
    'pro': 'Pro Plan',
    'agency': 'Agency Plan',
    'annual': 'Annual Plan',
};

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
    }, [status, router]);

    if (status === 'loading') return null;
    if (!session) return null;

    // Get user info from session
    const userName = session.user?.name || session.user?.email?.split('@')[0] || 'User';
    const userEmail = session.user?.email || '';
    const userRole = (session.user as any).plan || 'free'; // 'free' | 'starter' | 'pro'

    // Check if annual (logic would be expanded with actual subscription API data)
    const isAnnual = userRole.includes('annual');
    const displayPlan = PLAN_LABELS[userRole] || 'Free Plan';

    return (
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
            {/* Nav - Matched to main site style */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5">
                <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 h-24 flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        {/* Black Logo for light background */}
                        <div className="relative h-5 w-auto aspect-[256/65] shrink-0 transition-opacity">
                            <Image
                                src="/logoBlack.png"
                                alt="Quartz Editor"
                                fill
                                sizes="120px"
                                priority
                                unoptimized
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-12 text-[10px] tracking-[0.32em] font-light text-black">
                        <Link href="/about" className="link-underline hover:opacity-60 transition-opacity">ABOUT</Link>
                        <Link href="/pricing" className="link-underline hover:opacity-60 transition-opacity">PRICING</Link>
                        <Link href="/download" className="link-underline hover:opacity-60 transition-opacity">DOWNLOAD</Link>
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-black/20 hover:border-black hover:bg-black/5 transition-all duration-300 active:scale-95"
                        >
                            <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center overflow-hidden">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] font-medium text-black/60">
                                        {userEmail.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-black/60 hidden sm:inline-block">{userName.split(' ')[0]}</span>
                            <ChevronDown className={`w-3 h-3 text-black/30 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className="absolute top-full right-0 mt-2 w-56 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-50 origin-top-right"
                                >
                                    <div className="p-1">
                                        <div className="px-3 py-2 border-b border-black/5 mb-1">
                                            <p className="text-xs font-medium text-black">{userName}</p>
                                            <p className="text-[10px] text-black/40 truncate">{userEmail}</p>
                                        </div>

                                        <div className="px-2 py-1 space-y-0.5">
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-2 px-3 py-2 text-xs text-black/60 bg-black/5 rounded-lg font-medium"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <User className="w-3.5 h-3.5" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/billing"
                                                className="flex items-center gap-2 px-3 py-2 text-xs text-black/60 hover:text-black hover:bg-black/5 rounded-lg transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <CreditCard className="w-3.5 h-3.5" />
                                                Billing
                                            </Link>
                                        </div>

                                        <div className="mt-1 pt-1 border-t border-black/5">
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <LogOut className="w-3.5 h-3.5" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            <main className="pt-40 pb-32 px-8 md:px-12 lg:px-16 max-w-[1800px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20 border-b border-black/5 pb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h1 className="font-display text-[48px] md:text-[64px] font-extralight tracking-[-0.04em] leading-[1] text-black">
                            Dashboard
                        </h1>
                        <p className="text-xl text-black/40 font-light">
                            Welcome back, {userName.split(' ')[0]}.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-end"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium tracking-wide">SYSTEM OPERATIONAL</span>
                        </div>
                        <div className="flex items-center gap-2 text-black/40 text-sm">
                            <span>Current Plan:</span>
                            <span className="text-black font-medium">{displayPlan} {isAnnual && '(Annual)'}</span>
                            <Link href="/pricing" className="ml-2 text-[10px] uppercase tracking-widest border-b border-black/20 hover:border-black transition-colors">
                                Upgrade
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Main Actions Column */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Quick Actions */}
                        <section>
                            <h2 className="text-[11px] tracking-[0.4em] text-black/40 uppercase mb-8">Quick Actions</h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <motion.a
                                    href={`${DESKTOP_SCHEME}://open`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="group relative p-8 rounded-2xl bg-black text-white hover:bg-black/90 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <ExternalLink className="w-6 h-6 mb-6 opacity-80" />
                                        <h3 className="text-2xl font-light mb-2">Open Quartz</h3>
                                        <p className="text-white/50 text-sm font-light">Launch desktop application</p>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
                                </motion.a>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Link
                                        href="/download"
                                        className="group block h-full p-8 rounded-2xl border border-black/10 hover:border-black/30 bg-white transition-all duration-500"
                                    >
                                        <Download className="w-6 h-6 mb-6 text-black/40 group-hover:text-black transition-colors" />
                                        <h3 className="text-2xl font-light mb-2">Download</h3>
                                        <p className="text-black/40 text-sm font-light">Latest version (v1.2.0)</p>
                                    </Link>
                                </motion.div>
                            </div>
                        </section>

                        {/* Recent Usage Mockup */}
                        <section>
                            <h2 className="text-[11px] tracking-[0.4em] text-black/40 uppercase mb-8">Usage Overview</h2>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="p-8 rounded-2xl border border-black/10 bg-black/[0.01]"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <p className="text-3xl font-light tabular-nums">1,420</p>
                                        <p className="text-sm text-black/40 mt-1">Images culled this month</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-light tabular-nums">12.5h</p>
                                        <p className="text-sm text-black/40 mt-1">Time saved (est.)</p>
                                    </div>
                                </div>
                                {/* Simple bar chart placeholder */}
                                <div className="flex items-end gap-2 h-32 border-b border-black/5 pb-2">
                                    {[40, 65, 30, 80, 55, 90, 70, 45, 60, 35, 75, 50].map((h, i) => (
                                        <div key={i} className="flex-1 bg-black/5 hover:bg-black/10 transition-colors rounded-t-sm relative group cursor-default" style={{ height: `${h}%` }}>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tool-tip">
                                                {h * 10} images
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] text-black/30 font-mono uppercase">
                                    <span>Jan 1</span>
                                    <span>Jan 15</span>
                                    <span>Jan 31</span>
                                </div>
                            </motion.div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-12">
                        {/* Account Status */}
                        <section>
                            <h2 className="text-[11px] tracking-[0.4em] text-black/40 uppercase mb-8">Status</h2>
                            <div className="p-6 rounded-2xl border border-black/10 space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-black/5">
                                    <span className="text-sm text-black/60">Subscription</span>
                                    <Link href="/billing" className="text-xs font-medium hover:underline">Manage</Link>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-black/5">
                                    <span className="text-sm text-black/60">Next Billing</span>
                                    <span className="text-sm">Feb 21, 2026</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-black/60">Desktop App</span>
                                    <span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide">CONNECTED</span>
                                </div>
                            </div>
                        </section>

                        {/* Recent Updates */}
                        <section>
                            <h2 className="text-[11px] tracking-[0.4em] text-black/40 uppercase mb-8">Updates</h2>
                            <div className="space-y-4">
                                {[
                                    { date: 'Jan 15', title: 'Version 1.2.0 Released', desc: 'Improved AI accuracy and faster sync.' },
                                    { date: 'Jan 10', title: 'New Tutorial', desc: 'Mastering the color matching workflow.' },
                                    { date: 'Jan 05', title: 'Service Status', desc: 'All systems operational.' },
                                ].map((update, i) => (
                                    <motion.a
                                        href="#"
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + (i * 0.1) }}
                                        className="block group"
                                    >
                                        <p className="text-[10px] text-black/30 font-mono mb-1">{update.date}</p>
                                        <h3 className="text-sm font-medium group-hover:text-black/70 transition-colors">{update.title}</h3>
                                        <p className="text-xs text-black/50 mt-0.5">{update.desc}</p>
                                    </motion.a>
                                ))}
                            </div>
                            <Link href="/blog" className="inline-block mt-6 text-xs border-b border-black/20 hover:border-black pb-0.5 transition-colors">
                                View all updates
                            </Link>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
}
