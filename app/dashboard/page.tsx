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
        <div className="max-w-3xl py-10">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-[28px] font-semibold tracking-tight text-black mb-1">
                    Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}.
                </h1>
                <p className="text-black/40 text-[14px]">Here's an overview of your Quartz account.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-white border border-black/[0.06] rounded-2xl p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-black/30 mb-2">Plan</p>
                    <p className="text-[22px] font-semibold text-black tracking-tight">{isPro ? 'Pro' : 'Free'}</p>
                    <p className="text-[12px] text-black/40 mt-1">{isPro ? 'Full access' : 'Limited access'}</p>
                </div>
                <div className="bg-white border border-black/[0.06] rounded-2xl p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-black/30 mb-2">Member For</p>
                    <p className="text-[22px] font-semibold text-black tracking-tight">{monthsActive}<span className="text-sm font-normal text-black/40 ml-1">mo</span></p>
                    <p className="text-[12px] text-black/40 mt-1">Since {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="bg-white border border-black/[0.06] rounded-2xl p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-black/30 mb-2">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <p className="text-[22px] font-semibold text-black tracking-tight leading-none">Active</p>
                    </div>
                    <p className="text-[12px] text-black/40 mt-1">Account in good standing</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden mb-4">
                <div className="px-7 py-5 border-b border-black/[0.05] flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-black">Personal Information</h2>
                </div>
                <div className="p-7 flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-2xl font-medium text-black/40 overflow-hidden flex-shrink-0">
                        {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                    </div>

                    {/* Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[11px] font-semibold text-black/35 uppercase tracking-wider mb-1.5 block">Full Name</label>
                            <div className="text-[15px] font-medium text-black/90">{user.name || <span className="text-black/30 italic">Not provided</span>}</div>
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-black/35 uppercase tracking-wider mb-1.5 block">Email Address</label>
                            <div className="text-[15px] font-medium text-black/90">{user.email}</div>
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-black/35 uppercase tracking-wider mb-1.5 block">Member Since</label>
                            <div className="text-[15px] font-medium text-black/70">
                                {memberSince.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-black/35 uppercase tracking-wider mb-1.5 block">Subscription</label>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium ${isPro
                                ? 'bg-black text-white'
                                : 'bg-black/[0.06] text-black/60'
                                }`}>
                                {isPro ? 'Pro Plan' : 'Free Tier'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            {!isPro && (
                <div className="bg-black rounded-2xl p-6 flex items-center justify-between">
                    <div>
                        <p className="text-white font-semibold text-[15px] mb-1">Upgrade to Pro</p>
                        <p className="text-white/50 text-[13px]">Get full access to AI culling, audio sync, and XML export.</p>
                    </div>
                    <Link
                        href="/pricing"
                        className="flex-shrink-0 ml-6 px-5 py-2.5 bg-white text-black text-[13px] font-semibold rounded-xl hover:bg-white/90 transition-colors"
                    >
                        View Plans →
                    </Link>
                </div>
            )}
        </div>
    );
}
