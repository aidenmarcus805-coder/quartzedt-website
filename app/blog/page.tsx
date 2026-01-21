'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const BLOG_POSTS = [
    {
        slug: 'why-we-built-quartz',
        title: 'Why we built Quartz',
        excerpt: 'The story behind the tool—and why wedding editors deserve better.',
        date: 'January 2025',
        tag: 'Announcement',
        image: '/wedding-culling-ui.png',
    },
    {
        slug: 'roadmap-2025',
        title: "What's coming in 2025",
        excerpt: "A look at the features we're building next.",
        date: 'Coming soon',
        tag: 'Roadmap',
        image: '/flat-export-ui.png',
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 py-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-display text-[48px] md:text-[72px] font-extralight tracking-[-0.04em] leading-[1.05] mb-6">
                        Blog
                    </h1>
                    <p className="text-xl text-white/50 font-light max-w-xl">
                        Updates, insights, and behind-the-scenes from the Quartz team.
                    </p>
                </motion.div>
            </section>

            {/* Posts Grid */}
            <section className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {BLOG_POSTS.map((post, i) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                        >
                            <Link href={`/blog/${post.slug}`} className="group block">
                                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-white/5 mb-6">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-4 left-4 text-[10px] tracking-[0.3em] text-white/70 uppercase">
                                        {post.tag}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-medium text-white group-hover:text-accent transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-white/50 font-light">{post.excerpt}</p>
                                    <div className="flex items-center gap-2 text-white/30 group-hover:text-white/50 transition-colors pt-2">
                                        <span className="text-sm">{post.date}</span>
                                        <span className="text-white/20">·</span>
                                        <span className="text-sm flex items-center gap-1">
                                            Read more <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
