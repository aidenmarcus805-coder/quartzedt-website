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
  const customLanes = ownerPipelines.filter((pipeline) => pipeline.slug.includes('custom')).length;

  return (
    <div className="space-y-10">
      <OwnerPageHeader
        eyebrow="Pipelines"
        title="Every Quartz work lane in one place"
        description="View, create, organize, and manage the pipelines that route work across code, marketing, social, product, SEO, experiments, and custom lanes."
        actions={
          <>
            <button type="button" className={ownerSecondaryButtonClassName}>
              Create pipeline
            </button>
            <OwnerActionLink href="/dashboard/owner/import-bot">Assign imported bots</OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Pipelines</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{ownerPipelines.length}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Primary and custom lanes currently configured for the owner dashboard.</p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Queued work</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{totalQueue}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Items currently waiting inside individual pipeline feeds.</p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Assigned bots</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{totalBots}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Active or watching claws distributed across the pipeline network.</p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Healthy lanes</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{healthyLanes}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{customLanes} custom lane{customLanes === 1 ? '' : 's'} included for owner-specific work.</p>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Routing principles"
            description="How Quartz should think about pipeline movement before live integrations are wired in."
            action={<OwnerBadge tone="neutral">Owner defaults</OwnerBadge>}
          />

          <div className="mt-6 grid gap-4">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <div className="flex items-center gap-3 text-slate-500">
                <Route className="h-4 w-4" />
                <p className="text-sm font-semibold text-slate-900">UI work routes to Code first</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Dashboard structure, interaction changes, and implementation-facing notes should land in Code before they spread into other queues.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <div className="flex items-center gap-3 text-slate-500">
                <Sparkles className="h-4 w-4" />
                <p className="text-sm font-semibold text-slate-900">Outputs stay portable</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Anything a claw generates should be easy to scan, copy, route onward, or send into another page without cleanup.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <div className="flex items-center gap-3 text-slate-500">
                <Waypoints className="h-4 w-4" />
                <p className="text-sm font-semibold text-slate-900">Experiments promote deliberately</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Temporary tests should either graduate into a stable pipeline or stay isolated instead of cluttering the system.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Why pipelines matter"
            description="Pipelines are a major surface, but they are not the whole owner dashboard."
          />

          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <p>
              Use pipelines to keep work organized, give bots explicit homes, and define how outputs should move. Then use Groupchat, Suggestions, Outputs, and Code Refinements as the higher-level operating surfaces around them.
            </p>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <div className="flex items-center gap-3 text-slate-500">
                <Boxes className="h-4 w-4" />
                <p className="text-sm font-semibold text-slate-900">Each pipeline has its own feed and behavior</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Open any lane to review its current focus, recent outputs, routing defaults, and the claws assigned to it.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <OwnerSectionHeading
          title="All pipelines"
          description="From the primary lanes to the custom staging routes that support imported bots and one-off owner research."
        />

        <div className="grid gap-6 xl:grid-cols-2">
          {ownerPipelines.map((pipeline) => (
            <PipelineCard key={pipeline.slug} pipeline={pipeline} />
          ))}
        </div>
      </div>
    </div>
  );
}
