"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Plus, Send, Settings2, Command } from "lucide-react";

interface Message {
  id: string;
  agentName: string;
  content: string;
  isOwner: boolean;
  createdAt?: string | Date;
}

export const KiloClawChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init-1', agentName: 'Swarm Controller', content: 'Connection established. Fleet is standing by. All clusters NOMINAL.', isOwner: false, createdAt: new Date().toISOString() }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Hardcoded for MVP, maps to dynamic "Marketing Fleet" etc.
  const channelId = "global-swarm-main"; 

  // SSE Connection for real-time swarm chatter
  useEffect(() => {
    const eventSource = new EventSource(`/api/claws/stream?channelId=${channelId}`);
    
    eventSource.onmessage = (e) => {
        try {
            const data = JSON.parse(e.data);
            if (data.messages && Array.isArray(data.messages)) {
                setMessages(prev => {
                    // Deduplicate and merge
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNew = data.messages.filter((m: any) => !existingIds.has(m.id));
                    if (uniqueNew.length === 0) return prev;
                    
                    return [...prev, ...uniqueNew].sort((a, b) => 
                        new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
                    );
                });
            }
        } catch(err) {
            console.error("SSE Parse Error:", err);
        }
    };

    eventSource.onerror = (e) => {
        console.error("SSE Connection Error:", e);
        eventSource.close();
    };

    return () => eventSource.close();
  }, [channelId]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const payload = input;
    setInput("");

    // Optimistic insert
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, content: payload, isOwner: true, agentName: "Owner" }]);

    try {
        const res = await fetch("/api/claws/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channelId, content: payload })
        });
        
        if (res.ok) {
            const data = await res.json();
            // Swarm responds in the JSON instantly for MVP
            if (data.message) {
                 setMessages(prev => [...prev, data.message]);
            }
        }
    } catch(err) {
        console.error("Command Error:", err);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-0 left-[260px] right-0 flex flex-col items-center pointer-events-none z-40 pb-8 px-8">
      
      {/* Messages Feed (Fades up) */}
      <div 
        ref={scrollRef} 
        className="w-full max-w-3xl flex flex-col gap-4 overflow-y-auto max-h-[40vh] mb-4 pointer-events-auto hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
         {messages.map((m) => (
             <div key={m.id} className={`flex ${m.isOwner ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] text-[14px] leading-relaxed ${m.isOwner ? 'bg-slate-100/80 text-slate-800 rounded-2xl rounded-tr-sm px-4 py-3' : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm'}`}>
                    {!m.isOwner && <div className="font-semibold text-[11px] text-slate-400 mb-1 uppercase tracking-wider">{m.agentName}</div>}
                    {m.content}
                 </div>
             </div>
         ))}
      </div>

      {/* The Ask Bar */}
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-sm p-2 flex items-center gap-2 pointer-events-auto focus-within:border-slate-400 transition-all">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 ml-1">
           <Command size={14} />
        </div>
        <form onSubmit={handleCommand} className="flex-1 flex items-center relative">
            <input 
               autoFocus
               value={input}
               onChange={e => setInput(e.target.value)}
               placeholder="Ask Fleet or Search Pipelines..."
               className="w-full bg-transparent border-none py-2 px-2 text-[15px] font-sans text-slate-800 focus:outline-none placeholder:text-slate-400"
            />
            
            {/* Action Buttons inside Input */}
            <div className="absolute right-2 flex items-center gap-1">
                <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors" title="Settings">
                    <Settings2 size={16} />
                </button>
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className={`p-1.5 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-400'}`}
                >
                    <Send size={14} className={input.trim() ? "ml-0.5" : ""} />
                </button>
            </div>
        </form>
      </div>
      
      {/* Hint Text */}
      <div className="mt-3 text-[11px] text-slate-400 font-medium">
         Pro Tip: Use <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500">Cmd+K</kbd> to focus and <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500">/deploy</kbd> to execute
      </div>
    </div>
  );
};
