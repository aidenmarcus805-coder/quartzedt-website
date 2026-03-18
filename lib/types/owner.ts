export type OwnerPageKey =
  | 'overview'
  | 'pipelines'
  | 'openclaw'
  | 'suggestions'
  | 'import-bot'
  | 'bots'
  | 'outputs'
  | 'code-refinements'
  | 'settings';

export type PipelineStatus = 'active' | 'watching' | 'paused' | 'archived';
export type BotStatus = 'active' | 'idle' | 'paused' | 'error';
export type HealthStatus = 'healthy' | 'watching' | 'error';
export type ThreadRoom = 'owner' | 'code' | 'marketing' | 'product' | 'research';
export type MessageAuthorType = 'owner' | 'bot' | 'system';
export type SuggestionCategory =
  | 'Product idea'
  | 'Code improvement'
  | 'Workflow improvement'
  | 'Marketing idea'
  | 'SEO idea'
  | 'UI refinement'
  | 'Automation opportunity';
export type SuggestionPriority = 'low' | 'medium' | 'high';
export type ReviewStatus = 'review' | 'approved' | 'rejected' | 'archived';
export type OutputType =
  | 'Suggestion'
  | 'Code refinement'
  | 'Marketing copy'
  | 'Social draft'
  | 'SEO brief'
  | 'Product spec'
  | 'Bot system notice';
export type ImportStatus = 'draft' | 'validated' | 'imported' | 'failed';
export type CommandType =
  | 'status'
  | 'stop'
  | 'restart'
  | 'assign'
  | 'route'
  | 'deploy'
  | 'summarize'
  | 'next'
  | 'unknown';

export interface OwnerNavItem {
  key: OwnerPageKey;
  label: string;
  href: string;
  badge?: string;
  helper?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: PipelineStatus;
  accent: string;
  lastActivityAt: string;
  botIds: string[];
  outputIds: string[];
  suggestionIds: string[];
  threadIds: string[];
  routingRules: {
    intake: string;
    review: string;
    dispatch: string;
  };
}

export interface BotLogEntry {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  createdAt: string;
}

export interface BotRecord {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  status: BotStatus;
  health: HealthStatus;
  model: string;
  pipelineId: string | null;
  tools: string[];
  permissions: string[];
  lastActiveAt: string;
  taskCount: number;
  recentOutputIds: string[];
  recentThreadIds: string[];
  logs: BotLogEntry[];
}

export interface ChatThread {
  id: string;
  title: string;
  room: ThreadRoom;
  pipelineId: string | null;
  participantBotIds: string[];
  pinned: boolean;
  archived: boolean;
  unreadCount: number;
  updatedAt: string;
  summary: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  authorType: MessageAuthorType;
  authorId: string;
  authorLabel: string;
  content: string;
  createdAt: string;
  status: 'sent' | 'working' | 'done';
}

export interface Suggestion {
  id: string;
  title: string;
  category: SuggestionCategory;
  priority: SuggestionPriority;
  status: ReviewStatus;
  pipelineId: string;
  botId: string;
  createdAt: string;
  summary: string;
  detail: string;
  cursorPayload: string;
}

export interface OutputItem {
  id: string;
  title: string;
  type: OutputType;
  status: ReviewStatus;
  pipelineId: string;
  botId: string;
  createdAt: string;
  preview: string;
  content: string;
}

export interface CodeRefinement {
  id: string;
  title: string;
  pipelineId: string;
  botId: string;
  status: 'review' | 'applied' | 'rejected';
  createdAt: string;
  filesToChange: string[];
  suggestion: string;
  whyThisHelps: string;
  alternativeApproaches: string[];
}

export interface ImportedBotPreview {
  id: string;
  name: string;
  model: string;
  role: string;
  tools: string[];
  suggestedPipelineId: string | null;
  active: boolean;
}

export interface ImportHistoryEntry {
  id: string;
  source: string;
  fileName: string;
  rawConfig: string;
  status: ImportStatus;
  createdAt: string;
  detectedBots: ImportedBotPreview[];
}

export interface ApprovalItem {
  id: string;
  title: string;
  kind: 'suggestion' | 'output' | 'refinement' | 'import';
  targetId: string;
  pipelineId: string | null;
  createdAt: string;
  summary: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  detail: string;
  createdAt: string;
  pipelineId: string | null;
  threadId: string | null;
}

export interface OwnerSettings {
  ownerEmail: string;
  requireOwnerCheck: boolean;
  defaultModel: string;
  defaultPipelineId: string;
  routeNewUiWorkToCode: boolean;
  compactMode: boolean;
  notifications: {
    approvals: boolean;
    imports: boolean;
    threadMentions: boolean;
  };
  integrations: {
    kiloClawApiKey: string;
    openClawConfigPath: string;
    cursorWorkspace: string;
  };
}

export interface SearchResult {
  id: string;
  label: string;
  href: string;
  kind: 'page' | 'thread' | 'pipeline' | 'bot' | 'suggestion' | 'output' | 'refinement';
  detail: string;
}

export interface OwnerCommand {
  type: CommandType;
  target?: string;
  pipeline?: string;
  raw: string;
}

export interface OwnerWorkspaceSnapshot {
  navigation: OwnerNavItem[];
  pipelines: Pipeline[];
  bots: BotRecord[];
  threads: ChatThread[];
  messages: ChatMessage[];
  suggestions: Suggestion[];
  outputs: OutputItem[];
  refinements: CodeRefinement[];
  imports: ImportHistoryEntry[];
  approvals: ApprovalItem[];
  activity: ActivityItem[];
  settings: OwnerSettings;
}

export interface ImportValidationResult {
  valid: boolean;
  error?: string;
  detectedBots: ImportedBotPreview[];
  source: string;
  fileName: string;
}
