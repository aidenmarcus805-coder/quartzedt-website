'use client';

import { AppleLogo, WindowsLogo, Monitor, Cpu } from "@phosphor-icons/react";
import DeviceList from "./DeviceList";

export default function DownloadsPage() {
    return (
        <div className="min-h-full bg-white text-slate-900 selection:bg-slate-900 selection:text-white p-8 md:p-12">
            <div className="max-w-4xl space-y-8 mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-slate-900 mb-1">Workstation</h1>
                    <p className="text-slate-400 text-sm font-normal">Local processing engine for zero-latency assembly.</p>
                </div>

                {/* Platform Selection - Dense Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                    <div className="group relative bg-slate-900 text-white rounded-xl p-6 overflow-hidden cursor-pointer shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <AppleLogo weight="fill" className="w-8 h-8" />
                            <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-white/10 rounded">Universal v2.0.4</span>
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight mb-1">macOS</h3>
                        <p className="text-white/50 text-xs font-normal mb-6 leading-relaxed">Apple Silicon & Intel build. Requires v13+.</p>
                        <button className="w-full py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/90 transition-colors">Download DMG</button>
                    </div>

                    <div className="group relative bg-white border border-slate-200 text-slate-900 rounded-xl p-6 overflow-hidden cursor-pointer hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <WindowsLogo weight="fill" className="w-8 h-8 text-slate-400" />
                            <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-400 rounded">Stable v2.0.4</span>
                        </div>
                        <h3 className="text-lg font-medium tracking-tight mb-1">Windows</h3>
                        <p className="text-slate-500 text-xs font-normal mb-6 leading-relaxed">64-bit build. RTX Acceleration optimized.</p>
                        <button className="w-full py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-colors">Download EXE</button>
                    </div>
                </div>

                {/* Device Management */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden max-w-2xl">
                    <div className="px-5 h-12 flex items-center border-b border-slate-100 bg-white">
                        <Monitor weight="fill" className="w-4 h-4 text-slate-400 mr-2.5" />
                        <h2 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Authorized Machines</h2>
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Seating:</span>
                            <span className="text-[10px] font-mono font-bold text-emerald-600 transition-none">1/5</span>
                        </div>
                    </div>
                    <div className="bg-transparent">
                        <DeviceList />
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="flex items-start gap-3 text-slate-400">
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
                    <p className="text-[11px] text-slate-400 font-normal italic">Installation issues on specific NLE versions?</p>
                    <a href="/support" className="text-[11px] font-medium text-slate-900 hover:text-slate-600 transition-colors underline underline-offset-4 decoration-slate-200">Documentation</a>
                </div>
            </div>
        </div>
    );
}
