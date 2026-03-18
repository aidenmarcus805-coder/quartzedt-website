'use client';

import { AppleLogo, WindowsLogo, Monitor, Cpu } from "@phosphor-icons/react";
import DeviceList from "./DeviceList";

export default function DownloadsPage() {
    return (
        <div className="min-h-full bg-[#050504] text-[#FAF9F6] selection:bg-[#FAF9F6] selection:text-[#050504] p-8 md:p-12">
            <div className="max-w-4xl space-y-8 mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-1">Workstation</h1>
                    <p className="text-white/30 text-sm font-normal">Local processing engine for zero-latency assembly.</p>
                </div>

                {/* Platform Selection - Dense Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                    <div className="group relative bg-white text-black rounded-xl p-6 overflow-hidden cursor-pointer shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <AppleLogo weight="fill" className="w-8 h-8" />
                            <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-black/5 rounded">Universal v2.0.4</span>
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight mb-1">macOS</h3>
                        <p className="text-black/50 text-xs font-normal mb-6 leading-relaxed">Apple Silicon & Intel build. Requires v13+.</p>
                        <button className="w-full py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-black/80 transition-colors">Download DMG</button>
                    </div>

                    <div className="group relative bg-white/[0.03] border border-white/[0.05] text-white rounded-xl p-6 overflow-hidden cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                            <WindowsLogo weight="fill" className="w-8 h-8 text-white/40" />
                            <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-white/5 text-white/30 rounded">Stable v2.0.4</span>
                        </div>
                        <h3 className="text-lg font-medium tracking-tight mb-1">Windows</h3>
                        <p className="text-white/30 text-xs font-normal mb-6 leading-relaxed">64-bit build. RTX Acceleration optimized.</p>
                        <button className="w-full py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/90 transition-colors">Download EXE</button>
                    </div>
                </div>

                {/* Device Management */}
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden max-w-2xl">
                    <div className="px-5 h-12 flex items-center border-b border-white/[0.04] bg-white/[0.01]">
                        <Monitor weight="fill" className="w-4 h-4 text-white/20 mr-2.5" />
                        <h2 className="text-[10px] font-mono uppercase tracking-wider text-white/20">Authorized Machines</h2>
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-white/10 uppercase">Seating:</span>
                            <span className="text-[10px] font-mono font-bold text-emerald-500/60 transition-none">1/5</span>
                        </div>
                    </div>
                    <div className="bg-transparent">
                        <DeviceList />
                    </div>
                    <div className="p-4 border-t border-white/[0.04] bg-white/[0.005]">
                        <div className="flex items-start gap-3 text-white/20">
                            <Cpu weight="light" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] font-normal leading-relaxed">
                                Licenses are workstation-bound. Deauthorize any machine remotely. 
                                Multi-seat sync requires Pro.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Support */}
                <div className="pt-4 flex flex-col items-start gap-2 max-w-2xl">
                    <p className="text-[11px] text-white/20 font-normal italic">Installation issues on specific NLE versions?</p>
                    <a href="/support" className="text-[11px] font-medium text-white/30 hover:text-white transition-colors underline underline-offset-4 decoration-white/10">Documentation</a>
                </div>
            </div>
        </div>
    );
}
