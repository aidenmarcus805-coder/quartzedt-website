import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerBotCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerEmptyState, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { OWNER_DATA_CONNECTED } from '@/lib/owner/config';
import { ownerBots, ownerPipelines } from '@/lib/owner/data';

export default function OwnerBotManagementPage() {
  if (!OWNER_DATA_CONNECTED) {
    return (
      <div className="space-y-8">
        <OwnerPageHeader
          title="Bot Management"
          actions={<OwnerActionLink href="/dashboard/owner/import-bot">Import Bot</OwnerActionLink>}
        />

        <OwnerSectionHeading title="Bots" />
        <OwnerEmptyState title="No bots" />
      </div>
    );
  }

  const activeCount = ownerBots.filter((bot) => bot.status === 'active').length;
  const watchingCount = ownerBots.filter((bot) => bot.status === 'watching').length;
  const pausedCount = ownerBots.filter((bot) => bot.status === 'paused').length;
  const offlineCount = ownerBots.filter((bot) => bot.status === 'offline').length;

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title="Bot Management"
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/import-bot">Import Bot</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/groupchat" subtle>
              Open Groupchat
            </OwnerActionLink>
          </>
        }
      />

      <div className="flex flex-wrap items-center rounded-lg border border-slate-200 bg-white py-3 shadow-sm">
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Active</p>
          <p className="text-lg font-semibold text-slate-900">{activeCount}</p>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Watching</p>
          <p className="text-lg font-semibold text-slate-900">{watchingCount}</p>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Paused / offline</p>
          <p className="text-lg font-semibold text-slate-900">{pausedCount + offlineCount}</p>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 px-4 last:border-0">
          <p className="text-xs font-medium text-slate-500">Pipelines covered</p>
          <p className="text-lg font-semibold text-slate-900">{ownerPipelines.length}</p>
        </div>
      </div>

      <GlassCard className="p-4">
        <OwnerSectionHeading
          title="Roster"
          action={<OwnerBadge tone="neutral">{ownerBots.length} total</OwnerBadge>}
        />

        <div className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 md:grid">
            <span>Bot</span>
            <span>Pipeline</span>
            <span>Model</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-slate-100">
            {ownerBots.map((bot) => (
              <div key={bot.id} className="grid gap-2 px-4 py-3 text-sm text-slate-700 md:grid-cols-[1.4fr_1fr_1fr_0.8fr] md:items-center">
                <div>
                  <p className="font-medium text-slate-900">{bot.name}</p>
                  <p className="text-xs text-slate-500">{bot.role}</p>
                </div>
                <span className="text-xs">{bot.pipelineLabel}</span>
                <span className="text-xs">{bot.model}</span>
                <span className="text-xs text-slate-500">{bot.status}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4">
        <OwnerSectionHeading title="Detailed bot control" />

        <div className="grid gap-4 xl:grid-cols-2">
          {ownerBots.map((bot) => (
            <OwnerBotCard key={bot.id} bot={bot} />
          ))}
        </div>
      </div>
    </div>
  );
}
