import { FileJson2, ShieldCheck, Upload } from 'lucide-react';

import { OWNER_DATA_CONNECTED } from '@/lib/owner/config';
import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerImportBotCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerEmptyState, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { importedBotPackages } from '@/lib/owner/data';

export default function OwnerImportBotPage() {
  if (!OWNER_DATA_CONNECTED) {
    return (
      <div className="space-y-8">
        <OwnerPageHeader
          title="Import Bot"
          actions={<OwnerActionLink href="/dashboard/owner/bot-management">Bot Management</OwnerActionLink>}
        />

        <OwnerSectionHeading title="Imported packages" />
        <OwnerEmptyState title="No imported packages" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title="Import Bot"
        actions={
          <>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800">
              Validate Config
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Clear Staged
            </button>
          </>
        }
      />

      <div className="space-y-4">
        <OwnerSectionHeading title="Imported packages" />

        <div className="grid gap-4 xl:grid-cols-2">
          {importedBotPackages.map((packageItem) => (
            <OwnerImportBotCard key={packageItem.id} packageItem={packageItem} />
          ))}
        </div>
      </div>
    </div>
  );
}
