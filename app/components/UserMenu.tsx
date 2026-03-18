'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Layout, SignOut, CaretDown } from '@phosphor-icons/react';
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface UserMenuSession {
    user?: {
        image?: string | null;
        email?: string | null;
    } | null;
}

interface UserMenuProps {
    session: UserMenuSession;
    navOnLight?: boolean;
}

export function UserMenu({ session, navOnLight = false }: UserMenuProps) {
    const router = useRouter();
    const userImage = session.user?.image;
    const userEmail = typeof session.user?.email === 'string' ? session.user.email : 'User';
    const firstLetter = userEmail.charAt(0).toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    "flex items-center gap-2 rounded-full p-1 transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                    navOnLight ? "text-black" : "text-white"
                )}
            >
                <div className={cn(
                    "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-semibold ring-1 shadow-sm transition-all",
                    navOnLight ? "bg-black/5 ring-black/10" : "bg-white/10 ring-white/20",
                    "group-hover:ring-primary/40"
                )}>
                    {userImage ? (
                        <Image 
                            src={userImage} 
                            alt="" 
                            width={32} 
                            height={32} 
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <span className="opacity-70 font-display">{firstLetter}</span>
                    )}
                </div>
                <CaretDown weight="bold" className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={10} className="w-64">
                <DropdownMenuLabel className="pb-1">Account</DropdownMenuLabel>
                <div className="px-2.5 pb-2 pt-1">
                    <p className="text-[13.5px] font-semibold text-foreground truncate">
                        {userEmail}
                    </p>
                </div>
                
                <DropdownMenuSeparator />
                
                <div className="p-1">
                    <DropdownMenuItem
                        onClick={() => router.push('/dashboard')}
                        className="w-full flex items-center gap-3"
                    >
                        <Layout weight="bold" className="w-4 h-4 text-muted-foreground transition-colors" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 text-red-500/80 hover:text-red-500 hover:bg-red-500/[0.05] dark:hover:bg-red-500/10 transition-colors"
                    >
                        <SignOut weight="bold" className="w-4 h-4" />
                        <span>Sign out</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


