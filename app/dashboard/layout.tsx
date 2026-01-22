'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, CreditCard, Download, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const SIDEBAR_ITEMS = [
    { label: 'Overview', href: '/dashboard', icon: Home },
    { label: 'Subscription', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Download', href: '/dashboard/download', icon: Download },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Default to 'U' if no email (shouldn't happen in protected route, but safer)
    const userInitial = session?.user?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-black/5 bg-white z-40 flex flex-col">
                {/* Logo */}
                <div className="h-20 px-8 flex items-center border-b border-black/5">
                    <Link href="/" className="block relative h-4 w-auto aspect-[256/65]">
                        <Image
                            src="/logoBlack.png"
                            alt="Quartz"
                            fill
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-8 space-y-1">
                    <div className="px-4 mb-4">
                        <p className="text-[10px] tracking-[0.2em] text-black/40 uppercase font-medium">Menu</p>
                    </div>
                    {SIDEBAR_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group ${isActive
                                        ? 'bg-black text-white font-medium shadow-lg shadow-black/5'
                                        : 'text-black/60 hover:text-black hover:bg-black/5'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-black/40 group-hover:text-black'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer */}
                <div className="p-4 border-t border-black/5">
                    {session ? (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/[0.02] border border-black/5">
                            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center overflow-hidden shrink-0">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs font-medium text-black/50">{userInitial}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{session.user?.name || session.user?.email?.split('@')[0]}</p>
                                <p className="text-[10px] text-black/40 truncate">{session.user?.email}</p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="p-1.5 rounded-md hover:bg-black/5 text-black/40 hover:text-red-500 transition-colors"
                                aria-label="Sign out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/signin?next=/dashboard"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90 transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen bg-white">
                <div className="max-w-[1200px] mx-auto p-12 md:p-16">
                    {children}
                </div>
            </main>
        </div>
    );
}
