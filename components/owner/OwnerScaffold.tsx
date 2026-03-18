import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { ownerPrimaryButtonClassName, ownerSecondaryButtonClassName } from '@/lib/owner/present';
import type { OwnerSignal } from '@/lib/owner/types';

import { GlassCard } from './GlassCard';
import { OwnerBadge } from './OwnerBadge';

export function OwnerActionLink({
  href,
  subtle = false,
  children,
}: {
  href: string;
  subtle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={subtle ? ownerSecondaryButtonClassName : ownerPrimaryButtonClassName}>
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </Link>
  );
}

export function OwnerPageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string; // Kept for compatibility but ignored
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h1>
      </div>

      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function OwnerSectionHeading({
  title,
  action,
}: {
  title: string;
  description?: string; // Kept for compatibility but ignored
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-medium text-slate-900">{title}</h2>
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}

export function OwnerSignalCard({ signal }: { signal: OwnerSignal }) {
  return (
    <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium text-slate-500">{signal.label}</p>
        {signal.tone === 'critical' || signal.tone === 'warning' ? (
          <OwnerBadge tone={signal.tone}>{signal.tone}</OwnerBadge>
        ) : null}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-lg font-semibold text-slate-900">{signal.value}</p>
      </div>
    </div>
  );
}
