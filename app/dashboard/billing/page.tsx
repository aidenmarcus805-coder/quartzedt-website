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
        <div className="max-w-4xl space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-1">Billing</h1>
                <p className="text-white/30 text-sm font-normal">Manage subscription and secure payments.</p>
            </div>

            {/* Current Plan & Status - Tightened */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden max-w-2xl">
                <div className="p-6 border-b border-white/[0.04] bg-white/[0.01]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-xl font-medium text-white tracking-tight">
                                    {isPro ? 'Quartz Pro' : 'Quartz Free'}
                                </h2>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${isPro 
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-white/[0.05] text-white/40 border-white/[0.1]'}`}>
                                    {isPro ? 'ACTIVE' : 'BASELINE'}
                                </span>
                            </div>
                            <p className="text-white/40 text-[13px] leading-relaxed font-normal">
                                {isPro
                                    ? 'Studio-grade autonomous editing is active.'
                                    : 'Baseline analytics and basic ingest enabled.'}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <CheckoutButton plan={currentPlan} />
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Features Column */}
                    <div>
                        <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-4">
                            Capabilities
                        </h3>
                        <ul className="space-y-2.5">
                            {PRICING_PLAN.features.slice(0, 5).map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <Check weight="bold" className={`w-3 h-3 mt-1 flex-shrink-0 ${isPro ? 'text-white' : 'text-white/20'}`} />
                                    <span className={`text-xs leading-tight font-normal ${isPro ? 'text-white/80' : 'text-white/40'}`}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Security Column */}
                    <div>
                        <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-4">Security</h3>
                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2.5">
                                <ShieldCheck weight="fill" className="w-4 h-4 text-white/40" />
                                <p className="text-xs font-medium text-white/80">Creem Protected</p>
                            </div>
                            <p className="text-[11px] text-white/30 leading-relaxed font-normal">
                                PCI Level 1 encrypted payment processing. No data stored locally.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices - Dense List */}
            {isPro && (
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden max-w-2xl">
                    <div className="px-5 h-12 flex items-center border-b border-white/[0.04] bg-white/[0.01]">
                        <h2 className="text-[10px] font-mono uppercase tracking-wider text-white/20">Billing History</h2>
                    </div>
                    <div className="p-8 text-center bg-transparent">
                        <Receipt weight="light" className="w-6 h-6 text-white/10 mx-auto mb-3" />
                        <p className="text-xs font-normal text-white/40">No payment records found.</p>
                    </div>
                </div>
            )}

            {/* Support */}
            <div className="pt-4 flex flex-col items-start gap-3 max-w-2xl">
                <p className="text-[11px] text-white/20 font-normal italic">Enterprise or multi-studio billing?</p>
                <a href="mailto:support@quartz.ai" className="text-[11px] font-medium text-white/30 hover:text-white transition-colors underline underline-offset-4 decoration-white/10">
                    Contact Enterprise Support
                </a>
            </div>
        </div>
    );
}
