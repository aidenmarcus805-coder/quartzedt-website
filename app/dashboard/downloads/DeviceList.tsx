'use client';

import { Desktop, Trash } from '@phosphor-icons/react';
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
        if (confirm("Are you sure you want to revoke access for this device? It will be logged out immediately.")) {
            startTransition(() => {
                revokeDevice(id);
            });
        }
    };

    if (devices.length === 0) {
        return (
            <div className="text-sm text-black/50 bg-black/[0.02] rounded-xl p-8 border border-black/5 flex flex-col items-center justify-center text-center">
                <Desktop className="w-8 h-8 text-black/20 mb-3" />
                <p>No active devices found.</p>
                <p className="mt-1">Download the app and sign in to link your first device.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {devices.map(device => (
                <div key={device.id} className="bg-white border border-black/5 rounded-xl p-5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/40">
                            <Desktop weight="duotone" className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-black">
                                {device.name || "Unknown Computer"}
                            </h4>
                            <p className="text-xs text-black/50 mt-0.5">
                                Added {new Date(device.createdAt).toLocaleDateString()} · Last seen {new Date(device.lastSeen).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleRevoke(device.id)}
                        disabled={isPending}
                        className="p-2 text-black/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Revoke access"
                    >
                        <Trash className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
