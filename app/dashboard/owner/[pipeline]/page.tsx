import { prisma } from "@/app/lib/prisma";
import { PipelineCard } from "@/components/owner/PipelineCard";
import { LiveStats } from "@/components/owner/LiveStats";
import { KiloClawChat } from "@/components/owner/KiloClawChat";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PipelineFeedPage({ params }: { params: Promise<{ pipeline: string }> }) {
    const { pipeline: slug } = await params;

    // Fetch pipeline mapping
    const pipeline = await (prisma as any).pipeline.findUnique({
        where: { slug }
    });

    if (!pipeline && slug !== 'global') {
        // Fallback default
        redirect('/dashboard/owner/code');
    }

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
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-32">
             
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
            <div className="flex flex-col gap-0 w-full">
                 {outputs.length === 0 ? (
                     <div className="py-12 text-center text-slate-400 font-medium text-[15px]">
                         No intelligence outputs recorded in this pipeline yet.
                         <br/><span className="text-[13px] font-normal mt-1 block">Awaiting KiloClaw routing. Or, dispatch a command below.</span>
                     </div>
                 ) : (
                     outputs.map(output => (
                         <PipelineCard 
                             key={output.id} 
                             output={output} 
                             pipelineColor={tailwindColorClass} 
                         />
                     ))
                 )}
            </div>

            {/* Swarm Communication Layer (Floating Bar) */}
            <KiloClawChat />
        </div>
    );
}
