import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Check, CreditCard, Receipt, shieldCheck } from "@phosphor-icons/react/dist/ssr";
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
        <div className="max-w-3xl py-10">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-[28px] font-semibold tracking-tight text-black mb-1">Billing</h1>
                <p className="text-black/40 text-[14px]">Manage your subscription, payment methods, and billing history.</p>
            </div>

            {/* Current Plan & Status */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden mb-6">
                <div className="p-8 border-b border-black/[0.05]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-xl font-semibold text-black tracking-tight">
                                    {isPro ? 'Quartz Pro' : 'Free Tier'}
                                </h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${isPro 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                    : 'bg-black/[0.04] text-black/40 border-black/[0.05]'}`}>
                                    {isPro ? 'Active' : 'Basic Access'}
                                </span>
                            </div>
                            <p className="text-black/50 text-[14px] max-w-md leading-relaxed">
                                {isPro
                                    ? 'You have full access to automated culling, multi-cam sync, and high-fidelity XML exports.'
                                    : 'Upgrade to unlock AI-powered scene detection, unlimited wedding exports, and team collaboration.'}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <CheckoutButton plan={currentPlan} />
                        </div>
                    </div>
                </div>

                <div className="bg-black/[0.01] p-8 grid md:grid-cols-2 gap-10">
                    {/* Features Column */}
                    <div>
                        <h3 className="text-[11px] font-bold text-black/30 uppercase tracking-[0.1em] mb-5">
                            {isPro ? 'Active Benefits' : 'Pro Benchmarks'}
                        </h3>
                        <ul className="space-y-3.5">
                            {PRICING_PLAN.features.slice(0, 5).map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className={`mt-0.5 rounded-full p-0.5 ${isPro ? 'bg-emerald-100/60 text-emerald-600' : 'bg-black/[0.05] text-black/30'}`}>
                                        <Check weight="bold" className="w-3.5 h-3.5" />
                                    </div>
                                    <span className={`text-[13.5px] leading-tight ${isPro ? 'text-black/80 font-medium' : 'text-black/50'}`}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Security & Support info */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-[11px] font-bold text-black/30 uppercase tracking-[0.1em] mb-5">Security & Payments</h3>
                            <div className="bg-white border border-black/[0.04] rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#F5F1E6] flex items-center justify-center">
                                         <CreditCard weight="fill" className="w-4 h-4 text-amber-900" />
                                    </div>
                                    <p className="text-[13px] font-semibold text-black">Creem Managed</p>
                                </div>
                                <p className="text-[12px] text-black/50 leading-relaxed mb-3">
                                    All payments are processed securely by Creem.io. We never store your credit card information on our servers.
                                </p>
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                                    <Check weight="bold" className="w-3 h-3" />
                                    Enterprise-grade encryption
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices Placeholder */}
            {isPro && (
                <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
                    <div className="px-6 py-4 border-b border-black/[0.05] flex items-center gap-2.5">
                        <Receipt weight="fill" className="w-4 h-4 text-black/30" />
                        <h2 className="text-[14px] font-semibold text-black">Billing History</h2>
                    </div>
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 bg-black/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Receipt className="w-6 h-6 text-black/20" />
                        </div>
                        <p className="text-[14px] font-medium text-black">No invoices yet</p>
                        <p className="text-[13px] text-black/40 mt-1">Your recent transactions will appear here.</p>
                    </div>
                </div>
            )}

            {/* Help / Footer */}
            <div className="mt-8 flex items-center justify-center gap-6">
                <p className="text-[12px] text-black/30">Questions about your plan?</p>
                <a href="mailto:support@quartz.ai" className="text-[12px] font-semibold text-black/60 hover:text-black transition-colors underline underline-offset-4 decoration-black/10">Contact Support</a>
            </div>
        </div>
    );
}
