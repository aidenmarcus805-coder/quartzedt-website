'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function SuccessPage() {
    useEffect(() => {
        // Attempt to open the desktop app automatically
        setTimeout(() => {
            window.location.href = 'autocut://success';
        }, 1000);
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center text-[#171717] font-sans selection:bg-[#E5E5E5] selection:text-[#171717]">
            <div className="max-w-md w-full p-12 bg-white border border-[#E5E5E5] rounded-[20px] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                {/* 1. Status Indicator (Minimal/No Icon) */}
                <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center mx-auto mb-8 border border-black/5">
                    <span className="text-[20px] font-sans font-medium text-[#171717]">✓</span>
                </div>

                {/* 2. Message */}
                <h1 className="text-[28px] md:text-[32px] font-sans font-medium tracking-tight mb-4 text-[#171717] leading-tight">
                    Payment <br />Successful
                </h1>

                <p className="text-[#57534E] text-[15px] mb-10 leading-relaxed max-w-[280px] mx-auto">
                    Your license is active. Redirecting you back to Quartz...
                </p>

                {/* 3. Actions */}
                <div className="space-y-4">
                    <a
                        href="autocut://success"
                        className="flex items-center justify-center gap-2 w-full h-[52px] bg-[#050504] text-[#FAF9F6] font-semibold rounded-xl hover:scale-[1.02] transition-transform shadow-md text-[15px]"
                    >
                        Open Quartz
                    </a>

                    <Link
                        href="/"
                        className="block py-4 text-[13px] text-[#A8A29E] hover:text-[#050504] transition-colors font-medium tracking-[0.05em] uppercase"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
