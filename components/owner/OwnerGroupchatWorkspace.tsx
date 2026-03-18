"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { Command, CornerDownRight, Send, Sparkles } from 'lucide-react';

import { ownerPrimaryButtonClassName, ownerSecondaryButtonClassName } from '@/lib/owner/present';
import type { GroupchatContext, GroupchatMessage } from '@/lib/owner/types';

import { GlassCard } from './GlassCard';
import { OwnerBadge } from './OwnerBadge';

function buildSimulatedReply(context: GroupchatContext, prompt: string): GroupchatMessage {
  const coordinator = context.participants[0];
  const lowerPrompt = prompt.toLowerCase();

  let content = `Keeping this inside ${context.label}. I will route it as a concise owner handoff instead of letting it sprawl.`;

  if (lowerPrompt.includes('summary') || lowerPrompt.includes('summarize')) {
    content = `Summary for ${context.label}: the main open items are ${context.threads
      .map((thread) => thread.label.toLowerCase())
      .slice(0, 2)
      .join(' and ')}. I would send the clean outcomes into Suggestions or Code Refinements next.`;
  } else if (lowerPrompt.includes('route')) {
    content = `Routing recommendation: anything implementation-facing should move into Code Refinements, copy should land in Outputs, and speculative improvements should stay in Suggestions until approved.`;
  } else if (lowerPrompt.includes('bot') || lowerPrompt.includes('claw')) {
    content = `I checked the active claws in ${context.label}. The right next move is to keep ${context.participants
      .map((participant) => participant.name)
      .slice(0, 2)
      .join(' and ')} in the room and send any finished work outward once it is clean enough to approve.`;
  }

  return {
    id: `${context.id}-${Date.now()}-reply`,
    agentName: coordinator?.name ?? 'Quartz Prime',
    role: coordinator?.role ?? 'Coordinator',
    content,
    createdAtLabel: 'just now',
    isOwner: false,
  };
}

export function OwnerGroupchatWorkspace({
  contexts,
  initialContextId,
}: {
  contexts: GroupchatContext[];
  initialContextId?: string;
}) {
  const [activeContextId, setActiveContextId] = useState(initialContextId ?? contexts[0]?.id ?? '');
  const [input, setInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);
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
  }, [messages, activeContextId, isResponding]);

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
    setIsResponding(true);

    window.setTimeout(() => {
      const reply = buildSimulatedReply(activeContext, prompt);

      setMessageMap((current) => ({
        ...current,
        [activeContext.id]: [...(current[activeContext.id] ?? []), reply],
      }));
      setIsResponding(false);
    }, 650);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
      <GlassCard className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Contexts</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">OpenClaw rooms</h2>
          </div>
          <OwnerBadge tone="neutral">{contexts.length} live</OwnerBadge>
        </div>

        <div className="mt-5 space-y-3">
          {contexts.map((context) => {
            const active = context.id === activeContext.id;

            return (
              <button
                key={context.id}
                type="button"
                onClick={() => setActiveContextId(context.id)}
                className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200/80 bg-slate-50/80 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{context.label}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${active ? 'bg-white/10 text-white/80' : 'bg-white text-slate-500'}`}>
                    {context.unreadCount} unread
                  </span>
                </div>
                <p className={`mt-2 text-sm leading-6 ${active ? 'text-white/72' : 'text-slate-500'}`}>{context.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Pinned commands</p>
          <div className="mt-4 flex flex-col gap-2">
            {activeContext.pinnedCommands.map((command) => (
              <button
                key={command}
                type="button"
                onClick={() => setInput(command)}
                className="rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-3 text-left text-sm leading-6 text-slate-700 transition hover:border-slate-300"
              >
                {command}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Active context</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{activeContext.label}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{activeContext.description}</p>
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
          <div ref={scrollRef} className="max-h-[720px] space-y-4 overflow-y-auto p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwner ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-[28px] border px-5 py-4 ${
                    message.isOwner
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200/80 bg-white/85 text-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                    <span>{message.agentName}</span>
                    <span className={message.isOwner ? 'text-white/60' : 'text-slate-400'}>{message.role}</span>
                    <span className={message.isOwner ? 'text-white/60' : 'text-slate-400'}>{message.createdAtLabel}</span>
                  </div>
                  {message.replyToLabel ? (
                    <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${message.isOwner ? 'bg-white/10 text-white/80' : 'bg-slate-100 text-slate-500'}`}>
                      <CornerDownRight className="h-3.5 w-3.5" />
                      {message.replyToLabel}
                    </div>
                  ) : null}
                  <p className={`mt-3 text-sm leading-7 ${message.isOwner ? 'text-white/92' : 'text-slate-700'}`}>{message.content}</p>
                </div>
              </div>
            ))}

            {isResponding ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/85 px-4 py-3 text-sm text-slate-500">
                  <Sparkles className="h-4 w-4" />
                  Relevant claws are preparing a response…
                </div>
              </div>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
              <Command className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">Command the active claws</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Issue a command, ask for a summary, or redirect work. Use <span className="font-semibold text-slate-900">⌘K</span> to jump into the composer.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-slate-200/80 bg-white/80 p-3">
            <textarea
              data-owner-command-input="true"
              rows={4}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Command the claws, request a thread summary, or tell the room what to do next…"
              className="w-full resize-none bg-transparent px-2 py-2 text-sm leading-7 text-slate-700 outline-none placeholder:text-slate-400"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 px-2 pt-3">
              <div className="flex flex-wrap gap-2">
                {activeContext.pinnedCommands.slice(0, 2).map((command) => (
                  <button
                    key={command}
                    type="button"
                    onClick={() => setInput(command)}
                    className={ownerSecondaryButtonClassName}
                  >
                    {command}
                  </button>
                ))}
              </div>
              <button type="button" onClick={handleSend} className={ownerPrimaryButtonClassName}>
                Send command
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Threads</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">Current conversations</h3>
            </div>
            <OwnerBadge tone="warning">{activeContext.threads.reduce((sum, thread) => sum + thread.openItems, 0)} open</OwnerBadge>
          </div>

          <div className="mt-5 space-y-3">
            {activeContext.threads.map((thread) => (
              <div key={thread.id} className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-900">{thread.label}</p>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    {thread.openItems} open
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{thread.summary}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">What they are doing</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">Active tasks</h3>
            </div>
            <OwnerBadge tone="success">{activeContext.tasks.length} live</OwnerBadge>
          </div>

          <div className="mt-5 space-y-3">
            {activeContext.tasks.map((task) => (
              <div key={task.id} className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                  <OwnerBadge tone={task.status === 'Running' ? 'success' : task.status === 'Review' ? 'warning' : 'neutral'}>
                    {task.status}
                  </OwnerBadge>
                </div>
                <p className="mt-3 text-sm text-slate-600">{task.owner}</p>
                <p className="mt-1 text-sm text-slate-500">ETA: {task.eta}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
