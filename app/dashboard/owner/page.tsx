import Link from 'next/link';
import { ArrowRight, BellRing } from 'lucide-react';

import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerOutputCard, OwnerSuggestionCard } from '@/components/owner/OwnerCards';
import {
  OwnerActionLink,
  OwnerEmptyState,
  OwnerPageHeader,
  OwnerSectionHeading,
  OwnerSignalCard,
} from '@/components/owner/OwnerScaffold';
import { OWNER_DATA_CONNECTED } from '@/lib/owner/config';
import {
  overviewActivity,
  overviewAlerts,
  overviewSignals,
  ownerOutputs,
  ownerSuggestions,
  pendingApprovals,
  quickActions,
} from '@/lib/owner/data';

export default function OwnerDashboardIndex() {
  if (!OWNER_DATA_CONNECTED) {
    return (
      <div className="space-y-8">
        <OwnerPageHeader
          title="Overview"
          actions={
            <>
              <OwnerActionLink href="/dashboard/owner/groupchat">Open Groupchat</OwnerActionLink>
              <OwnerActionLink href="/dashboard/owner/suggestions" subtle>
                Suggestions
              </OwnerActionLink>
            </>
          }
        />

        <OwnerEmptyState title="No owner data" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title="Overview"
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/groupchat">Open Groupchat</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/suggestions" subtle>
              Review Suggestions
            </OwnerActionLink>
          </>
        }
      />

      <div className="flex flex-wrap items-center rounded-lg border border-slate-200 bg-white py-3 shadow-sm">
        {overviewSignals.map((signal) => (
          <OwnerSignalCard key={signal.id} signal={signal} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <OwnerSectionHeading
            title="Important alerts"
            action={<OwnerBadge tone="critical">{overviewAlerts.length} active</OwnerBadge>}
          />

          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm">
            {overviewAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <OwnerBadge tone={alert.severity}>{alert.severity}</OwnerBadge>
                    <h3 className="truncate text-sm font-medium text-slate-900">
                      {alert.title}
                    </h3>
                  </div>
                </div>
                <Link href={alert.href} className="shrink-0 text-xs font-medium text-slate-600 hover:text-slate-900">
                  {alert.actionLabel} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <OwnerSectionHeading
            title="Pending approvals"
            action={<OwnerBadge tone="warning">{pendingApprovals.length} waiting</OwnerBadge>}
          />

          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm">
            {pendingApprovals.map((approval) => (
              <Link
                key={approval.id}
                href={approval.href}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    <span>{approval.pipelineLabel}</span>
                    <span>&middot;</span>
                    <span>{approval.requestedBy}</span>
                  </div>
                  <h3 className="mt-1 truncate text-sm font-medium text-slate-900">
                    {approval.title}
                  </h3>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500">
                  <BellRing className="h-3 w-3" />
                  {approval.dueLabel}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <OwnerSectionHeading title="Recent claw activity" />

          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm">
            {overviewActivity.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <OwnerBadge tone={item.tone}>{item.pipelineLabel}</OwnerBadge>
                    <span className="text-sm font-medium text-slate-900">{item.agentName}</span>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    {item.createdAtLabel}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.action}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <OwnerSectionHeading title="Quick actions" />

            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="text-sm font-medium text-slate-900">{action.label}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <OwnerSectionHeading
              title="Recently generated suggestions"
              action={<OwnerActionLink href="/dashboard/owner/suggestions">View all</OwnerActionLink>}
            />

            <div className="grid gap-3">
              {ownerSuggestions.slice(0, 2).map((suggestion) => (
                <OwnerSuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <OwnerSectionHeading
          title="Recent outputs"
          action={<OwnerActionLink href="/dashboard/owner/outputs">See everything</OwnerActionLink>}
        />

        <div className="grid gap-4 xl:grid-cols-2">
          {ownerOutputs.slice(0, 2).map((output) => (
            <OwnerOutputCard key={output.id} output={output} />
          ))}
        </div>
      </div>
    </div>
  );
}
