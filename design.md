# Quartz Design System: The Obsidian Standard

## Core Philosophy: Cinematic Pro Modernism

A refined synthesis of professional utility and cinematic elegance. This is a "No Slop" design system—every pixel serves a purpose, every animation informs the user, and every surface respects the content.

### Aesthetic Keywords
- **Minimalist**: Negative space is used to focus attention.
- **Cinematic**: High-contrast, dramatic lighting, and film-grade color palettes.
- **Professional**: Functional density and precise alignment (NLE-inspired).
- **Pro Tech**: Monospace accents, technical status indicators, and grid-based layouts.
- **Apple-Esque**: Restrained rounded corners, smooth easing, and premium typography.
- **Semi-Flat**: Deep depth via layers and glass rather than heavy beveled shadows.
- **Glassmorphism**: Frosted translucency (`backdrop-filter`) to maintain context across layers.
- **Modern UI**: Fluid, responsive, and interactive.

---

## Color Palette: "Warm Obsidian"

### The Dark Layer (Foundation with subtle warmth)
```css
--bg-pure: #050504;              /* Deepest black with a hint of warmth. */
--bg-base: #0A0A09;              /* Primary workspace. */
--bg-surface: #121211;           /* Panel background. */
--bg-elevated: #1A1A18;          /* Elevated cards. */
--bg-glass: rgba(18, 18, 17, 0.7); /* Warm frosted glass. */
```

### The Light Layer (Typography & Borders)
```css
--text-primary: #FAF9F6;         /* Off-white / Cream for headers. */
--text-secondary: #A8A29E;       /* Stone-400: Warm neutral for body. */
--text-muted: #57534E;           /* Stone-600: Muted meta. */
--border-subtle: rgba(250, 249, 246, 0.04);
--border-default: rgba(250, 249, 246, 0.08);
--border-strong: rgba(250, 249, 246, 0.15);
```

### The Semantic Layer (Mature Accents)
```css
--accent-primary: #D4D4D8;       /* Champagne / Raw Silk: Premium neutral accent. */
--accent-soft: rgba(212, 212, 216, 0.1);
--status-error: #DC2626;         /* Deeper, more mature red. */
--status-warning: #D97706;       /* Deeper amber. */
```

---

## Typography: "Precision Sans"

### Font Stack
- **Primary**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.
- **Technical**: `JetBrains Mono`, `SF Mono`, `monospace` (For timecodes, filenames, shortcuts).

### Type Hierarchy
| Scale | Size | Weight | Tracking | Case |
| :--- | :--- | :--- | :--- | :--- |
| **H1 (Hero)** | 72px / 4.5rem | 700 / Bold | -0.05em | Sentence |
| **H2 (Section)** | 36px / 2.25rem | 600 / SemiBold | -0.02em | Sentence |
| **Label (Pro)** | 11px / 0.6875rem | 600 / SemiBold | 0.08em | UPPERCASE |
| **Body (Main)** | 14px / 0.875rem | 400 / Regular | -0.01em | Sentence |
| **Metadata** | 12px / 0.75rem | 400 / Regular | 0.01em | Sentence |

---

## Design Components: "Modern Pro Tools"

### 1. Glass Panels (Glassmorphism)
All secondary floating panels should use the `.glass` utility:
- **Style**: `backdrop-filter: blur(24px)`, `background: rgba(255, 255, 255, 0.04)`.
- **Border**: `1px solid rgba(255, 255, 255, 0.08)`.
- **Shadow**: `0 10px 30px rgba(0, 0, 0, 0.5)`.

### 2. The Apple-Esque Button
- **Radius**: `12px` (standard) or `50px` (pill).
- **Primary**: Champagne / Warm white background, black text.
- **Secondary**: Glass background, white border, translucent hover effect.
- **Hover**: Scale `1.02` with spring physics.

### 3. Semi-Flat Inputs
- **Style**: Darker than the panel (`--bg-pure`), zero border-radius (or `4px`), no border.
- **Focus**: `2px solid var(--accent-primary)` bottom-only or a subtle ring.
- **Typography**: Monospace font for technical data entry.

---

## Motion & Easing

### Principles
- **Organic Physics**: No linear tweens. Use `cubic-bezier(0.22, 1, 0.36, 1)` or Spring physics.
- **Staggered Entry**: List items enter sequentially with a 0.05s stagger.
- **Hover Micro-animations**: Subtle scale and opacity shifts rather than color flips.

### Framer Motion Constants
```javascript
const transition = {
  type: "spring",
  stiffness: 260,
  damping: 20
};
```

---

## Checklist: "Obsidian Standard"
- ✅ Is the interface dark enough to let footage breathe?
- ✅ Is color used *only* for semantic meaning?
- ✅ Are technical elements (timecodes, IDs) in monospace?
- ✅ Do floating elements have the frosted glass effect?
- ✅ Are rounded corners restrained (8px-12px)?

---

## Reference Aesthetic
- **DaVinci Resolve**: For panel density and professional restraint.
- **Apple Pro Apps (Final Cut, Logic)**: For layout polish and typography.
- **Figma Design**: For interface precision.
- **Linear**: For high-end product design and keyboard-first ethos.
