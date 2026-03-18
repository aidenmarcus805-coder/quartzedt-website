"use client";

import { useEffect, useRef, useState } from "react";
import { GlassCard } from "./GlassCard";

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
    <GlassCard className="flex flex-col h-[400px] p-0 overflow-hidden relative border-t-[4px] border-t-indigo-500/50">
      {/* 12 Agent Status Grid */}
      <div className="flex items-center gap-2 p-3 border-b border-black/5 bg-white/40 backdrop-blur-sm">
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-500 mr-2">Agent Fleet</span>
        {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full ${i < 9 ? 'bg-emerald-400' : 'bg-amber-400'}`} title={`Agent ${i+1}`} />
        ))}
      </div>

      {/* Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-mono text-xs text-slate-700">
         {messages.length === 0 ? (
             <div className="m-auto text-slate-400 text-sm">Swarm online. Awaiting commands.</div>
         ) : (
             messages.map((m) => (
                 <div key={m.id} className={`flex ${m.isOwner ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] rounded-md p-2 ${m.isOwner ? 'bg-indigo-50 border border-indigo-100 text-indigo-900' : 'bg-white/60 border border-black/5'}`}>
                        {!m.isOwner && <span className="font-bold text-slate-500 mr-2">[{m.agentName}]</span>}
                        {m.content}
                     </div>
                 </div>
             ))
         )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-black/5 bg-white/40">
        <form onSubmit={handleCommand} className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">{'>'}</span>
            <input 
               autoFocus
               value={input}
               onChange={e => setInput(e.target.value)}
               placeholder="Ask Fleet... (Cmd+K) /deploy /priority"
               className="w-full bg-white/50 border border-black/5 rounded-md py-2 pl-8 pr-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400"
            />
        </form>
      </div>
    </GlassCard>
  );
};
