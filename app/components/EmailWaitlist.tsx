'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';

export default function EmailWaitlist() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong.');
            }

            setStatus('success');
            setEmail('');
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="relative flex items-center">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading' || status === 'success'}
                        placeholder="Enter your email for access"
                        className="w-full bg-transparent text-white placeholder:text-white/20 border-b border-white/20 py-4 pr-12 text-lg font-light focus:outline-none focus:border-white transition-all duration-300 disabled:opacity-50 font-sans"
                        spellCheck={false}
                    />

                    <div className="absolute right-0 top-0 bottom-0 flex items-center">
                        <AnimatePresence mode="popLayout">
                            {status === 'idle' && (
                                <motion.button
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    type="submit"
                                    disabled={!email}
                                    className="text-white hover:text-white/70 disabled:opacity-0 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            )}

                            {status === 'loading' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="text-white/50"
                                >
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </motion.div>
                            )}

                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="text-emerald-500"
                                >
                                    <Check className="w-5 h-5" />
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    type="button"
                                    onClick={() => setStatus('idle')}
                                    className="text-red-500 hover:text-red-400 transition-colors"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </form>

            {/* Status Messages */}
            <div className="absolute top-full left-0 mt-3 w-full h-6 overflow-hidden">
                <AnimatePresence mode="wait">
                    {status === 'success' && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-xs text-emerald-500/80 font-mono tracking-wide uppercase"
                        >
                            You're on the list. We'll be in touch.
                        </motion.p>
                    )}

                    {status === 'error' && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-xs text-red-500/80 font-mono tracking-wide uppercase"
                        >
                            {errorMessage}
                        </motion.p>
                    )}

                    {status === 'idle' && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-white/20 font-mono tracking-wide uppercase"
                        >
                            Limited Availability
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
