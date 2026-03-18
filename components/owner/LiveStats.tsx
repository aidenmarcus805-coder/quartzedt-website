"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface DashboardStats {
    waitlist: { current: number; trend: string };
    licenses: { current: number; mapActive: boolean };
    mrr: { current: string | number; trend: string };
    projects: { current: string | number; saved: string };
}

export const LiveStats = () => {
    const [stats, setStats] = useState<DashboardStats>({
        waitlist: { current: 247, trend: '+12 today' },
        licenses: { current: 18, mapActive: true },
        mrr: { current: '$2,847', trend: '+18%' },
        projects: { current: '1,234 processed', saved: '142h' }
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
        { title: "Waitlist", value: stats?.waitlist?.current ?? 0, subtitle: stats?.waitlist?.trend ?? '...', critical: false },
        { title: "Active Licenses", value: stats?.licenses?.current ?? 0, subtitle: "Live location map active", critical: false },
        { title: "MRR", value: stats?.mrr?.current ?? '0', subtitle: stats?.mrr?.trend ?? '...', critical: false },
        { title: "Projects", value: stats?.projects?.current ?? '0', subtitle: `${stats?.projects?.saved ?? '0'} saved avg`, critical: false },
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
