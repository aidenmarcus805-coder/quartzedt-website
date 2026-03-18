import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerSuggestionCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerEmptyState, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { OWNER_DATA_CONNECTED } from '@/lib/owner/config';
import { ownerSuggestions } from '@/lib/owner/data';

const suggestionTypes = ['Code refinement', 'Marketing', 'Workflow', 'Product', 'Pipeline'];

export default function OwnerSuggestionsPage() {
  if (!OWNER_DATA_CONNECTED) {
    return (
      <div className="space-y-8">
        <OwnerPageHeader
          title="Suggestions"
          actions={<OwnerActionLink href="/dashboard/owner/code-refinements">Refinements</OwnerActionLink>}
        />

        <OwnerSectionHeading title="All suggestions" />
        <OwnerEmptyState title="No suggestions" />
      </div>
    );
  }

  const highPriority = ownerSuggestions.filter((suggestion) => suggestion.priority === 'High');

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title="Suggestions"
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/code-refinements">Open Refinements</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/pipelines" subtle>
              See Pipelines
            </OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <OwnerSectionHeading
            title="How to use this page"
            action={<OwnerBadge tone="warning">{highPriority.length} high priority</OwnerBadge>}
          />

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {suggestionTypes.map((type) => (
                <span key={type} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
                  {type}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-md border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
              Suggestions stay deliberately plain. They are not raw code, not noisy analytics, and not generic AI filler. They should read like clear work you can hand off immediately.
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <OwnerSectionHeading title="Priority queue" />

          <div className="grid gap-4">
            {highPriority.map((suggestion) => (
              <OwnerSuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <OwnerSectionHeading title="All suggestions" />

        <div className="grid gap-4 xl:grid-cols-2">
          {ownerSuggestions.map((suggestion) => (
            <OwnerSuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      </div>
    </div>
  );
}
