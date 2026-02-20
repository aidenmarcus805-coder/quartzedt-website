'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Check, ArrowRight } from '@phosphor-icons/react';

export default function SuccessPage() {
    useEffect(() => {
        // Attempt to open the desktop app automatically
        // We use a small timeout to allow the page to render first
        setTimeout(() => {
            window.location.href = 'autocut://success';
        }, 1000);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-sans selection:bg-white/20 selection:text-white">
            <div className="max-w-md w-full p-8 md:p-12 bg-[#111] border border-white/10 rounded-2xl text-center shadow-2xl">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-green-500/20">
                    <Check className="w-10 h-10 text-green-400" />
                </div>

                <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4 text-white">Payment Successful</h1>

                <p className="text-white/40 text-lg mb-10 leading-relaxed">
                    Your license has been activated successfully. Redirecting you back to the app...
                </p>

                <div className="space-y-4">
                    <a
                        href="autocut://success"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                    >
                        Open Quartz <ArrowRight className="w-4 h-4" />
                    </a>

                    <Link
                        href="/dashboard"
                        className="block py-4 text-sm text-white/30 hover:text-white transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
