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
            <OwnerActionLink href="/dashboard/owner/import-bot">Import Configs</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/bot-management" subtle>
              Open Bot Management
            </OwnerActionLink>
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

        <GlassCard className="p-4">
          <OwnerSectionHeading title="Why these settings exist" />

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              Authentication and verification keep the owner area private without forcing the rest of the app into owner-specific behavior.
            </div>
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              Routing rules protect work from drifting into the wrong pipeline and make sure groupchat, outputs, and suggestions stay coherent.
            </div>
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              Integration notes stay visible here so imported bots, KiloClaw, OpenClaw, and search tooling all remain easy to audit.
            </div>
          </div>
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
