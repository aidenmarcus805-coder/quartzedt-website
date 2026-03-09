import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Check } from "@phosphor-icons/react/dist/ssr";
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
        <div className="max-w-3xl">
            <h1 className="text-3xl font-medium tracking-tight mb-2">Billing</h1>
            <p className="text-black/50 mb-10">Manage your subscription, payment methods, and billing history.</p>

            {/* Current Plan Card */}
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden mb-6">
                <div className="p-8 border-b border-black/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-xl font-medium text-black">
                                    {isPro ? 'Pro Plan' : 'Free Plan'}
                                </h2>
                                {isPro && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200">
                                        Active
                                    </span>
                                )}
                            </div>
                            <p className="text-black/50 text-sm">
                                {isPro
                                    ? 'You are currently on the Pro plan with full access to all features.'
                                    : 'You are on the free tier. Upgrade to unlock AI scene detection and unlimited exports.'}
                            </p>
                        </div>

                        <CheckoutButton plan={currentPlan} />
                    </div>
                </div>

                {/* Plan Details Grid */}
                <div className="bg-black/[0.02] p-8 grid sm:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-4">
                            {isPro ? 'Your Features' : 'Pro Features'}
                        </h3>
                        <ul className="space-y-3">
                            {PRICING_PLAN.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className={`mt-0.5 rounded-full p-0.5 ${isPro ? 'bg-emerald-100 text-emerald-600' : 'bg-black/5 text-black/40'}`}>
                                        <Check weight="bold" className="w-3 h-3" />
                                    </div>
                                    <span className={`text-sm ${isPro ? 'text-black/80' : 'text-black/60'}`}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-4">Payment Information</h3>
                        {isPro ? (
                            <div className="text-sm text-black/60 space-y-2">
                                <p>Your subscription is billed securely via Creem.io.</p>
                                <p>Auto-renews at ${PRICING_PLAN.price}/mo unless cancelled.</p>
                            </div>
                        ) : (
                            <div className="text-sm text-black/60">
                                You currently have no active payment methods associated with your account.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
