'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, Layout, SignOut } from '@phosphor-icons/react';

interface UserMenuProps {
    session: any;
    navOnLight?: boolean;
}

export function UserMenu({ session, navOnLight = false }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center rounded-full transition-transform active:scale-95"
                aria-label="User menu"
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium overflow-hidden ring-1 shadow-sm transition-all duration-300 ${isOpen ? 'ring-accent/50 scale-105' : (navOnLight ? 'bg-black/5 ring-black/10' : 'bg-white/10 ring-white/20')
                    }`}>
                    {session.user?.image ? (
                        <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span className={navOnLight ? 'text-black/60' : 'text-white/60'}>
                            {session.user?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    )}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full right-0 mt-3 w-64 origin-top-right z-50"
                    >
                        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden">
                            <div className="px-4 py-3.5 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400 mb-1">Account</p>
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                    {session.user?.email}
                                </p>
                            </div>

                            <div className="p-1.5">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-xl transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                        <Layout className="w-4 h-4 group-hover:text-accent transition-colors" />
                                    </div>
                                    Dashboard
                                </Link>

                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        signOut();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500/80 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                                        <SignOut className="w-4 h-4" />
                                    </div>
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
