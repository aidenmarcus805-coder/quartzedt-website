'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, CreditCard, Download, Gear, SignOut } from '@phosphor-icons/react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { SiteLogoMenu } from '../components/SiteLogoMenu';

const NAV_ITEMS = [
    { label: 'Profile', href: '/dashboard', icon: User },
    { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Downloads & Devices', href: '/dashboard/downloads', icon: Download },
    { label: 'Settings', href: '/dashboard/settings', icon: Gear },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-white/[0.04] bg-[#0A0A09] h-screen sticky top-0">
            <div className="h-[80px] flex items-center px-6 border-b border-white/[0.04]">
                <SiteLogoMenu darkLogoVisible={false} />
            </div>

            <nav className="flex-1 py-8 px-3.5 flex flex-col gap-1 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/20 px-3 mb-4 mt-1">Account</p>
                {NAV_ITEMS.map((item) => {
                    const isActive = item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13.5px] transition-all duration-300 ${isActive
                                ? 'text-white'
                                : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/[0.05] border border-white/[0.05] rounded-xl z-0"
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                />
                            )}
                            <Icon weight={isActive ? "fill" : "regular"} className={`w-[18px] h-[18px] relative z-10 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/30'}`} />
                            <span className={`relative z-10 ${isActive ? 'font-medium' : 'font-light'}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/[0.04]">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13.5px] font-light text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
                >
                    <SignOut weight="regular" className="w-[18px] h-[18px]" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
