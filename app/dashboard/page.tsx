import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

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
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-[42px] font-extralight tracking-[-0.04em] text-white leading-tight mb-2">
                    Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}.
                </h1>
                <p className="text-white/30 text-[15px] font-light">Your Quartz account at a glance.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.05] rounded-2xl p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20 mb-3">Plan</p>
                    <p className="text-[24px] font-light text-white tracking-tight">{isPro ? 'Pro' : 'Free'}</p>
                    <p className="text-[13px] text-white/30 mt-1 font-light">{isPro ? 'Unlimited Access' : 'Trialing Access'}</p>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.05] rounded-2xl p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20 mb-3">Active For</p>
                    <p className="text-[24px] font-light text-white tracking-tight">{monthsActive}<span className="text-[15px] font-extralight text-white/30 ml-1.5 whitespace-nowrap">Months</span></p>
                    <p className="text-[13px] text-white/30 mt-1 font-light">Since {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.05] rounded-2xl p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20 mb-3">Status</p>
                    <div className="flex items-center gap-2.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <p className="text-[24px] font-light text-white tracking-tight leading-none">Active</p>
                    </div>
                    <p className="text-[13px] text-white/30 mt-1 font-light">Verified Account</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl overflow-hidden mb-6">
                <div className="px-8 flex items-center h-16 border-b border-white/[0.04]">
                    <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-white/20">Profile Details</h2>
                </div>
                <div className="p-8 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-3xl font-extralight text-white/20 overflow-hidden flex-shrink-0 shadow-inner">
                        {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.image} alt="Avatar" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                        ) : (
                            <span>{user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                    </div>

                    {/* Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        <div>
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mb-2 block">Identity</label>
                            <div className="text-[16px] font-light text-white/90">{user.name || <span className="text-white/20 italic">Anonymous</span>}</div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mb-2 block">Communication</label>
                            <div className="text-[16px] font-light text-white/90">{user.email}</div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mb-2 block">Origin</label>
                            <div className="text-[16px] font-light text-white/50">
                                {memberSince.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mb-2 block">License</label>
                            <div className="pt-0.5">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium tracking-wide ${isPro
                                    ? 'bg-white text-black'
                                    : 'bg-white/[0.05] text-white/40'
                                    }`}>
                                    {isPro ? 'QUARTZ PRO' : 'FREE TIER'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            {!isPro && (
                <div className="bg-white text-black rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                    <div className="text-center md:text-left">
                        <p className="font-semibold text-[18px] tracking-tight mb-1">Scale your studio with Pro.</p>
                        <p className="text-black/50 text-[14px] font-light">Unlock automated project assembly and multi-seat licensing.</p>
                    </div>
                    <Link
                        href="/pricing"
                        className="flex-shrink-0 px-6 py-3 bg-black text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all duration-300"
                    >
                        Explore Pro
                    </Link>
                </div>
            )}
        </div>
    );
}
