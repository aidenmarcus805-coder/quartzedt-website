'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Copy, ExternalLink, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';

const DESKTOP_SCHEME = process.env.NEXT_PUBLIC_DESKTOP_SCHEME || 'quartz';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const callbackUrl = useMemo(() => {
    return (
      searchParams.get('next') ||
      searchParams.get('callbackUrl') ||
      '/download'
    );
  }, [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [desktopToken, setDesktopToken] = useState<string | null>(null);
  const [tokenBusy, setTokenBusy] = useState(false);

  const deepLink = desktopToken
    ? `${DESKTOP_SCHEME}://auth?token=${encodeURIComponent(desktopToken)}`
    : `${DESKTOP_SCHEME}://open`;

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // ignore
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setDesktopToken(null);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setSubmitting(false);

    if (!res) {
      setError('Sign in failed.');
      return;
    }
    if (res.error) {
      setError('Sign in failed. Check your details.');
      return;
    }
    router.push(res.url || callbackUrl);
  };

  const mintDesktopToken = async () => {
    setTokenBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/desktop/token', { method: 'POST' });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        setError(data.error || 'Could not create desktop token.');
        return;
      }
      setDesktopToken(data.token);
    } catch {
      setError('Could not create desktop token.');
    } finally {
      setTokenBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/5"
      >
        <div className="grid grid-cols-3 h-14 items-center px-8 text-[11px] tracking-[0.15em]">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 hover:opacity-50 transition-opacity">
              <ArrowLeft className="w-3 h-3" />
              BACK
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Quartz"
                width={256}
                height={65}
                priority
                className="h-5 w-auto"
                unoptimized
              />
            </Link>
          </div>
          <div className="flex items-center justify-end gap-8">
            <Link href="/download" className="hover:opacity-50 transition-opacity">DOWNLOAD</Link>
          </div>
        </div>
      </motion.nav>

      {/* Dots */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          backgroundPosition: 'center',
          opacity: 0.18,
        }}
      />

      <main className="pt-28 pb-20 px-8">
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              <p className="text-[10px] tracking-[0.55em] text-white/35 font-light">SIGN IN</p>
            </div>

            <h1 className="font-display text-[clamp(44px,6vw,72px)] font-extralight tracking-[-0.05em] leading-[0.98]">
              Your account.
              <span className="text-white/25"> On desktop.</span>
            </h1>

            {error && (
              <div className="border border-white/10 bg-white/[0.03] px-5 py-4 text-[13px] text-white/65 font-light">
                {error}
              </div>
            )}

            {status === 'authenticated' ? (
              <div className="space-y-8">
                <div className="border border-white/10 bg-white/[0.02] p-8">
                  <p className="text-[10px] tracking-[0.4em] text-white/40 font-light">SIGNED IN</p>
                  <p className="mt-4 text-[14px] text-white/60 font-light">
                    {session?.user?.email}
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={mintDesktopToken}
                      disabled={tokenBusy}
                      className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-paper text-black text-[10px] tracking-[0.4em] hover:bg-paper/95 transition-all font-light disabled:opacity-60"
                    >
                      <span
                        className="h-2 w-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
                        aria-hidden="true"
                      />
                      {desktopToken ? 'REFRESH DESKTOP TOKEN' : 'CONNECT DESKTOP'}
                    </button>

                    <a
                      href={deepLink}
                      className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full border border-white/10 text-[10px] tracking-[0.4em] text-white/60 hover:text-white hover:border-accent/50 transition-all font-light"
                    >
                      <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
                      OPEN APP
                    </a>
                  </div>

                  {desktopToken && (
                    <div className="mt-8 border border-white/10 bg-black/40 p-5">
                      <div className="flex items-center justify-between gap-6">
                        <p className="text-[10px] tracking-[0.4em] text-white/35 font-light">DESKTOP TOKEN</p>
                        <button
                          type="button"
                          onClick={() => copy(desktopToken)}
                          className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] text-white/40 hover:text-white/70 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                          COPY
                        </button>
                      </div>
                      <p className="mt-4 text-[12px] leading-[1.7] text-white/55 font-light break-all">
                        {desktopToken}
                      </p>
                      <div className="mt-5 flex items-center gap-4 text-[10px] tracking-[0.3em] text-white/25 font-light">
                        <Minus className="w-8 h-[1px] text-white/15" />
                        Expires quickly. Use immediately.
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <Link
                    href="/download"
                    className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] text-white/35 hover:text-white transition-colors group"
                  >
                    <Minus className="w-8 h-[1px] text-white/20 group-hover:text-white/45 transition-colors" />
                    GO TO DOWNLOADS
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-[10px] tracking-[0.4em] text-white/25 hover:text-white/45 transition-colors font-light"
                  >
                    SIGN OUT
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="max-w-[520px] border border-white/10 bg-white/[0.02] p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.45em] text-white/35 font-light">
                      EMAIL
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      autoComplete="email"
                      required
                      className="mt-3 w-full bg-black/40 border border-white/10 px-4 py-3 text-[14px] text-white/70 outline-none focus:border-white/25 transition-colors"
                      placeholder="you@studio.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.45em] text-white/35 font-light">
                      PASSWORD
                    </label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      autoComplete="current-password"
                      className="mt-3 w-full bg-black/40 border border-white/10 px-4 py-3 text-[14px] text-white/70 outline-none focus:border-white/25 transition-colors"
                      placeholder="(dev placeholder)"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex w-full items-center justify-center gap-3 px-10 py-4 rounded-full bg-paper text-black text-[10px] tracking-[0.4em] hover:bg-paper/95 transition-all font-light disabled:opacity-60"
                  >
                    <span
                      className="h-2 w-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
                      aria-hidden="true"
                    />
                    {submitting ? 'SIGNING IN' : 'SIGN IN'}
                  </button>

                  <p className="text-[12px] leading-[1.8] text-white/35 font-light">
                    This is a minimal scaffold so the desktop connection flow can be built. Hook it to your real user
                    system when ready.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}


