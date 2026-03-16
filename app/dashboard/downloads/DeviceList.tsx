'use client';

import { Desktop, Clock, Trash, Tag } from "@phosphor-icons/react";

const DEVICES = [
    {
        id: '1',
        name: "Aiden's MacBook Pro",
        os: "macOS 14.2.1",
        lastSeen: "Online",
        added: "Feb 12, 2026",
    }
];

export default function DeviceList() {
    return (
        <div className="divide-y divide-white/[0.03]">
            {DEVICES.map((device) => (
                <div key={device.id} className="group p-5 hover:bg-white/[0.01] transition-colors duration-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
                                <Desktop weight="light" className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-normal text-white/90 flex items-center gap-2">
                                    {device.name}
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                                </h3>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-[11px] text-white/20 font-normal">
                                        <Tag className="w-3 h-3" />
                                        {device.os}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-white/20 font-normal">
                                        <Clock className="w-3 h-3" />
                                        {device.lastSeen}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button className="p-2 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all" title="Deauthorize Device">
                                <Trash weight="light" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
