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
        <div className="flex flex-col gap-3 group relative py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors -mx-4 px-4 rounded-xl">
            {/* Minimalist side identifier */}
            <div className={`absolute left-0 top-4 bottom-4 w-0.5 ${pipelineColor} opacity-70 rounded-r-full`}></div>
            
            {/* Header: Agent Trace & Confidence directly inline */}
            <div className="flex items-center gap-2 pl-3">
                <div className={`w-2 h-2 rounded-full ${statusDot}`}></div>
                <span className="text-xs font-semibold text-slate-800">
                     {output.agentName}
                </span>
                <span className="text-xs text-slate-400">
                     • Conf: {output.confidence}% • Score: {output.predictionScore}
                </span>
            </div>

            {/* Core Content Payload */}
            <div className="prose prose-sm prose-slate max-w-none font-sans text-slate-700 leading-relaxed break-words whitespace-pre-wrap pl-3">
                {output.content}
            </div>

            {/* Action Footer - Minimal Text Links */}
            <div className="mt-2 pl-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {(new Date(output.createdAt)).toLocaleTimeString()}
                 </div>
                 
                 <div className="flex items-center gap-3">
                     <button className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
                         <Copy size={13} /> Copy
                     </button>
                     <button className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                         <Send size={13} /> {output.suggestedAction || "Review"}
                     </button>
                 </div>
            </div>
        </div>
    );
};
