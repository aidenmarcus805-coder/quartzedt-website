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
        actions={<OwnerActionLink href="/dashboard/owner/bot-management">Open Bot Management</OwnerActionLink>}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard className="p-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-500">
              <Upload className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Import workflow</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">Stage first, activate second</h2>
              <p className="mt-1 text-sm text-slate-600">
                Imported bots should enter Quartz quietly. Review the bundle, confirm roles, assign a pipeline, then activate only what is actually safe and useful.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-500">
                <FileJson2 className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">Supported bundles</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                OpenClaw config files, KiloClaw bundle exports, and owner-specific assistant definitions.
              </p>
            </div>
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">Permission review</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Treat tool and role permissions as owner decisions, not defaults hidden inside imported JSON.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Example import payload</p>
            <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-slate-700">
{`{
  "name": "launch-week",
  "source": "OpenClaw",
  "defaultModel": "gpt-4.1",
  "bots": [
    { "name": "Founder Voice", "role": "launch copy cleanup" },
    { "name": "Hook Draft", "role": "social variations" }
  ]
}`}
            </pre>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <OwnerSectionHeading title="Assignment checklist" />

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <p className="font-medium text-slate-900">1. Inspect the config</p>
              <p className="mt-1">Confirm what the bundle is trying to do before it touches any live pipeline.</p>
            </div>
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <p className="font-medium text-slate-900">2. Assign the right lane</p>
              <p className="mt-1">Choose the pipeline that best matches the bot’s role instead of letting it float into a generic queue.</p>
            </div>
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <p className="font-medium text-slate-900">3. Limit permissions</p>
              <p className="mt-1">Give imported bots only the tools and authority they actually need.</p>
            </div>
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <p className="font-medium text-slate-900">4. Activate intentionally</p>
              <p className="mt-1">Only promote staged bots into the live system after their route and role are clear.</p>
            </div>
          </div>
        </GlassCard>
      </div>

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
