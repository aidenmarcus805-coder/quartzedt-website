import Link from 'next/link';
import { ArrowRight, BellRing, CheckCheck, Sparkles } from 'lucide-react';

import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerOutputCard, OwnerSuggestionCard } from '@/components/owner/OwnerCards';
import {
  OwnerActionLink,
  OwnerPageHeader,
  OwnerSectionHeading,
  OwnerSignalCard,
} from '@/components/owner/OwnerScaffold';
import {
  overviewActivity,
  overviewAlerts,
  overviewSignals,
  ownerOutputs,
  ownerSuggestions,
  pendingApprovals,
  quickActions,
} from '@/lib/owner/data';
import { ownerSecondaryButtonClassName } from '@/lib/owner/present';

export default function OwnerDashboardIndex() {
  return (
    <div className="space-y-10">
      <OwnerPageHeader
        eyebrow="Overview"
        title="Quartz owner overview"
        description="A private control surface for what matters right now: claw activity, approvals, alerts, suggestions, and the next clean move across Quartz."
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/groupchat">Open Groupchat</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/suggestions" subtle>
              Review Suggestions
            </OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewSignals.map((signal) => (
          <OwnerSignalCard key={signal.id} signal={signal} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Important alerts"
            description="Only the items that genuinely need an owner decision or intervention."
            action={<OwnerBadge tone="critical">{overviewAlerts.length} active</OwnerBadge>}
          />

          <div className="mt-6 space-y-4">
            {overviewAlerts.map((alert) => (
              <div key={alert.id} className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <OwnerBadge tone={alert.severity}>{alert.severity}</OwnerBadge>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        alert
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.04em] text-slate-950">
                      {alert.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{alert.detail}</p>
                  </div>

                  <Link href={alert.href} className={ownerSecondaryButtonClassName}>
                    {alert.actionLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Pending approvals"
            description="Approvals queued by the claws so you can unblock the next wave of work."
            action={<OwnerBadge tone="warning">{pendingApprovals.length} waiting</OwnerBadge>}
          />

          <div className="mt-6 space-y-4">
            {pendingApprovals.map((approval) => (
              <Link
                key={approval.id}
                href={approval.href}
                className="block rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      <span>{approval.pipelineLabel}</span>
                      <span>{approval.requestedBy}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                      {approval.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{approval.detail}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-slate-400" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <BellRing className="h-3.5 w-3.5" />
                  {approval.dueLabel}
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Recent claw activity"
            description="What the claws actually did recently, without fake analytics clutter."
          />

          <div className="mt-6 space-y-4">
            {overviewActivity.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 transition hover:border-slate-300"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <OwnerBadge tone={item.tone}>{item.pipelineLabel}</OwnerBadge>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {item.createdAtLabel}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                  {item.agentName}
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-800">{item.action}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
              </Link>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6 sm:p-8">
            <OwnerSectionHeading
              title="Quick actions"
              description="Jump directly into the surfaces that keep Quartz moving."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 transition hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                        {action.label}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{action.description}</p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <OwnerSectionHeading
              title="Recently generated suggestions"
              description="Useful copy-ready thinking waiting for approval or routing."
              action={<OwnerActionLink href="/dashboard/owner/suggestions">View all</OwnerActionLink>}
            />

            <div className="mt-6 grid gap-4">
              {ownerSuggestions.slice(0, 2).map((suggestion) => (
                <OwnerSuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <OwnerSectionHeading
            title="Recent outputs"
            description="The latest generated work across code, marketing, product, and imported claws."
            action={<OwnerActionLink href="/dashboard/owner/outputs">See everything</OwnerActionLink>}
          />

          <div className="grid gap-4">
            {ownerOutputs.slice(0, 2).map((output) => (
              <OwnerOutputCard key={output.id} output={output} />
            ))}
          </div>
        </div>

        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
              <CheckCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Owner principle</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Calm signal over dashboard noise
              </h2>
            </div>
          </div>

          <p className="mt-6 text-sm leading-7 text-slate-600">
            This overview is intentionally opinionated. It only shows the work that needs your eyes, the claws that need direction, and the outputs that are ready to move.
          </p>

          <div className="mt-6 space-y-3 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 text-sm leading-7 text-slate-700">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-slate-400" />
              Groupchat is the communication hub.
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-slate-400" />
              Suggestions and refinements stay copy-paste ready.
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-slate-400" />
              Pipelines remain important, but they are only one part of the system.
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
