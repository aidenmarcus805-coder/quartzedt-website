import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import DeviceList from "./DeviceList";
import { AppleLogo, WindowsLogo, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function DownloadsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const devices = await prisma.desktopDevice.findMany({
        where: { userId: session.user.id },
        orderBy: { lastSeen: 'desc' }
    });

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-medium tracking-tight mb-2">Downloads & Devices</h1>
            <p className="text-black/50 mb-10">Download the Quartz desktop app and manage your active devices.</p>

            {/* Downloads Section */}
            <div className="mb-12">
                <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-4">Desktop Apps</h2>
                <div className="grid sm:grid-cols-2 gap-4">

                    <div className="bg-white rounded-2xl border border-black/5 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-black/[0.03] to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

                        <div className="w-12 h-12 bg-black/[0.04] rounded-xl flex items-center justify-center mb-4 relative z-10">
                            <AppleLogo weight="fill" className="w-6 h-6 text-black/80" />
                        </div>

                        <h3 className="text-lg font-medium text-black mb-1 relative z-10">macOS</h3>
                        <p className="text-black/50 text-sm mb-6 relative z-10">Apple Silicon & Intel processors (macOS 12.3+)</p>

                        <Link
                            href="/api/desktop/download?os=mac"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-black/80 text-sm font-medium rounded-xl transition-colors relative z-10 w-full justify-center"
                        >
                            <DownloadSimple weight="bold" className="w-4 h-4" />
                            Download for Mac
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-black/5 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-black/[0.03] to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

                        <div className="w-12 h-12 bg-black/[0.04] rounded-xl flex items-center justify-center mb-4 relative z-10">
                            <WindowsLogo weight="fill" className="w-6 h-6 text-black/80" />
                        </div>

                        <h3 className="text-lg font-medium text-black mb-1 relative z-10">Windows</h3>
                        <p className="text-black/50 text-sm mb-6 relative z-10">Windows 10 64-bit or later</p>

                        <Link
                            href="/api/desktop/download?os=windows"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/[0.04] text-black hover:bg-black/[0.08] text-sm font-medium rounded-xl transition-colors relative z-10 w-full justify-center"
                        >
                            <DownloadSimple weight="bold" className="w-4 h-4" />
                            Download for Windows
                        </Link>
                    </div>

                </div>
            </div>

            {/* Devices Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider">Active Devices</h2>
                    <span className="text-xs font-medium px-2 py-0.5 bg-black/5 text-black/60 rounded-full">
                        {devices.length} / 2 Licenses Used
                    </span>
                </div>

                <DeviceList devices={devices} />
            </div>

        </div>
    );
}
