'use client';

import { motion } from 'framer-motion';
import {
    Download,
    Monitor,
    LogOut,
    ExternalLink,
    Plus,
    Clock,
    ChevronRight,
    ShieldCheck,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DESKTOP_SCHEME = process.env.NEXT_PUBLIC_DESKTOP_SCHEME || 'quartz';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
    }, [status, router]);

    if (status === 'loading') return null;
    if (!session) return null;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent/30">
            {/* Sidebar / Top Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
                            <Image src="/logo.png" alt="Quartz" width={120} height={30} className="h-4 w-auto" unoptimized />
                        </Link>
                        <div className="hidden md:flex items-center gap-6 text-[10px] tracking-[0.2em] text-white/40">
                            <Link href="/dashboard" className="text-white">OVERVIEW</Link>
                            <Link href="/projects" className="hover:text-white transition-colors">PROJECTS</Link>
                            <Link href="/team" className="hover:text-white transition-colors">TEAM</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => signOut()}
                            className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-white/10 flex items-center justify-center overflow-hidden">
                            {session.user?.image ? (
                                <Image src={session.user.image} alt="" width={32} height={32} />
                            ) : (
                                <span className="text-[10px] font-medium text-accent">{session.user?.email?.[0].toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Welcome & Stats */}
                    <div className="lg:col-span-8 space-y-12">
                        <header className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-accent text-[10px] tracking-[0.3em]"
                            >
                                <ShieldCheck className="w-3 h-3" />
                                VERIFIED ACCOUNT
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-light tracking-tight"
                            >
                                Welcome back, <span className="text-white/60">{session.user?.name || session.user?.email?.split('@')[0]}</span>
                            </motion.h1>
                        </header>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: 'PROJECTS', value: '12', sub: '3 this month', icon: Clock },
                                { label: 'STORAGE', value: '84%', sub: '2.1 TB used', icon: Zap },
                                { label: 'RENDER TIME', value: '142h', sub: 'Saved vs manual', icon: Monitor },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-colors"
                                >
                                    <stat.icon className="w-4 h-4 text-white/20 mb-6 group-hover:text-accent transition-colors" />
                                    <p className="text-[10px] tracking-[0.2em] text-white/40 mb-2">{stat.label}</p>
                                    <p className="text-3xl font-light mb-1">{stat.value}</p>
                                    <p className="text-[11px] text-white/20">{stat.sub}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity Placeholder */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h2 className="text-[10px] tracking-[0.3em] text-white/40">RECENT PROJECTS</h2>
                                <Link href="/projects" className="text-[10px] tracking-[0.2em] text-accent hover:underline flex items-center gap-2">
                                    VIEW ALL <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="space-y-1">
                                {[1, 2, 3].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                                                <Image src={`/wedding-sample-${i + 1}.jpg`} alt="" width={48} height={48} className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                <Plus className="w-4 h-4 text-white/10 group-hover:text-white/40" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-medium">Summer Wedding - {['Vail, CO', 'Big Sur, CA', 'Amalfi, IT'][i]}</p>
                                                <p className="text-[11px] text-white/30">Modified 2 days ago</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="hidden sm:block text-[9px] tracking-[0.1em] px-2 py-1 rounded bg-white/5 text-white/40">XML READY</span>
                                            <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Desktop Connection */}
                    <div className="lg:col-span-4 lg:border-l lg:border-white/5 lg:pl-12 space-y-12">
                        <section className="space-y-8">
                            <div className="space-y-4">
                                <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Desktop Studio</p>
                                <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 group-hover:opacity-30 transition-opacity" />
                                    <Monitor className="w-12 h-12 text-white/10 group-hover:text-accent transition-all duration-700" />
                                </div>
                                <p className="text-sm text-white/50 leading-relaxed font-light">
                                    Connect your web account to the Quartz Studio desktop application for deep-scan processing and ultra-fast exports.
                                </p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <a
                                    href={`${DESKTOP_SCHEME}://open`}
                                    className="w-full py-4 bg-white text-black text-[11px] tracking-[0.3em] font-medium flex items-center justify-center gap-3 hover:bg-white/90 transition-all rounded-full"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    OPEN DESKTOP APP
                                </a>

                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/download"
                                        className="w-full py-3 border border-white/10 text-[10px] tracking-[0.3em] text-white/60 flex items-center justify-center gap-3 hover:text-white hover:border-white/20 transition-all rounded-full"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        DOWNLOAD INSTALLER
                                    </Link>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6 pt-12 border-t border-white/5">
                            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Support & Docs</p>
                            <ul className="space-y-4">
                                {['Mastering Multicam', 'Export to Premiere', 'Custom AI Models', 'API Reference'].map((item) => (
                                    <li key={item}>
                                        <button className="text-[12px] text-white/30 hover:text-accent transition-colors flex items-center gap-3 group">
                                            <Plus className="w-3 h-3 group-hover:rotate-45 transition-transform" />
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
}
