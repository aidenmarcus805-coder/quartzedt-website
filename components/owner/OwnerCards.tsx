import Link from 'next/link';
import { ArrowUpRight, PauseCircle, RefreshCcw, Shield, Trash2 } from 'lucide-react';

import {
  formatLabel,
  ownerPrimaryButtonClassName,
  ownerSecondaryButtonClassName,
  toneFromBotStatus,
  toneFromOutputStatus,
  toneFromPriority,
} from '@/lib/owner/present';
import type {
  BotRecord,
  CodeRefinementSpec,
  ImportedBotPackage,
  OwnerOutput,
  OwnerSettingField,
  OwnerSettingSection,
  OwnerSuggestion,
} from '@/lib/owner/types';

import CopyTextButton from './CopyTextButton';
import { GlassCard } from './GlassCard';
import { OwnerBadge } from './OwnerBadge';

function fieldClassName() {
  return 'mt-3 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300';
}

function renderSettingField(field: OwnerSettingField) {
  if (field.type === 'toggle') {
    const enabled = Boolean(field.value);

    return (
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3">
        <span className="text-sm font-medium text-slate-700">{enabled ? 'Enabled' : 'Disabled'}</span>
        <span
          aria-hidden="true"
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
            enabled ? 'bg-slate-900' : 'bg-slate-200'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white transition ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </span>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return <textarea rows={4} defaultValue={String(field.value)} className={fieldClassName()} />;
  }

  if (field.type === 'select') {
    return (
      <select defaultValue={String(field.value)} className={fieldClassName()}>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.type === 'password' ? 'password' : 'text'}
      defaultValue={String(field.value)}
      className={fieldClassName()}
    />
  );
}

export function formatCodeRefinementSpec(refinement: CodeRefinementSpec) {
  return [
    'Title',
    refinement.title,
    '',
    'Files to Change',
    refinement.filesToChange.map((file) => `- ${file}`).join('\n'),
    '',
    'Suggestion',
    refinement.suggestion,
    '',
    'Why This Helps',
    refinement.whyThisHelps,
    '',
    'Alternative Approaches',
    refinement.alternativeApproaches.map((approach) => `- ${approach}`).join('\n'),
  ].join('\n');
}

export function OwnerOutputCard({
  output,
  showPipeline = true,
}: {
  output: OwnerOutput;
  showPipeline?: boolean;
}) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {showPipeline ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: output.pipelineAccent }} />
                {output.pipelineLabel}
              </span>
            ) : null}
            <span>{output.category}</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{output.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{output.excerpt}</p>
        </div>
        <OwnerBadge tone={toneFromOutputStatus(output.status)}>{formatLabel(output.status)}</OwnerBadge>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>By {output.author}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span>{output.createdAtLabel}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span>Destination: {output.destination}</span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <CopyTextButton value={output.copyableText} label="Copy brief" />
        <Link href={output.href} className={ownerPrimaryButtonClassName}>
          {output.routeTarget}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </GlassCard>
  );
}

export function OwnerSuggestionCard({ suggestion }: { suggestion: OwnerSuggestion }) {
  const copyValue = [
    'Title',
    suggestion.title,
    '',
    'Type',
    suggestion.type,
    '',
    'Summary',
    suggestion.summary,
    '',
    'Why Now',
    suggestion.whyNow,
    '',
    'Execution Brief',
    suggestion.executionBrief,
    '',
    'Tags',
    suggestion.tags.join(', '),
  ].join('\n');

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span>{suggestion.pipelineLabel}</span>
            <span>{suggestion.type}</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{suggestion.title}</h3>
        </div>
        <OwnerBadge tone={toneFromPriority(suggestion.priority)}>{suggestion.priority}</OwnerBadge>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{suggestion.summary}</p>

      <div className="mt-6 grid gap-4 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Why now</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{suggestion.whyNow}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Execution brief</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{suggestion.executionBrief}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {suggestion.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <CopyTextButton value={copyValue} label="Copy suggestion" />
        <Link href={`/dashboard/owner/pipelines/${suggestion.pipeline}`} className={ownerSecondaryButtonClassName}>
          Open {suggestion.pipelineLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </GlassCard>
  );
}

export function OwnerImportBotCard({ packageItem }: { packageItem: ImportedBotPackage }) {
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span>{packageItem.source}</span>
            <span>{packageItem.fileName}</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{packageItem.fileName}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{packageItem.notes}</p>
        </div>
        <OwnerBadge tone={packageItem.status === 'active' ? 'success' : packageItem.status === 'needs-review' ? 'warning' : 'neutral'}>
          {formatLabel(packageItem.status)}
        </OwnerBadge>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Config preview</p>
          <pre className="mt-3 whitespace-pre-wrap break-words text-xs leading-6 text-slate-700">{packageItem.preview}</pre>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-white/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Assignments</p>
          <div className="mt-4 space-y-3">
            {packageItem.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{assignment.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {assignment.role} · {assignment.pipelineLabel}
                  </p>
                </div>
                <OwnerBadge tone={assignment.active ? 'success' : 'neutral'}>
                  {assignment.active ? 'Active' : 'Staged'}
                </OwnerBadge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className={ownerSecondaryButtonClassName}>
          Review roles
        </button>
        <button type="button" className={ownerSecondaryButtonClassName}>
          Assign pipelines
        </button>
        <Link href="/dashboard/owner/bot-management" className={ownerPrimaryButtonClassName}>
          Open Bot Management
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </GlassCard>
  );
}

export function OwnerBotCard({ bot }: { bot: BotRecord }) {
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span>{bot.pipelineLabel}</span>
            <span>{bot.model}</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{bot.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{bot.role}</p>
        </div>
        <OwnerBadge tone={toneFromBotStatus(bot.status)}>{formatLabel(bot.status)}</OwnerBadge>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Last action</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{bot.lastAction}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Permissions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {bot.permissions.map((permission) => (
                <span key={permission} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {permission}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Tools</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {bot.tools.map((tool) => (
                <span key={tool} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Recent actions</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {bot.recentActions.map((action) => (
                <li key={action} className="rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2">
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Logs</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {bot.logs.map((log) => (
                <li key={log} className="rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2">
                  {log}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className={ownerSecondaryButtonClassName}>
          <Shield className="h-4 w-4" />
          Edit permissions
        </button>
        <button type="button" className={ownerSecondaryButtonClassName}>
          {bot.status === 'active' || bot.status === 'watching' ? (
            <PauseCircle className="h-4 w-4" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          {bot.status === 'active' || bot.status === 'watching' ? 'Pause' : 'Restart'}
        </button>
        <button type="button" className={ownerSecondaryButtonClassName}>
          Reassign
        </button>
        <button type="button" className={ownerSecondaryButtonClassName}>
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
    </GlassCard>
  );
}

export function OwnerCodeRefinementCard({ refinement }: { refinement: CodeRefinementSpec }) {
  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{refinement.pipelineLabel}</p>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{refinement.title}</h3>
        </div>
        <CopyTextButton value={formatCodeRefinementSpec(refinement)} label="Copy execution spec" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Files to Change</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {refinement.filesToChange.map((file) => (
              <li key={file} className="rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2">
                {file}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Alternative Approaches</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {refinement.alternativeApproaches.map((approach) => (
              <li key={approach} className="rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2">
                {approach}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Suggestion</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{refinement.suggestion}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Why This Helps</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{refinement.whyThisHelps}</p>
        </div>
      </div>
    </GlassCard>
  );
}

export function OwnerSettingsSectionCard({ section }: { section: OwnerSettingSection }) {
  return (
    <GlassCard hover={false} className="p-6 sm:p-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{section.title}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{section.description}</p>
      </div>

      <div className="mt-6 grid gap-4">
        {section.fields.map((field) => (
          <div key={field.id} className="rounded-[24px] border border-slate-200/80 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-slate-900">{field.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{field.description}</p>
            {renderSettingField(field)}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
