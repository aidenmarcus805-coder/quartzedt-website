# Quartz Editor Owner Dashboard Design Guidelines

## 1. Global Shell

### Sidebar behavior
Fixed left position. 240px width. Collapsible on mobile to hamburger menu. Contains primary navigation. Solid white background (`bg-white`). Right border 1px solid gray-200 (`border-r border-gray-200`). Active item highlighted with subtle gray background (`bg-gray-100`) and black text (`text-black`). Inactive items gray-500 (`text-gray-500`). Hover state on inactive items (`hover:bg-gray-50 hover:text-gray-900`).

### Main content area
Fills remaining viewport width. Light gray background (`bg-gray-50`). Minimum height 100vh. Scrollable Y-axis. 32px padding on desktop (`p-8`), 16px on mobile (`p-4`).

### Top bar if any
Hidden by default on desktop. Mobile only for hamburger menu and page title. 64px height. Solid white background (`bg-white`). Bottom border 1px solid gray-200 (`border-b border-gray-200`).

### Global search
Located at top of sidebar or top of main content area (if expanded). Full width input. Height 36px. Light gray background (`bg-gray-100`). No border (`border-none`). Placeholder text gray-400. Focus state adds 2px black ring (`focus:ring-2 focus:ring-black`). Cmd+K shortcut to focus.

### Global actions
Profile/Settings icon at bottom of sidebar. 32px by 32px circular hit area.

### Spacing system
Base unit 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Strict adherence required.

### Typography scale
Inter font family.
Scale:
- H1: 24px, SemiBold, Tracking tight (-0.02em).
- H2: 20px, Medium, Tracking tight (-0.01em).
- H3: 16px, Medium.
- Body: 14px, Regular.
- Small: 12px, Regular, text-gray-500.

### Color system
- Background: gray-50 (`#f9fafb`).
- Surface: white (`#ffffff`).
- Primary text: black (`#000000`) or gray-900 (`#111827`).
- Secondary text: gray-500 (`#6b7280`).
- Borders: gray-200 (`#e5e7eb`).
- Accents (Blue): blue-600 (`#2563eb`) for primary buttons only.
- Destructive: red-600 (`#dc2626`).
- Success: green-600 (`#16a34a`).

### Shadow system
Subtle depth only.
- Shadow-sm: For buttons and small inputs (`shadow-sm`).
- Shadow: For cards and dropdowns (`shadow`).
- No large shadows.

### Border system
1px solid. Color gray-200. Used for structure definition.

### Radius system
- Base: 6px (`rounded-md`).
- Buttons/Inputs: 6px (`rounded-md`).
- Cards: 8px (`rounded-lg`).
- Badges: 9999px (`rounded-full`).

### State system
- Default: Normal opacity, base color.
- Hover: 5% darken or light background shift.
- Active/Pressed: 10% darken, scale down to 0.98.
- Disabled: 50% opacity, `cursor-not-allowed`, grayscale if applicable.

### Hover system
Fast transition (150ms). Ease-in-out. Color or background-color change.

### Focus system
Keyboard focus: 2px solid black ring (`focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2`). Mouse focus: none, handle via active state.

## 2. Page Hierarchy

### Overview
- **Primary purpose**: High-level status of the business and systems.
- **Main focal area**: Key metrics (Revenue, Active Pipelines).
- **Secondary areas**: Recent alerts or issues.
- **Tertiary areas**: Quick links.
- **Action areas**: None primary.
- **Entry states**: Fades in.
- **Empty states**: "No data available" text, gray-500.
- **Loading states**: Skeleton pulses matching component dimensions.
- **Error states**: Inline red text block with "Retry" button.
- **Interaction flow**: Click metric to drill down.
- **Data presentation**: Simple numbers with % change.
- **Navigation within page**: Scroll down.
- **Page level actions**: Date range picker (top right).

### Customers
- **Primary purpose**: List and manage users.
- **Main focal area**: Customer table/list.
- **Secondary areas**: Search and filter bar.
- **Tertiary areas**: Pagination.
- **Action areas**: Row click to view details.
- **Entry states**: Table skeleton.
- **Empty states**: "No customers found" matching filter.
- **Loading states**: Row skeletons.
- **Error states**: "Failed to load customers" below header.
- **Interaction flow**: Search -> Filter -> Click Row.
- **Data presentation**: Tabular. Columns: Name, Plan, Status, Joined.
- **Navigation within page**: Pagination controls.
- **Page level actions**: Export CSV button.

### Revenue
- **Primary purpose**: Financial metrics.
- **Main focal area**: MRR and growth chart.
- **Secondary areas**: Recent transactions list.
- **Tertiary areas**: Churn metrics.
- **Action areas**: None.
- **Entry states**: Chart skeleton.
- **Empty states**: Zero states with flat lines.
- **Loading states**: Chart skeleton.
- **Error states**: "Failed to load financial data".
- **Interaction flow**: Hover over chart for exact numbers.
- **Data presentation**: Line chart and list.
- **Navigation within page**: None.
- **Page level actions**: Date range picker.

### Product Usage
- **Primary purpose**: Track feature adoption.
- **Main focal area**: Top features list by usage volume.
- **Secondary areas**: Active user count line chart.
- **Tertiary areas**: Drop-off points.
- **Action areas**: None.
- **Entry states**: List skeletons.
- **Empty states**: "No usage data yet".
- **Loading states**: List skeletons.
- **Error states**: "Failed to load usage data".
- **Interaction flow**: View only.
- **Data presentation**: Bar charts and lists.
- **Navigation within page**: None.
- **Page level actions**: Date range picker.

### Operations
- **Primary purpose**: System health and infrastructure cost.
- **Main focal area**: Server status list.
- **Secondary areas**: Error rate chart.
- **Tertiary areas**: Cost breakdown.
- **Action areas**: Restart service buttons.
- **Entry states**: Status indicators loading.
- **Empty states**: N/A.
- **Loading states**: Spinners on indicators.
- **Error states**: "Status unknown".
- **Interaction flow**: Click to expand service logs.
- **Data presentation**: Key-value pairs and tiny sparklines.
- **Navigation within page**: Scroll.
- **Page level actions**: Refresh status button.

### Pipelines
- **Primary purpose**: Monitor video processing jobs.
- **Main focal area**: List of active jobs with progress bars.
- **Secondary areas**: Completed/Failed counts.
- **Tertiary areas**: Queue depth.
- **Action areas**: Cancel job button, Retry job button.
- **Entry states**: Job list skeleton.
- **Empty states**: "No active pipelines".
- **Loading states**: Job list skeleton.
- **Error states**: "Failed to load pipeline queue".
- **Interaction flow**: Click job to view logs.
- **Data presentation**: Cards with progress bars.
- **Navigation within page**: Tabs (Active, Completed, Failed).
- **Page level actions**: Pause all pipelines (Destructive).

### OpenClaw Chat
- **Primary purpose**: Converse with OpenClaw assistant.
- **Main focal area**: Message history thread.
- **Secondary areas**: Input composer.
- **Tertiary areas**: Context attachments list.
- **Action areas**: Send button, Attach button.
- **Entry states**: Composer focused.
- **Empty states**: "Ask OpenClaw anything."
- **Loading states**: Typing indicator (three dots).
- **Error states**: "Message failed to send. [Retry]" inline.
- **Interaction flow**: Type -> Send -> Wait -> Read.
- **Data presentation**: Chat bubbles (Left/Right alignment).
- **Navigation within page**: Scroll up for history.
- **Page level actions**: Clear chat history.

### Suggestions
- **Primary purpose**: AI-generated system improvements.
- **Main focal area**: List of suggestion cards.
- **Secondary areas**: Dismissed suggestions tab.
- **Tertiary areas**: None.
- **Action areas**: Approve button, Dismiss button.
- **Entry states**: Card skeletons.
- **Empty states**: "No new suggestions. System optimal."
- **Loading states**: Card skeletons.
- **Error states**: "Failed to load suggestions".
- **Interaction flow**: Review card -> Approve or Dismiss.
- **Data presentation**: Cards with diffs or text summaries.
- **Navigation within page**: None.
- **Page level actions**: Dismiss all.

### Outputs
- **Primary purpose**: Review final rendered videos/assets.
- **Main focal area**: Grid or list of recent files.
- **Secondary areas**: Search by project/customer.
- **Tertiary areas**: Storage usage metric.
- **Action areas**: Download button, Play button, Delete button.
- **Entry states**: Grid skeletons.
- **Empty states**: "No outputs generated yet."
- **Loading states**: Grid skeletons.
- **Error states**: "Failed to load file list".
- **Interaction flow**: Click to preview -> Download.
- **Data presentation**: Thumbnails with filenames and sizes.
- **Navigation within page**: Pagination.
- **Page level actions**: None.

### Code Refinements
- **Primary purpose**: Review code changes proposed by AI.
- **Main focal area**: Diff viewer.
- **Secondary areas**: List of proposed commits.
- **Tertiary areas**: CI status.
- **Action areas**: Merge button, Reject button.
- **Entry states**: Commit list skeleton.
- **Empty states**: "No pending refinements."
- **Loading states**: Diff loading state.
- **Error states**: "Failed to load diff."
- **Interaction flow**: Select commit -> Review diff -> Action.
- **Data presentation**: Syntax-highlighted diffs (red/green background).
- **Navigation within page**: Left pane list, right pane diff.
- **Page level actions**: None.

### Bot Management
- **Primary purpose**: Configure AI sub-agents.
- **Main focal area**: List of active bots.
- **Secondary areas**: Bot creation form.
- **Tertiary areas**: Global bot settings.
- **Action areas**: Toggle active status, Edit prompt button.
- **Entry states**: List skeleton.
- **Empty states**: "No bots configured."
- **Loading states**: List skeleton.
- **Error states**: "Failed to load bots."
- **Interaction flow**: Click edit -> Update prompt -> Save.
- **Data presentation**: List items with status toggles.
- **Navigation within page**: None.
- **Page level actions**: Create new bot.

### Import Bot
- **Primary purpose**: Manage external data ingestion rules.
- **Main focal area**: List of sync connections.
- **Secondary areas**: Sync history log.
- **Tertiary areas**: None.
- **Action areas**: Trigger sync, Edit connection.
- **Entry states**: List skeleton.
- **Empty states**: "No import sources configured."
- **Loading states**: List skeleton.
- **Error states**: "Failed to load sync status."
- **Interaction flow**: Click trigger -> Watch status change to 'Syncing'.
- **Data presentation**: Table with last sync time and status.
- **Navigation within page**: Tabs (Connections, History).
- **Page level actions**: Add new connection.

### Settings
- **Primary purpose**: Global dashboard configuration.
- **Main focal area**: Stacked form sections (Profile, Team, Billing).
- **Secondary areas**: Danger zone (Delete account).
- **Tertiary areas**: None.
- **Action areas**: Save changes button per section.
- **Entry states**: Form values populate.
- **Empty states**: N/A.
- **Loading states**: Input skeletons.
- **Error states**: Field-level validation text (red).
- **Interaction flow**: Edit field -> Save button enables -> Click save.
- **Data presentation**: Forms. Inputs with labels above.
- **Navigation within page**: Scroll or sidebar anchor links.
- **Page level actions**: None.

## 3. Component Library

### OwnerSidebar
- **Purpose**: Global navigation.
- **Variants**: Desktop (expanded), Mobile (off-canvas).
- **States**: Default, active item, hover item.
- **Interactions**: Click to navigate.
- **Sizing**: 240px width. Full height.
- **Spacing**: 8px between items. 16px padding container.
- **Typography**: 14px Medium.
- **Visual hierarchy**: Highest level structure.
- **Animation if any**: Mobile slide-in (transform 200ms ease-out).

### PageHeader
- **Purpose**: Identify current view and house page actions.
- **Variants**: Standard, With Tabs.
- **States**: N/A.
- **Interactions**: N/A.
- **Sizing**: 64px height min.
- **Spacing**: 32px bottom margin to content.
- **Typography**: 24px SemiBold (H1).
- **Visual hierarchy**: Page title.
- **Animation if any**: None.

### InboxList
- **Purpose**: Display list of actionable items (alerts, tickets).
- **Variants**: Read, Unread.
- **States**: Default, Hover row, Selected row.
- **Interactions**: Click to view detail.
- **Sizing**: Full width. 64px row height.
- **Spacing**: 16px horizontal padding.
- **Typography**: 14px Regular body. 12px Regular timestamp.
- **Visual hierarchy**: Unread items have black text, read items have gray-600 text.
- **Animation if any**: None.

### CustomerRow
- **Purpose**: Display single customer summary.
- **Variants**: Active, Inactive, Churned.
- **States**: Default, Hover.
- **Interactions**: Click to navigate to customer profile.
- **Sizing**: 56px height.
- **Spacing**: 16px padding.
- **Typography**: 14px Medium name. 14px Regular email.
- **Visual hierarchy**: Name primary, metadata secondary.
- **Animation if any**: None.

### RevenueRow
- **Purpose**: Display single transaction.
- **Variants**: Charge, Refund, Failed.
- **States**: Default.
- **Interactions**: None.
- **Sizing**: 48px height.
- **Spacing**: 16px padding.
- **Typography**: 14px Regular. Amount right-aligned.
- **Visual hierarchy**: Amount primary.
- **Animation if any**: None.

### ProductSignal
- **Purpose**: Display metric card for product usage.
- **Variants**: Up trend, Down trend, Flat.
- **States**: Default.
- **Interactions**: None.
- **Sizing**: 1/3 or 1/4 column width. Minimum 120px height.
- **Spacing**: 24px internal padding.
- **Typography**: 20px Medium value, 12px Regular label.
- **Visual hierarchy**: Value is largest element.
- **Animation if any**: None.

### OperationalIssue
- **Purpose**: Show system alert.
- **Variants**: Critical (Red), Warning (Yellow), Info (Blue).
- **States**: Default.
- **Interactions**: Click to acknowledge/dismiss.
- **Sizing**: Full width banner or list item.
- **Spacing**: 12px padding.
- **Typography**: 14px Medium text.
- **Visual hierarchy**: Color dictates severity.
- **Animation if any**: Slide down to appear.

### PipelineCard
- **Purpose**: Display active processing job.
- **Variants**: Queued, Processing, Completed, Failed.
- **States**: Default, Hover.
- **Interactions**: Click for logs. Button clicks for cancel/retry.
- **Sizing**: 100% width of container.
- **Spacing**: 16px padding. 8px margin bottom.
- **Typography**: 14px Medium title. 12px Regular status.
- **Visual hierarchy**: Title, Progress bar, Status text.
- **Animation if any**: Progress bar width transition (linear).

### ChatComposer
- **Purpose**: Input area for OpenClaw chat.
- **Variants**: Empty, With text.
- **States**: Default, Focused, Disabled (while generating).
- **Interactions**: Type, Enter to send, Shift+Enter for newline.
- **Sizing**: Auto-expanding height (min 48px, max 200px).
- **Spacing**: 12px padding inside input.
- **Typography**: 14px Regular.
- **Visual hierarchy**: 1px solid gray-200 border, ring on focus.
- **Animation if any**: None.

### ChatThread
- **Purpose**: Container for chat messages.
- **Variants**: N/A.
- **States**: N/A.
- **Interactions**: Scroll up to load older messages.
- **Sizing**: Flex 1 (fills available vertical space).
- **Spacing**: 24px padding. 16px gap between messages.
- **Typography**: N/A.
- **Visual hierarchy**: N/A.
- **Animation if any**: Smooth scroll to bottom on new message.

### ChatMessage
- **Purpose**: Individual chat bubble.
- **Variants**: User (Right, Gray bg), Assistant (Left, White bg, border).
- **States**: Default.
- **Interactions**: Text selection.
- **Sizing**: Max-width 80%.
- **Spacing**: 12px 16px padding.
- **Typography**: 14px Regular. Markdown supported.
- **Visual hierarchy**: Content primary.
- **Animation if any**: Fade up on entry (150ms).

### SuggestionCard
- **Purpose**: Display AI recommendation.
- **Variants**: Code, Config, Process.
- **States**: Default.
- **Interactions**: Approve, Reject.
- **Sizing**: Full width container.
- **Spacing**: 24px padding.
- **Typography**: 16px Medium title, 14px Regular description.
- **Visual hierarchy**: Title, Diff/Summary, Action buttons bottom right.
- **Animation if any**: None.

### OutputRow
- **Purpose**: File listing.
- **Variants**: Video, Audio, Data.
- **States**: Default, Hover.
- **Interactions**: Download click.
- **Sizing**: 64px height.
- **Spacing**: 16px padding.
- **Typography**: 14px Medium filename.
- **Visual hierarchy**: Filename, Date, Size, Action icon.
- **Animation if any**: None.

### CodeRefinementCard
- **Purpose**: Show proposed code diff.
- **Variants**: Addition, Deletion, Modification.
- **States**: Default.
- **Interactions**: Merge click.
- **Sizing**: Flexible height based on diff.
- **Spacing**: 16px padding header, 0px padding body.
- **Typography**: 12px Mono for code. 14px Medium header.
- **Visual hierarchy**: Red/Green diff lines dominant.
- **Animation if any**: None.

### BotRow
- **Purpose**: List bot configuration.
- **Variants**: Active, Paused.
- **States**: Default, Hover.
- **Interactions**: Toggle switch.
- **Sizing**: 64px height.
- **Spacing**: 16px padding.
- **Typography**: 14px Medium name.
- **Visual hierarchy**: Name, Status badge, Toggle right aligned.
- **Animation if any**: Toggle sliding animation.

### ImportUploader
- **Purpose**: Drag and drop zone for files or config.
- **Variants**: Default, Dragging over.
- **States**: Idle, Active, Uploading, Success, Error.
- **Interactions**: Click to browse, Drag over to drop.
- **Sizing**: 200px height min. Full width.
- **Spacing**: 32px padding inside.
- **Typography**: 14px Medium text.
- **Visual hierarchy**: Dashed border gray-300, solid gray-500 on drag over. Icon centered.
- **Animation if any**: Background color transition on drag over.

### SettingsForm
- **Purpose**: Group related inputs.
- **Variants**: Default.
- **States**: Pristine, Dirty, Submitting.
- **Interactions**: Typing in inputs. Submit click.
- **Sizing**: Max width 600px.
- **Spacing**: 24px gap between form groups.
- **Typography**: 14px Medium labels.
- **Visual hierarchy**: Label top, input below, helper text below input.
- **Animation if any**: None.

### ActionRow
- **Purpose**: Container for bottom-aligned form actions.
- **Variants**: Left aligned, Right aligned.
- **States**: N/A.
- **Interactions**: N/A.
- **Sizing**: 100% width.
- **Spacing**: 16px top margin.
- **Typography**: N/A.
- **Visual hierarchy**: Primary button distinct from secondary.
- **Animation if any**: None.

### FilterPanel
- **Purpose**: Hold filter controls above lists.
- **Variants**: Simple (1 row), Complex (Multi-row).
- **States**: N/A.
- **Interactions**: Select dropdowns.
- **Sizing**: Full width.
- **Spacing**: 16px padding. 16px gap between filters.
- **Typography**: 14px Regular.
- **Visual hierarchy**: Inline elements left aligned.
- **Animation if any**: None.

### SearchInput
- **Purpose**: Text filter for lists.
- **Variants**: With icon.
- **States**: Default, Focused.
- **Interactions**: Type to filter. Esc to clear.
- **Sizing**: 36px height. 240px width default.
- **Spacing**: 8px left padding for icon, 32px left padding for text.
- **Typography**: 14px Regular.
- **Visual hierarchy**: Search icon inside input left.
- **Animation if any**: None.

## 4. Content Guidelines

### Copy style
Direct. Professional. Zero personality. Action-oriented. No jargon unless industry-standard. Sentence case for everything except proper nouns.

### Label conventions
Noun phrases. "Email address", not "Your email". "Server status", not "Current server status".

### Button wording
Verb + Noun. "Save changes", "Delete customer", "Export CSV". Short verbs for globals: "Save", "Cancel", "Edit".

### Status wording
Adjectives. "Active", "Pending", "Failed", "Completed".

### Empty state copy
Clear statement of fact + action (if applicable). "No customers found." "No active pipelines. Start a new job."

### Error messaging
"Action failed: [Reason]". "Failed to save settings: Network error." No "Oops" or "Something went wrong".

### Success messaging
"Action completed." "Settings saved." "Pipeline started." Hide via toast after 3 seconds.

### Badge text
One word only. "New", "Beta", "Error", "Live".

### Icon usage
Feather icons or Heroicons. 1.5 stroke width. Black or gray-500. Functional only, never decorative. Use adjacent to text for clarity.

## 5. Behavior Guidelines

### Keyboard navigation
Full Tab support. Logical DOM order matching visual order. Enter/Space activates buttons. Esc closes modals/dropdowns.

### Mouse interactions
Hover states on all clickable elements. Cursor changes to pointer on interactive elements.

### Touch interactions
Minimum tap target 44px by 44px. No hover-dependent information.

### Responsive breakpoints
- Mobile: < 768px. Stacked layouts, hidden sidebar.
- Tablet: 768px - 1024px.
- Desktop: > 1024px. Side-by-side layouts.

### Loading patterns
Skeleton screens for initial load. Inline spinners for actions. Disable buttons while action is processing.

### Error recovery
Always provide a "Retry" button for failed data fetches. Preserve user input on form submission errors.

### Undo patterns
Use toast with "Undo" action for non-destructive but significant actions (e.g., archiving). Destructive actions (Delete) require confirmation modal.

### Bulk actions
Checkbox column on left of tables. Action bar appears pinned to bottom of screen when items are selected.

### Inline actions
Hover on row reveals action icons on right side for quick access (Edit, Delete). Fallback to action menu column on touch.

### Drawer behavior
Slides in from right. 400px width. Backdrop 50% black opacity. Esc to close. Click outside to close.

### Modal behavior
Centered. Max width 500px. White background, rounded corners, shadow. Title, Content, Action Footer. Focus trapped inside modal. Esc to close.

### Search behavior
Instant search with 300ms debounce. Results update inline without page reload.

### Filter behavior
Apply immediately on selection. Active filters displayed as removable chips above list.

### Sort behavior
Click table header to sort. Toggle between ASC, DESC, None. Indicator chevron next to label.

### Infinite scroll
Used for logs and chat history. Trigger next page load 200px before reaching bottom/top.

### Real time updates
Use WebSockets. New items animate in (fade or slide). Changed values flash gray-100 briefly.

## 6. Accessibility

### Contrast
All text must meet WCAG 2.1 AA ratio (4.5:1 for normal text). Gray-500 (#6b7280) on white passes.

### Focus order
Top-to-bottom, left-to-right. Skip to main content link available at top of DOM.

### Screen reader labels
`aria-label` on all icon-only buttons. `aria-describedby` for inputs with helper text.

### Keyboard traps
No focus traps except intentionally inside active Modals/Drawers.

### ARIA requirements
`role="alert"` for error messages. `role="status"` for loading states. `aria-expanded` for dropdowns.

### Reduced motion support
Respect `prefers-reduced-motion`. Disable all sliding/fading transitions, replace with instant state changes.

## 7. Performance

### Image optimization
Avatars max 64x64px WebP. Thumbnails max 320x180px JPEG. Lazy load images below fold.

### Bundle size
Code split by route. Keep initial JS payload under 200kb gzip. No heavy charting libraries unless critical.

### Animation performance
Animate `transform` and `opacity` only. Never animate `width`, `height`, `margin`, or `padding`.

### Scroll performance
Virtualize long lists (>100 items). Passive event listeners for scroll.

### Memory usage
Cleanup WebSocket connections on unmount. Clear intervals. Do not store entire raw logs in memory, keep last 1000 lines.

## 8. Implementation Constraints

### Tailwind classes only
No custom CSS files. No inline styles unless dynamically calculated positioning. Extend Tailwind config for custom values.

### No heavy dependencies
Use native browser APIs where possible. `Intl.NumberFormat` for currency. `Intl.DateTimeFormat` for dates. No Moment.js or Lodash.

### Mobile first
Base classes are mobile. `md:` and `lg:` prefixes for larger screens.

### Progressive enhancement
Basic forms should work without JS if possible. Not strictly required for SPA dashboard, but graceful fallback for broken JS.

### Dark mode not required
Light theme only. Hardcode white/gray backgrounds and black text.

### RTL not required
LTR layout only.

### Internationalization not required
English only. Hardcode strings.