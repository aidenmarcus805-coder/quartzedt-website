import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerCodeRefinementCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { codeRefinementSpecs } from '@/lib/owner/data';

export default function OwnerCodeRefinementsPage() {
  return (
    <div className="space-y-10">
      <OwnerPageHeader
        eyebrow="Code Refinements"
        title="Plain-English execution specs"
        description="Structured code improvement specs written for execution, not raw diffs. Each refinement is copy-paste ready for another AI or a manual implementation pass."
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/pipelines/code">Open Code Pipeline</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/outputs" subtle>
              See Related Outputs
            </OwnerActionLink>
          </>
        }
      />

      <GlassCard className="p-6 sm:p-8">
        <OwnerSectionHeading
          title="Spec format"
          description="Every refinement follows the same owner-readable template."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {['Title', 'Files to Change', 'Suggestion', 'Why This Helps', 'Alternative Approaches'].map((item) => (
            <div key={item} className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 text-sm font-semibold text-slate-800">
              {item}
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-600">
          This page intentionally avoids raw code, raw console output, and raw diffs. It is designed for clean execution handoff.
        </p>
      </GlassCard>

      <div className="space-y-6">
        <OwnerSectionHeading
          title="Refinement queue"
          description="Structured improvements prepared by the claws for implementation or delegation."
        />

        <div className="grid gap-4">
          {codeRefinementSpecs.map((refinement) => (
            <OwnerCodeRefinementCard key={refinement.id} refinement={refinement} />
          ))}
        </div>
      </div>
    </div>
  );
}
