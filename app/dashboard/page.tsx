import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            name: true,
            email: true,
            image: true,
            createdAt: true,
            plan: true,
        }
    });

    if (!user) return null;

    const isPro = user.plan && user.plan !== 'free';
    const memberSince = new Date(user.createdAt);
    const monthsActive = Math.max(1, Math.round((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30)));

    return (
        <div className="min-h-full bg-white text-slate-900 selection:bg-slate-900 selection:text-white p-8 md:p-12 font-sans">
            <div className="max-w-4xl space-y-8 mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-slate-900 mb-1">
                        Welcome back{user.name && typeof user.name === 'string' ? `, ${user.name.split(' ')[0]}` : ''}.
                    </h1>
                    <p className="text-slate-400 text-sm font-normal">Dashboard overview of your Quartz account.</p>
                </div>

                {/* Stat Cards - Dense Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 transition-colors hover:border-slate-200">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">Plan</p>
                        <p className="text-xl font-medium text-slate-900 tracking-tight">{isPro ? 'Pro' : 'Free'}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-normal">{isPro ? 'Full Access' : 'Trialing'}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 transition-colors hover:border-slate-200">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">Duration</p>
                        <p className="text-xl font-medium text-slate-900 tracking-tight">{monthsActive}<span className="text-xs font-normal text-slate-400 ml-1">Months</span></p>
                        <p className="text-xs text-slate-400 mt-0.5 font-normal">Since {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 transition-colors hover:border-slate-200">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">Status</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <p className="text-xl font-medium text-slate-900 tracking-tight leading-none">Active</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 font-normal">Verified</p>
                    </div>
                </div>

                {/* Profile Card - Single Focus Column style */}
                <div className="bg-white border border-slate-100 rounded-xl overflow-hidden max-w-2xl shadow-sm">
                    <div className="px-5 h-12 flex items-center border-b border-slate-100 bg-slate-50/30">
                        <h2 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Profile Details</h2>
                    </div>
                    <div className="p-5 flex flex-col sm:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xl font-light text-slate-300 overflow-hidden flex-shrink-0 shadow-inner">
                            {user.image ? (
                                <Image 
                                    src={user.image} 
                                    alt="Avatar" 
                                    width={64} 
                                    height={64} 
                                    className="w-full h-full object-cover grayscale"
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <span>{user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                        </div>

                        {/* Fields */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 block">Identity</label>
                                <div className="text-sm font-normal text-slate-900">{user.name || <span className="text-slate-300 italic">Anonymous</span>}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 block">Contact</label>
                                <div className="text-sm font-normal text-slate-900">{user.email}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 block">Origin</label>
                                <div className="text-sm font-normal text-slate-500">
                                    {memberSince.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 block">License</label>
                                <div className="pt-0.5">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-tight ${isPro
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {isPro ? 'PRO' : 'FREE'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links / CTA */}
                {!isPro && (
                    <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 max-w-2xl shadow-lg">
                        <div className="text-center md:text-left">
                            <p className="font-medium text-base tracking-tight mb-0.5">Scale your studio with Pro.</p>
                            <p className="text-white/50 text-xs font-normal">Automated assembly and multi-seat sync.</p>
                        </div>
                        <Link
                            href="/pricing"
                            className="flex-shrink-0 px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/90 transition-colors"
                        >
                            Explore Pro
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
