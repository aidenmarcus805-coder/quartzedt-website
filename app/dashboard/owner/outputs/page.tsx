import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerOutputCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerEmptyState, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { OWNER_DATA_CONNECTED } from '@/lib/owner/config';
import { ownerOutputs } from '@/lib/owner/data';

const outputCategories = ['Code refinement', 'Copy draft', 'Social draft', 'Product note', 'SEO suggestion', 'Import review'];

export default function OwnerOutputsPage() {
  if (!OWNER_DATA_CONNECTED) {
    return (
      <div className="space-y-8">
        <OwnerPageHeader
          title="Outputs"
          actions={<OwnerActionLink href="/dashboard/owner/groupchat">Groupchat</OwnerActionLink>}
        />

        <OwnerSectionHeading title="All outputs" />
        <OwnerEmptyState title="No outputs" />
      </div>
    );
  }

  const readyCount = ownerOutputs.filter((output) => output.status === 'ready').length;
  const reviewCount = ownerOutputs.filter((output) => output.status === 'needs-review').length;

  return (
    <div className="space-y-8">
      <OwnerPageHeader
        title="Outputs"
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/groupchat">Send to Groupchat</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/code-refinements" subtle>
              Open Refinements
            </OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <OwnerSectionHeading
            title="Output filters"
            action={<OwnerBadge tone="success">{readyCount} ready</OwnerBadge>}
          />

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {outputCategories.map((category) => (
                <span key={category} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-md border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
              Every output should be easy to review, copy, send to Cursor, or route into another page. This page is built as the clean queue for that work.
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <OwnerSectionHeading title="Routing snapshot" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Ready to move</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{readyCount}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Needs review</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{reviewCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <OwnerSectionHeading title="All outputs" />

        <div className="grid gap-4 xl:grid-cols-2">
          {ownerOutputs.map((output) => (
            <OwnerOutputCard key={output.id} output={output} />
          ))}
        </div>
      </div>
    </div>
  );
}
