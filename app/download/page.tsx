'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, User, Copy, Check, ExternalLink } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  const deepLink = useMemo(() => {
    if (!desktopToken) return `${DESKTOP_SCHEME}://open`;
    return `${DESKTOP_SCHEME}://auth?token=${encodeURIComponent(desktopToken)}`;
  }, [desktopToken]);

  const copyToken = async () => {
    if (!desktopToken) return;
    await navigator.clipboard.writeText(desktopToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mintDesktopToken = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/desktop/token', { method: 'POST' });
      const data = (await res.json()) as { token?: string };
      if (data.token) setDesktopToken(data.token);
    } catch { /* silent */ } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5"
      >
        <div className="flex h-14 items-center justify-between px-8 text-[11px] tracking-[0.12em]">
          <Link href="/" className="flex items-center gap-2 text-black/50 hover:text-black transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back
          </Link>
          <Link href="/">
            <Image src="/logo.png" alt="Quartz" width={80} height={20} className="h-4 w-auto invert" unoptimized />
          </Link>
          <Link
            href={session ? "/dashboard" : "/signin?next=/download"}
            className="p-2 rounded-full border border-black/10 hover:border-black/30 transition-all relative"
          >
            <User className="w-4 h-4 text-black/60" />
            {session && <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-red-500" />}
          </Link>
        </div>
      </motion.nav>

      <main className="pt-32 pb-24 px-8">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="font-display text-4xl md:text-5xl font-light tracking-[-0.03em]">
                Get Quartz
              </h1>
              <p className="text-sm text-black/40 font-light">
                Professional AI video editing for your desktop.
              </p>
            </div>

            {/* Download Buttons */}
            <div className="space-y-3">
              <a
                href={MAC_URL || undefined}
                className={`group flex items-center justify-center gap-3 w-full h-14 rounded-xl text-sm font-medium transition-all ${MAC_URL
                  ? 'bg-black text-white hover:bg-black/90'
                  : 'bg-black/5 text-black/30 cursor-not-allowed'
                  }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                {MAC_URL ? 'Download for macOS' : 'macOS — Coming Soon'}
              </a>

              <a
                href={WINDOWS_URL || undefined}
                className={`group flex items-center justify-center gap-3 w-full h-14 rounded-xl text-sm font-medium transition-all ${WINDOWS_URL
                  ? 'bg-black text-white hover:bg-black/90'
                  : 'bg-black/5 text-black/30 cursor-not-allowed'
                  }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
                {WINDOWS_URL ? 'Download for Windows' : 'Windows — Coming Soon'}
              </a>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-black/[0.08]" />
              <span className="text-[10px] tracking-widest text-black/25 uppercase">or</span>
              <div className="flex-1 h-px bg-black/[0.08]" />
            </div>

            {/* Connect Desktop */}
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-xs text-black/40 font-light">
                  Already installed? Connect your account.
                </p>
              </div>

              {status === 'authenticated' ? (
                <div className="space-y-4">
                  {!desktopToken ? (
                    <button
                      onClick={mintDesktopToken}
                      disabled={busy}
                      className="w-full h-12 rounded-xl border border-black/10 text-sm text-black/70 hover:text-black hover:border-black/30 transition-all disabled:opacity-50"
                    >
                      {busy ? 'Generating...' : 'Generate Connection Code'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-black/[0.03] border border-black/[0.08]">
                        <code className="text-xs text-black/60 font-mono truncate">{desktopToken}</code>
                        <button onClick={copyToken} className="text-black/40 hover:text-black transition-colors">
                          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <a
                        href={deepLink}
                        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-black/[0.03] border border-black/10 text-sm text-black/70 hover:text-black hover:border-black/20 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in Desktop App
                      </a>
                      <p className="text-center text-[10px] text-black/30">
                        Paste this code into the app if it doesn't open automatically.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin?next=/download"
                  className="flex items-center justify-center w-full h-12 rounded-xl border border-black/10 text-sm text-black/70 hover:text-black hover:border-black/30 transition-all"
                >
                  Sign in to connect
                </Link>
              )}
            </div>

            {/* Footer */}
            {status === 'authenticated' && (
              <p className="text-center text-[11px] text-black/30">
                Signed in as {session?.user?.email}
              </p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
