'use client';

import { motion } from 'framer-motion';
import { Copy, Check, ArrowSquareOut } from '@phosphor-icons/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const DESKTOP_SCHEME = process.env.NEXT_PUBLIC_DESKTOP_SCHEME || 'quartz';
const MAC_URL = process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_MAC_URL || '';
const WINDOWS_URL = process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_WINDOWS_URL || '';

export default function DownloadPage() {
  const { data: session } = useSession();
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
    <div className="space-y-16">
      <div>
        <h1 className="font-display text-4xl font-light text-black">Download</h1>
        <p className="text-black/60 text-lg font-light">
          Get the Quartz Desktop application.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Download Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-sm font-medium text-black">Installers</h2>
            <p className="text-sm text-black/50">Select your operating system.</p>
          </div>

          <div className="space-y-4">
            <a
              href={MAC_URL || undefined}
              className={`group flex items-center justify-between px-6 py-5 rounded-2xl bg-black text-white hover:bg-black/90 transition-all ${!MAC_URL && 'opacity-50 cursor-not-allowed'}`}
            >
              <div className="flex items-center gap-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <p className="font-medium">Download for macOS</p>
                  <p className="text-xs text-white/50">Apple Silicon & Intel</p>
                </div>
              </div>
              <ArrowSquareOut className="w-5 h-5 opacity-50" />
            </a>

            <a
              href={WINDOWS_URL || undefined}
              className={`group flex items-center justify-between px-6 py-5 rounded-2xl border border-black/10 hover:border-black/30 bg-white transition-all ${!WINDOWS_URL && 'opacity-50 cursor-not-allowed'}`}
            >
              <div className="flex items-center gap-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
                <div className="text-left">
                  <p className="font-medium">Download for Windows</p>
                  <p className="text-xs text-black/40">Windows 10/11</p>
                </div>
              </div>
              <ArrowSquareOut className="w-5 h-5 opacity-30" />
            </a>
          </div>
        </section>

        {/* Connection Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-sm font-medium text-black">Connect</h2>
            <p className="text-sm text-black/50">Link the desktop app to your account.</p>
          </div>

          <div className="p-8 rounded-2xl bg-black/[0.02] border border-black/5">
            {!session ? (
              <div className="text-center py-4">
                <p className="text-sm text-black/60 mb-6">Sign in to generate a connection code.</p>
                <Link
                  href="/signin?next=/dashboard/download"
                  className="flex items-center justify-center w-full h-12 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90 transition-all shadow-lg shadow-black/5"
                >
                  Sign In to Connect
                </Link>
              </div>
            ) : !desktopToken ? (
              <div className="text-center py-4">
                <p className="text-sm text-black/60 mb-6">Need to sign in on the desktop app?</p>
                <button
                  onClick={mintDesktopToken}
                  disabled={busy}
                  className="w-full h-12 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90 transition-all disabled:opacity-50 shadow-lg shadow-black/5"
                >
                  {busy ? 'Generating...' : 'Generate Connection Code'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-black/50">Connection Code</p>
                  <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-black/10">
                    <code className="text-sm font-mono tracking-wide">{desktopToken}</code>
                    <button onClick={copyToken} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-black/40" />}
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center gap-4 py-4">
                  <div className="h-px bg-black/5 flex-1" />
                  <span className="text-[10px] text-black/30 uppercase">OR</span>
                  <div className="h-px bg-black/5 flex-1" />
                </div>

                <a
                  href={deepLink}
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-black/10 bg-white text-sm font-medium hover:border-black/30 transition-all"
                >
                  <ArrowSquareOut className="w-4 h-4" />
                  Open Desktop App
                </a>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
