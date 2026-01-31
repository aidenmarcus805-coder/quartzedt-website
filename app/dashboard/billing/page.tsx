'use client';

import { Check, CreditCard, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { PRICING_PLAN } from '../../lib/constants/pricing';

export default function BillingPage() {
    const { data: session } = useSession();
    const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

    const price = billing === 'annual' ? PRICING_PLAN.priceAnnual : PRICING_PLAN.price;
    const period = billing === 'annual' ? 'year' : 'month';
    const productId = billing === 'annual' ? PRICING_PLAN.creemProductIdAnnual : PRICING_PLAN.creemProductIdMonthly;
    const priceSuffix = billing === 'annual' ? '/year' : '/month';

    const handleCheckout = () => {
        window.open(`https://creem.io/payment/${productId}?email=${session?.user?.email}`, '_blank');
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="font-display text-4xl font-light text-black">Subscription</h1>
                    <p className="text-black/60 text-lg font-light">
                        Upgrade or manage your Quartz plan.
                    </p>
                </div>

                {/* Minimal Billing Toggle */}
                <div className="flex items-center p-1 bg-black/[0.03] rounded-full border border-black/10 w-fit">
                    <button
                        onClick={() => setBilling('monthly')}
                        className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${billing === 'monthly' ? 'bg-white text-black font-medium shadow-sm border border-black/5' : 'text-black/40 hover:text-black'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBilling('annual')}
                        className={`px-6 py-2 rounded-full text-sm transition-all duration-300 flex items-center gap-2 ${billing === 'annual' ? 'bg-white text-black font-medium shadow-sm border border-black/5' : 'text-black/40 hover:text-black'}`}
                    >
                        Annual
                        <span className={`text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded ${billing === 'annual' ? 'bg-black/5 text-black' : 'bg-black/5 text-black/30'}`}>
                            -17%
                        </span>
                    </button>
                </div>
            </div>

            {/* Single Pro Card */}
            <div className="relative p-8 md:p-10 rounded-2xl border border-black ring-1 ring-black/5 bg-white overflow-hidden">
                {/* Popular Badge */}
                <div className="absolute top-0 right-0">
                    <div className="bg-black text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-bl-xl font-medium">
                        Pro Plan
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-6xl font-light tracking-tight text-black">${price}</span>
                                <span className="text-xl text-black/40">{priceSuffix}</span>
                            </div>
                            <p className="text-black/40 text-sm mt-3">
                                Billed {billing}, cancel anytime. Includes 7-day free trial.
                            </p>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full md:w-auto px-8 py-4 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/90 transition-all shadow-lg shadow-black/5"
                        >
                            Upgrade to Pro Plan
                        </button>
                    </div>

                    <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-black/5 pt-8 lg:pt-0 lg:pl-12">
                        <p className="text-sm font-medium text-black/90 uppercase tracking-widest mb-6">Everything you need</p>
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                            {PRICING_PLAN.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-[15px] text-black/70">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Refer a Friend Section */}
            <div className="p-8 rounded-2xl border border-black/10 bg-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 flex-1">
                    <h3 className="font-display text-xl text-black">Give One Month Free</h3>
                    <p className="text-black/60 font-light">
                        Share Quartz with a friend. They get a 1-month Referral Pass for free when they sign up with your link.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto bg-black/[0.02] p-2 rounded-xl border border-black/5">
                    <code className="px-3 text-sm text-black/60 font-mono truncate max-w-[200px] md:max-w-[300px]">
                        quartzeditor.com/referral?code={(session?.user as any)?.email?.split('@')[0] || 'your-code'}
                    </code>
                    <button
                        onClick={() => {
                            const code = (session?.user as any)?.email?.split('@')[0] || 'your-code';
                            navigator.clipboard.writeText(`https://quartzeditor.com/referral?code=${code}`);
                        }}
                        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/90 transition-colors shrink-0"
                    >
                        Copy Link
                    </button>
                </div>
            </div>

            <div className="p-6 rounded-xl bg-black/[0.02] border border-black/5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-black/50" />
                    <span className="text-black/60">Payments are securely processed by Creem.io. canceling is easy.</span>
                </div>
                <a href="mailto:support@quartzeditor.com" className="text-black/60 hover:text-black hover:underline"> Need help?</a>
            </div>
        </div >
    );
}
