import { PrismaClient } from "@prisma/client";
import { PipelineCard } from "@/components/owner/PipelineCard";
import { LiveStats } from "@/components/owner/LiveStats";
import { KiloClawChat } from "@/components/owner/KiloClawChat";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export default async function PipelineFeedPage({ params }: { params: Promise<{ pipeline: string }> }) {
    const { pipeline: slug } = await params;

    // Fetch pipeline mapping
    const pipeline = await prisma.pipeline.findUnique({
        where: { slug }
    });

    if (!pipeline && slug !== 'global') {
        // Fallback default
        redirect('/dashboard/owner/code');
    }

    // Fetch the swarm outputs mapping to this bucket, ordered by AI Priority Score
    const outputs = await prisma.clawOutput.findMany({
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
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
             
            {/* Top Dashboard Matrix */}
            <LiveStats />
            
            {/* Swarm Communication Layer */}
            <KiloClawChat />

            {/* Pipeline Feed Divider */}
            <div className="flex items-center justify-between mt-6 -mb-2 border-b border-black/5 pb-2">
                 <h2 className="font-display font-semibold text-2xl tracking-tight text-slate-800 capitalize flex items-center gap-2">
                     <span className={`w-3 h-3 rounded-full ${tailwindColorClass} shadow-sm border border-black/5 block`}></span>
                     {pipeline?.name || "Global Stream"} Intelligence Feed
                 </h2>
                 <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                     <span>Sort: Priority <span className="opacity-50">▼</span></span>
                     <span className="px-2 py-0.5 rounded-full bg-slate-200/50 text-slate-600">{outputs.length} open</span>
                 </div>
            </div>

            {/* The Intelligence Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {outputs.length === 0 ? (
                     <div className="col-span-1 md:col-span-2 lg:col-span-3 p-12 text-center text-slate-400 font-medium border-2 border-dashed border-slate-300 rounded-2xl">
                         No intelligence outputs recorded in this pipeline yet.
                         <br/><span className="text-xs font-normal mt-1 block">Awaiting KiloClaw routing. Or, dispatch a command in the Swarm Chat above.</span>
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

        </div>
    );
}
