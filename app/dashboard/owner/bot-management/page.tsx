import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerBotCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { ownerBots, ownerPipelines } from '@/lib/owner/data';

export default function OwnerBotManagementPage() {
  const activeCount = ownerBots.filter((bot) => bot.status === 'active').length;
  const watchingCount = ownerBots.filter((bot) => bot.status === 'watching').length;
  const pausedCount = ownerBots.filter((bot) => bot.status === 'paused').length;
  const offlineCount = ownerBots.filter((bot) => bot.status === 'offline').length;

  return (
    <div className="space-y-10">
      <OwnerPageHeader
        eyebrow="Bot Management"
        title="Every claw, model, tool, and status"
        description="See every bot you have, what model it uses, what pipeline it belongs to, its permissions, recent actions, logs, and the controls to pause, restart, remove, or reassign it."
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/import-bot">Import Bot</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/groupchat" subtle>
              Open Groupchat
            </OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Active</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{activeCount}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Currently executing or ready to respond.</p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Watching</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{watchingCount}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Monitoring or waiting for a clean owner decision.</p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Paused / offline</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{pausedCount + offlineCount}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{offlineCount} offline · {pausedCount} paused</p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Pipelines covered</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{ownerPipelines.length}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">Primary lanes and custom staging routes visible to the owner.</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6 sm:p-8">
        <OwnerSectionHeading
          title="Roster"
          description="A quick scan of every bot before you open the detailed controls below."
          action={<OwnerBadge tone="neutral">{ownerBots.length} total</OwnerBadge>}
        />

        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/70">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-4 border-b border-slate-200/80 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 md:grid">
            <span>Bot</span>
            <span>Pipeline</span>
            <span>Model</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-slate-200/80">
            {ownerBots.map((bot) => (
              <div key={bot.id} className="grid gap-3 px-5 py-4 text-sm text-slate-700 md:grid-cols-[1.4fr_1fr_1fr_0.8fr] md:items-center">
                <div>
                  <p className="font-semibold text-slate-900">{bot.name}</p>
                  <p className="mt-1 text-slate-500">{bot.role}</p>
                </div>
                <span>{bot.pipelineLabel}</span>
                <span>{bot.model}</span>
                <span className="text-slate-500">{bot.status}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="space-y-6">
        <OwnerSectionHeading
          title="Detailed bot control"
          description="Inspect logs, review tools and permissions, and adjust what each claw is allowed to do."
        />

        <div className="grid gap-4">
          {ownerBots.map((bot) => (
            <OwnerBotCard key={bot.id} bot={bot} />
          ))}
        </div>
      </div>
    </div>
  );
}
