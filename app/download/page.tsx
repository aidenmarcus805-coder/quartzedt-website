'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Copy, ExternalLink, Minus, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';

const DESKTOP_SCHEME = process.env.NEXT_PUBLIC_DESKTOP_SCHEME || 'quartz';
const MAC_URL = process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_MAC_URL || '';
const WINDOWS_URL = process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_WINDOWS_URL || '';

export default function DownloadPage() {
  const { data: session, status } = useSession();
  const [desktopToken, setDesktopToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deepLink = useMemo(() => {
    if (!desktopToken) return `${DESKTOP_SCHEME}://open`;
    return `${DESKTOP_SCHEME}://auth?token=${encodeURIComponent(desktopToken)}`;
  }, [desktopToken]);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // ignore
    }
  };

  const mintDesktopToken = async () => {
    setBusy(true);
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
      setBusy(false);
    }
  };

  const DownloadButton = ({
    href,
    label,
  }: {
    href: string;
    label: string;
  }) => {
    const disabled = !href;
    return (
      <a
        href={disabled ? undefined : href}
        className={`group inline-flex items-center justify-center gap-3 w-full rounded-full border border-white/15 py-4 text-[10px] tracking-[0.4em] font-light transition-all ${disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-paper hover:text-black hover:border-white/20'
          }`}
        aria-disabled={disabled}
      >
        <span
          className={`h-2 w-2 rounded-full transition-all duration-200 ${disabled
            ? 'bg-white/15'
            : 'bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100'
            }`}
          aria-hidden="true"
        />
        {disabled ? 'COMING SOON' : label}
      </a>
    );
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
            <Link href="/pricing" className="hover:opacity-50 transition-opacity">PRICING</Link>
            <Link
              href={session ? "/dashboard" : "/signin?next=/download"}
              className="p-2.5 rounded-full border border-white/20 hover:border-white hover:bg-white/10 transition-all duration-300 active:scale-95 flex items-center justify-center group/signin shadow-[0_0_20px_rgba(255,255,255,0.02)] relative"
              aria-label={session ? "Go to Dashboard" : "Sign In"}
            >
              <User className="w-4 h-4 transition-colors duration-300 bg-transparent group-hover/signin:text-accent" />
              <div className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full animate-pulse bg-accent ${session ? 'opacity-100' : 'opacity-0'}`} />
            </Link>
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

      <main className="pt-28 pb-24 px-8">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-14"
          >
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                <p className="text-[10px] tracking-[0.55em] text-white/35 font-light">DOWNLOAD</p>
              </div>

              <h1 className="font-display text-[clamp(44px,6vw,72px)] font-extralight tracking-[-0.05em] leading-[0.98]">
                Quartz for desktop.
                <span className="text-white/25"> Faster finishing.</span>
              </h1>

              <p className="text-[15px] md:text-[17px] leading-[1.9] text-white/55 font-light max-w-[70ch]">
                Install the desktop app, then connect your account to sync projects and exports.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-white/10 bg-white/[0.02] p-10 md:p-12">
                <p className="text-[10px] tracking-[0.45em] text-white/40 font-light">macOS</p>
                <p className="mt-4 text-[13px] leading-[1.8] text-white/50 font-light">
                  Apple Silicon + Intel · macOS 13+
                </p>
                <div className="mt-10">
                  <DownloadButton href={MAC_URL} label="DOWNLOAD FOR MAC" />
                </div>
              </div>

              <div className="border border-white/10 bg-white/[0.02] p-10 md:p-12">
                <p className="text-[10px] tracking-[0.45em] text-white/40 font-light">Windows</p>
                <p className="mt-4 text-[13px] leading-[1.8] text-white/50 font-light">
                  Windows 10/11 · x64
                </p>
                <div className="mt-10">
                  <DownloadButton href={WINDOWS_URL} label="DOWNLOAD FOR WINDOWS" />
                </div>
              </div>
            </div>

            {(!MAC_URL || !WINDOWS_URL) && (
              <div className="text-[12px] leading-[1.8] text-white/35 font-light">
                Add your installer links in your host env:
                <span className="text-white/50">
                  {' '}
                  NEXT_PUBLIC_DESKTOP_DOWNLOAD_MAC_URL
                </span>
                <span className="text-white/25"> / </span>
                <span className="text-white/50">
                  NEXT_PUBLIC_DESKTOP_DOWNLOAD_WINDOWS_URL
                </span>
                .
              </div>
            )}

            <div className="border border-white/10 bg-white/[0.02] p-10 md:p-12">
              <div className="flex items-center justify-between gap-8 flex-wrap">
                <div>
                  <p className="text-[10px] tracking-[0.45em] text-white/40 font-light">CONNECT DESKTOP</p>
                  <p className="mt-4 text-[13px] leading-[1.9] text-white/55 font-light max-w-[70ch]">
                    Your desktop app can receive a short-lived handoff token via a deep link:
                    <span className="text-white/35"> {DESKTOP_SCHEME}://auth?token=…</span>
                  </p>
                </div>

                <a
                  href={deepLink}
                  className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full border border-white/15 text-[10px] tracking-[0.4em] text-white/60 hover:text-white hover:border-accent/50 transition-all font-light"
                >
                  <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
                  OPEN APP
                </a>
              </div>

              {error && (
                <div className="mt-8 border border-white/10 bg-white/[0.03] px-5 py-4 text-[13px] text-white/65 font-light">
                  {error}
                </div>
              )}

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {status === 'authenticated' ? (
                  <button
                    type="button"
                    onClick={mintDesktopToken}
                    disabled={busy}
                    className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-paper text-black text-[10px] tracking-[0.4em] hover:bg-paper/95 transition-all font-light disabled:opacity-60"
                  >
                    <span
                      className="h-2 w-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
                      aria-hidden="true"
                    />
                    {desktopToken ? 'REFRESH TOKEN' : 'GENERATE TOKEN'}
                  </button>
                ) : (
                  <Link
                    href="/signin?next=/download"
                    className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-paper text-black text-[10px] tracking-[0.4em] hover:bg-paper/95 transition-all font-light"
                  >
                    <span
                      className="h-2 w-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
                      aria-hidden="true"
                    />
                    SIGN IN TO CONNECT
                  </Link>
                )}

                <Link
                  href="/pricing"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full border border-white/10 text-[10px] tracking-[0.4em] text-white/60 hover:text-white hover:border-accent/50 transition-all font-light"
                >
                  <Minus className="w-8 h-[1px] text-white/20 group-hover:text-white/60 transition-colors" />
                  VIEW PRICING
                </Link>
              </div>

              {status === 'authenticated' && (
                <div className="mt-10 text-[12px] leading-[1.8] text-white/40 font-light">
                  Signed in as <span className="text-white/60">{session?.user?.email}</span>.
                </div>
              )}

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
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}


