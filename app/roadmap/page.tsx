'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, Circle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Status = 'done' | 'in-progress' | 'planned';

interface RoadmapItem {
    title: string;
    description: string;
    status: Status;
    votes?: number;
}

const ROADMAP_SECTIONS: { title: string; items: RoadmapItem[] }[] = [
    {
        title: 'Shipped',
        items: [
            { title: 'AI scene detection', description: 'Automatic highlight detection based on faces, motion, and audio.', status: 'done' },
            { title: 'Multi-cam audio sync', description: 'Align all camera and audio sources automatically.', status: 'done' },
            { title: 'XML export', description: 'Export structured timelines to Premiere and DaVinci.', status: 'done' },
        ],
    },
    {
        title: 'In Progress',
        items: [
            { title: 'Speech-to-text transcripts', description: 'Full transcriptions with speaker identification.', status: 'in-progress', votes: 47 },
            { title: 'Color matching', description: 'Automatic color consistency across cameras.', status: 'in-progress', votes: 38 },
        ],
    },
    {
        title: 'Planned',
        items: [
            { title: 'Smart B-roll suggestions', description: 'AI recommends B-roll clips based on your narrative.', status: 'planned', votes: 62 },
            { title: 'Collaboration mode', description: 'Share projects with clients for feedback.', status: 'planned', votes: 29 },
            { title: 'Mobile preview app', description: 'Review rough cuts on your phone.', status: 'planned', votes: 18 },
        ],
    },
];

const statusIcons: Record<Status, React.ReactNode> = {
    done: <Check className="w-4 h-4 text-green-500" />,
    'in-progress': <Clock className="w-4 h-4 text-yellow-500" />,
    planned: <Circle className="w-4 h-4 text-white/30" />,
};

export default function RoadmapPage() {
    const [votedItems, setVotedItems] = useState<Set<string>>(new Set());

    const handleVote = (title: string) => {
        setVotedItems(prev => {
            const next = new Set(prev);
            if (next.has(title)) {
                next.delete(title);
            } else {
                next.add(title);
            }
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/5">
                <div className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-display text-[48px] md:text-[72px] font-extralight tracking-[-0.04em] leading-[1.05] mb-6">
                        Roadmap
                    </h1>
                    <p className="text-xl text-white/50 font-light max-w-xl">
                        See what we're building. Vote on what matters to you.
                    </p>
                </motion.div>
            </section>

            {/* Roadmap Sections */}
            <section className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 pb-32 space-y-16">
                {ROADMAP_SECTIONS.map((section, sectionIdx) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: sectionIdx * 0.1 }}
                    >
                        <h2 className="text-sm tracking-[0.3em] text-white/40 uppercase mb-6">{section.title}</h2>
                        <div className="space-y-4">
                            {section.items.map((item) => {
                                const hasVoted = votedItems.has(item.title);
                                const displayVotes = (item.votes || 0) + (hasVoted ? 1 : 0);

                                return (
                                    <div
                                        key={item.title}
                                        className="group p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="mt-1">{statusIcons[item.status]}</div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-white mb-1">{item.title}</h3>
                                                    <p className="text-sm text-white/50 font-light">{item.description}</p>
                                                </div>
                                            </div>
                                            {item.status !== 'done' && (
                                                <button
                                                    onClick={() => handleVote(item.title)}
                                                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${hasVoted
                                                            ? 'bg-accent text-white'
                                                            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    ▲ {displayVotes}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}

                {/* Suggest Feature */}
                <div className="pt-12 border-t border-white/10">
                    <h3 className="text-lg font-medium text-white mb-4">Have a feature request?</h3>
                    <p className="text-white/50 font-light mb-6">
                        Join our Discord to suggest features and discuss with other editors.
                    </p>
                    <a
                        href="https://discord.gg/quartz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
                    >
                        Join Discord
                    </a>
                </div>
            </section>
        </div>
    );
}
