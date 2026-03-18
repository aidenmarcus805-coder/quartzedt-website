import { OWNER_DATA_CONNECTED } from '@/lib/owner/config';
import { OwnerGroupchatWorkspace } from '@/components/owner/OwnerGroupchatWorkspace';
import { OwnerActionLink, OwnerEmptyState, OwnerPageHeader } from '@/components/owner/OwnerScaffold';
import { groupchatContexts } from '@/lib/owner/data';

export default function OwnerGroupchatPage() {
  if (!OWNER_DATA_CONNECTED) {
    return (
      <div className="space-y-8">
        <OwnerPageHeader
          title="OpenClaw Groupchat"
          actions={<OwnerActionLink href="/dashboard/owner/outputs">Outputs</OwnerActionLink>}
        />

        <OwnerEmptyState title="OpenClaw is not connected" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title="OpenClaw Groupchat"
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/outputs">Review Outputs</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/suggestions" subtle>
              Open Suggestions
            </OwnerActionLink>
          </>
        }
      />

      <OwnerGroupchatWorkspace contexts={groupchatContexts} initialContextId="owner-hq" />
    </div>
  );
}
