import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // We already know session exists due to layout.tsx redirection, but type guard
    if (!session?.user?.email) return null;

    // Fetch fresh user data from DB
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            name: true,
            email: true,
            image: true,
            createdAt: true,
            plan: true,
        }
    });

    if (!user) return null;

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-medium tracking-tight mb-2">Profile</h1>
            <p className="text-black/50 mb-10">Manage your account details and personal information.</p>

            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                {/* Subtle decorative gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-black/[0.02] to-transparent pointer-events-none rounded-bl-full" />

                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-2xl font-medium text-black/40 overflow-hidden flex-shrink-0 relative z-10">
                    {user.image ? (
                        <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-6 relative z-10">
                    <div>
                        <label className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1 block">Full Name</label>
                        <div className="text-lg font-medium text-black/90">{user.name || 'Not provided'}</div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1 block">Email Address</label>
                        <div className="text-lg font-medium text-black/90">{user.email}</div>
                    </div>

                    <div className="pt-4 border-t border-black/5">
                        <div>
                            <label className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1 block">Member Since</label>
                            <div className="text-sm font-medium text-black/70">
                                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
