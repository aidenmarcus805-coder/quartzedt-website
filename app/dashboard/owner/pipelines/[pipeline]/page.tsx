import { notFound } from 'next/navigation';
import { Bot, Route, Sparkles, Waypoints } from 'lucide-react';

import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerOutputCard, OwnerSuggestionCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import {
  getOutputsForPipeline,
  getPipelineBySlug,
  getSuggestionsForPipeline,
  ownerBots,
} from '@/lib/owner/data';
import { toneFromPipelineStatus } from '@/lib/owner/present';

export default async function OwnerPipelineDetailPage({
  params,
}: {
  params: Promise<{ pipeline: string }>;
}) {
  const { pipeline: slug } = await params;
  const pipeline = getPipelineBySlug(slug);

  if (!pipeline) {
    notFound();
  }

  const outputs = getOutputsForPipeline(slug);
  const suggestions = getSuggestionsForPipeline(slug);
  const bots = ownerBots.filter((bot) => bot.pipeline === slug);

  return (
    <div className="space-y-10">
      <OwnerPageHeader
        eyebrow="Pipeline detail"
        title={pipeline.name}
        description={pipeline.description}
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/groupchat">Open Groupchat</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/outputs" subtle>
              View Outputs
            </OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <GlassCard hover={false} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Status</p>
            <OwnerBadge tone={toneFromPipelineStatus(pipeline.status)}>{pipeline.status}</OwnerBadge>
          </div>
          <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{pipeline.queueCount} queued</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Current work waiting inside the {pipeline.name} feed.</p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Assigned bots</p>
          <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{pipeline.botCount}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Claws currently attached to this pipeline.</p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Recent outputs</p>
          <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{outputs.length}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Items that can be reviewed, copied, or routed onward.</p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Suggestions</p>
          <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{suggestions.length}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Copy-ready improvements tied to this lane.</p>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Current focus"
            description="What this pipeline is supposed to protect and produce right now."
          />

          <p className="mt-6 text-sm leading-7 text-slate-600">{pipeline.focus}</p>

          <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
            <div className="flex items-center gap-3 text-slate-500">
              <Waypoints className="h-4 w-4" />
              <p className="text-sm font-semibold text-slate-900">Assigned claws</p>
            </div>
            <div className="mt-4 space-y-3">
              {bots.length > 0 ? (
                bots.map((bot) => (
                  <div key={bot.id} className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{bot.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{bot.role}</p>
                      </div>
                      <OwnerBadge tone="neutral">{bot.status}</OwnerBadge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{bot.lastAction}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-sm text-slate-500">
                  No direct bot records are attached yet, but the pipeline routing structure is ready.
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Routing behavior"
            description="How work should enter, be reviewed, and leave this pipeline."
            action={<OwnerBadge tone="neutral">Owner rule set</OwnerBadge>}
          />

          <div className="mt-6 grid gap-4">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <div className="flex items-center gap-3 text-slate-500">
                <Route className="h-4 w-4" />
                <p className="text-sm font-semibold text-slate-900">Intake</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pipeline.routing.intake}</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <div className="flex items-center gap-3 text-slate-500">
                <Sparkles className="h-4 w-4" />
                <p className="text-sm font-semibold text-slate-900">Review surface</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pipeline.routing.review}</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <div className="flex items-center gap-3 text-slate-500">
                <Bot className="h-4 w-4" />
                <p className="text-sm font-semibold text-slate-900">Dispatch</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pipeline.routing.dispatch}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <OwnerSectionHeading
          title="Pipeline feed"
          description="Recent outputs produced inside this lane, ready to review or route."
        />

        {outputs.length > 0 ? (
          <div className="grid gap-4">
            {outputs.map((output) => (
              <OwnerOutputCard key={output.id} output={output} showPipeline={false} />
            ))}
          </div>
        ) : (
          <GlassCard className="p-8 text-sm leading-7 text-slate-600">
            This pipeline does not have any mock outputs yet, but its routing behavior and shell are in place.
          </GlassCard>
        )}
      </div>

      <div className="space-y-6">
        <OwnerSectionHeading
          title="Related suggestions"
          description="Execution-ready improvement notes tied specifically to this pipeline."
        />

        {suggestions.length > 0 ? (
          <div className="grid gap-4">
            {suggestions.map((suggestion) => (
              <OwnerSuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        ) : (
          <GlassCard className="p-8 text-sm leading-7 text-slate-600">
            No suggestions are attached yet. Use Groupchat or Suggestions to generate new work for this lane.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
