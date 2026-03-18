import { MessageSquareMore, Sparkles, Workflow } from 'lucide-react';

import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerGroupchatWorkspace } from '@/components/owner/OwnerGroupchatWorkspace';
import { OwnerActionLink, OwnerPageHeader } from '@/components/owner/OwnerScaffold';
import { groupchatContexts } from '@/lib/owner/data';

export default function OwnerGroupchatPage() {
  return (
    <div className="space-y-10">
      <OwnerPageHeader
        eyebrow="OpenClaw Groupchat"
        title="Talk to the claws together"
        description="This is the main communication hub for Quartz owner workflows: switch contexts, review threaded responses, issue commands, and watch the claws work in real time."
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/outputs">Review Outputs</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/suggestions" subtle>
              Open Suggestions
            </OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center gap-3 text-slate-500">
            <MessageSquareMore className="h-4 w-4" />
            <p className="text-sm font-semibold text-slate-900">Threaded responses</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Keep multiple conversations clean by anchoring replies to a thread instead of letting everything mix together.
          </p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center gap-3 text-slate-500">
            <Workflow className="h-4 w-4" />
            <p className="text-sm font-semibold text-slate-900">Context switching</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Move between Owner HQ, code rooms, and future lane-specific chats without losing the narrative of the work.
          </p>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center gap-3 text-slate-500">
            <Sparkles className="h-4 w-4" />
            <p className="text-sm font-semibold text-slate-900">Owner command surface</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Use the composer to ask for summaries, reroute work, or push the next instruction to every relevant claw at once.
          </p>
        </GlassCard>
      </div>

      <OwnerGroupchatWorkspace contexts={groupchatContexts} initialContextId="owner-hq" />
    </div>
  );
}
