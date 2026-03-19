# Quartz AI Website UI & Design Guidelines

## 1. Website Context & Design Goals
**Context:** This is the public-facing marketing, conversion, and account management website for Quartz AI. Its primary audience is professional wedding videographers evaluating the software, comparing pricing, downloading the local app, and managing their subscriptions. 

**Core Design Goals:**
1. **Instant Authority & Trust:** Professionals are downloading a local app that processes their client footage. The site must feel premium, secure, and established.
2. **High-Impact Scannability:** Videographers are visual and busy. The site must communicate value through strong typography and clear visual hierarchy rather than walls of text.
3. **Frictionless Conversion:** The path from "What is this?" to "Download App" or "Buy Now" must be absolute and uninterrupted. 
4. **Performance as a Promise:** A site selling high-performance local AI must load instantly. Heavy assets (video demos) must be optimized and deferred so the initial render is snappy.
5. **Clear Wayfinding:** The distinction between learning (features), buying (pricing), and doing (account management) must be immediately obvious from the global navigation.

These goals dictate a design language with generous whitespace to focus attention on product visuals, high-contrast CTAs that draw the eye, and a smooth, calm interaction model that builds confidence.

---

## 2. Foundational Principles

**Typography Principles:**
* **Hierarchy:** Massive, high-contrast display headings for hero sections. Clean, highly legible sans-serif for body copy. 
* **Tone:** Confident, direct, and professional. 
* **Density:** Generous line-heights and paragraph spacing for marketing copy. Tighter, grid-aligned typography for pricing tables and technical specs.

**Layout Principles:**
* **Columns & Grid:** A standard 12-column responsive grid. Content generally lives in a centered max-width container. 
* **Focus:** The "Z-pattern" for top-of-page reading, shifting to alternating 50/50 splits (text/image) for feature explanations. 
* **Whitespace:** Used aggressively as a structural element. Large padding between distinct page sections (e.g., Hero vs. Social Proof) to give the user time to process each value proposition.

**Components & States:**
* **General Rules:** Buttons must look clickable; inputs must look fillable. 
* **Interaction States (Universal):**
  * *Default:* High contrast, clear boundaries.
  * *Hover:* Predictable shift (e.g., slight lift, color brighten, or underline).
  * *Active:* Grounded (e.g., slight scale down or background darken).
  * *Disabled:* Faded (e.g., 40% opacity), stripped of hover effects, `not-allowed` cursor.
  * *Loading:* Text/icon swaps to a spinner; component remains disabled.
  * *Error:* Semantic warning colors applied to borders or backgrounds, accompanied by explicit text.

**Interaction Philosophy:**
* **Snappy vs. Calm:** The website should feel calm and deliberate. Scroll-triggered reveal animations should be subtle (e.g., a gentle fade-up) and never delay the user from reading. 
* **Feedback:** Form submissions (email capture, contact, checkout) must provide immediate inline feedback or toasts upon success/failure.

---

## 3. Site Shell & Navigation

**The App Shell:**
* **Global Top Nav:** Sticky on scroll. Contains the Logo (left), Primary Links (center), and Auth/CTAs (right). 
* **Global Footer:** A "fat footer" containing secondary links, legal (TOS, Privacy), social links, and a final newsletter/download CTA.

**Navigation Structure & Controls:**
* **Primary Nav Links (Features, Pricing, FAQ):**
  * *Purpose:* Route users to main marketing pages.
  * *States:* Default (neutral text) → Hover (text color shift or subtle underline) → Active/Current Page (bolded or persistent underline).
* **Dropdown Menus (e.g., "Resources" -> Blog, Help Center):**
  * *Purpose:* Group secondary content without cluttering the top nav.
  * *States:* Default (hidden) → Hover on parent (menu fades in, drops down slightly). Menu items follow standard link states.
* **Mobile Hamburger Menu:**
  * *Purpose:* Condense navigation for narrow screens.
  * *States:* Default (icon) → Active (transforms to 'X', opens full-screen or side-drawer overlay).
* **Primary CTA ("Download" / "Get Started"):**
  * *Purpose:* The main conversion driver in the top right.
  * *States:* Default (solid accent color) → Hover (brightness increase) → Active (inset shadow) → Loading (spinner if initiating a heavy download/redirect).

---

## 4. Core Workflows & Screens

### A. Landing Page (Home)
* **Layout:** Hero Section (Headline, Subhead, Primary CTA, Video Demo) → Social Proof (Logos) → Feature Highlights (Alternating rows) → Testimonials (Cards) → Final Bottom CTA.
* **Main Tasks:** Understand the value prop instantly; watch the demo; click the download/purchase button.
* **Key Components:** 
  * **Hero CTA Button:** Largest button on the site. Demands attention.
  * **Video Player Modal:** Clicking the demo thumbnail opens a focused, dark-background modal to play the video.
  * **Feature Alternating Rows:** Text on one side, UI screenshot on the other.

### B. Pricing Page
* **Layout:** Centered header → Billing Toggle (Monthly/Yearly) → Pricing Tier Cards (1-3 max) → FAQ Accordion.
* **Main Tasks:** Compare features across tiers; select a billing cycle; initiate checkout.
* **Key Components:**
  * **Billing Toggle Switch:** 
    * *States:* Default (Monthly selected) → Hover (pill background lightens) → Active (slides to Yearly).
  * **Pricing Cards:** 
    * *Layout:* Tier name, price (large), feature checklist, CTA at the bottom.
    * *States:* The "Pro" or recommended tier has a distinct border/badge. Hovering a card lifts it slightly via box-shadow.
  * **FAQ Accordions:** 
    * *States:* Default (collapsed, plus icon) → Hover (text color shift) → Active (expands smoothly, icon becomes minus).

### C. Authentication / Account Portal
* **Layout:** Focused, single-column layout. Distraction-free (no global top nav, just a logo to return home).
* **Main Tasks:** Login, create account, reset password, manage subscription.
* **Key Components:**
  * **Text Inputs (Email, Password):** 
    * *States:* Default (gray border) → Hover (darker border) → Focus (accent color outline, crucial for accessibility) → Error (red border, warning text below) → Disabled (grayed out).
  * **Submit Button:** 
    * *States:* Must have a clear Loading state (spinner) while authenticating to prevent double-clicks.

### D. Download & Onboarding
* **Layout:** Success header → OS detection toggle (Mac/Windows) → Download button → "Next Steps" checklist.
* **Main Tasks:** Actually get the software onto the machine; read installation instructions.
* **Key Components:**
  * **OS Selector Tabs:** 
    * *States:* Default (inactive tab) → Hover (bg shift) → Active (solid background, bold text).
  * **Download Progress CTA:** 
    * *States:* Default → Loading (changes to "Starting download...").

---

## 5. Components & Interaction Patterns

### Buttons
* **Primary:** Solid fill, highly visible. Used for the single most important action on a page (e.g., "Start Free Trial").
* **Secondary:** Outlined or ghost (text only). Used for secondary actions (e.g., "Read Documentation", "Log In" in the nav).
* **Hierarchy Rule:** Never place two Primary buttons next to each other. 

### Inputs & Forms
* **Forms (Email capture, Checkout):** Must use clear labels (not just placeholders, which disappear). 
* **Validation:** Inline validation on `blur` (when the user leaves the field) is preferred over waiting for the submit button to be clicked.

### Cards
* **Role:** Used to chunk information (Pricing Tiers, Blog Posts, Testimonials). 
* **Interaction:** If the entire card is a link, the hover state should apply to the whole card (slight lift, title text color change).

### Feedback Components
* **Toasts/Snackbars:** Used for transient success states (e.g., "Link copied to clipboard", "Settings updated" in the account portal). Appears bottom-center or bottom-right.
* **Inline Errors:** Placed directly underneath the form field that caused the error.

---

## 6. Behavioral & Edge-Case Guidelines

* **Loading:** 
  * Pages should load structure instantly. Dynamic content (like fetching subscription status in the portal) should use Skeleton loaders that match the shape of the final content.
* **Errors:** 
  * **Global (404/500 Pages):** Must be branded, polite, and offer a clear "Return Home" CTA. 
  * **Form Errors:** Must be explicit. "Invalid email address" instead of "Error".
* **Empty States:** 
  * E.g., An empty invoice history in the account portal. Show a clean, branded icon and text: "You have no past invoices."
* **Responsiveness:** 
  * **Mobile:** Multi-column grids collapse to single columns. Top nav collapses to a hamburger menu. Hover states are ignored; rely on active/pressed states for touch targets.
  * **Tablet:** Adjust grid from 3-columns to 2-columns (e.g., for pricing tiers).
* **Accessibility:** 
  * All interactive elements must be reachable via the `Tab` key with a visible focus ring. 
  * Contrast ratios for text must meet WCAG AA standards. Semantic HTML (`<nav>`, `<main>`, `<button>` vs `<a>`) is strictly enforced.

---

## 7. Thought-Process Pipeline

**How to design a new page/feature for the website:**
1. **Identify the Goal:** What is the user trying to learn or do? (e.g., "Learn about the new Transcription feature").
2. **UX Requirements:** What content supports this? (A video, 3 bullet points, a CTA).
3. **Choose Patterns:** Select from the library. A 50/50 alternating row for the feature explanation, a Primary CTA leading to the download page.
4. **Evaluate Tradeoffs:** *Clarity vs. Flashiness.* Should we add a complex 3D scroll animation? No, it distracts from the conversion and hurts performance. Keep it clean and fast.
5. **Screen Evaluation Checklist:**
   * [ ] Is there exactly one obvious Primary CTA?
   * [ ] Does the page make sense if I just read the headings?
   * [ ] Are all button/input states accounted for?
   * [ ] How does this layout look stacked on a mobile phone?

---

## 8. Implementation Plan

**Phase 1: Component Audit & Shell Definition (Owners: Design & Engineering)**
* Ignore legacy `.md` files. Audit the current `app/` and `components/` directories.
* Define and standardize the App Shell (Global Nav, Footer, responsive wrappers).
* *Deliverable:* A merged PR containing the standardized layout wrappers.

**Phase 2: Core Marketing Components (Owner: Frontend Engineer)**
* Build or refactor the foundational UI components to match these guidelines: `<Button>` (with primary/secondary variants), `<Input>`, `<Card>`, `<Accordion>`.
* Wire up all 6 interaction states using Tailwind.
* *Deliverable:* A clean component library ready for page assembly.

**Phase 3: Critical Path Refactor (Owners: Full Team)**
* Apply the new components to the highest-priority conversion pages:
  1. Landing Page (Home)
  2. Pricing Page
  3. Authentication / Account Portal
* *Deliverable:* Shipped, high-converting core pages.

**Phase 4: Ongoing Review (Owners: Design Lead)**
* New pages (e.g., Blog, Feature Deep-Dives) must be reviewed against the "Thought-Process Pipeline" checklist before merging.
* *Deliverable:* A consistently professional, fast, and high-converting website.