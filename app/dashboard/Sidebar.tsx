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
        <aside className="w-52 flex-shrink-0 hidden md:flex flex-col border-r border-white/[0.04] bg-[#0A0A09] h-screen sticky top-0">
            <div className="h-14 flex items-center px-4 border-b border-white/[0.04]">
                <SiteLogoMenu darkLogoVisible={false} />
            </div>

            <nav className="flex-1 py-4 px-2.5 flex flex-col gap-1 overflow-y-auto">
                <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-white/20 px-3 mb-2 mt-1">Account</p>
                {NAV_ITEMS.map((item) => {
                    const isActive = item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${isActive
                                ? 'text-white bg-white/[0.05]'
                                : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                                }`}
                        >
                            <Icon weight={isActive ? "fill" : "regular"} className={`w-4 h-4 relative z-10 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/30'}`} />
                            <span className={`relative z-10 ${isActive ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-white/[0.04]">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-normal text-white/30 hover:text-white hover:bg-white/[0.02] transition-colors duration-200"
                >
                    <SignOut weight="regular" className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
