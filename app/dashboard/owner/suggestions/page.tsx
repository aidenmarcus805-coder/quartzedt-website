import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerSuggestionCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { ownerSuggestions } from '@/lib/owner/data';

const suggestionTypes = ['Code refinement', 'Marketing', 'Workflow', 'Product', 'Pipeline'];

export default function OwnerSuggestionsPage() {
  const highPriority = ownerSuggestions.filter((suggestion) => suggestion.priority === 'High');

  return (
    <div className="space-y-10">
      <OwnerPageHeader
        eyebrow="Suggestions"
        title="Copy-ready improvements and ideas"
        description="A dedicated owner surface for AI-generated suggestions, workflow improvements, feature ideas, code refinement specs, and pipeline recommendations."
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/code-refinements">Open Refinements</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/pipelines" subtle>
              See Pipelines
            </OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="How to use this page"
            description="Everything here is written to be easy to copy into another AI, route into a pipeline, or act on manually."
            action={<OwnerBadge tone="warning">{highPriority.length} high priority</OwnerBadge>}
          />

          <div className="mt-6 flex flex-wrap gap-2">
            {suggestionTypes.map((type) => (
              <span key={type} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                {type}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600">
            Suggestions stay deliberately plain. They are not raw code, not noisy analytics, and not generic AI filler. They should read like clear work you can hand off immediately.
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Priority queue"
            description="The suggestions that most directly affect current owner workflows."
          />

          <div className="mt-6 grid gap-4">
            {highPriority.map((suggestion) => (
              <OwnerSuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <OwnerSectionHeading
          title="All suggestions"
          description="Organized, filterable in spirit, and ready to copy into another AI or to route directly into Quartz."
        />

        <div className="grid gap-4">
          {ownerSuggestions.map((suggestion) => (
            <OwnerSuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      </div>
    </div>
  );
}
