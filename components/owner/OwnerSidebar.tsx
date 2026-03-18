"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  Bot,
  Boxes,
  Lightbulb,
  LucideIcon,
  MessageSquareMore,
  PanelLeft,
  Settings2,
  Sparkles,
  Upload,
  WandSparkles,
} from 'lucide-react';

import { ownerNavigation, ownerPipelines } from '@/lib/owner/data';
import type { OwnerNavIcon } from '@/lib/owner/types';
import { cn } from '@/lib/utils';

const navIcons: Record<OwnerNavIcon, LucideIcon> = {
  overview: PanelLeft,
  pipelines: Boxes,
  groupchat: MessageSquareMore,
  suggestions: Lightbulb,
  import: Upload,
  bots: Bot,
  outputs: Sparkles,
  refinements: WandSparkles,
  settings: Settings2,
};

function isActivePath(pathname: string, href: string) {
  if (href === '/dashboard/owner') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function OwnerSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-white/80 bg-[#f6f2ec]/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Quartz owner</p>
            <p className="mt-1 text-sm text-slate-600">Private operating system</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {ownerNavigation.map((item) => {
            const Icon = navIcons[item.icon];
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition',
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-white/80 bg-white/85 text-slate-600',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <aside className="fixed inset-y-0 left-0 hidden w-[296px] flex-col border-r border-white/60 bg-[#f8f5f0]/92 px-5 py-6 backdrop-blur-2xl lg:flex">
        <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Quartz owner</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-950">Founder operating system</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Quiet control over pipelines, claws, suggestions, outputs, and owner-only settings.
          </p>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto pr-1">
          <div className="space-y-2">
            {ownerNavigation.map((item) => {
              const Icon = navIcons[item.icon];
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-start gap-3 rounded-[24px] border px-4 py-4 transition',
                    active
                      ? 'border-slate-900 bg-slate-900 text-white shadow-[0_20px_40px_-30px_rgba(15,23,42,0.65)]'
                      : 'border-white/80 bg-white/70 text-slate-600 hover:border-slate-200 hover:text-slate-950',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border',
                      active ? 'border-white/20 bg-white/10 text-white' : 'border-slate-200 bg-slate-50 text-slate-500',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">{item.label}</span>
                      <span className={cn('text-[11px] uppercase tracking-[0.2em]', active ? 'text-white/60' : 'text-slate-400')}>
                        ⌘{item.shortcut}
                      </span>
                    </span>
                    <span className={cn('mt-1 block text-sm leading-6', active ? 'text-white/72' : 'text-slate-500')}>
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 rounded-[28px] border border-white/70 bg-white/65 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Active lanes</p>
            <div className="mt-4 space-y-3">
              {ownerPipelines.slice(0, 4).map((pipeline) => (
                <Link
                  key={pipeline.slug}
                  href={`/dashboard/owner/pipelines/${pipeline.slug}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 transition hover:border-slate-300"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{pipeline.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{pipeline.queueCount} queued · {pipeline.botCount} bots</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pipeline.accent }} />
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-6 space-y-3">
          <div className="rounded-[24px] border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Owner only.</span> This area is built for routing work, reviewing claws, and making decisions without noise.
          </div>
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit owner dashboard
          </Link>
        </div>
      </aside>
    </>
  );
}
