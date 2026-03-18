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
          actions={
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800">
              New Thread
            </button>
          }
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
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800">
              New Thread
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Clear Chat
            </button>
          </>
        }
      />

      <OwnerGroupchatWorkspace contexts={groupchatContexts} initialContextId="owner-hq" />
    </div>
  );
}
