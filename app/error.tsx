'use client';

import Link from 'next/link';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen bg-white text-black">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center px-6 py-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/40">Something broke</p>
          <h1 className="mt-6 font-display text-5xl font-light tracking-[-0.04em] md:text-6xl">
            The page hit an unexpected error.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-black/65">
            Try the route again, or use one of the fallback paths below to keep moving through Quartz documentation and support.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={() => reset()}
              className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90"
            >
              Retry page
            </button>
            <Link href="/guide" className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-black transition hover:border-black/25 hover:bg-black/[0.03]">
              Open guide
            </Link>
            <Link href="/docs" className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-black transition hover:border-black/25 hover:bg-black/[0.03]">
              Open docs
            </Link>
            <Link href="/support" className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-black transition hover:border-black/25 hover:bg-black/[0.03]">
              Support center
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
