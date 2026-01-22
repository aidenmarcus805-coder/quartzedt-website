'use client';

import { Check, CreditCard, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

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
        id: 'pro',
        name: 'Pro Plan',
        price: '$49',
        period: 'per month',
        description: 'For professional wedding filmmakers.',
        features: ['Unlimited exports', 'No watermark', 'Priority support', 'All AI features'],
        productId: 'prod_founding_GF7xl',
        popular: true,
    },
    {
        id: 'annual',
        name: 'Annual Pass',
        price: '$490',
        period: 'per year',
        description: 'Best value for full-time studios.',
        features: ['2 months free', 'Unlimited exports', 'No watermark', 'Priority support'],
        productId: 'prod_annual_XYZ',
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
                <p className="text-black/50 text-lg font-light">
                    Upgrade or manage your Quartz plan.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative p-8 rounded-2xl border ${plan.popular ? 'border-black ring-1 ring-black/5' : 'border-black/10'} bg-white flex flex-col`}
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
                                <span className="text-sm text-black/40">/{plan.period.split(' ')[1]}</span>
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

            <div className="p-6 rounded-xl bg-black/[0.02] border border-black/5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-black/40" />
                    <span className="text-black/60">Payments are securely processed by Creem.io. canceling is easy.</span>
                </div>
                <a href="mailto:support@quartzeditor.com" className="text-black/60 hover:text-black hover:underline"> Need help?</a>
            </div>
        </div>
    );
}
