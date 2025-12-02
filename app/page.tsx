'use client';

import { ArrowRight, CheckCircle2, Play, Star } from 'lucide-react';

const heroStats = [
  { label: 'Editors onboarded', value: '480+' },
  { label: 'Hours saved per edit', value: '18' },
  { label: 'Projects delivered', value: '2.4K+' },
];

const precisionBullets = [
  'Smart Scene Detection',
  'Dialogue Prioritization',
  'Multi-Cam Sync',
  'Cinematic Flow Engine™',
];

const aiFeatures = [
  {
    title: 'AUTOSYNC™',
    desc: 'Instant multi-camera alignment with sub-frame accuracy and audio drift correction.',
  },
  {
    title: 'AUTOSELECT™',
    desc: 'AI spots vows, applause, laughter, and reaction beats worth anchoring scenes around.',
  },
  {
    title: 'AUTOGRADIENT™',
    desc: 'Color suggestions trained on your LUT library and preferred film stocks.',
  },
  {
    title: 'AUTOCUT FLOW™',
    desc: 'Edits shaped around emotional rhythm—never frantic jump cuts.',
  },
  {
    title: 'AUDIO CLEANUP',
    desc: 'Wind, hum, HVAC, and shoe scuffs removed in a single pass.',
  },
  {
    title: 'INTELLIGENT TIMELINES',
    desc: 'Rough cut, selects, and assembly delivered in minutes for Premiere Pro.',
  },
];

const workflowPhases = [
  {
    title: 'Upload all cams + audio',
    detail: 'Drop ProRes, H.265, or proxy clips. AutoCut understands every format and lens.',
  },
  {
    title: 'AutoCut builds assembly',
    detail: 'Scene detection, pacing, multi-cam sync, and dialogue-first storytelling handled for you.',
  },
  {
    title: 'You finesse + grade',
    detail: 'Tweak pacing, apply LUTs, and add music once the structure is ready.',
  },
  {
    title: 'Deliver cinematic film',
    detail: 'Export Premiere project, Final Cut XML, or DaVinci timeline and ship faster.',
  },
];

const weddingHighlights = [
  'Emotion-first timeline building',
  'Vow + speech isolation',
  'Highlight reel auto-draft',
  'Protects your LUTs + profiles',
];

const testimonials = [
  {
    quote: 'AutoCut turned three-day wedding edits into a single afternoon. The pacing still feels human.',
    author: 'Marisa Ortega',
    role: 'Founder, Arcadian Weddings',
  },
  {
    quote: 'It is the only AI assistant we trust to respect cinematic storytelling for high-end clients.',
    author: 'Lewis Pate',
    role: 'Creative Director, North River Films',
  },
];

const pricingPlans = [
  {
    tier: 'Free Trial',
    price: '$0',
    suffix: '7 days full access',
    features: ['Unlimited projects', 'Watermarked exports', 'Community support'],
    cta: 'Start Free Trial',
  },
  {
    tier: 'Starter',
    price: '$100',
    suffix: 'per month',
    features: ['All AI engines', 'Premiere + Final Cut export', 'Priority chat support'],
    highlight: true,
    cta: 'Choose Starter',
  },
  {
    tier: 'Pro',
    price: '$250',
    suffix: 'per month',
    features: ['DaVinci + CapCut Pro export', 'Multi-user workspaces', 'Dedicated success manager'],
    cta: 'Choose Pro',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12 lg:px-16 text-[11px] tracking-[0.2em]">
          <div className="hidden items-center gap-6 lg:flex">
            <a href="#features" className="transition-opacity hover:opacity-60">
              FEATURES
            </a>
            <a href="#workflow" className="transition-opacity hover:opacity-60">
              WORKFLOW
            </a>
            <a href="#weddings" className="transition-opacity hover:opacity-60">
              WEDDINGS
            </a>
            <a href="#pricing" className="transition-opacity hover:opacity-60">
              PRICING
            </a>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 text-base tracking-[0.35em]">AUTOCUT</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hidden text-[10px] tracking-[0.2em] transition-opacity hover:opacity-60 lg:block">
              LOG IN
            </a>
            <button className="border border-black px-5 py-2 text-[10px] tracking-[0.2em] transition-all hover:bg-black hover:text-white">
              START TRIAL
            </button>
          </div>
        </div>
      </nav>

      <main className="space-y-20 pt-24 sm:pt-28">
        {/* Hero */}
        <section className="px-4 pt-4">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="rounded-[36px] border border-black/10 bg-white/90 p-4 shadow-[0_40px_80px_-60px_rgba(0,0,0,0.4)]">
              <div className="relative rounded-[28px] border border-black/5 bg-[#fdfdfb] px-3 pb-3 pt-6 sm:px-6 sm:pb-6">
                <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-size-[18px_18px] opacity-50" />
                <div className="relative rounded-[24px] border border-black/10 bg-black/90 px-4 pb-16 pt-6 sm:px-8 sm:pt-10">
                  <div className="h-[220px] rounded-[20px] border border-white/10 bg-linear-to-br from-black to-[#1d1d1d] shadow-inner sm:h-[320px]">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-white/70">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30">
                        <Play className="h-6 w-6" />
                      </div>
                      <p className="text-xs tracking-[0.35em]">AI EDITOR MONTAGE</p>
                      <p className="text-[11px] tracking-[0.25em] text-white/50">Placeholder reel</p>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 rounded-[24px] bg-linear-to-t from-black/85 via-black/20 to-transparent p-6 text-white sm:p-8">
                    <p className="text-[10px] tracking-[0.3em] text-white/70">AUTO CUT</p>
                    <h1 className="mt-2 text-3xl font-light tracking-tighter sm:text-4xl">Edit Less. Create More.</h1>
                    <p className="mt-4 text-sm text-white/70">
                      AI-powered Premiere Pro assistant that assembles cinematic wedding films while you stay focused on the story.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] tracking-[0.25em] text-black transition-all hover:bg-white/80">
                        START FREE TRIAL
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button className="flex items-center gap-2 rounded-full border border-white px-6 py-3 text-[11px] tracking-[0.25em] text-white transition-all hover:bg-white hover:text-black">
                        <Play className="h-4 w-4" />
                        WATCH DEMO
                      </button>
                    </div>
                    <p className="mt-4 text-[11px] tracking-[0.3em] text-white/60">Start free • Cancel anytime • Creator support</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 rounded-[32px] border border-black/10 bg-white px-6 py-6 text-[11px] tracking-[0.25em] text-black/45 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-light tracking-tight text-black">{stat.value}</p>
                  <p>{stat.label.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Precision by Design */}
        <section className="bg-[#f6f6f6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-white bg-linear-to-br from-zinc-900 to-black p-10 text-white">
              <p className="text-[10px] tracking-[0.3em] text-white/40">PRECISION BY DESIGN</p>
              <h2 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">Designed for Filmmakers</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                Not influencers. Not hobbyists. Professionals. AutoCut understands pacing, emotion, rhythm, and human storytelling—automatically.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {precisionBullets.map((item) => (
                  <div className="rounded-2xl border border-white/20 px-5 py-4 text-sm tracking-[0.2em] text-white/70" key={item}>
                    {item.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-black/10 bg-white p-10">
              <p className="text-[10px] tracking-[0.3em] text-black/40">WHY IT MATTERS</p>
              <p className="mt-4 text-lg font-light leading-relaxed text-black/70">
                Upload every angle, press generate, and receive a tastefully structured Premiere timeline that respects dialogue, pacing, and lens choices.
              </p>
              <div className="mt-8 space-y-4 text-sm text-black/65">
                <p>— On-beat music edits for vows + speeches</p>
                <p>— Dialogue-first arcs surfaced automatically</p>
                <p>— Organic in-camera transitions preserved</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Feature Grid */}
        <section className="border-t border-black/10 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8" id="features">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <p className="text-[10px] tracking-[0.35em] text-black/35">THE AI ENGINE BUILT FOR REAL EDITING</p>
              <h2 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">Precision modules you actually use</h2>
            </div>
            <div className="grid grid-cols-1 gap-px rounded-[32px] bg-black/10 sm:grid-cols-2">
              {aiFeatures.map((feature) => (
                <div className="bg-white p-8 sm:p-10" key={feature.title}>
                  <p className="text-[11px] tracking-[0.3em] text-black/55">{feature.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-black/60">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Banner */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[32px] bg-black px-8 py-16 text-center text-white">
            <p className="text-2xl font-light tracking-tight sm:text-4xl">
              “A human editor would spend a week on this timeline. AutoCut delivers it in minutes.”
            </p>
            <p className="mt-4 text-[10px] tracking-[0.35em] text-white/60">BEFORE / AFTER — COMING SOON</p>
          </div>
        </section>

        {/* Workflow */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8" id="workflow">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-[10px] tracking-[0.35em] text-black/40">YOUR TOOLS. YOUR LENSES. YOUR STYLE.</p>
              <h2 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">Works with your workflow</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {workflowPhases.map((phase, index) => (
                <div className="rounded-3xl border border-black/10 bg-white p-6" key={phase.title}>
                  <p className="text-[10px] tracking-[0.35em] text-black/30">STEP {index + 1}</p>
                  <p className="mt-3 text-base font-light text-black">{phase.title}</p>
                  <p className="mt-2 text-sm text-black/60">{phase.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wedding Mode */}
        <section className="bg-[#f8f8f8] px-4 py-16 sm:px-6 sm:py-20 lg:px-8" id="weddings">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-[10px] tracking-[0.35em] text-black/35">SPECIALIZED WEDDING MODE</p>
              <h2 className="text-3xl font-light tracking-tight sm:text-4xl">Built for emotion-first storytelling.</h2>
              <p className="text-sm leading-relaxed text-black/60 sm:text-base">
                AutoCut pulls vows, speeches, and reaction shots into an emotion-first timeline so you can polish instead of dig.
              </p>
              <div className="space-y-3">
                {weddingHighlights.map((point) => (
                  <div className="flex items-center gap-3 text-sm text-black/70" key={point}>
                    <CheckCircle2 className="h-4 w-4 text-black/50" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-black/10 bg-white p-10">
              <p className="text-[10px] tracking-[0.3em] text-black/40">EXPORTS TO</p>
              <p className="mt-4 text-sm tracking-[0.35em] text-black/70">
                PREMIERE PRO · FINAL CUT · DAVINCI RESOLVE · CAPCUT PRO
              </p>
              <p className="mt-10 text-xs tracking-[0.35em] text-black/35">UPLOAD → AUTOCUT BUILDS → YOU REFINE → DONE</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-[10px] tracking-[0.35em] text-black/40">WHAT FILMMAKERS SAY</p>
              <h2 className="mt-3 text-3xl font-light tracking-tight">Proof it delivers on set and in post</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div className="rounded-[28px] border border-black/10 bg-white p-8" key={testimonial.author}>
                  <div className="mb-4 flex gap-1 text-black/20">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star className="h-4 w-4 text-black/25" fill="currentColor" key={idx} />
                    ))}
                  </div>
                  <p className="text-lg font-light leading-relaxed text-black/80">“{testimonial.quote}”</p>
                  <p className="mt-6 text-sm tracking-[0.2em] text-black/60">{testimonial.author.toUpperCase()}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-black/40">{testimonial.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8" id="pricing">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-[10px] tracking-[0.35em] text-black/40">SUBSCRIPTIONS</p>
              <h2 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">Start free, scale when ready</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <div
                  className={`flex flex-col rounded-[32px] border p-8 ${
                    plan.highlight ? 'border-black bg-black text-white shadow-2xl' : 'border-black/10 bg-white'
                  }`}
                  key={plan.tier}
                >
                  <p className="text-[10px] tracking-[0.3em]">{plan.tier.toUpperCase()}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-light tracking-tight">{plan.price}</span>
                    <span className={plan.highlight ? 'text-white/70' : 'text-black/40'}>{plan.suffix}</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm leading-relaxed">
                    {plan.features.map((feature) => (
                      <li className={plan.highlight ? 'text-white/75' : 'text-black/60'} key={feature}>
                        — {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`mt-8 rounded-full border px-6 py-3 text-[11px] tracking-[0.2em] ${
                      plan.highlight
                        ? 'border-white text-white transition-colors hover:bg-white hover:text-black'
                        : 'border-black text-black transition-colors hover:bg-black hover:text-white'
                    }`}
                  >
                    {plan.cta.toUpperCase()}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-[32px] bg-black px-10 py-16 text-center text-white">
            <p className="text-[10px] tracking-[0.35em] text-white/60">FINAL CALL</p>
            <h2 className="text-3xl font-light tracking-tight sm:text-4xl">Ready to ship edits in hours, not days?</h2>
            <p className="text-sm text-white/70">Early users receive lifetime pricing and founder-level support.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="rounded-full border border-white bg-white px-8 py-4 text-[11px] tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-white">
                START FREE TRIAL
              </button>
              <button className="rounded-full border border-white px-8 py-4 text-[11px] tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black">
                TALK TO SALES
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="text-base tracking-[0.3em]">AUTOCUT</p>
            <p className="mt-2 text-[11px] tracking-[0.2em] text-white/40">Precision AI Editing for Wedding Filmmakers</p>
          </div>
          <div className="flex items-center justify-center gap-8 text-[11px] tracking-[0.2em] text-white/40">
            <a href="#" className="transition-colors hover:text-white">
              PRIVACY
            </a>
            <a href="#" className="transition-colors hover:text-white">
              TERMS
            </a>
            <a href="#" className="transition-colors hover:text-white">
              CONTACT
          </a>
        </div>
        </div>
      </footer>
    </div>
  );
}
