'use client';

import { Monitor, Trash, Clock, Calendar } from '@phosphor-icons/react';
import { revokeDevice } from './actions';
import { useTransition } from 'react';

type Device = {
    id: string;
    name: string | null;
    machineId: string;
    lastSeen: Date;
    createdAt: Date;
};

export default function DeviceList({ devices }: { devices: Device[] }) {
    const [isPending, startTransition] = useTransition();

    const handleRevoke = (id: string) => {
        if (confirm("Revoke workstation access? You will be logged out of this device immediately.")) {
            startTransition(() => {
                revokeDevice(id);
            });
        }
    };

    if (devices.length === 0) {
        return (
            <div className="text-[13px] text-black/40 bg-black/[0.02] rounded-xl p-10 border border-black/5 flex flex-col items-center justify-center text-center">
                <Monitor className="w-9 h-9 text-black/20 mb-4" />
                <p className="font-medium text-black/60">No active workstations</p>
                <p className="mt-1 max-w-[200px]">Link your first device by signing into the Quartz desktop app.</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-black/[0.04]">
            {devices.map(device => (
                <div key={device.id} className="py-5 flex items-center justify-between group transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black/[0.03] border border-black/[0.05] flex items-center justify-center text-black/40 group-hover:bg-black group-hover:text-white transition-all duration-300">
                            <Monitor weight="bold" className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-[14px] font-semibold text-black tracking-tight leading-none">
                                    {device.name || "Unknown Workstation"}
                                </h4>
                                {new Date().getTime() - new Date(device.lastSeen).getTime() < 1000 * 60 * 60 * 24 ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Online recently" />
                                ) : null}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5">
                                <div className="flex items-center gap-1 text-[11px] font-medium text-black/40">
                                    <Calendar className="w-3 h-3" />
                                    Added {new Date(device.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] font-medium text-black/40">
                                    <Clock className="w-3 h-3" />
                                    Seen {new Date(device.lastSeen).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleRevoke(device.id)}
                        disabled={isPending}
                        className="p-2.5 text-black/30 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        title="Revoke access"
                    >
                        <Trash weight="bold" className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
