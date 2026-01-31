'use client';

import { motion } from 'framer-motion';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');
    const [isLoading, setIsLoading] = useState(false);

    // Pricing config (mirroring pricing page for now)
    const PLAN = {
        price: 179,
        priceAnnual: 1790, // $149/mo technically if annual? using logic from pricing page
        lsVariantIdMonth: 'variant_monthly_id_placeholder',
        lsVariantIdYear: 'ad029df4-2bb2-45b2-bfa3-038e6938eb09', // Founding Member Annual
    };

    const price = billing === 'annual' ? PLAN.priceAnnual : PLAN.price;
    const period = billing === 'annual' ? 'year' : 'mo';

    // Effective cost per month for display
    const costPerMonth = billing === 'annual' ? Math.round(PLAN.priceAnnual / 12) : PLAN.price;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin?next=/checkout');
        }
    }, [status, router]);

    const handleCheckout = () => {
        setIsLoading(true);
        // In real app, toggle based on billing state
        const variantId = billing === 'annual' ? PLAN.lsVariantIdYear : PLAN.lsVariantIdMonth;

        // Fallback to the one we know exists if others are missing
        const finalVariant = variantId.includes('placeholder') ? PLAN.lsVariantIdYear : variantId;

        const checkoutUrl = `https://quartzedt.lemonsqueezy.com/checkout/buy/${finalVariant}?checkout[email]=${session?.user?.email || ''}&embed=1&checkout[dark]=1`;

        if (window.LemonSqueezy) {
            window.LemonSqueezy.Url.Open(checkoutUrl);
            setIsLoading(false); // Overlay opens, stop spinner
        } else {
            window.open(checkoutUrl, '_blank');
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <Loader2 className="animate-spin text-white/20" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20 selection:text-white overflow-hidden flex flex-col">

            {/* Simple Header */}
            <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10 w-full max-w-[1200px] mx-auto">
                <Link href="/" className="text-sm text-white/50 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                <div className="text-sm text-white/30 hidden md:block">
                    Logged in as <span className="text-white/70">{session?.user?.email}</span>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-4xl px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">

                    {/* Left Column: Value Prop */}
                    <div className="space-y-8">
                        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-white mb-6">
                            Upgrade to <br />
                            <span className="text-white">Pro.</span>
                        </h1>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-lg text-white/80">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                    <Check size={14} />
                                </div>
                                Unlimited Export Projects
                            </div>
                            <div className="flex items-center gap-3 text-lg text-white/80">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                    <Check size={14} />
                                </div>
                                Hardware Acceleration (GPU)
                            </div>
                            <div className="flex items-center gap-3 text-lg text-white/80">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                    <Check size={14} />
                                </div>
                                Priority Support
                            </div>
                            <div className="flex items-center gap-3 text-lg text-white/80">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                    <Check size={14} />
                                </div>
                                Commercial License
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111] border border-white/10 rounded-2xl p-8 relative shadow-2xl"
                    >
                        {/* Toggle */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-white/5 p-1 rounded-full flex text-sm">
                                <button
                                    onClick={() => setBilling('monthly')}
                                    className={`px-4 py-1.5 rounded-full transition-all ${billing === 'monthly' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBilling('annual')}
                                    className={`px-4 py-1.5 rounded-full transition-all ${billing === 'annual' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
                                >
                                    Yearly
                                </button>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-1">
                                <span className="text-5xl font-light text-white">${costPerMonth}</span>
                                <span className="text-white/40 text-lg">/mo</span>
                            </div>
                            {billing === 'annual' && (
                                <p className="text-emerald-400 text-xs mt-2 font-medium bg-emerald-400/10 inline-block px-2 py-1 rounded">Billed ${PLAN.priceAnnual} yearly (Save 17%)</p>
                            )}
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="w-full py-4 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Unlock Pro Access"}
                        </button>

                        <p className="text-center text-white/20 text-xs mt-4">
                            Secure checkout via Lemon Squeezy.
                        </p>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
