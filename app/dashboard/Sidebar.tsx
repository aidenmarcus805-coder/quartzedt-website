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
        <aside className="w-60 flex-shrink-0 hidden md:flex flex-col border-r border-black/[0.06] bg-white h-screen sticky top-0">
            <div className="h-[72px] flex items-center px-5 border-b border-black/[0.05]">
                <SiteLogoMenu darkLogoVisible={true} />
            </div>

            <nav className="flex-1 py-5 px-2.5 flex flex-col gap-0.5 overflow-y-auto">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-black/30 px-3 mb-2 mt-1">Account</p>
                {NAV_ITEMS.map((item) => {
                    const isActive = item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-200 ${isActive
                                ? 'text-black'
                                : 'text-black/45 hover:text-black hover:bg-black/[0.03]'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-black/[0.05] rounded-[10px] z-0"
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                />
                            )}
                            <Icon weight={isActive ? "fill" : "regular"} className="w-[17px] h-[17px] relative z-10 flex-shrink-0" />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-2.5 border-t border-black/[0.05]">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[10px] text-[13px] font-medium text-red-500/70 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200"
                >
                    <SignOut weight="regular" className="w-[17px] h-[17px]" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
