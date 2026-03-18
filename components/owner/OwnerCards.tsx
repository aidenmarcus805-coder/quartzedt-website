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
  return 'mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-300 focus:ring-1 focus:ring-slate-200';
}

function renderSettingField(field: OwnerSettingField) {
  if (field.type === 'toggle') {
    const enabled = Boolean(field.value);

    return (
      <div className="mt-2 flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
        <span className="text-sm font-medium text-slate-900">{enabled ? 'Enabled' : 'Disabled'}</span>
        <span
          aria-hidden="true"
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            enabled ? 'bg-slate-900' : 'bg-slate-200'
          }`}
        >
          <span
            className={`inline-block h-3 w-3 rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-1'
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
    <GlassCard className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {showPipeline ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: output.pipelineAccent }} />
                {output.pipelineLabel}
              </span>
            ) : null}
            <span>&middot;</span>
            <span>{output.category}</span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{output.title}</h3>
          <p className="mt-1 text-sm text-slate-600 line-clamp-2">{output.excerpt}</p>
        </div>
        <OwnerBadge tone={toneFromOutputStatus(output.status)}>{formatLabel(output.status)}</OwnerBadge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>{output.author}</span>
        <span>&middot;</span>
        <span>{output.createdAtLabel}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CopyTextButton value={output.copyableText} label="Copy brief" />
        <Link href={output.href} className={ownerPrimaryButtonClassName}>
          {output.routeTarget}
          <ArrowUpRight className="h-3 w-3" />
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
    <GlassCard className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            <span>{suggestion.pipelineLabel}</span>
            <span>&middot;</span>
            <span>{suggestion.type}</span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{suggestion.title}</h3>
        </div>
        <OwnerBadge tone={toneFromPriority(suggestion.priority)}>{suggestion.priority}</OwnerBadge>
      </div>

      <p className="mt-2 text-sm text-slate-600">{suggestion.summary}</p>

      <div className="mt-4 grid gap-4 rounded-md border border-slate-100 bg-slate-50 p-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Why now</p>
          <p className="mt-1 text-sm text-slate-700">{suggestion.whyNow}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Execution brief</p>
          <p className="mt-1 text-sm text-slate-700">{suggestion.executionBrief}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CopyTextButton value={copyValue} label="Copy suggestion" />
        <Link href={`/dashboard/owner/pipelines/${suggestion.pipeline}`} className={ownerSecondaryButtonClassName}>
          Open {suggestion.pipelineLabel}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </GlassCard>
  );
}

export function OwnerImportBotCard({ packageItem }: { packageItem: ImportedBotPackage }) {
  return (
    <GlassCard className="p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            <span>{packageItem.source}</span>
            <span>&middot;</span>
            <span>{packageItem.fileName}</span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{packageItem.fileName}</h3>
          <p className="mt-1 text-sm text-slate-600">{packageItem.notes}</p>
        </div>
        <OwnerBadge tone={packageItem.status === 'active' ? 'success' : packageItem.status === 'needs-review' ? 'warning' : 'neutral'}>
          {formatLabel(packageItem.status)}
        </OwnerBadge>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Config preview</p>
          <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-slate-700">{packageItem.preview}</pre>
        </div>

        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Assignments</p>
          <div className="mt-2 space-y-2">
            {packageItem.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{assignment.name}</p>
                  <p className="text-xs text-slate-500">
                    {assignment.role} &middot; {assignment.pipelineLabel}
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

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={ownerSecondaryButtonClassName}>
          Review roles
        </button>
        <button type="button" className={ownerSecondaryButtonClassName}>
          Assign pipelines
        </button>
        <Link href="/dashboard/owner/bot-management" className={ownerPrimaryButtonClassName}>
          Open Bot Management
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </GlassCard>
  );
}

export function OwnerBotCard({ bot }: { bot: BotRecord }) {
  return (
    <GlassCard className="p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            <span>{bot.pipelineLabel}</span>
            <span>&middot;</span>
            <span>{bot.model}</span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{bot.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{bot.role}</p>
        </div>
        <OwnerBadge tone={toneFromBotStatus(bot.status)}>{formatLabel(bot.status)}</OwnerBadge>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Last action</p>
            <p className="mt-1 text-sm text-slate-700">{bot.lastAction}</p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Permissions</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {bot.permissions.map((permission) => (
                <span key={permission} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {permission}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Tools</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {bot.tools.map((tool) => (
                <span key={tool} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Recent actions</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {bot.recentActions.map((action) => (
                <li key={action} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs">
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Logs</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {bot.logs.map((log) => (
                <li key={log} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs">
                  {log}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={ownerSecondaryButtonClassName}>
          <Shield className="h-3 w-3" />
          Edit permissions
        </button>
        <button type="button" className={ownerSecondaryButtonClassName}>
          {bot.status === 'active' || bot.status === 'watching' ? (
            <PauseCircle className="h-3 w-3" />
          ) : (
            <RefreshCcw className="h-3 w-3" />
          )}
          {bot.status === 'active' || bot.status === 'watching' ? 'Pause' : 'Restart'}
        </button>
        <button type="button" className={ownerSecondaryButtonClassName}>
          Reassign
        </button>
        <button type="button" className={ownerSecondaryButtonClassName}>
          <Trash2 className="h-3 w-3" />
          Remove
        </button>
      </div>
    </GlassCard>
  );
}

export function OwnerCodeRefinementCard({ refinement }: { refinement: CodeRefinementSpec }) {
  return (
    <GlassCard className="p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{refinement.pipelineLabel}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">{refinement.title}</h3>
        </div>
        <CopyTextButton value={formatCodeRefinementSpec(refinement)} label="Copy execution spec" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Files to Change</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {refinement.filesToChange.map((file) => (
              <li key={file} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs">
                {file}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Alternative Approaches</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {refinement.alternativeApproaches.map((approach) => (
              <li key={approach} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs">
                {approach}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Suggestion</p>
          <p className="mt-1 text-sm text-slate-700">{refinement.suggestion}</p>
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Why This Helps</p>
          <p className="mt-1 text-sm text-slate-700">{refinement.whyThisHelps}</p>
        </div>
      </div>
    </GlassCard>
  );
}

export function OwnerSettingsSectionCard({ section }: { section: OwnerSettingSection }) {
  return (
    <GlassCard hover={false} className="p-4">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{section.title}</p>
      </div>

      <div className="mt-4 grid gap-4">
        {section.fields.map((field) => (
          <div key={field.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-900">{field.label}</p>
            {renderSettingField(field)}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
