'use client';

import { useState } from 'react';
import { Bell, Flask, ChatText, type Icon } from '@phosphor-icons/react';
import { Switch } from "@/components/ui/switch";



function SettingRow({ icon: Icon, title, description, children }: { icon: Icon; title: string, description: string, children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    <Icon weight="light" className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-normal text-slate-900">{title}</h3>
                    <p className="text-[11px] font-normal text-slate-400 max-w-sm leading-tight">{description}</p>
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
        <div className="min-h-full bg-white text-slate-900 selection:bg-slate-900 selection:text-white p-8 md:p-12">
            <div className="max-w-4xl space-y-8 mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-slate-900 mb-1">Settings</h1>
                    <p className="text-slate-400 text-sm font-normal">Workflow and security preferences.</p>
                </div>

                {/* Notifications */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl overflow-hidden max-w-2xl">
                    <div className="px-5 h-12 flex items-center border-b border-slate-100 bg-white">
                        <h2 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Communication</h2>
                    </div>
                    <div className="px-5 divide-y divide-slate-100">
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
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl overflow-hidden max-w-2xl">
                    <div className="px-5 h-12 flex items-center border-b border-slate-100 bg-white">
                        <h2 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Future Engine</h2>
                    </div>
                    <div className="px-5 divide-y divide-slate-100">
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
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl overflow-hidden max-w-2xl">
                    <div className="px-5 h-12 flex items-center border-b border-slate-100 bg-white">
                        <h2 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Security Hub</h2>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                        <div className="p-4 bg-white border border-slate-100 rounded-xl">
                            <h4 className="font-medium text-slate-900 mb-0.5">Credentials</h4>
                            <p className="text-[11px] text-slate-400 font-normal mb-4">Manage password and auth.</p>
                            <button className="text-[11px] font-medium text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-4 decoration-slate-200">Configure</button>
                        </div>
                        <div className="p-4 bg-white border border-slate-100 rounded-xl">
                            <h4 className="font-medium text-slate-900 mb-0.5">Two-Factor</h4>
                            <p className="text-[11px] text-slate-400 font-normal mb-4">Secure workstation access.</p>
                            <button className="text-[11px] font-medium text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-4 decoration-slate-200">Enable</button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone - Grounded and tight */}
                <div className="border border-red-500/10 bg-red-50/50 rounded-xl p-6 max-w-2xl">
                    <h2 className="text-[14px] font-medium text-red-600 mb-1">Danger Zone</h2>
                    <p className="text-red-600/60 text-[11px] font-normal mb-6 max-w-md leading-relaxed italic">
                        Purging your account will remove all models and metadata from our cluster.
                    </p>
                    <button className="px-5 py-2 border border-red-200 text-red-600 text-[10px] font-bold tracking-widest uppercase rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300">
                        Purge Account
                    </button>
                </div>
            </div>
        </div>
    );
}
