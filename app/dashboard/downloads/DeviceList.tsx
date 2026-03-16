'use client';

import { Desktop, Clock, Trash, Tag } from "@phosphor-icons/react";

const DEVICES = [
    {
        id: '1',
        name: "Aiden's MacBook Pro",
        os: "macOS 14.2.1",
        lastSeen: "Online Now",
        added: "Feb 12, 2026",
    }
];

export default function DeviceList() {
    return (
        <div className="divide-y divide-white/[0.04]">
            {DEVICES.map((device) => (
                <div key={device.id} className="group p-8 hover:bg-white/[0.01] transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/20 group-hover:text-white/40 group-hover:border-white/10 transition-all duration-500">
                                <Desktop weight="light" className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-light text-white/90 mb-1 flex items-center gap-3">
                                    {device.name}
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                </h3>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mt-2">
                                    <div className="flex items-center gap-2 text-[12px] text-white/30 font-light">
                                        <Tag className="w-3.5 h-3.5" />
                                        {device.os}
                                    </div>
                                    <div className="flex items-center gap-2 text-[12px] text-white/30 font-light">
                                        <Clock className="w-3.5 h-3.5" />
                                        Last seen {device.lastSeen}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="p-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all" title="Deauthorize Device">
                                <Trash weight="light" className="w-4.5 h-4.5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
