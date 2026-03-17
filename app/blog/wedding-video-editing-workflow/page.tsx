import { motion } from 'framer-motion';
import { ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Ultimate Wedding Video Editing Workflow: 2026 Guide | Quartz',
    description: 'Learn how to speed up wedding video editing and cut from raw cards to delivery in half the time. A complete workflow guide from ingest to final export.',
    openGraph: {
        title: 'The Ultimate Wedding Video Editing Workflow: 2026 Guide',
        description: 'Learn how to speed up wedding video editing and cut from raw cards to delivery in half the time',
        type: 'article',
    }
};

export default function WeddingVideoEditingWorkflowPage() {
    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#050504]">
            {/* Header */}
            <header className="border-b border-black/5 bg-white">
                <div className="max-w-[800px] mx-auto px-8 py-6">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-black/50 hover:text-black transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to blog
                    </Link>
                </div>
            </header>

            {/* Article */}
            <article className="max-w-[800px] mx-auto px-8 py-16">
                <div>
                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-[10px] tracking-[0.3em] text-accent uppercase font-bold">Workflow Guide</span>
                        <span className="text-black/20">·</span>
                        <span className="text-sm text-black/40 font-medium">10 min read</span>
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-[36px] md:text-[48px] font-bold tracking-tight leading-[1.15] mb-12">
                        The Ultimate Wedding Video Editing Workflow (How to Cut Your Time in Half)
                    </h1>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none text-black/80 font-normal leading-relaxed">
                        
                        <p className="text-xl text-black/90 font-medium leading-relaxed mb-12">
                            I've edited over 200 weddings in my career. When I started, a typical 8-hour wedding would take me four full days to edit. Now? I cut from raw memory cards to final delivery in less than two. Here is exactly how I speed up my wedding video editing workflow without sacrificing the emotion or quality of the final film.
                        </p>

                        <h2 className="text-2xl font-bold text-black mt-12 mb-6 tracking-tight">Step 1: Ingest, Backups, and the Multi-Cam Sync Nightmare</h2>
                        <p className="mb-6">
                            The foundation of a fast wedding video editing workflow isn't editing—it's organization. If you are hunting for clips on Thursday afternoon, you have already lost time.
                        </p>
                        <p className="mb-6">
                            As soon as I get home, I dump every card directly to a fast SSD RAID array, simultaneously producing a duplicate to a cheaper HDD archive. I organize folders meticulously:
                        </p>
                        <ul className="space-y-3 mb-8 pl-6 list-disc">
                            <li>01_RAW (Subdivided by Camera: Cam_A, Cam_B, Drone, Audio)</li>
                            <li>02_AUDIO (Lavs, DJ Feed, Room Mic)</li>
                            <li>03_PROJECT (Premiere/DaVinci files)</li>
                            <li>04_EXPORTS</li>
                        </ul>
                        <p className="mb-6">
                            <strong>The Multi-Cam Pain:</strong> Historically, the next morning meant hours of manual syncing. Lining up wave-forms, drifting audio from un-jammed cameras, and matching DJ feeds to internal scratch tracks. This used to be the most mind-numbing part of the job. 
                        </p>
                        <p className="mb-6">
                            Now, I let <Link href="/" className="text-accent hover:underline font-medium">Quartz</Link> handle this. Its built-in sync solver takes hundreds of scattered video and audio files and automatically snaps them onto a multicam timeline, fixing drift computationally. What used to take 3 hours now takes exactly zero of my active time.
                        </p>

                        <h2 className="text-2xl font-bold text-black mt-16 mb-6 tracking-tight">Step 2: Culling Strategies (Manual Grind vs. AI Assistance)</h2>
                        <p className="mb-6">
                            Here is the golden rule of culling: <em>Do not edit while you cull.</em> Your brain operates differently when making structural decisions versus creative ones. Keep them separate.
                        </p>
                        <p className="mb-6">
                            <strong>The Manual Method:</strong> I used to drop everything onto one massive timeline and scrub through at 2x speed, lifting the usable bits to Video Track 2 (the "Pancake Editing" method). From 4 hours of raw footage, I'd distill down to a 45-minute "selects" sequence.
                        </p>
                        <p className="mb-6">
                            <strong>Why AI Wins for Volume:</strong> When you shoot 30 weddings a year, manual culling leads to severe decision fatigue. Modern tools like Quartz use vision models to intelligently analyze your footage. It finds the shots with direct eye contact, smiles, and high-energy motion, scoring them automatically. AI culling isn't about letting a robot make the film—it's about stripping away the floor shots and shaky focus hunts so you only look at the good stuff.
                        </p>

                        <h2 className="text-2xl font-bold text-black mt-16 mb-6 tracking-tight">Step 3: Building the Ceremony and Toast Timelines</h2>
                        <p className="mb-6">
                            Always edit your dialogue anchors first. The ceremony and the speeches form the narrative spine of your wedding video.
                        </p>
                        <ul className="space-y-3 mb-8 pl-6 list-disc">
                            <li><strong>Clean the Audio First:</strong> Apply your EQ, compression, and vocal isolation (like Adobe Podcast or DaVinci Voice Isolation) before making a single cut.</li>
                            <li><strong>Chop the Dead Air:</strong> Cut out the officiant walking up, the long pauses before vows, and the mic hand-offs.</li>
                            <li><strong>Pacing the Multicam:</strong> For the ceremony, switch angles based on emotion, not just who is speaking. When the groom is saying his vows, we want to hear him, but often the <em>reaction</em> shot of the bride crying is the more powerful visual.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-black mt-16 mb-6 tracking-tight">Step 4: The Reception and Dancing Energy</h2>
                        <p className="mb-6">
                            Reception footage is all about energy matching. I sort my reception selects into three buckets: Intimate (First Dances), High Energy (Dance floor peaking), and Outros (Sparkler exits, final hugs).
                        </p>
                        <p className="mb-6">
                            I don't sync dancing footage to audio. Instead, I build a dynamic montage set to the final track of the highlight film. The secret to making dancing footage look cinematic is cutting on the beat, but also cutting <em>just before</em> an action completes. If a guest does a spin, cut away right before the spin finishes to carry the momentum into the next shot.
                        </p>

                        <h2 className="text-2xl font-bold text-black mt-16 mb-6 tracking-tight">Step 5: The Highlight Film Assembly</h2>
                        <p className="mb-6">
                            With the ceremony and speeches refined, I pull the best 60-90 seconds of spoken audio to use as the voiceover narrative for the highlight film.
                        </p>
                        <ol className="space-y-3 mb-8 pl-6 list-decimal font-medium">
                            <li>Lay down the chosen music tracks.</li>
                            <li>Place the emotional dialogue hooks (vows, father of the bride toast).</li>
                            <li>Fill the gaps with B-roll, following a chronological-but-fluid arc (Prep → First Look → Ceremony → Photos → Reception).</li>
                            <li>Add sound design (camera clicks, wind, dress rustling) to make the film feel three-dimensional.</li>
                        </ol>

                        <h2 className="text-2xl font-bold text-black mt-16 mb-6 tracking-tight">Step 6: How I Use Quartz in My Workflow</h2>
                        <p className="mb-6">
                            If you want to speed up wedding video editing significantly, you have to adopt tools that handle the mechanical labor. I use Quartz as my "assistant editor." 
                        </p>
                        <p className="mb-6">
                            Instead of spending Day 1 syncing audio and scrubbing through 4TB of clips, I feed the cards into Quartz. While I sleep, it syncs the multi-cam sequences, runs vision models to score the best B-roll (finding the exact frames of smiles and hugs), and generates a structured timeline export. 
                        </p>
                        <p className="mb-6">
                            When I sit down at my desk, I don't look at a blank timeline. I look at a fully assembled foundation. I still make the creative choices—I refine the cuts, tweak the pacing, and color grade—but the soul-crushing assembly phase is entirely outsourced to AI. It easily saves me 10+ hours per film.
                        </p>

                        {/* FAQ Section with Schema Markup (via JSON-LD further down, visually presented here) */}
                        <div className="bg-black/5 rounded-2xl p-8 mt-16 mb-12">
                            <h3 className="text-xl font-bold text-black mb-6">Frequently Asked Questions</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-black mb-2">How long should it take to edit a wedding video?</h4>
                                    <p className="text-black/70 text-sm">For a standard 5-7 minute highlight film plus full ceremony and speeches edits, a traditional workflow usually takes 20-30 hours. Utilizing modern AI workflows and tools like Quartz can bring this down to 10-15 hours.</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-bold text-black mb-2">What is the best way to sync audio for weddings?</h4>
                                    <p className="text-black/70 text-sm">Always record a scratch track on your cameras. You can use PluralEyes, your NLE's built-in waveform sync, or for massive multi-cam projects, an automated CSP solver like Quartz that handles timecode gaps and drift automatically.</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-black mb-2">Can AI edit wedding videos?</h4>
                                    <p className="text-black/70 text-sm">AI cannot replace a filmmaker's emotional intuition. However, AI can handle the mechanical assembly: syncing, culling out bad shots, and snapping clips to beat grids, which dramatically speeds up the wedding video editing workflow.</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* CTA */}
                    <div className="mt-16 pt-12 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-black tracking-tight mb-2">Ready to cut your edit time in half?</h3>
                            <p className="text-black/60">Join hundreds of wedding filmmakers using Quartz to eliminate the tedious assembly grind.</p>
                        </div>
                        <Link
                            href="/pricing"
                            className="shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 hover:-translate-y-0.5 transition-all"
                        >
                            Start your free trial
                        </Link>
                    </div>
                </div>
            </article>

            {/* Schema.org FAQ Markup for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "How long should it take to edit a wedding video?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "For a standard 5-7 minute highlight film plus full ceremony and speeches edits, a traditional workflow usually takes 20-30 hours. Utilizing modern AI workflows and tools like Quartz can bring this down to 10-15 hours."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What is the best way to sync audio for weddings?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Always record a scratch track on your cameras. You can use PluralEyes, your NLE's built-in waveform sync, or for massive multi-cam projects, an automated solver like Quartz that handles timecode gaps and drift automatically."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can AI edit wedding videos?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "AI cannot replace a filmmaker's emotional intuition. However, AI can handle the mechanical assembly: syncing, culling out bad shots, and snapping clips to beat grids, which dramatically speeds up the wedding video editing workflow."
                                }
                            }
                        ]
                    })
                }}
            />
        </div>
    );
}
