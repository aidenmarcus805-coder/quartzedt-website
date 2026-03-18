import type { BotRecord, OwnerOutput, OwnerSuggestion, OwnerTone, PipelineSummary } from './types';

export const ownerPrimaryButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800';

export const ownerSecondaryButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900';

export const ownerToneClassNames: Record<OwnerTone, string> = {
  neutral: 'border-slate-200 bg-slate-100 text-slate-600',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  critical: 'border-rose-200 bg-rose-50 text-rose-700',
};

export function formatLabel(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function toneFromPipelineStatus(status: PipelineSummary['status']): OwnerTone {
  if (status === 'healthy') return 'success';
  if (status === 'blocked') return 'critical';

  return 'warning';
}

export function toneFromOutputStatus(status: OwnerOutput['status']): OwnerTone {
  if (status === 'ready') return 'success';
  if (status === 'needs-review') return 'warning';

  return 'neutral';
}

export function toneFromPriority(priority: OwnerSuggestion['priority']): OwnerTone {
  if (priority === 'High') return 'critical';
  if (priority === 'Medium') return 'warning';

  return 'neutral';
}

export function toneFromBotStatus(status: BotRecord['status']): OwnerTone {
  if (status === 'active') return 'success';
  if (status === 'offline') return 'critical';
  if (status === 'paused') return 'warning';

  return 'neutral';
}
