'use client';

import { AppleLogo, WindowsLogo, Monitor, Cpu } from "@phosphor-icons/react";
import DeviceList from "./DeviceList";

export default function DownloadsPage() {
    return (
        <div className="max-w-5xl">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-[42px] font-extralight tracking-[-0.04em] text-white leading-tight mb-2">Workstation</h1>
                <p className="text-white/30 text-[15px] font-light">Install the Quartz engine on your local machine for zero-latency processing.</p>
            </div>

            {/* Platform Selection */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
                <div className="group relative bg-white text-black rounded-2xl p-10 overflow-hidden cursor-pointer hover:scale-[1.01] transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <AppleLogo weight="fill" className="w-12 h-12" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 bg-black/5 rounded-full">Universal v2.0.4</span>
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight mb-2">macOS</h3>
                        <p className="text-black/50 text-[14px] font-light mb-10 max-w-[240px]">Apple Silicon & Intel build. Requires macOS 13 or later.</p>
                        <div className="mt-auto">
                            <button className="px-6 py-2.5 bg-black text-white text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-black/80 transition-all">Download DMG</button>
                        </div>
                    </div>
                    {/* Subtle aesthetic backdrop */}
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-[0.03] grayscale pointer-events-none">
                        <AppleLogo weight="fill" className="w-64 h-64" />
                    </div>
                </div>

                <div className="group relative bg-white/[0.03] border border-white/[0.05] text-white rounded-2xl p-10 overflow-hidden cursor-pointer hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <WindowsLogo weight="fill" className="w-12 h-12 text-white/40" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 bg-white/5 text-white/30 rounded-full">Stable v2.0.4</span>
                        </div>
                        <h3 className="text-2xl font-light tracking-tight mb-2">Windows</h3>
                        <p className="text-white/30 text-[14px] font-light mb-10 max-w-[240px]">64-bit installer. Optimized for NVIDIA RTX acceleration.</p>
                        <div className="mt-auto">
                            <button className="px-6 py-2.5 bg-white text-black text-[12px] font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all duration-300">Download EXE</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Device Management */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden">
                <div className="px-8 flex items-center h-16 border-b border-white/[0.04] bg-white/[0.01]">
                    <Monitor weight="fill" className="w-4 h-4 text-white/20 mr-2.5" />
                    <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-white/20">Authorized Machines</h2>
                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-white/20">Seating:</span>
                        <span className="text-[11px] font-bold text-emerald-500/60">1 / 5 Active</span>
                    </div>
                </div>
                <div className="bg-transparent">
                    <DeviceList />
                </div>
                <div className="p-8 border-t border-white/[0.04] bg-white/[0.005]">
                    <div className="flex items-start gap-4 text-white/20">
                        <Cpu weight="light" className="w-5 h-5 flex-shrink-0" />
                        <p className="text-[12px] font-light leading-relaxed">
                            Quartz licenses are workstation-bound. You can deauthorize any machine remotely to free up a seat for a new installation. 
                            Multi-seat sync requires a Pro subscription.
                        </p>
                    </div>
                </div>
            </div>

            {/* Support Footer */}
            <div className="mt-12 text-center">
                <p className="text-[13px] text-white/20 font-light italic mb-2">Encountering installation issues on Linux or specific NLE versions?</p>
                <a href="/support" className="text-[12px] font-medium text-white/40 hover:text-white transition-colors underline underline-offset-4 decoration-white/10">View Technical Documentation</a>
            </div>
        </div>
    );
}
