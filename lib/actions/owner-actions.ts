import type {
  BotRecord,
  ChatMessage,
  ChatThread,
  CodeRefinement,
  ImportValidationResult,
  OwnerCommand,
  OwnerWorkspaceSnapshot,
  OutputItem,
  Pipeline,
  SearchResult,
  Suggestion,
} from '@/lib/types/owner';

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function parseOwnerCommand(raw: string): OwnerCommand {
  const input = raw.trim();

  if (!input.startsWith('/')) {
    return { type: 'unknown', raw };
  }

  const [command, ...args] = input.slice(1).split(/\s+/);

  switch (command) {
    case 'status':
      return { type: 'status', raw };
    case 'stop':
      return { type: 'stop', target: args.join(' '), raw };
    case 'restart':
      return { type: 'restart', target: args.join(' '), raw };
    case 'assign':
      return { type: 'assign', target: args[0], pipeline: args.slice(1).join(' '), raw };
    case 'route':
      return { type: 'route', target: args[0], pipeline: args.slice(1).join(' '), raw };
    case 'deploy':
      return { type: 'deploy', target: args[0], raw };
    case 'summarize':
      return { type: 'summarize', raw };
    case 'next':
      return { type: 'next', raw };
    default:
      return { type: 'unknown', raw };
  }
}

export function searchOwnerWorkspace(snapshot: OwnerWorkspaceSnapshot, query: string): SearchResult[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return snapshot.navigation.map((item) => ({
      id: item.key,
      label: item.label,
      href: item.href,
      kind: 'page',
      detail: item.helper ?? 'Open page',
    }));
  }

  const pages = snapshot.navigation
    .filter((item) => `${item.label} ${item.helper ?? ''}`.toLowerCase().includes(normalized))
    .map((item) => ({ id: item.key, label: item.label, href: item.href, kind: 'page' as const, detail: item.helper ?? 'Page' }));

  const threads = snapshot.threads
    .filter((thread) => `${thread.title} ${thread.summary}`.toLowerCase().includes(normalized))
    .map((thread) => ({
      id: thread.id,
      label: thread.title,
      href: '/dashboard/owner/groupchat',
      kind: 'thread' as const,
      detail: thread.summary,
    }));

  const pipelines = snapshot.pipelines
    .filter((pipeline) => `${pipeline.name} ${pipeline.description}`.toLowerCase().includes(normalized))
    .map((pipeline) => ({
      id: pipeline.id,
      label: pipeline.name,
      href: `/dashboard/owner/pipelines/${pipeline.slug}`,
      kind: 'pipeline' as const,
      detail: pipeline.description,
    }));

  const bots = snapshot.bots
    .filter((bot) => `${bot.name} ${bot.description} ${bot.model}`.toLowerCase().includes(normalized))
    .map((bot) => ({
      id: bot.id,
      label: bot.name,
      href: '/dashboard/owner/bot-management',
      kind: 'bot' as const,
      detail: bot.description,
    }));

  const suggestions = snapshot.suggestions
    .filter((suggestion) => `${suggestion.title} ${suggestion.summary}`.toLowerCase().includes(normalized))
    .map((suggestion) => ({
      id: suggestion.id,
      label: suggestion.title,
      href: '/dashboard/owner/suggestions',
      kind: 'suggestion' as const,
      detail: suggestion.summary,
    }));

  const outputs = snapshot.outputs
    .filter((output) => `${output.title} ${output.preview}`.toLowerCase().includes(normalized))
    .map((output) => ({
      id: output.id,
      label: output.title,
      href: '/dashboard/owner/outputs',
      kind: 'output' as const,
      detail: output.preview,
    }));

  const refinements = snapshot.refinements
    .filter((refinement) => `${refinement.title} ${refinement.suggestion}`.toLowerCase().includes(normalized))
    .map((refinement) => ({
      id: refinement.id,
      label: refinement.title,
      href: '/dashboard/owner/code-refinements',
      kind: 'refinement' as const,
      detail: refinement.suggestion,
    }));

  return [...pages, ...threads, ...pipelines, ...bots, ...suggestions, ...outputs, ...refinements].slice(0, 12);
}

export function validateImportedConfig(rawConfig: string): ImportValidationResult {
  if (!rawConfig.trim()) {
    return {
      valid: false,
      error: 'Paste a config before validating.',
      detectedBots: [],
      source: 'Unknown',
      fileName: 'pasted-config.json',
    };
  }

  try {
    const parsed = JSON.parse(rawConfig) as {
      source?: string;
      name?: string;
      bots?: Array<{ name?: string; model?: string; role?: string; tools?: string[] }>;
    };

    const bots = Array.isArray(parsed.bots)
      ? parsed.bots.map((bot, index) => ({
          id: makeId(`validated-bot-${index}`),
          name: bot.name ?? `Imported Bot ${index + 1}`,
          model: bot.model ?? 'gpt-4.1',
          role: bot.role ?? 'general assistant',
          tools: Array.isArray(bot.tools) ? bot.tools : [],
          suggestedPipelineId: null,
          active: false,
        }))
      : [];

    return {
      valid: true,
      detectedBots: bots,
      source: parsed.source ?? 'OpenClaw',
      fileName: parsed.name ? `${parsed.name}.json` : 'pasted-config.json',
    };
  } catch {
    return {
      valid: false,
      error: 'The config is not valid JSON.',
      detectedBots: [],
      source: 'Unknown',
      fileName: 'pasted-config.json',
    };
  }
}

export function createOwnerMessage(threadId: string, content: string): ChatMessage {
  return {
    id: makeId('message'),
    threadId,
    authorType: 'owner',
    authorId: 'owner',
    authorLabel: 'Owner',
    content,
    createdAt: new Date().toISOString(),
    status: 'done',
  };
}

export function simulateBotReply({
  thread,
  bots,
  pipelines,
  outputs,
  refinements,
  input,
}: {
  thread: ChatThread;
  bots: BotRecord[];
  pipelines: Pipeline[];
  outputs: OutputItem[];
  refinements: CodeRefinement[];
  input: string;
}): ChatMessage {
  const parsed = parseOwnerCommand(input);
  const primaryBot = bots.find((bot) => thread.participantBotIds.includes(bot.id)) ?? bots[0];

  let content = 'Noted. I updated the thread context and kept the next action visible in the workspace.';

  switch (parsed.type) {
    case 'status':
      content = `${bots.filter((bot) => bot.status === 'active').length} bots are active, ${outputs.filter((output) => output.status === 'review').length} outputs are waiting for review, and ${refinements.filter((item) => item.status === 'review').length} refinements are still open.`;
      break;
    case 'stop':
      content = `I marked ${parsed.target || 'the requested bot'} for pause review. You can confirm it from Bot Management.`;
      break;
    case 'restart':
      content = `Restart queued for ${parsed.target || 'the requested bot'}. The status row will update in Bot Management.`;
      break;
    case 'assign':
      content = `I mapped ${parsed.target || 'that bot'} toward ${parsed.pipeline || 'the requested pipeline'}. Confirm the final assignment in the bot detail panel.`;
      break;
    case 'route':
      content = `Routing prepared for ${parsed.target || 'that item'} into ${parsed.pipeline || 'the selected pipeline'}. Review it in Outputs or Suggestions before confirming.`;
      break;
    case 'deploy':
      content = `The refinement ${parsed.target || ''} is ready for handoff. I would send it to Cursor after one final review pass.`;
      break;
    case 'summarize':
      content = `Summary: ${thread.summary} Open review items sit in ${pipelines
        .filter((pipeline) => pipeline.threadIds.includes(thread.id))
        .map((pipeline) => pipeline.name)
        .join(', ') || 'the active workspace'}.`;
      break;
    case 'next':
      content = 'Next best move: clear the top review item, then either route the resulting output forward or archive the thread if the work is done.';
      break;
    default:
      content = `Understood. I kept this in ${thread.title} and prepared it as the next active task instead of letting it disappear into a generic queue.`;
  }

  return {
    id: makeId('message'),
    threadId: thread.id,
    authorType: 'bot',
    authorId: primaryBot?.id ?? 'system',
    authorLabel: primaryBot?.name ?? 'Quartz',
    content,
    createdAt: new Date().toISOString(),
    status: 'done',
  };
}

export function formatRefinementForCopy(refinement: CodeRefinement) {
  return [
    refinement.title,
    '',
    'Files to Change',
    ...refinement.filesToChange,
    '',
    'Suggestion',
    refinement.suggestion,
    '',
    'Why This Helps',
    refinement.whyThisHelps,
    '',
    'Alternative Approaches',
    ...refinement.alternativeApproaches,
  ].join('\n');
}

export function getPipelineName(pipelines: Pipeline[], pipelineId: string | null) {
  return pipelines.find((pipeline) => pipeline.id === pipelineId)?.name ?? 'Unassigned';
}

export function getBotName(bots: BotRecord[], botId: string) {
  return bots.find((bot) => bot.id === botId)?.name ?? 'Unknown bot';
}

export function sortByCreatedAtDesc<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function createThreadTitle(input: string) {
  const cleaned = input.trim().replace(/^\//, '');
  return cleaned.length > 48 ? `${cleaned.slice(0, 48)}…` : cleaned || 'New thread';
}
