# Quartz Design System — Desktop Application

## Brand Identity

**Product:** Quartz — AI-powered wedding video editing software  
**Platform:** Desktop application (Windows/macOS)  
**Tagline:** "From Weeks to Hours"  
**Positioning:** Premium creative tool for professional wedding videographers

---

## Design Philosophy

### Style Name: Cinematic Pro Minimalism

A design language that combines:
- **Cinematic aesthetics** (film-grade color, dramatic contrast)
- **Pro tool gravitas** (serious, precise, trustworthy)
- **Restrained minimalism** (every element earns its place)
- **Wedding elegance** (refined details, sophisticated typography)

### Core Principles

1. **Content is king** — Video preview and timeline dominate; UI recedes
2. **Dark-first interface** — Reduces eye strain, makes footage pop
3. **Information density done right** — Dense but not cluttered
4. **Predictable interactions** — Familiar patterns from pro NLEs (Premiere, Resolve)
5. **Professional restraint** — No "AI slop" gradients, unnecessary animations, or gimmicks

---

## Color Palette

### Dark Theme (Primary)

```css
/* Backgrounds — Layered depth system */
--bg-base: #0A0A0A;              /* Deepest layer (behind panels) */
--bg-surface: #141414;           /* Panel backgrounds */
--bg-elevated: #1A1A1A;          /* Cards, dropdowns, modals */
--bg-overlay: #202020;           /* Hover states, selections */

/* Borders */
--border-subtle: #262626;        /* Panel dividers */
--border-default: #333333;       /* Input borders */
--border-strong: #404040;        /* Focus rings */

/* Text */
--text-primary: #FFFFFF;         /* Headings, important text */
--text-secondary: #A3A3A3;       /* Body text, labels */
--text-tertiary: #737373;        /* Placeholder, disabled */
--text-muted: #525252;           /* Timestamps, metadata */

/* Interactive */
--interactive-default: #FFFFFF;  /* Buttons, links */
--interactive-hover: #E5E5E5;    /* Hover state */
--interactive-active: #CCCCCC;   /* Pressed state */
--interactive-disabled: #404040; /* Disabled state */
```

### Accent Colors (Use Sparingly)

```css
/* Status indicators only */
--color-accent: #FFFFFF;         /* Primary action, selection highlight */
--color-success: #22C55E;        /* Sync complete, export success */
--color-warning: #F59E0B;        /* Sync issues, low disk */
--color-error: #EF4444;          /* Errors, failed operations */
--color-info: #3B82F6;           /* Tips, informational */

/* Timeline-specific */
--color-audio-waveform: #4ADE80; /* Audio visualization */
--color-selection: rgba(255, 255, 255, 0.15); /* Range selection */
--color-playhead: #FFFFFF;       /* Playhead line */
--color-in-out: #F59E0B;         /* In/out points */
```

### Usage Rules

- **Monochrome interface** — App chrome is strictly grayscale
- **Color is semantic** — Only for status, errors, or timeline markers
- **Footage should pop** — Dark UI ensures video preview stands out
- **No colored backgrounds** — Panels are always dark grays

---

## Typography

### Font Stack

```css
--font-ui: 'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

### Type Scale (UI Optimized)

```css
/* Window Title */
--text-title: 0.8125rem;         /* 13px */
--text-title-weight: 600;

/* Panel Headers */
--text-panel-header: 0.75rem;    /* 12px */
--text-panel-header-weight: 600;
--text-panel-header-transform: uppercase;
--text-panel-header-spacing: 0.05em;

/* Labels & UI Text */
--text-label: 0.75rem;           /* 12px */
--text-label-weight: 500;

/* Body / Descriptions */
--text-body: 0.8125rem;          /* 13px */
--text-body-weight: 400;

/* Small / Metadata */
--text-small: 0.6875rem;         /* 11px */
--text-small-weight: 400;

/* Timecode */
--text-timecode: 0.75rem;        /* 12px, monospace */
--text-timecode-font: var(--font-mono);
--text-timecode-weight: 500;
```

### Typography Patterns

| Context | Size | Weight | Case | Font |
|---------|------|--------|------|------|
| Window title | 13px | 600 | Sentence | UI |
| Panel header | 12px | 600 | UPPERCASE | UI |
| Tab label | 12px | 500 | Sentence | UI |
| Button text | 12px | 500 | Sentence | UI |
| Input label | 11px | 500 | Sentence | UI |
| Body text | 13px | 400 | Sentence | UI |
| Timecode | 12px | 500 | — | Mono |
| Keyboard shortcuts | 11px | 400 | — | Mono |

---

## Spacing System

### Base Unit

```css
--space-unit: 4px;
```

### Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

### Application Spacing

| Element | Spacing |
|---------|---------|
| Panel padding | 12px |
| Panel header padding | 8px 12px |
| Item spacing in lists | 4px |
| Button padding | 6px 12px |
| Input padding | 6px 8px |
| Toolbar icon gap | 4px |
| Section gap (within panel) | 16px |

---

## Layout Architecture

### Window Structure

```
┌─────────────────────────────────────────────────────────┐
│  Title Bar / Menu Bar                                   │
├────────────┬────────────────────────────┬───────────────┤
│            │                            │               │
│  Left      │  Video Preview             │  Right        │
│  Panel     │  (Primary Focus)           │  Panel        │
│  (Browser) │                            │  (Inspector)  │
│            │                            │               │
│            ├────────────────────────────┤               │
│            │  Timeline                  │               │
│            │  (Horizontal scroll)       │               │
├────────────┴────────────────────────────┴───────────────┤
│  Status Bar                                             │
└─────────────────────────────────────────────────────────┘
```

### Panel Hierarchy

1. **Video Preview** — Largest, center focus, where the work lives
2. **Timeline** — Full width, primary interaction surface
3. **Side Panels** — Collapsible, supporting tools and properties
4. **Title Bar** — Minimal, blends with OS or custom frame
5. **Status Bar** — Compact, progress and system info

### Panel Behavior

- **Resizable** — Drag dividers to resize
- **Collapsible** — Toggle visibility with keyboard shortcuts
- **Dockable** — Panels can be rearranged (if supported)
- **Responsive** — Minimum widths prevent unusable states

---

## Component Patterns

### Window Chrome

```css
/* Title Bar */
height: 38px;
background: var(--bg-surface);
border-bottom: 1px solid var(--border-subtle);
-webkit-app-region: drag;        /* Draggable */

/* Traffic lights / Window controls */
position: absolute;
left: 12px;                      /* macOS */
/* or right: 12px for Windows */
```

### Panels

```css
/* Panel Container */
background: var(--bg-surface);
border: 1px solid var(--border-subtle);

/* Panel Header */
height: 32px;
padding: 0 12px;
background: var(--bg-elevated);
border-bottom: 1px solid var(--border-subtle);
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;
color: var(--text-secondary);
```

### Buttons

```css
/* Primary Button */
background: var(--interactive-default);
color: var(--bg-base);
padding: 6px 12px;
border-radius: 4px;
font-size: 12px;
font-weight: 500;

/* Secondary Button */
background: var(--bg-elevated);
color: var(--text-primary);
border: 1px solid var(--border-default);

/* Ghost Button */
background: transparent;
color: var(--text-secondary);

/* Icon Button */
width: 28px;
height: 28px;
padding: 0;
border-radius: 4px;
background: transparent;

/* Icon Button Hover */
background: var(--bg-overlay);
```

### Inputs

```css
/* Text Input */
background: var(--bg-base);
border: 1px solid var(--border-default);
border-radius: 4px;
padding: 6px 8px;
font-size: 13px;
color: var(--text-primary);

/* Input Focus */
border-color: var(--border-strong);
outline: none;

/* Slider / Range */
height: 4px;
background: var(--bg-overlay);
border-radius: 2px;

/* Slider Thumb */
width: 12px;
height: 12px;
background: var(--interactive-default);
border-radius: 50%;
```

### Toolbar

```css
/* Toolbar Container */
height: 40px;
padding: 0 8px;
background: var(--bg-surface);
border-bottom: 1px solid var(--border-subtle);
display: flex;
align-items: center;
gap: 4px;

/* Tool Button */
width: 32px;
height: 32px;
border-radius: 4px;
background: transparent;

/* Tool Button Active */
background: var(--bg-overlay);
color: var(--text-primary);

/* Divider */
width: 1px;
height: 20px;
background: var(--border-subtle);
margin: 0 4px;
```

### Timeline

```css
/* Timeline Container */
background: var(--bg-base);
min-height: 200px;

/* Track */
height: 48px;
background: var(--bg-surface);
border-bottom: 1px solid var(--border-subtle);

/* Clip */
background: var(--bg-elevated);
border: 1px solid var(--border-default);
border-radius: 4px;

/* Clip Selected */
border-color: var(--interactive-default);
box-shadow: 0 0 0 1px var(--interactive-default);

/* Playhead */
width: 2px;
background: var(--color-playhead);
z-index: 100;

/* Timecode Ruler */
height: 24px;
background: var(--bg-surface);
font-family: var(--font-mono);
font-size: 11px;
color: var(--text-tertiary);
```

### Video Preview

```css
/* Preview Container */
background: #000000;
display: flex;
align-items: center;
justify-content: center;

/* Transport Controls */
height: 40px;
background: var(--bg-surface);
border-top: 1px solid var(--border-subtle);

/* Timecode Display */
font-family: var(--font-mono);
font-size: 14px;
font-weight: 500;
color: var(--text-primary);
background: var(--bg-base);
padding: 4px 8px;
border-radius: 4px;
```

### Context Menus

```css
/* Menu Container */
background: var(--bg-elevated);
border: 1px solid var(--border-default);
border-radius: 6px;
padding: 4px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

/* Menu Item */
padding: 6px 12px;
border-radius: 4px;
font-size: 13px;

/* Menu Item Hover */
background: var(--bg-overlay);

/* Keyboard Shortcut */
color: var(--text-tertiary);
font-family: var(--font-mono);
font-size: 11px;
```

### Modals / Dialogs

```css
/* Overlay */
background: rgba(0, 0, 0, 0.6);
backdrop-filter: blur(4px);

/* Modal Container */
background: var(--bg-elevated);
border: 1px solid var(--border-default);
border-radius: 8px;
padding: 24px;
max-width: 480px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);

/* Modal Header */
font-size: 16px;
font-weight: 600;
margin-bottom: 16px;

/* Modal Actions */
display: flex;
gap: 8px;
justify-content: flex-end;
margin-top: 24px;
```

### Progress Indicators

```css
/* Progress Bar */
height: 4px;
background: var(--bg-overlay);
border-radius: 2px;

/* Progress Fill */
background: var(--interactive-default);
border-radius: 2px;
transition: width 0.2s ease;

/* Indeterminate */
animation: indeterminate 1.5s ease infinite;

/* Spinner */
width: 16px;
height: 16px;
border: 2px solid var(--border-default);
border-top-color: var(--interactive-default);
border-radius: 50%;
animation: spin 0.8s linear infinite;
```

---

## Motion & Animation

### Principles

1. **Functional, not decorative** — Animation aids understanding
2. **Fast and responsive** — Users are working, not waiting
3. **Subtle** — Don't distract from video content
4. **60fps minimum** — No jank in a video editing app

### Timing

```css
--duration-instant: 100ms;       /* Hovers, toggles */
--duration-fast: 150ms;          /* Panel resizes, UI feedback */
--duration-normal: 200ms;        /* Dropdowns, modals */
--duration-slow: 300ms;          /* Panel collapse/expand */
```

### Easing

```css
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Patterns

| Action | Duration | Easing |
|--------|----------|--------|
| Button hover | 100ms | ease-out |
| Dropdown open | 150ms | ease-out |
| Panel expand | 200ms | ease-in-out |
| Modal open | 200ms | ease-out |
| Progress update | 200ms | ease-out |
| Toast appear | 200ms | ease-out |

### What NOT to Animate

- Clip dragging on timeline (immediate response)
- Playhead scrubbing (instant)
- Panel resizing (instant or very fast)
- Keyboard navigation (instant)

---

## Iconography

### Style

- **Stroke-based** — 1.5px stroke weight
- **Minimal detail** — Recognizable at 16px
- **Consistent optical weight** — Icons feel balanced
- **Neutral color** — `var(--text-secondary)` default

### Sizes

```css
--icon-xs: 12px;                 /* Inline indicators */
--icon-sm: 16px;                 /* Default UI icons */
--icon-md: 20px;                 /* Toolbar icons */
--icon-lg: 24px;                 /* Empty states */
```

### Icon States

```css
/* Default */
color: var(--text-secondary);
opacity: 1;

/* Hover */
color: var(--text-primary);

/* Active */
color: var(--text-primary);

/* Disabled */
color: var(--text-tertiary);
opacity: 0.5;
```

---

## States & Feedback

### Interactive States

| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | bg-elevated | border-default | text-secondary |
| Hover | bg-overlay | border-default | text-primary |
| Active/Pressed | bg-overlay | border-strong | text-primary |
| Focus | — | border-strong + ring | text-primary |
| Selected | bg-overlay | border-strong | text-primary |
| Disabled | bg-surface | border-subtle | text-tertiary |

### Focus Indicators

```css
/* Focus Ring */
outline: 2px solid var(--border-strong);
outline-offset: 2px;

/* Or box-shadow approach */
box-shadow: 0 0 0 2px var(--bg-base), 0 0 0 4px var(--border-strong);
```

### Loading States

- **Progress bar** — For known durations (export, sync)
- **Spinner** — For unknown durations (processing)
- **Skeleton** — For content loading (thumbnails)
- **Disabled + spinner** — For buttons during async actions

### Error States

```css
/* Error Input */
border-color: var(--color-error);

/* Error Message */
color: var(--color-error);
font-size: 11px;
margin-top: 4px;
```

---

## Keyboard & Accessibility

### Keyboard Navigation

- All interactive elements must be focusable
- Tab order follows visual layout
- Custom focus styles (see above)
- Arrow keys for lists, tabs, timeline

### Common Shortcuts (Reference)

| Action | Shortcut |
|--------|----------|
| Play/Pause | Space |
| Cut | Cmd/Ctrl + X |
| Copy | Cmd/Ctrl + C |
| Paste | Cmd/Ctrl + V |
| Undo | Cmd/Ctrl + Z |
| Redo | Cmd/Ctrl + Shift + Z |
| Save | Cmd/Ctrl + S |
| Export | Cmd/Ctrl + E |
| Toggle Panel | Cmd/Ctrl + [1-9] |

### Display Shortcuts

- Show in context menus (right-aligned, monospace)
- Show in tooltips on hover
- `⌘` for Mac, `Ctrl` for Windows

---

## Responsive Behavior

### Minimum Window Size

- **Width:** 1024px
- **Height:** 640px

### Panel Collapse Points

- Left panel collapses at < 200px width
- Right panel collapses at < 240px width
- Timeline minimum height: 150px

### Compact Mode

When window is small:
- Reduce panel padding
- Hide secondary toolbar items
- Collapse to icon-only buttons
- Stack transport controls vertically

---

## Do's and Don'ts

### ✅ Do

- Use dark backgrounds to make video content pop
- Maintain strict monochrome UI chrome
- Use color only for semantic meaning (status, errors)
- Keep panels dense but organized
- Provide keyboard shortcuts for all actions
- Follow NLE conventions (Premiere, Resolve, FCPX)
- Use consistent 4px grid alignment

### ❌ Don't

- Add gradients or decorative colors to panels
- Use bright colors in the UI (except status indicators)
- Add unnecessary animations that slow down work
- Deviate from standard NLE patterns without reason
- Use rounded corners > 8px (keep it architectural)
- Show loading states without progress indication
- Use color as the only differentiator (accessibility)

---

## Reference Applications

For pattern inspiration:
- **DaVinci Resolve** — Gold standard for pro video editing UI
- **Adobe Premiere Pro** — Industry familiarity
- **Final Cut Pro X** — macOS-native polish
- **Figma** — Panel architecture, clean dark mode
- **Linear** — Minimal, keyboard-first design

---

## Summary

Quartz's desktop application is **Cinematic Pro Minimalism** applied to a professional video editing tool. The interface should:

> Feel like a refined, modern NLE that respects the craft of wedding videographers — powerful but not overwhelming, dark but not oppressive, minimal but complete.

Every design decision should ask:

> "Does this help the videographer focus on their footage, or does it distract?"

When in doubt, defer to DaVinci Resolve patterns — users coming from pro tools should feel immediately at home.
