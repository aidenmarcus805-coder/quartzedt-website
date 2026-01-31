'use client';

import { Check, CreditCard, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { PRICING_PLAN } from '../../lib/constants/pricing';

const PLANS = [
    {
        id: 'free',
        name: 'Free Trial',
        price: '$0',
        period: '7 days',
        description: 'Perfect for testing the waters.',
        features: ['7-day unlimited access', 'Watermarked exports', 'Basic support'],
        current: false,
    },
    {
        id: 'referral',
        name: 'Referral Pass',
        price: '$0',
        period: 'one-time',
        description: 'Special access for referred friends.',
        features: ['1 month unlimited access', 'No watermark', 'Priority support', 'One-time payment'],
        productId: 'prod_referral_Placeholder',
    },
    {
        id: 'pro',
        name: 'Pro Plan',
        price: `$${PRICING_PLAN.price}`,
        period: 'per month',
        description: 'For professional wedding filmmakers.',
        features: ['Unlimited exports', 'No watermark', 'Priority support', 'All AI features'],
        productId: PRICING_PLAN.creemProductIdMonthly,
        popular: true,
    },
    {
        id: 'annual',
        name: 'Annual Pass',
        price: `$${PRICING_PLAN.priceAnnual}`,
        period: 'per year',
        description: 'Best value for full-time studios.',
        features: ['2 months free', 'Unlimited exports', 'No watermark', 'Priority support'],
        productId: PRICING_PLAN.creemProductIdAnnual,
    }
];

export default function BillingPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const currentPlan = (session?.user as any)?.plan || 'free';

    const handleCheckout = async (productId: string) => {
        // ... (same logic as before)
        window.open(`https://creem.io/payment/${productId}?email=${session?.user?.email}`, '_blank');
    };

    return (
        <div className="space-y-16">
            <div className="space-y-2">
                <h1 className="font-display text-4xl font-light text-black">Subscription</h1>
                <p className="text-black/60 text-lg font-light">
                    Upgrade or manage your Quartz plan.
                </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative p-6 rounded-2xl border ${plan.popular ? 'border-black ring-1 ring-black/5' : 'border-black/10'} bg-white flex flex-col`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                                <span className="bg-black text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">Popular</span>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="font-medium text-lg mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-light">{plan.price}</span>
                                <span className="text-sm text-black/50">
                                    {plan.period === 'billed once' ? ' one-time' : `/${plan.period.includes(' ') ? plan.period.split(' ')[1] : plan.period}`}
                                </span>
                            </div>
                            <p className="text-sm text-black/50 mt-4 leading-relaxed">{plan.description}</p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-sm text-black/70">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleCheckout(plan.productId || '')}
                            disabled={plan.id === currentPlan || !plan.productId}
                            className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${plan.id === currentPlan
                                ? 'bg-black/5 text-black/30 cursor-default'
                                : plan.popular
                                    ? 'bg-black text-white hover:bg-black/90'
                                    : 'border border-black/10 hover:border-black/30'
                                }`}
                        >
                            {plan.id === currentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                        </button>
                    </div>
                ))}
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
