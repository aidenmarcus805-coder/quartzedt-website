import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerSettingsSectionCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerEmptyState, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { OWNER_DATA_CONNECTED } from '@/lib/owner/config';
import { ownerSettingSections } from '@/lib/owner/data';

const ownerConfigPreview = `{
  "theme": "light",
  "ownerShell": "quartz",
  "defaultUiPipeline": "Code",
  "groupchatSummaryCadence": "Every major thread",
  "importPolicy": "stage_before_activate"
}`;

export default function OwnerSettingsPage() {
  if (!OWNER_DATA_CONNECTED) {
    return (
      <div className="space-y-8">
        <OwnerPageHeader
          title="Settings"
          actions={<OwnerActionLink href="/dashboard/owner/import-bot">Import Configs</OwnerActionLink>}
        />

        <OwnerSectionHeading title="Owner setting sections" />
        <OwnerEmptyState title="No settings data" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title="Settings"
        actions={
          <>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800">
              Save Changes
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Reset Defaults
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard className="p-4">
          <OwnerSectionHeading title="Config snapshot" />

          <pre className="mt-4 whitespace-pre-wrap break-words rounded-md border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">
            {ownerConfigPreview}
          </pre>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <OwnerSectionHeading title="Owner setting sections" />

        <div className="grid gap-4 xl:grid-cols-2">
          {ownerSettingSections.map((section) => (
            <OwnerSettingsSectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
