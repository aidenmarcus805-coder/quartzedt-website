export type OwnerTone = 'neutral' | 'success' | 'warning' | 'critical';

export type OwnerNavIcon =
  | 'overview'
  | 'pipelines'
  | 'groupchat'
  | 'suggestions'
  | 'import'
  | 'bots'
  | 'outputs'
  | 'refinements'
  | 'settings';

export interface OwnerNavItem {
  label: string;
  href: string;
  description: string;
  icon: OwnerNavIcon;
  shortcut: string;
}

export interface OwnerSignal {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: OwnerTone;
}

export interface OwnerActivityItem {
  id: string;
  agentName: string;
  pipelineLabel: string;
  action: string;
  detail: string;
  createdAtLabel: string;
  href: string;
  tone: OwnerTone;
}

export interface OwnerAlertItem {
  id: string;
  title: string;
  detail: string;
  severity: Exclude<OwnerTone, 'neutral'>;
  actionLabel: string;
  href: string;
}

export interface OwnerApprovalItem {
  id: string;
  title: string;
  pipelineLabel: string;
  requestedBy: string;
  detail: string;
  dueLabel: string;
  href: string;
}

export interface OwnerQuickAction {
  id: string;
  label: string;
  description: string;
  href: string;
}

export interface PipelineRecentOutput {
  id: string;
  title: string;
  kind: string;
  createdAtLabel: string;
  status: string;
}

export interface PipelineSummary {
  slug: string;
  name: string;
  description: string;
  accent: string;
  status: 'healthy' | 'watching' | 'blocked';
  focus: string;
  queueCount: number;
  botCount: number;
  recentOutputCount: number;
  routing: {
    intake: string;
    review: string;
    dispatch: string;
  };
  assignedBots: string[];
  recentOutputs: PipelineRecentOutput[];
}

export interface OwnerOutput {
  id: string;
  title: string;
  category: string;
  pipeline: string;
  pipelineLabel: string;
  pipelineAccent: string;
  status: 'ready' | 'needs-review' | 'queued' | 'routed';
  author: string;
  destination: string;
  createdAtLabel: string;
  excerpt: string;
  copyableText: string;
  routeTarget: string;
  href: string;
}

export interface OwnerSuggestion {
  id: string;
  title: string;
  type: 'Code refinement' | 'Marketing' | 'Workflow' | 'Product' | 'Pipeline';
  pipeline: string;
  pipelineLabel: string;
  priority: 'High' | 'Medium' | 'Low';
  createdAtLabel: string;
  summary: string;
  whyNow: string;
  executionBrief: string;
  tags: string[];
}

export interface ImportedBotAssignment {
  id: string;
  name: string;
  role: string;
  pipeline: string;
  pipelineLabel: string;
  active: boolean;
}

export interface ImportedBotPackage {
  id: string;
  source: 'OpenClaw' | 'KiloClaw';
  fileName: string;
  importedAtLabel: string;
  status: 'staged' | 'active' | 'needs-review';
  notes: string;
  preview: string;
  assignments: ImportedBotAssignment[];
}

export interface BotRecord {
  id: string;
  name: string;
  role: string;
  pipeline: string;
  pipelineLabel: string;
  model: string;
  status: 'active' | 'watching' | 'paused' | 'offline';
  permissions: string[];
  tools: string[];
  lastAction: string;
  recentActions: string[];
  logs: string[];
}

export interface CodeRefinementSpec {
  id: string;
  title: string;
  pipelineLabel: string;
  filesToChange: string[];
  suggestion: string;
  whyThisHelps: string;
  alternativeApproaches: string[];
}

export interface GroupchatParticipant {
  id: string;
  name: string;
  role: string;
  pipelineLabel: string;
  status: string;
}

export interface GroupchatThread {
  id: string;
  label: string;
  summary: string;
  openItems: number;
}

export interface GroupchatTask {
  id: string;
  title: string;
  owner: string;
  status: 'Running' | 'Review' | 'Queued';
  eta: string;
}

export interface GroupchatMessage {
  id: string;
  agentName: string;
  role: string;
  content: string;
  createdAtLabel: string;
  isOwner: boolean;
  replyToLabel?: string;
}

export interface GroupchatContext {
  id: string;
  label: string;
  description: string;
  unreadCount: number;
  participants: GroupchatParticipant[];
  pinnedCommands: string[];
  threads: GroupchatThread[];
  tasks: GroupchatTask[];
  messages: GroupchatMessage[];
}

export interface OwnerSettingField {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'text' | 'password' | 'textarea' | 'select';
  value: boolean | string;
  options?: string[];
}

export interface OwnerSettingSection {
  id: string;
  title: string;
  description: string;
  fields: OwnerSettingField[];
}
