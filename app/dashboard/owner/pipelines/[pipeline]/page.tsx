import { notFound } from 'next/navigation';
import { Bot, Route, Sparkles, Waypoints } from 'lucide-react';

import { OWNER_DATA_CONNECTED } from '@/lib/owner/config';
import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerOutputCard, OwnerSuggestionCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerEmptyState, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
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

  if (!OWNER_DATA_CONNECTED) {
    const title = slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    return (
      <div className="space-y-8">
        <OwnerPageHeader
          title={title}
          actions={<OwnerActionLink href="/dashboard/owner/pipelines">Back to Pipelines</OwnerActionLink>}
        />

        <OwnerEmptyState title="No pipeline data" />
      </div>
    );
  }

  const pipeline = getPipelineBySlug(slug);

  if (!pipeline) {
    notFound();
  }

  const outputs = getOutputsForPipeline(slug);
  const suggestions = getSuggestionsForPipeline(slug);
  const bots = ownerBots.filter((bot) => bot.pipeline === slug);

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title={pipeline.name}
        actions={
          <>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800">
              Pause Pipeline
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Clear Queue
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-center rounded-lg border border-slate-200 bg-white py-3 shadow-sm">
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-slate-500">Status</p>
            <OwnerBadge tone={toneFromPipelineStatus(pipeline.status)}>{pipeline.status}</OwnerBadge>
          </div>
          <p className="text-lg font-semibold text-slate-900">{pipeline.queueCount} queued</p>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Assigned bots</p>
          <p className="text-lg font-semibold text-slate-900">{pipeline.botCount}</p>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Recent outputs</p>
          <p className="text-lg font-semibold text-slate-900">{outputs.length}</p>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Suggestions</p>
          <p className="text-lg font-semibold text-slate-900">{suggestions.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <OwnerSectionHeading title="Current focus" />

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-700">{pipeline.focus}</p>

            <div className="mt-6">
              <div className="flex items-center gap-2 text-slate-500">
                <Waypoints className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">Assigned claws</p>
              </div>
              <div className="mt-3 space-y-2">
                {bots.length > 0 ? (
                  bots.map((bot) => (
                    <div key={bot.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{bot.name}</p>
                          <p className="text-xs text-slate-500">{bot.role}</p>
                        </div>
                        <OwnerBadge tone="neutral">{bot.status}</OwnerBadge>
                      </div>
                      <p className="mt-2 text-xs text-slate-600">{bot.lastAction}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No direct bot records are attached yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <OwnerSectionHeading title="Routing behavior" />

          <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Route className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">Intake</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">{pipeline.routing.intake}</p>
            </div>
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Sparkles className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">Review surface</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">{pipeline.routing.review}</p>
            </div>
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Bot className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">Dispatch</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">{pipeline.routing.dispatch}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <OwnerSectionHeading title="Pipeline feed" />

        {outputs.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {outputs.map((output) => (
              <OwnerOutputCard key={output.id} output={output} showPipeline={false} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            This pipeline does not have any mock outputs yet.
          </div>
        )}
      </div>

      <div className="space-y-4">
        <OwnerSectionHeading title="Related suggestions" />

        {suggestions.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {suggestions.map((suggestion) => (
              <OwnerSuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            No suggestions are attached yet.
          </div>
        )}
      </div>
    </div>
  );
}
