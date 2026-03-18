"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";
import { motion } from "framer-motion";

export const LiveStats = () => {
    const [stats, setStats] = useState<any>({
        waitlist: { current: 0, trend: '+0 today' },
        licenses: { current: 0, mapActive: true },
        mrr: { current: '$0', trend: '+0%' },
        projects: { current: '0 processed', saved: '0h' }
    });

    useEffect(() => {
        const eventSource = new EventSource('/api/owner/stats-stream');
        
        eventSource.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                setStats(data);
            } catch (err) {
                console.error("Failed to parse SSE stats:", err);
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const cards = [
        { title: "Waitlist", value: stats.waitlist.current, subtitle: stats.waitlist.trend, critical: false },
        { title: "Active Licenses", value: stats.licenses.current, subtitle: "Live location map active", critical: false },
        { title: "MRR", value: stats.mrr.current, subtitle: stats.mrr.trend, critical: false }, // Could check >5% churn here for red
        { title: "Projects", value: stats.projects.current, subtitle: `${stats.projects.saved} saved avg`, critical: false },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            {cards.map((c, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                    <GlassCard className="flex flex-col gap-1 p-5 border-t-[3px] border-t-white/40">
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            {c.title}
                        </div>
                        <div className="text-3xl font-display font-semibold tracking-tight text-slate-800">
                            {c.value?.toLocaleString() || "0"}
                        </div>
                        <div className={`text-sm font-medium ${c.critical ? 'text-red-500' : 'text-emerald-500'} flex items-center gap-1`}>
                            {c.subtitle}
                        </div>
                    </GlassCard>
                </motion.div>
            ))}
        </div>
    );
};
