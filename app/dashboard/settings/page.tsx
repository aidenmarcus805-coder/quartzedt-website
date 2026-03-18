'use client';

import { useState } from 'react';
import { Bell, Lock, Flask, ChatText } from '@phosphor-icons/react';
import { Switch } from "@/components/ui/switch";

interface ToggleProps {
    enabled: boolean;
    onToggle: () => void;
}



function SettingRow({ icon: Icon, title, description, children }: { icon: any; title: string, description: string, children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/20">
                    <Icon weight="light" className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-normal text-white/90">{title}</h3>
                    <p className="text-[11px] font-normal text-white/20 max-w-sm leading-tight">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

export default function SettingsPage() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        daily: true,
    });

    const [beta, setBeta] = useState({
        earlyAccess: true,
        aiAssistant: false,
    });

    return (
        <div className="min-h-full bg-[#050504] text-[#FAF9F6] selection:bg-[#FAF9F6] selection:text-[#050504] p-8 md:p-12">
            <div className="max-w-4xl space-y-8 mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-1">Settings</h1>
                    <p className="text-white/30 text-sm font-normal">Workflow and security preferences.</p>
                </div>

                {/* Notifications */}
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden max-w-2xl">
                    <div className="px-5 h-12 flex items-center border-b border-white/[0.04] bg-white/[0.01]">
                        <h2 className="text-[10px] font-mono uppercase tracking-wider text-white/20">Communication</h2>
                    </div>
                    <div className="px-5 divide-y divide-white/[0.03]">
                        <SettingRow
                            icon={Bell}
                            title="In-App Notifications"
                            description="Alerts for project completions and system updates."
                        >
                            <Switch checked={notifications.email} onCheckedChange={() => setNotifications({ ...notifications, email: !notifications.email })} />
                        </SettingRow>
                        <SettingRow
                            icon={ChatText}
                            title="Email Reports"
                            description="Daily summary of studio throughput."
                        >
                            <Switch checked={notifications.daily} onCheckedChange={() => setNotifications({ ...notifications, daily: !notifications.daily })} />
                        </SettingRow>
                    </div>
                </div>

                {/* Access & Beta */}
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden max-w-2xl">
                    <div className="px-5 h-12 flex items-center border-b border-white/[0.04] bg-white/[0.01]">
                        <h2 className="text-[10px] font-mono uppercase tracking-wider text-white/20">Future Engine</h2>
                    </div>
                    <div className="px-5 divide-y divide-white/[0.03]">
                        <SettingRow
                            icon={Flask}
                            title="Early Access"
                            description="Internal beta filters and scene detection."
                        >
                            <Switch checked={beta.earlyAccess} onCheckedChange={() => setBeta({ ...beta, earlyAccess: !beta.earlyAccess })} />
                        </SettingRow>
                    </div>
                </div>

                {/* Security Hub */}
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden max-w-2xl">
                    <div className="px-5 h-12 flex items-center border-b border-white/[0.04] bg-white/[0.01]">
                        <h2 className="text-[10px] font-mono uppercase tracking-wider text-white/20">Security Hub</h2>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                            <h4 className="text-[13px] font-medium text-white mb-0.5">Credentials</h4>
                            <p className="text-[11px] text-white/30 font-normal mb-4">Manage password and auth.</p>
                            <button className="text-[11px] font-medium text-white/40 hover:text-white transition-colors underline underline-offset-4 decoration-white/10">Configure</button>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                            <h4 className="text-[13px] font-medium text-white mb-0.5">Two-Factor</h4>
                            <p className="text-[11px] text-white/30 font-normal mb-4">Secure workstation access.</p>
                            <button className="text-[11px] font-medium text-white/40 hover:text-white transition-colors underline underline-offset-4 decoration-white/10">Enable</button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone - Grounded and tight */}
                <div className="border border-red-500/10 bg-red-500/[0.01] rounded-xl p-6 max-w-2xl">
                    <h2 className="text-[14px] font-medium text-red-500/80 mb-1">Danger Zone</h2>
                    <p className="text-red-500/30 text-[11px] font-normal mb-6 max-w-md leading-relaxed italic">
                        Purging your account will remove all models and metadata from our cluster.
                    </p>
                    <button className="px-5 py-2 border border-red-600/20 text-red-600/60 text-[10px] font-bold tracking-widest uppercase rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300">
                        Purge Account
                    </button>
                </div>
            </div>
        </div>
    );
}
