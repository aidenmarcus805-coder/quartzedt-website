import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-medium tracking-tight mb-2">Settings</h1>
            <p className="text-black/50 mb-10">Manage your application preferences and account security.</p>

            {/* Preferences Section */}
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-8 mb-6">
                <h2 className="text-lg font-medium text-black mb-6">Preferences</h2>

                <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-black/5">
                        <div>
                            <h3 className="text-sm font-medium text-black">Email Notifications</h3>
                            <p className="text-sm text-black/50 mt-0.5">Receive updates about new features and releases.</p>
                        </div>
                        {/* Toggle Switch (Static Display) */}
                        <div className="w-11 h-6 bg-black rounded-full relative cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                            <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <h3 className="text-sm font-medium text-black"> बीटा Features (Beta)</h3>
                            <p className="text-sm text-black/50 mt-0.5">Get early access to experimental tools like auto-captions.</p>
                        </div>
                        {/* Toggle Switch (Static Display Off) */}
                        <div className="w-11 h-6 bg-black/10 rounded-full relative cursor-pointer hover:bg-black/20 transition-colors">
                            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/50 rounded-[24px] border border-red-100 p-8 relative overflow-hidden">
                {/* Subtle decorative gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-100/50 to-transparent pointer-events-none rounded-bl-full" />

                <h2 className="text-lg font-medium text-red-900 mb-2 relative z-10">Danger Zone</h2>
                <p className="text-sm text-red-700/70 mb-6 relative z-10 max-w-lg">
                    Deleting your account will permanently remove all your data, revoking your access to the desktop app and active subscriptions. This action cannot be undone.
                </p>

                <button
                    className="relative z-10 px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium text-sm rounded-xl transition-all shadow-sm"
                >
                    Delete Account
                </button>
            </div>

        </div>
    );
}
