import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerSettingsSectionCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { ownerSettingSections } from '@/lib/owner/data';

const ownerConfigPreview = `{
  "theme": "light",
  "ownerShell": "quartz",
  "defaultUiPipeline": "Code",
  "groupchatSummaryCadence": "Every major thread",
  "importPolicy": "stage_before_activate"
}`;

export default function OwnerSettingsPage() {
  return (
    <div className="space-y-10">
      <OwnerPageHeader
        eyebrow="Settings"
        title="Owner defaults, keys, routing, and integrations"
        description="Configure private owner access, bot defaults, pipeline routing rules, UI preferences, API keys, and Quartz-specific integration behavior."
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/import-bot">Import Configs</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/bot-management" subtle>
              Open Bot Management
            </OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Config snapshot"
            description="A readable owner-oriented view of the current operating defaults."
          />

          <pre className="mt-6 whitespace-pre-wrap break-words rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 text-xs leading-6 text-slate-700">
            {ownerConfigPreview}
          </pre>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Why these settings exist"
            description="The owner dashboard is not a generic account panel. These settings shape how Quartz thinks and routes work for you."
          />

          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              Authentication and verification keep the owner area private without forcing the rest of the app into owner-specific behavior.
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              Routing rules protect work from drifting into the wrong pipeline and make sure groupchat, outputs, and suggestions stay coherent.
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              Integration notes stay visible here so imported bots, KiloClaw, OpenClaw, and search tooling all remain easy to audit.
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <OwnerSectionHeading
          title="Owner setting sections"
          description="Everything needed to tune the private Quartz operating system before live data arrives."
        />

        <div className="grid gap-4">
          {ownerSettingSections.map((section) => (
            <OwnerSettingsSectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
