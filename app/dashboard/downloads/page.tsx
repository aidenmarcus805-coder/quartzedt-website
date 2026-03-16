import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import DeviceList from "./DeviceList";
import { AppleLogo, WindowsLogo, DownloadSimple, Monitor, Cpu } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function DownloadsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const devices = await prisma.desktopDevice.findMany({
        where: { userId: session.user.id },
        orderBy: { lastSeen: 'desc' }
    });

    return (
        <div className="max-w-3xl py-10">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-[28px] font-semibold tracking-tight text-black mb-1">Downloads & Devices</h1>
                <p className="text-black/40 text-[14px]">Get the Quartz desktop companion and manage your active workstations.</p>
            </div>

            {/* Downloads Section */}
            <div className="mb-12">
                <h2 className="text-[11px] font-bold text-black/30 uppercase tracking-[0.1em] mb-5">Available builds</h2>
                <div className="grid sm:grid-cols-2 gap-4">

                    <div className="bg-white rounded-2xl border border-black/[0.06] p-6 hover:shadow-md transition-all relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-black/[0.02] to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

                        <div className="w-11 h-11 bg-black/[0.04] rounded-xl flex items-center justify-center mb-5 relative z-10">
                            <AppleLogo weight="fill" className="w-5 h-5 text-black/80" />
                        </div>

                        <h3 className="text-[16px] font-semibold text-black mb-1 relative z-10">macOS</h3>
                        <p className="text-black/45 text-[13px] mb-8 relative z-10 leading-relaxed">Universal build for Apple Silicon (M1/M2/M3) and Intel Macs.</p>

                        <Link
                            href="/api/desktop/download?os=mac"
                            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-black text-white hover:bg-black/90 text-[13px] font-semibold rounded-xl transition-all relative z-10 w-full justify-center shadow-sm"
                        >
                            <DownloadSimple weight="bold" className="w-4 h-4" />
                            Download .dmg
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-black/[0.06] p-6 hover:shadow-md transition-all relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-black/[0.02] to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

                        <div className="w-11 h-11 bg-black/[0.04] rounded-xl flex items-center justify-center mb-5 relative z-10">
                            <WindowsLogo weight="fill" className="w-5 h-5 text-black/80" />
                        </div>

                        <h3 className="text-[16px] font-semibold text-black mb-1 relative z-10">Windows</h3>
                        <p className="text-black/45 text-[13px] mb-8 relative z-10 leading-relaxed">Optimized for Windows 10 & 11 (64-bit systems).</p>

                        <Link
                            href="/api/desktop/download?os=windows"
                            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-black/[0.04] text-black hover:bg-black/[0.08] text-[13px] font-semibold rounded-xl transition-all relative z-10 w-full justify-center"
                        >
                            <DownloadSimple weight="bold" className="w-4 h-4" />
                            Download .exe
                        </Link>
                    </div>

                </div>
            </div>

            {/* Devices Section */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
                <div className="px-6 py-4 border-b border-black/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Monitor weight="fill" className="w-4 h-4 text-black/30" />
                        <h2 className="text-[14px] font-semibold text-black">Active Workstations</h2>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-black/[0.04] border border-black/[0.05] rounded-lg">
                        <Cpu weight="bold" className="w-3 h-3 text-black/40" />
                        <span className="text-[11px] font-bold text-black/60 uppercase tracking-wider">
                            {devices.length} / 2 Seats
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <DeviceList devices={devices} />
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[12px] text-black/30 italic">Quartz Engine is currently running on {devices.length} active seat{devices.length === 1 ? '' : 's'}.</p>
            </div>

        </div>
    );
}
