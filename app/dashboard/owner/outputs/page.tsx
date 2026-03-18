import { GlassCard } from '@/components/owner/GlassCard';
import { OwnerBadge } from '@/components/owner/OwnerBadge';
import { OwnerOutputCard } from '@/components/owner/OwnerCards';
import { OwnerActionLink, OwnerPageHeader, OwnerSectionHeading } from '@/components/owner/OwnerScaffold';
import { ownerOutputs } from '@/lib/owner/data';

const outputCategories = ['Code refinement', 'Copy draft', 'Social draft', 'Product note', 'SEO suggestion', 'Import review'];

export default function OwnerOutputsPage() {
  const readyCount = ownerOutputs.filter((output) => output.status === 'ready').length;
  const reviewCount = ownerOutputs.filter((output) => output.status === 'needs-review').length;

  return (
    <div className="space-y-10">
      <OwnerPageHeader
        eyebrow="Outputs"
        title="Everything the claws generate"
        description="A dedicated output surface for code refinement specs, copy drafts, product ideas, SEO notes, social content, import reviews, and system notices."
        actions={
          <>
            <OwnerActionLink href="/dashboard/owner/groupchat">Send to Groupchat</OwnerActionLink>
            <OwnerActionLink href="/dashboard/owner/code-refinements" subtle>
              Open Refinements
            </OwnerActionLink>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Output filters"
            description="Scan by type mentally now, then wire these filters to real data later."
            action={<OwnerBadge tone="success">{readyCount} ready</OwnerBadge>}
          />

          <div className="mt-6 flex flex-wrap gap-2">
            {outputCategories.map((category) => (
              <span key={category} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                {category}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600">
            Every output should be easy to review, copy, send to Cursor, or route into another page. This page is built as the clean queue for that work.
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8">
          <OwnerSectionHeading
            title="Routing snapshot"
            description="How much work is already ready versus still waiting for owner attention."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Ready to move</p>
              <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{readyCount}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">Outputs already clean enough to copy, route, or publish.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Needs review</p>
              <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{reviewCount}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">Items that still want an owner check before leaving their lane.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <OwnerSectionHeading
          title="All outputs"
          description="The latest generated work across the entire owner system, ordered as a practical scan surface."
        />

        <div className="grid gap-4">
          {ownerOutputs.map((output) => (
            <OwnerOutputCard key={output.id} output={output} />
          ))}
        </div>
      </div>
    </div>
  );
}
