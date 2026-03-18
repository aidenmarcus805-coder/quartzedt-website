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
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">{description}</p>
      </div>

      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function OwnerSectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}

export function OwnerSignalCard({ signal }: { signal: OwnerSignal }) {
  return (
    <GlassCard hover={false} className="p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{signal.label}</p>
        <OwnerBadge tone={signal.tone}>{signal.tone}</OwnerBadge>
      </div>
      <p className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{signal.value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{signal.detail}</p>
    </GlassCard>
  );
}
