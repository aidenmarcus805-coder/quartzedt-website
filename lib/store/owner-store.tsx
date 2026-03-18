"use client";

import { createContext, useContext, useMemo, useState } from 'react';

import {
  createOwnerMessage,
  createThreadTitle,
  formatRefinementForCopy,
  parseOwnerCommand,
  searchOwnerWorkspace,
  simulateBotReply,
  sortByCreatedAtDesc,
  validateImportedConfig,
} from '@/lib/actions/owner-actions';
import { createOwnerMockData } from '@/lib/mock-data/owner';
import type {
  ActivityItem,
  BotRecord,
  BotStatus,
  ChatMessage,
  ChatThread,
  CodeRefinement,
  ImportHistoryEntry,
  ImportValidationResult,
  OutputItem,
  OwnerSettings,
  OwnerWorkspaceSnapshot,
  Pipeline,
  SearchResult,
  Suggestion,
} from '@/lib/types/owner';

type OwnerStoreContextValue = {
  searchQuery: string;
  selectedThreadId: string;
  pipelines: Pipeline[];
  bots: BotRecord[];
  threads: ChatThread[];
  messages: ChatMessage[];
  suggestions: Suggestion[];
  outputs: OutputItem[];
  refinements: CodeRefinement[];
  imports: ImportHistoryEntry[];
  approvals: OwnerWorkspaceSnapshot['approvals'];
  activity: ActivityItem[];
  settings: OwnerSettings;
  searchResults: SearchResult[];
  latestImportValidation: ImportValidationResult | null;
  setSearchQuery: (query: string) => void;
  selectThread: (threadId: string) => void;
  createThread: (input: string, room?: ChatThread['room']) => void;
  pinThread: (threadId: string) => void;
  archiveThread: (threadId: string) => void;
  sendMessage: (threadId: string, input: string) => void;
  approveSuggestion: (suggestionId: string) => void;
  rejectSuggestion: (suggestionId: string) => void;
  archiveSuggestion: (suggestionId: string) => void;
  moveSuggestionToPipeline: (suggestionId: string, pipelineId: string) => void;
  approveOutput: (outputId: string) => void;
  rejectOutput: (outputId: string) => void;
  archiveOutput: (outputId: string) => void;
  routeOutputToPipeline: (outputId: string, pipelineId: string) => void;
  markRefinementApplied: (refinementId: string) => void;
  rejectRefinement: (refinementId: string) => void;
  assignRefinementToBot: (refinementId: string, botId: string) => void;
  createPipeline: (input: Pick<Pipeline, 'name' | 'description'>) => void;
  updatePipeline: (pipelineId: string, input: Partial<Pipeline>) => void;
  archivePipeline: (pipelineId: string) => void;
  pauseBot: (botId: string) => void;
  resumeBot: (botId: string) => void;
  restartBot: (botId: string) => void;
  reassignBot: (botId: string, pipelineId: string | null) => void;
  validateImportConfig: (rawConfig: string) => ImportValidationResult;
  importValidatedConfig: (args: { rawConfig: string; fileName?: string; activate: boolean; assignments: Record<string, string | null> }) => void;
  updateSettings: (input: Partial<OwnerSettings>) => void;
  copyRefinementPayload: (refinementId: string) => string;
};

const OwnerStoreContext = createContext<OwnerStoreContextValue | null>(null);

function createInitialState() {
  return createOwnerMockData();
}

export function OwnerStoreProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(() => createInitialState(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState(initial.threads[0]?.id ?? '');
  const [pipelines, setPipelines] = useState(initial.pipelines);
  const [bots, setBots] = useState(initial.bots);
  const [threads, setThreads] = useState(initial.threads);
  const [messages, setMessages] = useState(initial.messages);
  const [suggestions, setSuggestions] = useState(initial.suggestions);
  const [outputs, setOutputs] = useState(initial.outputs);
  const [refinements, setRefinements] = useState(initial.refinements);
  const [imports, setImports] = useState(initial.imports);
  const [approvals, setApprovals] = useState(initial.approvals);
  const [activity, setActivity] = useState(initial.activity);
  const [settings, setSettings] = useState(initial.settings);
  const [latestImportValidation, setLatestImportValidation] = useState<ImportValidationResult | null>(null);

  const snapshot = useMemo<OwnerWorkspaceSnapshot>(
    () => ({
      navigation: initial.navigation,
      pipelines,
      bots,
      threads,
      messages,
      suggestions,
      outputs,
      refinements,
      imports,
      approvals,
      activity,
      settings,
    }),
    [initial.navigation, pipelines, bots, threads, messages, suggestions, outputs, refinements, imports, approvals, activity, settings],
  );

  const searchResults = useMemo(() => searchOwnerWorkspace(snapshot, searchQuery), [snapshot, searchQuery]);

  const selectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setThreads((current) => current.map((thread) => (thread.id === threadId ? { ...thread, unreadCount: 0 } : thread)));
  };

  const createThread = (input: string, room: ChatThread['room'] = 'owner') => {
    const id = `thread-${Date.now()}`;
    const title = createThreadTitle(input);

    setThreads((current) => [
      {
        id,
        title,
        room,
        pipelineId: null,
        participantBotIds: ['bot-orchestrator'],
        pinned: false,
        archived: false,
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
        summary: 'New owner thread',
      },
      ...current,
    ]);
    setSelectedThreadId(id);
  };

  const pinThread = (threadId: string) => {
    setThreads((current) => current.map((thread) => (thread.id === threadId ? { ...thread, pinned: !thread.pinned } : thread)));
  };

  const archiveThread = (threadId: string) => {
    setThreads((current) => current.map((thread) => (thread.id === threadId ? { ...thread, archived: true } : thread)));
    if (selectedThreadId === threadId) {
      const fallback = threads.find((thread) => thread.id !== threadId && !thread.archived)?.id ?? '';
      setSelectedThreadId(fallback);
    }
  };

  const sendMessage = (threadId: string, input: string) => {
    const ownerMessage = createOwnerMessage(threadId, input);
    const activeThread = threads.find((thread) => thread.id === threadId);

    setMessages((current) => [...current, ownerMessage]);
    setThreads((current) =>
      current.map((thread) => (thread.id === threadId ? { ...thread, updatedAt: ownerMessage.createdAt } : thread)),
    );

    setActivity((current) => [
      {
        id: `activity-${Date.now()}`,
        label: `Owner updated ${activeThread?.title ?? 'a thread'}`,
        detail: input,
        createdAt: ownerMessage.createdAt,
        pipelineId: activeThread?.pipelineId ?? null,
        threadId,
      },
      ...current,
    ]);

    if (!activeThread) {
      return;
    }

    const parsed = parseOwnerCommand(input);

    if (parsed.type === 'stop' && parsed.target) {
      setBots((current) => current.map((bot) => (bot.name.toLowerCase().includes(parsed.target!.toLowerCase()) ? { ...bot, status: 'paused' } : bot)));
    }

    if (parsed.type === 'restart' && parsed.target) {
      setBots((current) => current.map((bot) => (bot.name.toLowerCase().includes(parsed.target!.toLowerCase()) ? { ...bot, status: 'active', health: 'healthy' } : bot)));
    }

    if (parsed.type === 'assign' && parsed.target && parsed.pipeline) {
      const targetPipeline = pipelines.find(
        (pipeline) => pipeline.name.toLowerCase() === parsed.pipeline!.toLowerCase() || pipeline.slug === parsed.pipeline!.toLowerCase(),
      );

      if (targetPipeline) {
        setBots((current) =>
          current.map((bot) => (bot.name.toLowerCase().includes(parsed.target!.toLowerCase()) ? { ...bot, pipelineId: targetPipeline.id } : bot)),
        );
      }
    }

    if (parsed.type === 'route' && parsed.target && parsed.pipeline) {
      const targetPipeline = pipelines.find(
        (pipeline) => pipeline.name.toLowerCase() === parsed.pipeline!.toLowerCase() || pipeline.slug === parsed.pipeline!.toLowerCase(),
      );

      if (targetPipeline) {
        setOutputs((current) =>
          current.map((output) =>
            output.id === parsed.target || output.title.toLowerCase().includes(parsed.target!.toLowerCase())
              ? { ...output, pipelineId: targetPipeline.id }
              : output,
          ),
        );
      }
    }

    if (parsed.type === 'deploy' && parsed.target) {
      setRefinements((current) =>
        current.map((refinement) => (refinement.id === parsed.target ? { ...refinement, status: 'applied' } : refinement)),
      );
    }

    const reply = simulateBotReply({ thread: activeThread, bots, pipelines, outputs, refinements, input });

    setMessages((current) => [...current, reply]);
    setThreads((current) => current.map((thread) => (thread.id === threadId ? { ...thread, updatedAt: reply.createdAt } : thread)));
  };

  const approveSuggestion = (suggestionId: string) => {
    setSuggestions((current) => current.map((suggestion) => (suggestion.id === suggestionId ? { ...suggestion, status: 'approved' } : suggestion)));
  };

  const rejectSuggestion = (suggestionId: string) => {
    setSuggestions((current) => current.map((suggestion) => (suggestion.id === suggestionId ? { ...suggestion, status: 'rejected' } : suggestion)));
  };

  const archiveSuggestion = (suggestionId: string) => {
    setSuggestions((current) => current.map((suggestion) => (suggestion.id === suggestionId ? { ...suggestion, status: 'archived' } : suggestion)));
  };

  const moveSuggestionToPipeline = (suggestionId: string, pipelineId: string) => {
    setSuggestions((current) => current.map((suggestion) => (suggestion.id === suggestionId ? { ...suggestion, pipelineId } : suggestion)));
  };

  const approveOutput = (outputId: string) => {
    setOutputs((current) => current.map((output) => (output.id === outputId ? { ...output, status: 'approved' } : output)));
  };

  const rejectOutput = (outputId: string) => {
    setOutputs((current) => current.map((output) => (output.id === outputId ? { ...output, status: 'rejected' } : output)));
  };

  const archiveOutput = (outputId: string) => {
    setOutputs((current) => current.map((output) => (output.id === outputId ? { ...output, status: 'archived' } : output)));
  };

  const routeOutputToPipeline = (outputId: string, pipelineId: string) => {
    setOutputs((current) => current.map((output) => (output.id === outputId ? { ...output, pipelineId } : output)));
  };

  const markRefinementApplied = (refinementId: string) => {
    setRefinements((current) => current.map((item) => (item.id === refinementId ? { ...item, status: 'applied' } : item)));
  };

  const rejectRefinement = (refinementId: string) => {
    setRefinements((current) => current.map((item) => (item.id === refinementId ? { ...item, status: 'rejected' } : item)));
  };

  const assignRefinementToBot = (refinementId: string, botId: string) => {
    setRefinements((current) => current.map((item) => (item.id === refinementId ? { ...item, botId } : item)));
  };

  const createPipeline = (input: Pick<Pipeline, 'name' | 'description'>) => {
    const slug = input.name.toLowerCase().replace(/\s+/g, '-');

    setPipelines((current) => [
      {
        id: `pipeline-${Date.now()}`,
        name: input.name,
        slug,
        description: input.description,
        status: 'active',
        accent: '#64748b',
        lastActivityAt: new Date().toISOString(),
        botIds: [],
        outputIds: [],
        suggestionIds: [],
        threadIds: [],
        routingRules: {
          intake: 'Owner prompts',
          review: 'Owner review queue',
          dispatch: 'Assigned manually',
        },
      },
      ...current,
    ]);
  };

  const updatePipeline = (pipelineId: string, input: Partial<Pipeline>) => {
    setPipelines((current) => current.map((pipeline) => (pipeline.id === pipelineId ? { ...pipeline, ...input } : pipeline)));
  };

  const archivePipeline = (pipelineId: string) => {
    setPipelines((current) => current.map((pipeline) => (pipeline.id === pipelineId ? { ...pipeline, status: 'archived' } : pipeline)));
  };

  const pauseBot = (botId: string) => {
    setBots((current) => current.map((bot) => (bot.id === botId ? { ...bot, status: 'paused' } : bot)));
  };

  const resumeBot = (botId: string) => {
    setBots((current) => current.map((bot) => (bot.id === botId ? { ...bot, status: 'active', health: 'healthy' } : bot)));
  };

  const restartBot = (botId: string) => {
    setBots((current) =>
      current.map((bot) =>
        bot.id === botId
          ? {
              ...bot,
              status: 'active',
              health: 'healthy',
              lastActiveAt: new Date().toISOString(),
            }
          : bot,
      ),
    );
  };

  const reassignBot = (botId: string, pipelineId: string | null) => {
    setBots((current) => current.map((bot) => (bot.id === botId ? { ...bot, pipelineId } : bot)));
  };

  const handleValidateImportConfig = (rawConfig: string) => {
    const result = validateImportedConfig(rawConfig);
    setLatestImportValidation(result);
    return result;
  };

  const importValidatedConfig = ({
    rawConfig,
    fileName,
    activate,
    assignments,
  }: {
    rawConfig: string;
    fileName?: string;
    activate: boolean;
    assignments: Record<string, string | null>;
  }) => {
    const validation = validateImportedConfig(rawConfig);
    setLatestImportValidation(validation);

    if (!validation.valid) {
      return;
    }

    const createdAt = new Date().toISOString();
    const historyEntry: ImportHistoryEntry = {
      id: `import-${Date.now()}`,
      source: validation.source,
      fileName: fileName ?? validation.fileName,
      rawConfig,
      status: 'imported',
      createdAt,
      detectedBots: validation.detectedBots.map((bot) => ({
        ...bot,
        suggestedPipelineId: assignments[bot.id] ?? bot.suggestedPipelineId,
        active: activate,
      })),
    };

    setImports((current) => [historyEntry, ...current]);
    setBots((current) => [
      ...historyEntry.detectedBots.map((bot) => ({
        id: `bot-${bot.id}`,
        name: bot.name,
        description: bot.role,
        systemPrompt: 'Imported bot',
        status: (bot.active ? 'active' : 'idle') as BotStatus,
        health: 'healthy' as const,
        model: bot.model,
        pipelineId: bot.suggestedPipelineId,
        tools: bot.tools,
        permissions: ['imported'],
        lastActiveAt: createdAt,
        taskCount: 0,
        recentOutputIds: [],
        recentThreadIds: [],
        logs: [{ id: `log-${bot.id}`, level: 'info' as const, message: 'Imported into workspace.', createdAt }],
      })),
      ...current,
    ]);
  };

  const updateSettings = (input: Partial<OwnerSettings>) => {
    setSettings((current) => ({
      ...current,
      ...input,
      notifications: input.notifications ? { ...current.notifications, ...input.notifications } : current.notifications,
      integrations: input.integrations ? { ...current.integrations, ...input.integrations } : current.integrations,
    }));
  };

  const copyRefinementPayload = (refinementId: string) => {
    const refinement = refinements.find((item) => item.id === refinementId);
    return refinement ? formatRefinementForCopy(refinement) : '';
  };

  const value = useMemo<OwnerStoreContextValue>(
    () => ({
      searchQuery,
      selectedThreadId,
      pipelines: sortByCreatedAtDesc(pipelines.map((pipeline) => ({ ...pipeline, createdAt: pipeline.lastActivityAt })) as Array<Pipeline & { createdAt: string }>).map(({ createdAt: _createdAt, ...pipeline }) => pipeline),
      bots,
      threads: [...threads].sort((left, right) => {
        if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
        return right.updatedAt.localeCompare(left.updatedAt);
      }),
      messages,
      suggestions: sortByCreatedAtDesc(suggestions),
      outputs: sortByCreatedAtDesc(outputs),
      refinements: sortByCreatedAtDesc(refinements),
      imports: sortByCreatedAtDesc(imports),
      approvals: sortByCreatedAtDesc(approvals),
      activity: sortByCreatedAtDesc(activity),
      settings,
      searchResults,
      latestImportValidation,
      setSearchQuery,
      selectThread,
      createThread,
      pinThread,
      archiveThread,
      sendMessage,
      approveSuggestion,
      rejectSuggestion,
      archiveSuggestion,
      moveSuggestionToPipeline,
      approveOutput,
      rejectOutput,
      archiveOutput,
      routeOutputToPipeline,
      markRefinementApplied,
      rejectRefinement,
      assignRefinementToBot,
      createPipeline,
      updatePipeline,
      archivePipeline,
      pauseBot,
      resumeBot,
      restartBot,
      reassignBot,
      validateImportConfig: handleValidateImportConfig,
      importValidatedConfig,
      updateSettings,
      copyRefinementPayload,
    }),
    [
      activity,
      approvals,
      bots,
      imports,
      latestImportValidation,
      messages,
      outputs,
      pipelines,
      refinements,
      searchQuery,
      searchResults,
      selectedThreadId,
      settings,
      suggestions,
      threads,
    ],
  );

  return <OwnerStoreContext.Provider value={value}>{children}</OwnerStoreContext.Provider>;
}

export function useOwnerStore() {
  const context = useContext(OwnerStoreContext);

  if (!context) {
    throw new Error('useOwnerStore must be used inside OwnerStoreProvider');
  }

  return context;
}
