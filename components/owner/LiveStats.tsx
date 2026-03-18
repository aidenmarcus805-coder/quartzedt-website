"use client";

import { useEffect, useState } from "react";
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
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 w-full border-b border-slate-100 pb-6 mb-2">
            {cards.map((c, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="flex flex-col gap-0.5"
                >
                    <div className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                        {c.title}
                    </div>
                    <div className="text-xl font-display font-semibold tracking-tight text-slate-800 flex items-baseline gap-2">
                        {c.value?.toLocaleString() || "0"}
                        <span className={`text-[11px] font-medium tracking-normal ${c.critical ? 'text-red-500' : 'text-emerald-500'}`}>
                            {c.subtitle}
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
