import { prisma } from "@/app/lib/prisma";
import { PipelineCard } from "@/components/owner/PipelineCard";
import { LiveStats } from "@/components/owner/LiveStats";
import { KiloClawChat } from "@/components/owner/KiloClawChat";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PipelineFeedPage({ params }: { params: Promise<{ pipeline: string }> }) {
    const { pipeline: slug } = await params;

    // Auto-provision pipeline if it doesn't exist
    const pipeline = await (prisma as any).pipeline.upsert({
        where: { slug },
        update: {},
        create: {
            name: slug.charAt(0).toUpperCase() + slug.slice(1),
            slug: slug,
            color: slug === 'marketing' ? 'emerald' : slug === 'code' ? 'blue' : 'gray',
            order: 0
        }
    });

    // Fetch the swarm outputs mapping to this bucket, ordered by AI Priority Score
    const outputs = await (prisma as any).clawOutput.findMany({
        where: pipeline ? { pipelineId: pipeline.id } : undefined,
        orderBy: [
            { predictionScore: 'desc' },
            { createdAt: 'desc' }
        ],
        take: 50 // limit feed
    });

    // Provide the specific fallback color based on our tailwind mapping
    const tailwindColorClass = `bg-owner-${slug}`;

    return (
        <div className="flex flex-col gap-8 pb-32">
             
            {/* Top Dashboard Matrix */}
            <LiveStats />

            {/* Pipeline Feed Divider */}
            <div className="flex items-center justify-between mt-4 border-b border-slate-200 pb-3">
                 <h2 className="font-display font-semibold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${tailwindColorClass} block`}></span>
                     {pipeline?.name || "Global"} Intelligence Feed
                 </h2>
                 <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
                     <span className="flex items-center gap-1 cursor-pointer hover:text-slate-800 transition-colors">Sort: Priority <span className="opacity-50 text-[10px]">▼</span></span>
                     <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{outputs.length} open</span>
                 </div>
            </div>

            {/* The Intelligence Feed (Flat Linear Stream) */}
            <div className="flex flex-col gap-0 w-full min-h-[200px]">
                  {Array.isArray(outputs) && outputs.length === 0 ? (
                      <div className="py-20 flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                              <span className="text-2xl">?</span>
                          </div>
                          <h3 className="text-slate-900 font-semibold mb-1">No intelligence recorded</h3>
                          <p className="text-slate-400 text-sm font-normal max-w-[280px] mb-8">
                              Awaiting KiloClaw routing for the <strong>{pipeline?.name || "Global"}</strong> pipeline.
                          </p>
                          <form action="/api/owner/seed-sample" method="POST">
                               <input type="hidden" name="pipelineId" value={pipeline?.id} />
                               <input type="hidden" name="slug" value={slug} />
                               <button 
                                 type="submit"
                                 className="px-6 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all active:scale-95"
                               >
                                  Generate Sample Intel
                               </button>
                          </form>
                      </div>
                  ) : Array.isArray(outputs) ? (
                      outputs.map((output: any) => (
                          <PipelineCard 
                              key={output.id} 
                              output={output} 
                              pipelineColor={tailwindColorClass} 
                          />
                      ))
                  ) : (
                      <div className="py-12 text-center text-slate-400">Loading Intelligence...</div>
                  )}
            </div>

            {/* Swarm Communication Layer (Floating Bar) */}
            <KiloClawChat />
        </div>
    );
}
