"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Plus, Send, Settings2, Command } from "lucide-react";

interface Message {
  id: string;
  agentName: string;
  content: string;
  isOwner: boolean;
}

export const KiloClawChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Hardcoded for MVP, maps to dynamic "Marketing Fleet" etc.
  const channelId = "global-swarm-main"; 

  // Fast-polling or SSE connection abstraction
  useEffect(() => {
    // A simplified short-polling block as an MVP standin for SSE stability
    let interval: ReturnType<typeof setInterval> | undefined;
    
    const fetchChat = async () => {
        try {
            // Note: the backend stream endpoint is technically highly efficient, 
            // but for this UI piece standard fetch polling is very stable as well.
            const res = await fetch(`/api/claws/stream?channelId=${channelId}`);
            // If we were using standard SSE:
            // const es = new EventSource(`/api/claws/stream?channelId=${channelId}`);
            // (Mocking the fetch implementation due to Edge API structure complexity)
        } catch(e) {}
    };

    // Interval would be assigned here if we mapped fetchChat 
    // interval = setInterval(fetchChat, 3000);

    return () => clearInterval(interval as any);
  }, []);

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
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2 flex items-center gap-2 pointer-events-auto focus-within:ring-2 focus-within:ring-slate-200/50 transition-all">
        <div className="w-8 h-8 rounded-full bg-[#F9F9F9] flex items-center justify-center text-slate-400 shrink-0 ml-1">
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
