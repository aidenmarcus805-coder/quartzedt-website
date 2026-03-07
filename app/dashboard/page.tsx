'use client';

import { motion } from 'framer-motion';
import { Download, ArrowSquareOut, ClockCounterClockwise, CreditCard, Database, FilmStrip, Lightning, Lifebuoy, PlayCircle, Sparkle } from '@phosphor-icons/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const DESKTOP_SCHEME = process.env.NEXT_PUBLIC_DESKTOP_SCHEME || 'quartz';

const STATS = [
    { label: 'Hours saved', value: '17.2', detail: 'Average per wedding' },
    { label: 'Videos processed', value: '12', detail: 'Last 30 days' },
    { label: 'Storage used', value: '312 GB', detail: 'Of 1 TB quota' },
];

const PROJECTS = [
    { name: 'Maya + Eli', status: 'Story generated', updated: '2 hours ago', length: '8h footage' },
    { name: 'Harper Estate', status: 'Ready for export', updated: 'Yesterday', length: '5h footage' },
    { name: 'Coastal Vows', status: 'Scene detection', updated: '3 days ago', length: '11h footage' },
];

const QUICK_ACTIONS = [
    { label: 'Continue last edit', href: `${DESKTOP_SCHEME}://open`, external: true, icon: PlayCircle },
    { label: 'Download installer', href: '/dashboard/download', external: false, icon: Download },
    { label: 'Read getting started', href: '/guide', external: false, icon: Sparkle },
    { label: 'Open support', href: '/support', external: false, icon: Lifebuoy },
];

export default function DashboardPage() {
    const { data: session } = useSession();

    const userRole = (session?.user as any)?.plan || 'free';
    const isPro = userRole !== 'free';

    return (
        <div className="space-y-14">
            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[2rem] bg-black p-10 text-white">
                    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/40">Overview</p>
                    <h1 className="mt-5 font-display text-5xl font-light tracking-[-0.04em]">
                        {session?.user?.name ? `Welcome back, ${session.user.name.split(' ')[0]}.` : 'Welcome back.'}
                    </h1>
                    <p className="mt-5 max-w-2xl text-lg font-light leading-8 text-white/65">
                        Keep projects moving with a single place for recent edits, account status, desktop access,
                        onboarding help, and the next best action.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href={`${DESKTOP_SCHEME}://open`}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                        >
                            <ArrowSquareOut className="h-4 w-4" />
                            Open desktop app
                        </a>
                        <Link
                            href="/guide"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                            <Sparkle className="h-4 w-4" />
                            Getting started
                        </Link>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-black/7 bg-black/[0.02] p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/35">Account</p>
                            <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-black">
                                {session?.user?.name || session?.user?.email?.split('@')[0] || 'Quartz user'}
                            </h2>
                            <p className="mt-2 text-sm text-black/55">{session?.user?.email}</p>
                        </div>
                        <span className="rounded-full bg-black px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                            {isPro ? 'Pro' : 'Free'}
                        </span>
                    </div>

                    <div className="mt-8 grid gap-3">
                        <div className="rounded-2xl border border-black/7 bg-white px-5 py-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-black/35">Current plan</p>
                            <p className="mt-2 text-sm text-black/65">{isPro ? 'Pro plan active and ready for desktop processing.' : 'Free access with upgrade prompts for advanced workflows.'}</p>
                        </div>
                        <div className="rounded-2xl border border-black/7 bg-white px-5 py-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-black/35">Storage quota</p>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/8">
                                <div className="h-full w-[31%] rounded-full bg-black" />
                            </div>
                            <p className="mt-3 text-sm text-black/60">312 GB used of 1 TB available for proxies, models, and project assets.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-5 md:grid-cols-3">
                {STATS.map((stat) => (
                    <div key={stat.label} className="rounded-3xl border border-black/7 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-black/35">{stat.label}</p>
                        <p className="mt-5 text-4xl font-light tracking-[-0.04em] text-black">{stat.value}</p>
                        <p className="mt-3 text-sm text-black/55">{stat.detail}</p>
                    </div>
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[2rem] border border-black/7 bg-black/[0.02] p-8">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/35">Recent projects</p>
                            <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-black">Pick up where you left off.</h2>
                        </div>
                        <button className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:border-black/25 hover:bg-black/[0.03]">
                            New project
                        </button>
                    </div>

                    <div className="mt-8 space-y-4">
                        {PROJECTS.map((project) => (
                            <div key={project.name} className="flex flex-col gap-4 rounded-3xl border border-black/7 bg-white p-6 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                                        <FilmStrip className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium tracking-[-0.02em] text-black">{project.name}</h3>
                                        <p className="mt-1 text-sm text-black/55">{project.status} • {project.length}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-black/55">
                                    <ClockCounterClockwise className="h-4 w-4" />
                                    {project.updated}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-black/7 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/35">Quick actions</p>
                        <div className="mt-6 space-y-3">
                            {QUICK_ACTIONS.map((action) => {
                                const Icon = action.icon;

                                if (action.external) {
                                    return (
                                        <a
                                            key={action.label}
                                            href={action.href}
                                            className="flex items-center justify-between rounded-2xl border border-black/7 px-5 py-4 text-sm font-medium text-black transition hover:border-black/20 hover:bg-black/[0.02]"
                                        >
                                            <span className="flex items-center gap-3">
                                                <Icon className="h-4 w-4 text-black/55" />
                                                {action.label}
                                            </span>
                                            <ArrowSquareOut className="h-4 w-4 text-black/35" />
                                        </a>
                                    );
                                }

                                return (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="flex items-center justify-between rounded-2xl border border-black/7 px-5 py-4 text-sm font-medium text-black transition hover:border-black/20 hover:bg-black/[0.02]"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className="h-4 w-4 text-black/55" />
                                            {action.label}
                                        </span>
                                        <ArrowSquareOut className="h-4 w-4 text-black/35" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-black/7 bg-black p-8 text-white">
                        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/40">Getting started checklist</p>
                        <div className="mt-6 space-y-4 text-sm text-white/65">
                            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <Database className="mt-0.5 h-4 w-4 text-white/70" />
                                Enable proxy generation for smoother playback.
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <CreditCard className="mt-0.5 h-4 w-4 text-white/70" />
                                Confirm your plan and device setup before long renders.
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <Lightning className="mt-0.5 h-4 w-4 text-white/70" />
                                Run your first full workflow from scan through export.
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/docs" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90">
                                Open docs
                            </Link>
                            <Link href="/features" className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                                Explore features
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[2rem] border border-black/7 bg-black/[0.02] p-8">
                    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/35">Subscription</p>
                    <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-black">{isPro ? 'Pro plan active' : 'Free trial active'}</h2>
                    <p className="mt-3 text-sm leading-7 text-black/60">
                        {isPro ? 'Your desktop workflow, downloads, and advanced tools are ready to use.' : 'Upgrade for deeper processing, a smoother production workflow, and expanded usage limits.'}
                    </p>
                    <Link href="/dashboard/billing" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-black transition hover:text-black/70">
                        Manage subscription
                        <ArrowSquareOut className="h-4 w-4" />
                    </Link>
                </div>

                <div className="rounded-[2rem] border border-black/7 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/35">Help and onboarding</p>
                    <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-black">Documentation and support are one click away.</h2>
                    <p className="mt-3 text-sm leading-7 text-black/60">
                        Use the guide for first-run onboarding, docs for technical references, support for troubleshooting, and features for capability details.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href="/guide" className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90">Guide</Link>
                        <Link href="/docs" className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:border-black/20 hover:bg-black/[0.03]">Docs</Link>
                        <Link href="/support" className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:border-black/20 hover:bg-black/[0.03]">Support</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
