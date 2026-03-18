import { PipelineCard } from '@/components/owner/PipelineCard';
import { OWNER_DATA_CONNECTED } from '@/lib/owner/config';
import { OwnerActionLink, OwnerEmptyState, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { ownerPipelines } from '@/lib/owner/data';

export default function OwnerPipelinesPage() {
  if (!OWNER_DATA_CONNECTED) {
    return (
      <div className="space-y-8">
        <OwnerPageHeader
          title="Pipelines"
          actions={<OwnerActionLink href="/dashboard/owner/import-bot">Assign imported bots</OwnerActionLink>}
        />

        <OwnerSectionHeading title="All pipelines" />
        <OwnerEmptyState title="No pipelines" />
      </div>
    );
  }

  const totalQueue = ownerPipelines.reduce((sum, pipeline) => sum + pipeline.queueCount, 0);
  const totalBots = ownerPipelines.reduce((sum, pipeline) => sum + pipeline.botCount, 0);
  const healthyLanes = ownerPipelines.filter((pipeline) => pipeline.status === 'healthy').length;

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title="Pipelines"
        actions={
          <>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800">
              Rebalance Queues
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Sync Pipelines
            </button>
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
