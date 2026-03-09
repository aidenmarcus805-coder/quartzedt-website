'use client';

import { useState } from 'react';
import { PRICING_PLAN } from '@/app/lib/constants/pricing';

export default function CheckoutButton({ plan }: { plan: string }) {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: PRICING_PLAN.creemProductIdMonthly
                })
            });

            if (!res.ok) throw new Error('Checkout failed');

            const { url } = await res.json();
            if (url) {
                window.location.href = url;
            } else {
                alert('Something went wrong initiating checkout.');
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            alert('Error starting checkout. Please try again.');
            setLoading(false);
        }
    };

    if (plan !== 'free') {
        return (
            <button
                className="px-6 py-2.5 bg-black/5 hover:bg-black/10 text-black font-medium text-sm rounded-xl transition-colors w-full sm:w-auto"
                onClick={() => alert("Please contact support to manage or cancel your subscription.")}
            >
                Manage Subscription
            </button>
        );
    }

    return (
        <button
            onClick={handleUpgrade}
            disabled={loading}
            className="px-6 py-2.5 bg-black text-white hover:bg-black/80 font-medium text-sm rounded-xl shadow-lg transition-colors w-full sm:w-auto disabled:opacity-50 flex items-center justify-center gap-2"
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {loading ? 'Redirecting...' : 'Upgrade to Pro'}
        </button>
    );
}
