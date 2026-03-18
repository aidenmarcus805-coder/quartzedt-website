import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerCodeRefinementCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerEmptyState, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { OWNER_DATA_CONNECTED } from '@/lib/owner/config';
import { codeRefinementSpecs } from '@/lib/owner/data';

export default function OwnerCodeRefinementsPage() {
  if (!OWNER_DATA_CONNECTED) {
    return (
      <div className="space-y-8">
        <OwnerPageHeader
          title="Code Refinements"
          actions={<OwnerActionLink href="/dashboard/owner/pipelines/code">Code Pipeline</OwnerActionLink>}
        />

        <OwnerSectionHeading title="Refinement queue" />
        <OwnerEmptyState title="No refinements" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title="Code Refinements"
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/pipelines/code">Open Code Pipeline</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/outputs" subtle>
              See Related Outputs
            </OwnerActionLink>
          </>
        }
      />

      <GlassCard className="p-4">
        <OwnerSectionHeading title="Spec format" />

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {['Title', 'Files to Change', 'Suggestion', 'Why This Helps', 'Alternative Approaches'].map((item) => (
            <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900">
              {item}
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-600">
          This page intentionally avoids raw code, raw console output, and raw diffs. It is designed for clean execution handoff.
        </p>
      </GlassCard>

      <div className="space-y-4">
        <OwnerSectionHeading title="Refinement queue" />

        <div className="grid gap-4">
          {codeRefinementSpecs.map((refinement) => (
            <OwnerCodeRefinementCard key={refinement.id} refinement={refinement} />
          ))}
        </div>
      </div>
    </div>
  );
}
