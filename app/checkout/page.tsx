'use client';

import { motion } from 'framer-motion';
import { Check, ArrowLeft, CircleNotch, ShieldCheck, CreditCard, Lock } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Configuration
    const PLAN = {
        name: "Quartz Editor Pro",
        priceMonthly: 179,
        priceAnnual: 1790,
        lsVariantIdMonth: 'variant_monthly_id_placeholder',
        lsVariantIdYear: 'ad029df4-2bb2-45b2-bfa3-038e6938eb09', // Founding Member Annual
    };

    const currentPrice = billing === 'annual' ? PLAN.priceAnnual : PLAN.priceMonthly;
    const savings = billing === 'annual' ? Math.round(PLAN.priceMonthly * 12 - PLAN.priceAnnual) : 0;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin?next=/checkout');
        }
    }, [status, router]);

    const handleProceed = () => {
        setIsRedirecting(true);

        // Select variant
        const variantId = billing === 'annual' ? PLAN.lsVariantIdYear : PLAN.lsVariantIdMonth;
        // Fallback logic for placeholders
        const finalVariant = variantId.includes('placeholder') ? PLAN.lsVariantIdYear : variantId;

        // Construct Hosted Checkout URL (no embed)
        const checkoutUrl = `https://quartzedt.lemonsqueezy.com/checkout/buy/${finalVariant}?checkout[email]=${session?.user?.email || ''}&checkout[dark]=1`;

        // Hard redirect to payment provider
        window.location.href = checkoutUrl;
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <CircleNotch className="animate-spin text-white/20" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 selection:text-white flex flex-col">

            {/* Header */}
            <header className="w-full border-b border-white/5 bg-[#0a0a0a]">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-sm text-white/50 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft size={16} /> Cancel
                    </Link>
                    <div className="flex items-center gap-2">
                        <Lock size={12} className="text-emerald-500" />
                        <span className="text-xs font-medium text-white/70 uppercase tracking-wide">Secure Checkout</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-12 gap-12 lg:gap-20">

                {/* Left Col: Order Configuration */}
                <div className="md:col-span-7 space-y-10">
                    <div>
                        <h1 className="text-3xl font-light text-white mb-2">Order Summary</h1>
                        <p className="text-white/40">Review your plan details before proceeding.</p>
                    </div>

                    {/* Plan Selection Card */}
                    <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-start justify-between">
                            <div>
                                <h3 className="font-medium text-lg text-white">Quartz Pro License</h3>
                                <p className="text-sm text-white/50 mt-1">All-access pass to the platform.</p>
                            </div>
                            <div className="bg-white/5 px-3 py-1 rounded text-xs text-white/70">
                                Single User
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Toggle-like Selection */}
                            <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${billing === 'annual' ? 'bg-white/5 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="radio"
                                        name="billing"
                                        checked={billing === 'annual'}
                                        onChange={() => setBilling('annual')}
                                        className="w-4 h-4 accent-emerald-500 bg-transparent border-white/20"
                                    />
                                    <div>
                                        <span className="block font-medium text-white">Annual Billing</span>
                                        <span className="text-xs text-emerald-400">Best Value (Save ${(savings).toLocaleString()})</span>
                                    </div>
                                </div>
                                <span className="font-medium text-white/90">${PLAN.priceAnnual.toLocaleString()} <span className="text-white/40 font-normal">/yr</span></span>
                            </label>

                            <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${billing === 'monthly' ? 'bg-white/5 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="radio"
                                        name="billing"
                                        checked={billing === 'monthly'}
                                        onChange={() => setBilling('monthly')}
                                        className="w-4 h-4 accent-emerald-500 bg-transparent border-white/20"
                                    />
                                    <div>
                                        <span className="block font-medium text-white">Monthly Billing</span>
                                    </div>
                                </div>
                                <span className="font-medium text-white/90">${PLAN.priceMonthly} <span className="text-white/40 font-normal">/mo</span></span>
                            </label>
                        </div>
                    </div>

                    {/* Included Features */}
                    <div className="space-y-4 pt-4">
                        <h4 className="text-sm font-medium text-white/70 uppercase tracking-widest pl-1">Included in Pro</h4>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3 text-white/60">
                                <Check size={16} className="text-emerald-500" /> Unlimited Projects
                            </div>
                            <div className="flex items-center gap-3 text-white/60">
                                <Check size={16} className="text-emerald-500" /> Advanced AI Analysis
                            </div>
                            <div className="flex items-center gap-3 text-white/60">
                                <Check size={16} className="text-emerald-500" /> GPU Acceleration
                            </div>
                            <div className="flex items-center gap-3 text-white/60">
                                <Check size={16} className="text-emerald-500" /> 24/7 Priority Support
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Totals & Action */}
                <div className="md:col-span-5 relative">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 sticky top-8">
                        <h3 className="text-lg font-medium text-white mb-6">Payment Details</h3>

                        <div className="space-y-3 pb-6 border-b border-white/5 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-white/50">{PLAN.name}</span>
                                <span className="text-white">${currentPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-400/80 text-xs">
                                <span>Setup Fee</span>
                                <span>$0.00</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-6">
                            <span className="text-lg font-medium text-white">Total Due</span>
                            <div className="text-right">
                                <div className="text-3xl font-light text-white">${currentPrice.toLocaleString()}</div>
                                <div className="text-xs text-white/30 uppercase tracking-wide">USD</div>
                            </div>
                        </div>

                        <button
                            onClick={handleProceed}
                            disabled={isRedirecting}
                            className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mb-4"
                        >
                            {isRedirecting ? <CircleNotch className="animate-spin" size={18} /> : "Proceed to Payment"}
                        </button>

                        <div className="flex items-center justify-center gap-4 text-white/20 mb-6">
                            <ShieldCheck size={18} />
                            <CreditCard size={18} />
                            <Lock size={18} />
                        </div>

                        <p className="text-center text-white/30 text-xs leading-relaxed">
                            You will be redirected to our secure payment partner, Lemon Squeezy, to complete your purchase.
                            <br /><br />
                            Your subscription will start immediately after payment.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
}
