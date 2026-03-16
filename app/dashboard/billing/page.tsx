import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Check, CreditCard, Receipt, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import CheckoutButton from "./CheckoutButton";
import { PRICING_PLAN } from "@/app/lib/constants/pricing";

export default async function BillingPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { plan: true }
    });

    const currentPlan = user?.plan || 'free';
    const isPro = currentPlan !== 'free';

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-[42px] font-extralight tracking-[-0.04em] text-white leading-tight mb-2">Billing</h1>
                <p className="text-white/30 text-[15px] font-light">Manage your subscription, secure payments, and invoices.</p>
            </div>

            {/* Current Plan & Status */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden mb-8">
                <div className="p-10 border-b border-white/[0.04]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <h2 className="text-2xl font-light text-white tracking-tight">
                                    {isPro ? 'Quartz Pro' : 'Quartz Free'}
                                </h2>
                                <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border ${isPro 
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-white/[0.05] text-white/40 border-white/[0.1]'}`}>
                                    {isPro ? 'Active Subscription' : 'Baseline Access'}
                                </span>
                            </div>
                            <p className="text-white/40 text-[15px] max-w-[500px] leading-relaxed font-light">
                                {isPro
                                    ? 'Studio-grade autonomous editing is active. You have full access to intelligent culling and multi-seat sync.'
                                    : 'Baseline analytics and basic ingest are enabled. Upgrade to unlock the full Quartz autonomous engine.'}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <CheckoutButton plan={currentPlan} />
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.01] p-10 grid md:grid-cols-2 gap-16">
                    {/* Features Column */}
                    <div>
                        <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mb-6">
                            Included in {isPro ? 'Pro' : 'Baseline'}
                        </h3>
                        <ul className="space-y-4">
                            {PRICING_PLAN.features.slice(0, 5).map((feature, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className={`mt-0.5 rounded-full p-0.5 ${isPro ? 'text-white' : 'text-white/20'}`}>
                                        <Check weight="bold" className="w-3.5 h-3.5" />
                                    </div>
                                    <span className={`text-[14px] leading-tight font-light ${isPro ? 'text-white/80' : 'text-white/40'}`}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Security & Support info */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mb-6">Payments & Security</h3>
                            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                                         <ShieldCheck weight="fill" className="w-5 h-5 text-white/50" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-medium text-white/90">Creem Protected</p>
                                        <p className="text-[11px] text-white/30 tracking-wide uppercase mt-0.5">Level 1 PCI Compliant</p>
                                    </div>
                                </div>
                                <p className="text-[13px] text-white/40 leading-relaxed mb-4 font-light">
                                    Quartz uses Creem for secure, encrypted payment processing. Your sensitive data never touches our infrastructure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices */}
            {isPro && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden">
                    <div className="px-8 flex items-center h-16 border-b border-white/[0.04]">
                        <Receipt weight="fill" className="w-4 h-4 text-white/20 mr-2.5" />
                        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-white/20">Billing History</h2>
                    </div>
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-5 border border-white/[0.05]">
                            <Receipt className="w-7 h-7 text-white/10" />
                        </div>
                        <p className="text-[15px] font-light text-white/60">No payment records found.</p>
                        <p className="text-[13px] text-white/20 mt-1.5 font-light">Invoices will appear here once your cycle begins.</p>
                    </div>
                </div>
            )}

            {/* Support Footer */}
            <div className="mt-12 flex flex-col items-center gap-4 text-center">
                <p className="text-[13px] text-white/20 font-light italic">Need a custom enterprise license or multi-studio billing?</p>
                <a href="mailto:support@quartz.ai" className="px-6 py-2 border border-white/10 rounded-full text-[12px] font-medium text-white/40 hover:text-white hover:border-white/30 transition-all duration-300 tracking-wide">
                    Contact Enterprise Support
                </a>
            </div>
        </div>
    );
}
