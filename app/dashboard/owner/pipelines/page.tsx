import { Boxes, Route, Sparkles, Waypoints } from 'lucide-react';

import { GlassCard } from '@/components/owner/GlassCard';
import { PipelineCard } from '@/components/owner/PipelineCard';
import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerActionLink, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { ownerPipelines } from '@/lib/owner/data';
import { ownerSecondaryButtonClassName } from '@/lib/owner/present';

export default function OwnerPipelinesPage() {
  const totalQueue = ownerPipelines.reduce((sum, pipeline) => sum + pipeline.queueCount, 0);
  const totalBots = ownerPipelines.reduce((sum, pipeline) => sum + pipeline.botCount, 0);
  const healthyLanes = ownerPipelines.filter((pipeline) => pipeline.status === 'healthy').length;

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title="Pipelines"
        actions={
          <>
            <button type="button" className={ownerSecondaryButtonClassName}>
              Create pipeline
            </button>
            <OwnerActionLink href="/dashboard/owner/import-bot">Assign imported bots</OwnerActionLink>
          </>
        }
      />

      <div className="flex flex-wrap items-center rounded-lg border border-slate-200 bg-white py-3 shadow-sm">
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Pipelines</p>
          <p className="text-lg font-semibold text-slate-900">{ownerPipelines.length}</p>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Queued work</p>
          <p className="text-lg font-semibold text-slate-900">{totalQueue}</p>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Assigned bots</p>
          <p className="text-lg font-semibold text-slate-900">{totalBots}</p>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Healthy lanes</p>
          <p className="text-lg font-semibold text-slate-900">{healthyLanes}</p>
        </div>
      </div>

      <div className="space-y-4">
        <OwnerSectionHeading title="All pipelines" />

        <div className="grid gap-4 xl:grid-cols-2">
          {ownerPipelines.map((pipeline) => (
            <PipelineCard key={pipeline.slug} pipeline={pipeline} />
          ))}
        </div>
      </div>
    </div>
  );
}
