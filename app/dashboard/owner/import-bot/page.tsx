import { FileJson2, ShieldCheck, Upload } from 'lucide-react';

import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerImportBotCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { importedBotPackages } from '@/lib/owner/data';
import { ownerSecondaryButtonClassName } from '@/lib/owner/present';

export default function OwnerImportBotPage() {
  return (
    <div className="space-y-10">
      <OwnerPageHeader
        eyebrow="Import Bot"
        title="Bring in OpenClaw and KiloClaw configs"
        description="Upload config files like openclaw.json, inspect imported bots, assign them to pipelines, activate or deactivate them, and keep role decisions deliberate."
        actions={
          <>
            <button type="button" className={ownerSecondaryButtonClassName}>
              Upload openclaw.json
            </button>
            <OwnerActionLink href="/dashboard/owner/bot-management">Open Bot Management</OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
              <Upload className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Import workflow</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">Stage first, activate second</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Imported bots should enter Quartz quietly. Review the bundle, confirm roles, assign a pipeline, then activate only what is actually safe and useful.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <div className="flex items-center gap-3 text-slate-500">
                <FileJson2 className="h-4 w-4" />
                <p className="text-sm font-semibold text-slate-900">Supported bundles</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                OpenClaw config files, KiloClaw bundle exports, and owner-specific assistant definitions.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <div className="flex items-center gap-3 text-slate-500">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-sm font-semibold text-slate-900">Permission review</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Treat tool and role permissions as owner decisions, not defaults hidden inside imported JSON.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Example import payload</p>
            <pre className="mt-3 whitespace-pre-wrap break-words text-xs leading-6 text-slate-700">
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

        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Assignment checklist"
            description="A simple owner flow for imported bot review."
          />

          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <p className="font-semibold text-slate-900">1. Inspect the config</p>
              <p className="mt-2">Confirm what the bundle is trying to do before it touches any live pipeline.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <p className="font-semibold text-slate-900">2. Assign the right lane</p>
              <p className="mt-2">Choose the pipeline that best matches the bot’s role instead of letting it float into a generic queue.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <p className="font-semibold text-slate-900">3. Limit permissions</p>
              <p className="mt-2">Give imported bots only the tools and authority they actually need.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <p className="font-semibold text-slate-900">4. Activate intentionally</p>
              <p className="mt-2">Only promote staged bots into the live system after their route and role are clear.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <OwnerSectionHeading
          title="Imported packages"
          description="Review each staged or active import bundle, inspect what came in, and decide where it belongs."
        />

        <div className="grid gap-4">
          {importedBotPackages.map((packageItem) => (
            <OwnerImportBotCard key={packageItem.id} packageItem={packageItem} />
          ))}
        </div>
      </div>
    </div>
  );
}
