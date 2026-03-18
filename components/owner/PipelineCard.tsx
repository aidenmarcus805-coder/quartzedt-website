import Link from 'next/link';
import { ArrowUpRight, Bot, Route, Rows3 } from 'lucide-react';

import { ownerPrimaryButtonClassName, toneFromPipelineStatus } from '@/lib/owner/present';
import type { PipelineSummary } from '@/lib/owner/types';

import { GlassCard } from './GlassCard';
import { OwnerBadge } from './OwnerBadge';

export const PipelineCard = ({ pipeline }: { pipeline: PipelineSummary }) => {
  return (
    <GlassCard className="flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pipeline.accent }} />
            <span>Pipeline</span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{pipeline.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{pipeline.description}</p>
        </div>
        <OwnerBadge tone={toneFromPipelineStatus(pipeline.status)}>{pipeline.status}</OwnerBadge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Queued</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{pipeline.queueCount}</p>
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Bots</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{pipeline.botCount}</p>
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Recent outputs</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{pipeline.recentOutputCount}</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Current focus</p>
          <p className="mt-1 text-sm text-slate-700">{pipeline.focus}</p>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            <Bot className="h-3 w-3" />
            Assigned bots
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pipeline.assignedBots.map((bot) => (
              <span key={bot} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {bot}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            <Rows3 className="h-3 w-3" />
            Recent outputs
          </p>
          <div className="mt-2 space-y-2">
            {pipeline.recentOutputs.slice(0, 2).map((output) => (
              <div
                key={output.id}
                className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{output.title}</p>
                  <p className="text-xs text-slate-500">
                    {output.kind} &middot; {output.createdAtLabel}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500">{output.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            <Route className="h-3 w-3" />
            Routing behavior
          </p>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-medium text-slate-900">Intake:</span> {pipeline.routing.intake}
            </p>
            <p>
              <span className="font-medium text-slate-900">Review:</span> {pipeline.routing.review}
            </p>
            <p>
              <span className="font-medium text-slate-900">Dispatch:</span> {pipeline.routing.dispatch}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Link href={`/dashboard/owner/pipelines/${pipeline.slug}`} className={ownerPrimaryButtonClassName}>
          Open pipeline
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </GlassCard>
  );
};
