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
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800">
              Approve All
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Filter Suggestions
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <OwnerSectionHeading
            title="Priority queue"
            action={<OwnerBadge tone="warning">{highPriority.length} high priority</OwnerBadge>}
          />

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
