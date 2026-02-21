'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import Image from 'next/image';
import Link from 'next/link';
import { CircleNotch } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

function SignInContent() {
  const searchParams = useSearchParams();
  const isDesktopFlow = searchParams.get('desktop') === 'true';
  const callbackUrl = searchParams.get('callbackUrl') || (isDesktopFlow ? '/api/desktop/token' : '/');

  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(() => {
    // Initialize error directly from params to avoid useEffect setState
    const errorParam = searchParams.get('error');
    if (errorParam === 'OAuthSignin') return 'Error connecting to Google. Check your redirect URIs.';
    if (errorParam === 'OAuthCallback') return 'Error during Google authentication.';
    if (errorParam) return 'Authentication failed.';
    return null;
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const hasAutoSignedIn = useRef(false);

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt === 'google' && !hasAutoSignedIn.current && !isLoading && !error) {
      hasAutoSignedIn.current = true;
      // Add a small delay to ensure hydration is complete and the session is stable
      const timer = setTimeout(() => {
        handleGoogleSignIn();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, error, isLoading]);

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
    if (!email) {
      setError('Please enter an email address.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (!turnstileToken) {
      setError('Please complete the captcha.');
      return;
    }

    setIsLoading('credentials');
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        turnstileToken,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        setError('Invalid credentials.');
        setIsLoading(null);
      } else {
        // API routes require a hard navigation, not soft router push
        window.location.href = callbackUrl;
      }
    } catch {
      setError('Internal error.');
      setIsLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center bg-[#f5f5f5] overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?q=80&w=2071&auto=format&fit=crop"
          alt="Background"
          fill
          priority
          className="object-cover brightness-[0.7] scale-105"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Logo and Title */}
        <div className="flex-1 hidden md:flex flex-col text-white max-w-[400px]">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="/logo.png"
              alt="Quartz logo"
              width={180}
              height={45}
              className="h-9 w-auto select-none brightness-0 invert object-contain drop-shadow-lg"
            />
          </div>
          <h2 className="text-[24px] font-medium tracking-wide text-white drop-shadow-md leading-tight">
            Sign in or create an account
          </h2>
        </div>

        {/* Right Side: Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[440px] bg-white rounded-md shadow-2xl z-10 text-gray-900 mx-auto md:mx-0 min-h-[500px] flex flex-col pt-10 pb-8 px-10 ring-1 ring-black/5"
        >
          <div className="flex-1">
            <h1 className="text-[28px] font-semibold mb-1 tracking-tight text-[#222222]">Sign in</h1>
            <p className="text-[14px] text-gray-600 mb-8">
              New user? <Link href="/signup" className="text-[#0266F2] hover:underline font-medium">Create an account</Link>
            </p>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[#D32F2F] text-[13px] mb-4 font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={step === 1 ? handleContinue : handleCredentialsSignIn} className="mb-2">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1"
                >
                  <label className="block text-[13px] font-medium text-gray-700">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[42px] border border-gray-300 rounded-sm px-3 text-[14px] focus:outline-none focus:border-[#0266F2] focus:ring-1 focus:ring-[#0266F2] transition-shadow shadow-sm"
                    required
                  />
                  <div className="flex justify-end pt-5">
                    <button
                      type="submit"
                      className="bg-[#0266F2] hover:bg-[#0052C2] text-white rounded-full px-7 py-2 text-[14px] font-semibold transition-colors duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                    <span className="text-[14px] text-gray-700 font-medium">{email}</span>
                    <button type="button" onClick={() => setStep(1)} className="text-[13px] text-[#0266F2] hover:underline">Edit</button>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[13px] font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-[42px] border border-gray-300 rounded-sm px-3 text-[14px] focus:outline-none focus:border-[#0266F2] focus:ring-1 focus:ring-[#0266F2] transition-shadow shadow-sm"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-center mt-3 scale-[0.95] origin-top">
                    <Turnstile
                      siteKey="0x4AAAAAACgT6NmiKPh2uf_o"
                      onSuccess={(token) => setTurnstileToken(token)}
                      options={{ theme: 'light' }}
                    />
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      disabled={!!isLoading}
                      className="bg-[#0266F2] hover:bg-[#0052C2] disabled:bg-[#0266F2]/50 text-white rounded-full px-7 py-2 text-[14px] font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {isLoading === 'credentials' && <CircleNotch className="w-4 h-4 animate-spin inset-0" />}
                      Sign In
                    </button>
                  </div>
                </motion.div>
              )}
            </form>

            <AnimatePresence>
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 my-7">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-[13px] text-gray-500 font-light">Or</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <div className="space-y-3">
                    <button
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
                      <span className="text-[14px] font-medium text-[#222222]">Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full h-11 hover:bg-gray-50 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-[14px] font-medium text-[#222222]">Continue with Facebook</span>
                    </button>

                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full h-11 hover:bg-gray-50 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.79 1.56-.05 2.89.65 3.63 1.71-3.13 1.84-2.6 5.86.44 7.02-.75 1.73-1.63 3.32-2.73 4.23zM12.03 7.25C11.89 4.09 14.54 1.41 17.5 1.06c.36 3.44-2.88 6.13-5.47 6.19z" />
                      </svg>
                      <span className="text-[14px] font-medium text-[#222222]">Continue with Apple</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Links */}
          <div className="pt-8 flex flex-col items-start gap-4 mx-auto md:mx-0 pr-8 md:pr-0 pl-1">
            <Link href="#" className="text-[13px] text-[#0266F2] hover:underline font-medium block">
              More sign-in options
            </Link>
            <Link href="#" className="text-[13px] text-[#0266F2] hover:underline font-medium block">
              Get help signing in
            </Link>
          </div>

          {/* Desktop Context Link */}
          {isDesktopFlow && (
            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-2 border border-blue-100 bg-blue-50 px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[9px] font-bold tracking-[0.1em] text-blue-700 uppercase">Editor Link Pending</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <CircleNotch className="w-8 h-8 text-[#0266F2] animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
