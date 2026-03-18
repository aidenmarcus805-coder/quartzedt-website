'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, CreditCard, Download, Gear, SignOut, ShieldStar } from '@phosphor-icons/react';
import { signOut, useSession } from 'next-auth/react';
import { SiteLogoMenu } from '../components/SiteLogoMenu';
import { isOwnerEmail } from '@/lib/owner/config';

const NAV_ITEMS = [
    { label: 'Profile', href: '/dashboard', icon: User },
    { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Downloads & Devices', href: '/dashboard/downloads', icon: Download },
    { label: 'Settings', href: '/dashboard/settings', icon: Gear },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    
    // Check if current user is the owner
    const isOwner = isOwnerEmail(session?.user?.email);

    // Don't render the main dashboard sidebar if we are in the owner dashboard
    if (pathname.startsWith('/dashboard/owner')) return null;

    return (
        <aside className="w-52 flex-shrink-0 hidden md:flex flex-col border-r border-slate-200 bg-[#F9F9F9] text-slate-900 h-screen sticky top-0 font-sans">
            <div className="h-14 flex items-center px-4 border-b border-slate-200">
                <SiteLogoMenu darkLogoVisible={true} />
            </div>

            <nav className="flex-1 py-4 px-2.5 flex flex-col gap-1 overflow-y-auto">
                <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-slate-400 px-3 mb-2 mt-1">Account</p>
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
                                ? 'text-slate-900 bg-slate-200/50'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/30'
                                }`}
                        >
                            <Icon weight={isActive ? "fill" : "regular"} className={`w-4 h-4 relative z-10 flex-shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                            <span className={`relative z-10 ${isActive ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                        </Link>
                    );
                })}

                {isOwner && (
                    <>
                        <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-slate-400 px-3 mt-4 mb-2">Admin</p>
                        <Link
                            href="/dashboard/owner"
                            className="relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200/30"
                        >
                            <ShieldStar weight="regular" className="w-4 h-4 relative z-10 flex-shrink-0 text-slate-400" />
                            <span className="relative z-10 font-normal">Owner Dashboard</span>
                        </Link>
                    </>
                )}
            </nav>

            <div className="p-3 border-t border-slate-200">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-normal text-slate-500 hover:text-slate-900 hover:bg-slate-200/30 transition-colors duration-200"
                >
                    <SignOut weight="regular" className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
