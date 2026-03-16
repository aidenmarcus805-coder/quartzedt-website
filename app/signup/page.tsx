'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import Image from 'next/image';
import Link from 'next/link';
import { CircleNotch, EnvelopeSimple, LockSimple, User } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

function SignUpContent() {
    const searchParams = useSearchParams();
    const isDesktopFlow = searchParams.get('desktop') === 'true';
    const callbackUrl = searchParams.get('callbackUrl') || (isDesktopFlow ? '/api/desktop/token' : '/');

    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState<1 | 2>(1);
    const [error, setError] = useState<string | null>(null);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<'name' | 'email' | 'password' | 'confirmPassword' | null>(null);

    const handleGoogleSignIn = async () => {
        setIsLoading('google');
        setError(null);
        try {
            await signIn('google', { callbackUrl });
        } catch {
            setError('Connection failed.');
            setIsLoading(null);
        }
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            setError('Please enter your full name.');
            return;
        }
        if (!email) {
            setError('Please enter an email address.');
            return;
        }
        setError(null);
        setStep(2);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!turnstileToken) {
            setError('Please complete the captcha.');
            return;
        }

        setIsLoading('credentials');
        setError(null);

        try {
            // For now, we use the same credentials provider.
            // In a real app, you might have a dedicated /api/register endpoint.
            // Based on auth.ts, the credentials provider auto-creates users.
            const result = await signIn('credentials', {
                email,
                password,
                name, // Passing name though auth.ts might need updating to handle it if it doesn't already
                turnstileToken,
                redirect: false,
                callbackUrl
            });

            if (result?.error) {
                setError(result.error === 'CredentialsSignin' ? 'Invalid credentials.' : result.error);
                setIsLoading(null);
            } else {
                window.location.href = callbackUrl;
            }
        } catch {
            setError('Internal error.');
            setIsLoading(null);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center bg-[#FAF9F6] overflow-hidden font-sans">
            <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0px 1000px white inset !important;
          -webkit-text-fill-color: #333 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        ::selection {
          background-color: rgba(0, 0, 0, 0.1);
          color: #000;
        }
        input::selection {
          background-color: rgba(0, 0, 0, 0.15);
          color: inherit;
        }
      `}</style>

            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
                <Image
                    src="/signBG.jpg"
                    alt="Abstract background"
                    fill
                    priority
                    className="object-cover opacity-60"
                    style={{ objectPosition: '75% center' }}
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
                {/* Left Side: Logo and Title */}
                <div className="flex-1 hidden md:flex flex-col text-white max-w-[420px]">
                    <div className="flex items-center gap-3 mb-0.5">
                        <Link href="/" className="transition-opacity hover:opacity-80">
                            <Image
                                src="/logo.png"
                                alt="Quartz logo"
                                width={180}
                                height={45}
                                className="h-10 w-auto select-none object-contain"
                            />
                        </Link>
                    </div>
                    <h2 className="text-[16px] font-medium tracking-wide text-white/80 leading-tight">
                        Create an account to get started
                    </h2>
                </div>

                {/* Right Side: Auth Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-[440px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10 text-gray-900 mx-auto md:mx-0 flex flex-col pt-10 pb-8 px-10 ring-1 ring-black/5"
                >
                    <div className="flex-1">
                        <h1 className="text-[32px] font-bold mb-2 tracking-tight text-[#222222] font-display">Sign up</h1>
                        <p className="text-[14px] text-gray-500 mb-8">
                            Already have an account? <Link href="/signin" className="text-gray-800 hover:text-black underline decoration-gray-200 underline-offset-4 font-medium transition-colors">Sign in</Link>
                        </p>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 text-red-600 text-[13px] p-3 rounded-md mb-6 font-medium border border-red-100"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={step === 1 ? handleContinue : handleSignUp} className="mb-2">
                            <div className="relative overflow-hidden">
                                <AnimatePresence initial={false} mode="wait">
                                    {step === 1 ? (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-1.5 relative">
                                                <label className="block text-[12px] font-medium text-gray-700 ml-1">Full Name</label>
                                                <div className="relative flex items-center">
                                                    <AnimatePresence>
                                                        {focusedField === 'name' && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 2 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 2 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute right-4 text-gray-400 pointer-events-none z-10"
                                                            >
                                                                <User size={18} weight="regular" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onFocus={() => setFocusedField('name')}
                                                        onBlur={() => setFocusedField(null)}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full h-[46px] border border-gray-300 rounded-lg px-4 text-[15px] focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                                                        required
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 relative">
                                                <label className="block text-[12px] font-medium text-gray-700 ml-1">Email address</label>
                                                <div className="relative flex items-center">
                                                    <AnimatePresence>
                                                        {focusedField === 'email' && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 2 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 2 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute right-4 text-gray-400 pointer-events-none z-10"
                                                            >
                                                                <EnvelopeSimple size={18} weight="regular" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onFocus={() => setFocusedField('email')}
                                                        onBlur={() => setFocusedField(null)}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full h-[46px] border border-gray-300 rounded-lg px-4 text-[15px] focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                                                        required
                                                        placeholder="name@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-2">
                                                <button
                                                    type="submit"
                                                    className="bg-[#0266F2] hover:bg-[#0052C2] text-white rounded-full px-8 py-2.5 text-[15px] font-bold transition-all duration-200 shadow-none active:scale-95"
                                                >
                                                    Continue
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3 my-2">
                                                <div className="flex-1 h-px bg-gray-200"></div>
                                                <span className="text-[13px] text-gray-500 font-light">Or</span>
                                                <div className="flex-1 h-px bg-gray-200"></div>
                                            </div>

                                            <div className="space-y-3">
                                                <button
                                                    type="button"
                                                    onClick={handleGoogleSignIn}
                                                    disabled={!!isLoading}
                                                    className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full h-11 hover:bg-gray-50 transition-colors"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 18 18">
                                                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                                                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                                                        <path d="M3.964 10.711c-.18-.54-.282-1.117-.282-1.711 0-.594.102-1.17.282-1.711V4.957H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.043l3.007-2.332z" fill="#FBBC05" />
                                                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.957L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                                                    </svg>
                                                    <span className="text-[14px] font-medium text-[#222222]">Sign up with Google</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-1 mb-2">
                                                <label className="block text-[12px] font-medium text-gray-600 ml-1">Account details</label>
                                                <div className="grid grid-cols-1 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 italic">
                                                    <span className="text-[13px] text-gray-600 font-medium truncate">{name}</span>
                                                    <span className="text-[13px] text-gray-400 truncate">{email}</span>
                                                    <button type="button" onClick={() => { setStep(1); setError(null); }} className="text-[12px] text-gray-800 font-medium hover:text-black underline decoration-gray-200 underline-offset-4 transition-colors text-left w-fit not-italic mt-1">Change</button>
                                                </div>
                                            </div>

                                            <div className="space-y-1 relative">
                                                <label className="block text-[12px] font-medium text-gray-700 ml-1">Password</label>
                                                <div className="relative flex items-center">
                                                    <AnimatePresence>
                                                        {focusedField === 'password' && !password && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 2 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 2 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute right-4 text-gray-400 pointer-events-none z-10"
                                                            >
                                                                <LockSimple size={18} weight="regular" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onFocus={() => setFocusedField('password')}
                                                        onBlur={() => setFocusedField(null)}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full h-[46px] border border-gray-300 rounded-lg px-4 text-[15px] focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                                                        required
                                                        autoFocus
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1 relative">
                                                <label className="block text-[12px] font-medium text-gray-700 ml-1">Confirm Password</label>
                                                <div className="relative flex items-center">
                                                    <AnimatePresence>
                                                        {focusedField === 'confirmPassword' && !confirmPassword && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 2 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 2 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute right-4 text-gray-400 pointer-events-none z-10"
                                                            >
                                                                <LockSimple size={18} weight="regular" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onFocus={() => setFocusedField('confirmPassword')}
                                                        onBlur={() => setFocusedField(null)}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full h-[46px] border border-gray-300 rounded-lg px-4 text-[15px] focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                                                        required
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-center mt-2 transform scale-[0.8] origin-center bg-gray-50 p-1 rounded-lg border border-gray-100">
                                                <Turnstile
                                                    siteKey="0x4AAAAAACgT6NmiKPh2uf_o"
                                                    onSuccess={(token) => setTurnstileToken(token)}
                                                    options={{ theme: 'light' }}
                                                />
                                            </div>

                                            <div className="flex justify-end pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={!!isLoading}
                                                    className="bg-[#0a0a0a] hover:bg-[#222222] disabled:bg-gray-400 text-white rounded-full px-8 py-2.5 text-[15px] font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-none active:scale-95"
                                                >
                                                    {isLoading === 'credentials' && <CircleNotch className="w-4 h-4 animate-spin" />}
                                                    Create Account
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>
                    </div>

                    {/* Bottom Links */}
                    <div className="pt-4 flex flex-col items-start gap-4 mx-auto md:mx-0 pr-8 md:pr-0 pl-1">
                        <Link href="#" className="text-[13px] text-gray-500 hover:text-black hover:underline font-medium block transition-colors">
                            Terms of Service & Privacy Policy
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
                <CircleNotch className="w-8 h-8 text-[#0266F2] animate-spin" />
            </div>
        }>
            <SignUpContent />
        </Suspense>
    );
}
