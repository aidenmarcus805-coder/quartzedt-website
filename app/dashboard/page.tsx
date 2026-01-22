'use client';

import { motion } from 'framer-motion';
import { Download, ExternalLink, CreditCard, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const DESKTOP_SCHEME = process.env.NEXT_PUBLIC_DESKTOP_SCHEME || 'quartz';

export default function DashboardPage() {
    const { data: session } = useSession();

    const userRole = (session?.user as any)?.plan || 'free';
    const isPro = userRole !== 'free';

    return (
        <div className="space-y-16">
            {/* Header */}
            <div>
                <h1 className="font-display text-4xl text-black font-light mb-2">Profile</h1>
                <p className="text-black/60 text-lg font-light">Manage your Quartz account and subscription.</p>
            </div>

            {/* Account Section */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-sm font-medium text-black">Account</h2>
                    <p className="text-sm text-black/50">Manage your login details and profile.</p>
                </div>

                <div className="p-8 rounded-2xl bg-black/[0.02] border border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center text-xl font-medium text-black/40 overflow-hidden">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                session?.user?.email?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="font-medium text-lg">{session?.user?.name || session?.user?.email?.split('@')[0]}</h3>
                                <span className="px-2 py-0.5 rounded-full bg-black/5 text-[10px] font-medium uppercase tracking-wider text-black/60">
                                    {isPro ? 'Pro Member' : 'Free Account'}
                                </span>
                            </div>
                            <p className="text-black/50">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscriptions Section */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-sm font-medium text-black">Subscriptions</h2>
                    <p className="text-sm text-black/50">View and manage your plan processing.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Current Plan Card */}
                    <div className="p-8 rounded-2xl bg-black/[0.02] border border-black/5 flex flex-col relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center mb-6">
                                <CreditCard className="w-5 h-5 text-black/60" />
                            </div>
                            <h3 className="font-medium text-lg mb-1">{isPro ? 'Pro Plan' : 'Free Trial'}</h3>
                            <p className="text-sm text-black/50 mb-8">{isPro ? 'Active and recurring.' : 'Limited access. Upgrade for more.'}</p>

                            <Link href="/dashboard/billing">
                                <button className="text-sm font-medium border-b border-black/20 hover:border-black pb-0.5 transition-colors">
                                    Manage Subscription
                                </button>
                            </Link>
                        </div>
                        {/* Decorative BG */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-black/5 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-50" />
                    </div>

                    {/* Desktop App Card */}
                    <div className="p-8 rounded-2xl bg-black text-white border border-black/5 flex flex-col relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-medium text-lg mb-1">Quartz Desktop</h3>
                            <p className="text-sm text-white/50 mb-8">Version 1.2.0 • Latest Build</p>

                            <div className="flex gap-4">
                                <a
                                    href={`${DESKTOP_SCHEME}://open`}
                                    className="flex items-center gap-2 text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open
                                </a>
                                <Link
                                    href="/dashboard/download"
                                    className="flex items-center gap-2 text-sm border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Installer
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
                    </div>
                </div>
            </section>


        </div>
    );
}
