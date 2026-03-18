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
