import { GlassCard } from "./GlassCard";
import { Copy, Plus, Send, CheckCircle, Clock } from "lucide-react";

/**
 * Universal Card mapping KiloClaw outputs in the Priority Feed.
 * Handles Code Specs, Marketing Drafts, and standard intelligence.
 */
export const PipelineCard = ({ output, pipelineColor }: { output: any, pipelineColor: string }) => {
    
    // Status color mapping for the priority dot
    const statusColors: Record<string, string> = {
        "ACTION_NEEDED": "bg-red-500",
        "DRAFT": "bg-yellow-400",
        "APPROVED": "bg-green-500",
        "PUBLISHED": "bg-blue-500"
    };

    const statusDot = statusColors[output.status] || "bg-gray-400";

    return (
        <GlassCard className="flex flex-col gap-3 group relative overflow-hidden" hover={true}>
            {/* Absolute side accent bar tied to pipeline color */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${pipelineColor} opacity-50`}></div>
            
            {/* Header: Priority dot, Trace, Score */}
            <div className="flex justify-between items-center bg-white/30 rounded-md p-2 -mx-2 -mt-2 mb-1">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusDot} ml-1`}></div>
                    <span className="text-xs font-semibold text-slate-500 tracking-wider">
                         {output.agentName} <span className="text-slate-400 font-normal">→ {output.confidence}% conf</span>
                    </span>
                </div>
                <div className="flex bg-slate-100 rounded-full px-2 py-0.5 items-center gap-1">
                     <span className="text-[10px] text-slate-500 font-medium">SCORE</span>
                     <span className="text-xs font-bold text-slate-700">{output.predictionScore}</span>
                </div>
            </div>

            {/* Core Content Payload */}
            {/* MVP: Render pre-formatted text. Later map CodeSpecViewer here natively if syntax requires it */}
            <div className="prose prose-sm prose-slate max-w-none font-sans text-slate-800 break-words whitespace-pre-wrap">
                {output.content}
            </div>

            {/* Action Footer */}
            <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
                 <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {(new Date(output.createdAt)).toLocaleTimeString()}
                 </div>
                 
                 <div className="flex items-center gap-2">
                     <button className="flex items-center gap-1 text-xs font-medium bg-white border border-black/10 px-3 py-1.5 rounded-md hover:bg-slate-50 text-slate-600 transition-colors">
                         <Copy size={14} /> Copy
                     </button>
                     <button className="flex items-center gap-1 text-xs font-medium bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-md hover:bg-indigo-100 text-indigo-700 transition-colors">
                         <Send size={14} /> {output.suggestedAction || "Review"}
                     </button>
                 </div>
            </div>
        </GlassCard>
    );
};
