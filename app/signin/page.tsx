'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Chrome, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SignInContent() {
  const searchParams = useSearchParams();
  // const router = useRouter(); // Removed unused router
  const isDesktopFlow = searchParams.get('desktop') === 'true';
  const callbackUrl = searchParams.get('callbackUrl') || (isDesktopFlow ? '/api/desktop/token' : '/');

  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(() => {
    // Initialize error directly from params to avoid useEffect setState
    const errorParam = searchParams.get('error');
    if (errorParam === 'OAuthSignin') return 'Error connecting to Google. Check your redirect URIs.';
    if (errorParam === 'OAuthCallback') return 'Error during Google authentication.';
    if (errorParam) return 'Authentication failed.';
    return null;
  });
  const [isFocused, setIsFocused] = useState<string | null>(null);

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt === 'google' && !isLoading && !error) {
      handleGoogleSignIn();
    }
  }, [searchParams, error]); // Handle auto-trigger once if param is present and no error

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

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading('credentials');
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 antialiased relative overflow-hidden">

      {/* Background: Vignette only */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[360px] z-10"
      >
        {/* Branding: Silent */}
        <div className="text-center mb-10">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Quartz"
              width={100}
              height={25}
              className="h-6 w-auto mx-auto brightness-[0.8]"
            />
          </Link>
        </div>

        {/* Auth Module: Synchronized with Desktop */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500/90 text-[11px] text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div className="space-y-2">
              <div className="relative overflow-hidden rounded-lg bg-[#0A0A0A] border border-white/[0.08] focus-within:border-white/20 transition-all h-[46px]">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full bg-transparent px-4 text-sm font-light placeholder:text-white/20 focus:outline-none transition-all text-white/90"
                  required
                />
              </div>

              <div className="relative overflow-hidden rounded-lg bg-[#0A0A0A] border border-white/[0.08] focus-within:border-white/20 transition-all h-[46px]">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-full bg-transparent px-4 text-sm font-light placeholder:text-white/20 focus:outline-none transition-all text-white/90"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!!isLoading}
              className="w-full bg-white text-black rounded-lg h-[46px] text-sm font-semibold hover:bg-[#eee] transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              {isLoading === 'credentials' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-x-0 h-px bg-white/[0.05]" />
            <span className="relative px-4 bg-[#050505] text-[10px] tracking-widest text-white/20 uppercase font-medium">
              or continue with
            </span>
          </div>

          {/* Google: Desktop Style */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={!!isLoading}
              className="w-full bg-[#0A0A0A] border border-white/[0.08] hover:border-white/20 rounded-lg h-[46px] text-[13px] font-medium text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isLoading === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                    <path d="M3.964 10.711c-.18-.54-.282-1.117-.282-1.711 0-.594.102-1.17.282-1.711V4.957H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.043l3.007-2.332z" fill="#FBBC05" />
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.957L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                  </svg>
                  Google
                </>
              )}
            </button>
          </div>

          {/* Minimal Utilities */}
          <div className="flex flex-col items-center gap-6 pt-4">
            <Link href="/forgot" className="text-[10px] text-white/10 hover:text-white/30 transition-colors tracking-tight">
              Forgot your password?
            </Link>

            <div className="flex items-center gap-3 text-[9px] text-white/5 font-medium tracking-widest uppercase">
              <Link href="/terms" className="hover:text-white/20">Terms</Link>
              <span className="w-1 h-1 rounded-full bg-white/[0.02]" />
              <Link href="/privacy" className="hover:text-white/20">Privacy</Link>
            </div>
          </div>
        </div>

        {/* Desktop Context Link */}
        {isDesktopFlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-8 w-full left-0 flex justify-center pointer-events-none"
          >
            <div className="flex items-center gap-2 border border-white/[0.03] bg-white/[0.01] px-4 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-white/10 animate-pulse" />
              <span className="text-[9px] font-bold tracking-[0.2em] text-white/10 uppercase">Editor Link Pending</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/5 animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
