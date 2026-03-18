import Link from 'next/link';
import { ArrowUpRight, Bot, Route, Rows3 } from 'lucide-react';

import { ownerPrimaryButtonClassName, toneFromPipelineStatus } from '@/lib/owner/present';
import type { PipelineSummary } from '@/lib/owner/types';

import { GlassCard } from './GlassCard';
import { OwnerBadge } from './OwnerBadge';

export const PipelineCard = ({ pipeline }: { pipeline: PipelineSummary }) => {
  return (
    <GlassCard className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pipeline.accent }} />
            <span>Pipeline</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{pipeline.name}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{pipeline.description}</p>
        </div>
        <OwnerBadge tone={toneFromPipelineStatus(pipeline.status)}>{pipeline.status}</OwnerBadge>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Queued</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{pipeline.queueCount}</p>
        </div>
        <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Bots</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{pipeline.botCount}</p>
        </div>
        <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Recent outputs</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{pipeline.recentOutputCount}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Current focus</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{pipeline.focus}</p>
        </div>

        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <Bot className="h-4 w-4" />
            Assigned bots
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pipeline.assignedBots.map((bot) => (
              <span key={bot} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {bot}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <Rows3 className="h-4 w-4" />
            Recent outputs
          </p>
          <div className="mt-3 space-y-2">
            {pipeline.recentOutputs.slice(0, 2).map((output) => (
              <div
                key={output.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{output.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {output.kind} · {output.createdAtLabel}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500">{output.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-4">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <Route className="h-4 w-4" />
            Routing behavior
          </p>
          <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Intake:</span> {pipeline.routing.intake}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Review:</span> {pipeline.routing.review}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Dispatch:</span> {pipeline.routing.dispatch}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200/70 pt-6">
        <p className="text-sm text-slate-500">Each pipeline keeps its own feed, recent outputs, and routing defaults.</p>
        <Link href={`/dashboard/owner/pipelines/${pipeline.slug}`} className={ownerPrimaryButtonClassName}>
          Open pipeline
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </GlassCard>
  );
};
