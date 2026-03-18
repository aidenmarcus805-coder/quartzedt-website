"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { CornerDownRight, Send } from 'lucide-react';

import { ownerPrimaryButtonClassName, ownerSecondaryButtonClassName } from '@/lib/owner/present';
import type { GroupchatContext, GroupchatMessage } from '@/lib/owner/types';

import { GlassCard } from './GlassCard';
import { OwnerBadge } from './OwnerBadge';

export function OwnerGroupchatWorkspace({
  contexts,
  initialContextId,
}: {
  contexts: GroupchatContext[];
  initialContextId?: string;
}) {
  const [activeContextId, setActiveContextId] = useState(initialContextId ?? contexts[0]?.id ?? '');
  const [input, setInput] = useState('');
  const [messageMap, setMessageMap] = useState<Record<string, GroupchatMessage[]>>(() =>
    Object.fromEntries(contexts.map((context) => [context.id, context.messages])),
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeContext = useMemo(
    () => contexts.find((context) => context.id === activeContextId) ?? contexts[0],
    [activeContextId, contexts],
  );

  const messages = useMemo(
    () => (activeContext ? messageMap[activeContext.id] ?? activeContext.messages : []),
    [activeContext, messageMap],
  );

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, activeContextId]);

  if (!activeContext) {
    return null;
  }

  const handleSend = () => {
    const prompt = input.trim();
    if (!prompt) return;

    const ownerMessage: GroupchatMessage = {
      id: `${activeContext.id}-${Date.now()}-owner`,
      agentName: 'Owner',
      role: 'Owner',
      content: prompt,
      createdAtLabel: 'just now',
      isOwner: true,
    };

    setMessageMap((current) => ({
      ...current,
      [activeContext.id]: [...(current[activeContext.id] ?? activeContext.messages), ownerMessage],
    }));
    setInput('');
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
      <GlassCard className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Contexts</p>
          </div>
          <OwnerBadge tone="neutral">{contexts.length} live</OwnerBadge>
        </div>

        <div className="mt-4 space-y-2">
          {contexts.map((context) => {
            const active = context.id === activeContext.id;

            return (
              <button
                key={context.id}
                type="button"
                onClick={() => setActiveContextId(context.id)}
                className={`w-full rounded-md border px-3 py-3 text-left transition-colors ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{context.label}</p>
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${active ? 'bg-white/10 text-white/80' : 'bg-slate-100 text-slate-500'}`}>
                    {context.unreadCount} unread
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      <div className="space-y-4">
        <GlassCard className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Active context</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{activeContext.label}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeContext.participants.map((participant) => (
                <OwnerBadge key={participant.id} tone="neutral" className="normal-case tracking-normal text-[12px]">
                  {participant.name} · {participant.status}
                </OwnerBadge>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-0">
          <div ref={scrollRef} className="max-h-[720px] space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwner ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg border px-4 py-3 ${
                    message.isOwner
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                    <span>{message.agentName}</span>
                    <span className={message.isOwner ? 'text-white/60' : 'text-slate-400'}>{message.role}</span>
                    <span className={message.isOwner ? 'text-white/60' : 'text-slate-400'}>{message.createdAtLabel}</span>
                  </div>
                  {message.replyToLabel ? (
                    <div className={`mt-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs ${message.isOwner ? 'bg-white/10 text-white/80' : 'bg-slate-100 text-slate-500'}`}>
                      <CornerDownRight className="h-3.5 w-3.5" />
                      {message.replyToLabel}
                    </div>
                  ) : null}
                  <p className={`mt-2 text-sm leading-6 ${message.isOwner ? 'text-white/92' : 'text-slate-700'}`}>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <textarea
              data-owner-command-input="true"
              rows={4}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type a message"
              className="w-full resize-none bg-transparent px-1 py-1 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
            />
            <div className="flex items-center justify-end border-t border-slate-200 px-1 pt-3">
              <button type="button" onClick={handleSend} className={ownerPrimaryButtonClassName}>
                Send
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
