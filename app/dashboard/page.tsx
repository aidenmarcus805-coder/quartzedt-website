'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, LogOut, ExternalLink, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DESKTOP_SCHEME = process.env.NEXT_PUBLIC_DESKTOP_SCHEME || 'quartz';

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

    const userName = session.user?.name || session.user?.email?.split('@')[0] || 'User';
    const userInitial = userName[0].toUpperCase();

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5">
                <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt="Quartz" width={80} height={20} className="h-4 w-auto invert" unoptimized />
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.06] transition-colors"
                        >
                            <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center overflow-hidden">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] font-medium text-black/60">{userInitial}</span>
                                )}
                            </div>
                            <span className="text-xs text-black/60">{userName.split(' ')[0]}</span>
                            <ChevronDown className="w-3 h-3 text-black/30" />
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className="absolute top-full right-0 mt-2 w-48 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden"
                                >
                                    <div className="p-1">
                                        <div className="px-3 py-2 text-[10px] text-black/40 border-b border-black/5 mb-1">
                                            {session.user?.email}
                                        </div>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-black/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Sign out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            <main className="pt-28 pb-20 px-6">
                <div className="max-w-xl mx-auto space-y-12">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-2"
                    >
                        <h1 className="text-3xl font-light tracking-tight">
                            Welcome, {userName.split(' ')[0]}
                        </h1>
                        <p className="text-sm text-black/40">
                            Your account is connected.
                        </p>
                    </motion.div>

                    {/* Desktop App Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <a
                            href={`${DESKTOP_SCHEME}://open`}
                            className="flex items-center justify-center gap-3 w-full h-14 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90 transition-all"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Open Desktop App
                        </a>

                        <Link
                            href="/download"
                            className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-black/10 text-sm text-black/60 hover:text-black hover:border-black/20 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Download Installer
                        </Link>
                    </motion.div>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-black/[0.06]" />
                        <span className="text-[10px] tracking-widest text-black/20 uppercase">or</span>
                        <div className="flex-1 h-px bg-black/[0.06]" />
                    </div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        <Link
                            href="/pricing"
                            className="p-4 rounded-xl border border-black/5 hover:border-black/10 transition-colors text-center"
                        >
                            <p className="text-sm font-medium">Pricing</p>
                            <p className="text-[11px] text-black/40 mt-1">View plans</p>
                        </Link>
                        <Link
                            href="/"
                            className="p-4 rounded-xl border border-black/5 hover:border-black/10 transition-colors text-center"
                        >
                            <p className="text-sm font-medium">Homepage</p>
                            <p className="text-[11px] text-black/40 mt-1">Back to site</p>
                        </Link>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
