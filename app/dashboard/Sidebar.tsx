'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, CreditCard, Download, Gear, SignOut, ArrowLeft } from '@phosphor-icons/react';
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
        <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-black/[0.08] bg-white/40 backdrop-blur-2xl h-screen sticky top-0">
            <div className="h-20 flex items-center px-4 border-b border-black/[0.05]">
                <SiteLogoMenu darkLogoVisible={true} />
            </div>

            <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-300 ${isActive
                                ? 'text-black bg-black/[0.04]'
                                : 'text-black/60 hover:text-black hover:bg-black/[0.02]'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-black/[0.04] z-0"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon weight={isActive ? "fill" : "regular"} className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-black/[0.05]">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[14px] font-medium text-red-600/80 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                    <SignOut weight="bold" className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
