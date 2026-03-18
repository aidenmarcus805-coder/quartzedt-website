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

import { ownerNavigation } from '@/lib/owner/data';
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
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Quartz owner</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
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
                  'inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors',
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <aside className="hidden h-screen flex-col border-r border-slate-200 bg-slate-50 lg:sticky lg:top-0 lg:z-40 lg:flex">
        <div className="mb-6 px-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quartz owner</p>
        </div>

        <div className="flex h-full flex-col px-4 py-6">
          <nav className="flex-1 overflow-y-auto">
            <div className="space-y-1">
              {ownerNavigation.map((item) => {
                const Icon = navIcons[item.icon];
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-slate-200/60 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className="text-[10px] text-slate-400">
                      ⌘{item.shortcut}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="mt-6 px-2">
            <Link
              href="/dashboard"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit owner dashboard
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
