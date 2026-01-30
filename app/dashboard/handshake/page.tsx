'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Copy, Check, ArrowRight } from 'lucide-react';

import { Suspense } from 'react';

function HandshakeContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [copied, setCopied] = useState(false);
    const [hasAttemptedLink, setHasAttemptedLink] = useState(false);

    useEffect(() => {
        if (token && !hasAttemptedLink) {
            // Attempt to open the deep link
            window.location.href = `autocut://auth?token=${token}`;
            setHasAttemptedLink(true);
        }
    }, [token, hasAttemptedLink]);

    const handleCopy = () => {
        if (token) {
            navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <p className="text-white/40 font-mono text-sm">No token provided.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 antialiased relative overflow-hidden">

            {/* Background: Vignette */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] opacity-60" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[400px] z-10 flex flex-col items-center text-center"
            >
                {/* Branding */}
                <Link href="/" className="mb-12 opacity-80 hover:opacity-100 transition-opacity">
                    <Image
                        src="/logo.png"
                        alt="Quartz"
                        width={100}
                        height={25}
                        className="h-6 w-auto brightness-[0.8]"
                    />
                </Link>

                <div className="space-y-6 w-full">
                    <div className="space-y-2">
                        <h1 className="text-xl font-medium tracking-tight text-white">
                            Connecting to Quartz...
                        </h1>
                        <p className="text-sm text-white/40 leading-relaxed max-w-[280px] mx-auto">
                            If the app didn't open automatically, copy the code below and paste it into the editor.
                        </p>
                    </div>

                    {/* Token Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                        <div className="relative bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-3">

                            <div className="flex items-center justify-between gap-4 bg-[#050505] rounded-lg px-3 py-2 border border-white/[0.04]">
                                <code className="font-mono text-[11px] text-white/70 truncate tracking-wide">
                                    {token}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white"
                                >
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div
                                                key="check"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                            >
                                                <Check className="w-3.5 h-3.5 text-green-500" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="copy"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/20 font-medium uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                Valid for 10 minutes
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 w-full">
                        <a
                            href={`autocut://auth?token=${token}`}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-4"
                        >
                            Open Quartz <ArrowRight className="w-4 h-4" />
                        </a>
                        <p className="text-[11px] text-white/20">
                            Automatic redirect blocked by browser? Click the button above.
                        </p>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}

export default function HandshakePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white/5 animate-spin" />
            </div>
        }>
            <HandshakeContent />
        </Suspense>
    );
}
