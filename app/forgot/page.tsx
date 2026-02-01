'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 antialiased relative overflow-hidden">
            {/* Background: Subtle gradient for "lighter" tone than the pure black signin */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_#111_0%,_#050505_100%)] opacity-80" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[400px] z-10"
            >
                {/* Branding */}
                <div className="text-center mb-12">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Quartz"
                            width={100}
                            height={25}
                            className="h-6 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity"
                        />
                    </Link>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-2xl">
                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-light tracking-tight">Reset Password</h1>
                                    <p className="text-sm text-white/40 font-light">
                                        Enter your email address and we&apos;ll send you a link to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative overflow-hidden rounded-xl bg-black/40 border border-white/[0.08] focus-within:border-white/20 transition-all h-12 flex items-center">
                                        <div className="absolute left-4">
                                            <Mail className="w-4 h-4 text-white/20" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-full bg-transparent pl-12 pr-4 text-sm font-light placeholder:text-white/10 focus:outline-none transition-all text-white/90"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-white text-black rounded-xl h-12 text-sm font-semibold hover:bg-[#eee] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </button>
                                </form>

                                <div className="text-center pt-2">
                                    <Link
                                        href="/signin"
                                        className="inline-flex items-center gap-2 text-xs text-white/20 hover:text-white/50 transition-colors tracking-tight"
                                    >
                                        <ArrowLeft className="w-3 h-3" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 text-center py-4"
                            >
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                                        <CheckCircle2 className="w-8 h-8 text-accent" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-xl font-light tracking-tight">Check your email</h2>
                                    <p className="text-sm text-white/40 font-light leading-relaxed">
                                        We&apos;ve sent a password reset link to <br />
                                        <span className="text-white/80 font-medium">{email}</span>
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <Link
                                        href="/signin"
                                        className="inline-flex items-center gap-2 text-xs text-white/20 hover:text-white/50 transition-colors tracking-tight"
                                    >
                                        <ArrowLeft className="w-3 h-3" />
                                        Return to Sign In
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
