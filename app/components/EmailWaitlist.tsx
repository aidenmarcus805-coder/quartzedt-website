'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, CircleNotch, WarningCircle, CaretDown } from '@phosphor-icons/react';

const GPU_OPTIONS = [
    "MacBook M1/M2/M3/M4/M5",
    "RTX 3060/4060 (8GB)",
    "RTX 4070/3080 (12GB)",
    "RTX 4080/4090 (16GB+)",
    "RTX 50 series",
    "AMD GPUs",
    "Other"
];

const WEDDINGS_OPTIONS = [
    "0-10",
    "11-20",
    "21-30",
    "30+",
    "Not a wedding filmmaker"
];

export default function EmailWaitlist() {
    const [email, setEmail] = useState('');
    const [gpu, setGpu] = useState('');
    const [weddings, setWeddings] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const isComplete = email && email.includes('@') && gpu && weddings;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isComplete) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, gpu, weddings }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong.');
            }

            setStatus('success');
            setEmail('');
            setGpu('');
            setWeddings('');
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md mx-auto text-center py-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
            >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">You're on the list</h3>
                <p className="text-white/50 text-sm">We'll be in touch as soon as a spot opens up.</p>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto relative">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading'}
                        placeholder="Email address"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-sans text-[15px] shadow-inner"
                        spellCheck={false}
                        required
                    />
                </div>

                <div className="relative">
                    <select
                        value={gpu}
                        onChange={(e) => setGpu(e.target.value)}
                        disabled={status === 'loading'}
                        className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-sans text-[15px] shadow-inner ${gpu ? 'text-white' : 'text-white/40'}`}
                        required
                    >
                        <option value="" disabled>What GPU are you editing on?</option>
                        {GPU_OPTIONS.map(opt => (
                            <option key={opt} value={opt} className="bg-neutral-900 text-white min-h-[40px] py-2">{opt}</option>
                        ))}
                    </select>
                    <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={weddings}
                        onChange={(e) => setWeddings(e.target.value)}
                        disabled={status === 'loading'}
                        className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-sans text-[15px] shadow-inner ${weddings ? 'text-white' : 'text-white/40'}`}
                        required
                    >
                        <option value="" disabled>Weddings shot per year?</option>
                        {WEDDINGS_OPTIONS.map(opt => (
                            <option key={opt} value={opt} className="bg-neutral-900 text-white">{opt}</option>
                        ))}
                    </select>
                    <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>

                <div className="flex items-center justify-between mt-3 px-1">
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {status === 'error' && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="text-xs text-red-500 flex items-center gap-1.5"
                                >
                                    <WarningCircle className="w-4 h-4" />
                                    {errorMessage}
                                </motion.p>
                            )}
                            {status === 'idle' && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xs text-white/30 flex items-center gap-2"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/30 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white/30"></span>
                                    </span>
                                    Limited availability
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="submit"
                        disabled={!isComplete || status === 'loading'}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] text-sm"
                    >
                        {status === 'loading' ? (
                            <CircleNotch className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                Request Access
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
