'use client';

import { useState } from 'react';
import { Bell, Lock, Flask, Desktop, ChatText } from '@phosphor-icons/react';

interface ToggleProps {
    enabled: boolean;
    onToggle: () => void;
}

function Toggle({ enabled, onToggle }: ToggleProps) {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none ${enabled ? 'bg-white' : 'bg-white/10'
                }`}
        >
            <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-[#050504] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${enabled ? 'translate-x-[1.25rem]' : 'translate-x-[0.25rem]'
                    }`}
            />
        </button>
    );
}

function SettingRow({ icon: Icon, title, description, children }: { icon: any; title: string, description: string, children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-6">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/30 transition-colors group-hover:bg-white/[0.06]">
                    <Icon weight="light" className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-[15px] font-light text-white/90 mb-1">{title}</h3>
                    <p className="text-[13px] font-light text-white/30 max-w-sm leading-relaxed">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

export default function SettingsPage() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false daily: true,
    });

    const [beta, setBeta] = useState({
        earlyAccess: true,
        aiAssistant: false,
    });

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-[42px] font-extralight tracking-[-0.04em] text-white leading-tight mb-2">Settings</h1>
                <p className="text-white/30 text-[15px] font-light">Customize your workflow and security preferences.</p>
            </div>

            {/* Notifications */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden mb-8">
                <div className="px-8 flex items-center h-16 border-b border-white/[0.04]">
                    <Bell weight="fill" className="w-4 h-4 text-white/20 mr-2.5" />
                    <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-white/20">Communication</h2>
                </div>
                <div className="px-8 divide-y divide-white/[0.04]">
                    <SettingRow
                        icon={Bell}
                        title="In-App Notifications"
                        description="Receive alerts for project completions and system updates directly in the app."
                    >
                        <Toggle enabled={notifications.email} onToggle={() => setNotifications({ ...notifications, email: !notifications.email })} />
                    </SettingRow>
                    <SettingRow
                        icon={ChatText}
                        title="Email Reports"
                        description="Daily summary of your studio's culling and assembly throughput."
                    >
                        <Toggle enabled={notifications.daily} onToggle={() => setNotifications({ ...notifications, daily: !notifications.daily })} />
                    </SettingRow>
                </div>
            </div>

            {/* Access & Beta */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden mb-8">
                <div className="px-8 flex items-center h-16 border-b border-white/[0.04]">
                    <Flask weight="fill" className="w-4 h-4 text-white/20 mr-2.5" />
                    <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-white/20">Future Engine</h2>
                </div>
                <div className="px-8 divide-y divide-white/[0.04]">
                    <SettingRow
                        icon={Flask}
                        title="Early Access Program"
                        description="Get access to internal beta filters and experimental scene detection models."
                    >
                        <Toggle enabled={beta.earlyAccess} onToggle={() => setBeta({ ...beta, earlyAccess: !beta.earlyAccess })} />
                    </SettingRow>
                </div>
            </div>

            {/* Security Section (Dark placeholder style) */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden mb-12">
                <div className="px-8 flex items-center h-16 border-b border-white/[0.04]">
                    <Lock weight="fill" className="w-4 h-4 text-white/20 mr-2.5" />
                    <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-white/20">Security Hub</h2>
                </div>
                <div className="p-8 grid md:grid-cols-2 gap-8">
                    <div className="p-6 bg-white/[0.03] border border-white/[0.05] rounded-xl group hover:border-white/10 transition-all duration-500">
                        <h4 className="text-[14px] font-light text-white mb-1">Access Credentials</h4>
                        <p className="text-[12px] text-white/30 font-light mb-6">Manage your password and authentication methods.</p>
                        <button className="text-[12px] font-medium text-white/60 hover:text-white transition-colors underline underline-offset-4 decoration-white/10">Configure</button>
                    </div>
                    <div className="p-6 bg-white/[0.03] border border-white/[0.05] rounded-xl group hover:border-white/10 transition-all duration-500">
                        <h4 className="text-[14px] font-light text-white mb-1">Two-Factor Authentication</h4>
                        <p className="text-[12px] text-white/30 font-light mb-6">Secure your workstation access with an extra layer.</p>
                        <button className="text-[12px] font-medium text-white/60 hover:text-white transition-colors underline underline-offset-4 decoration-white/10">Enable</button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-500/10 bg-red-500/[0.02] rounded-2xl p-8 mb-16">
                <h2 className="text-[16px] font-medium text-red-500 mb-2">Danger Zone</h2>
                <p className="text-red-500/40 text-[13px] font-light mb-8 max-w-lg leading-relaxed italic">
                    Deleting your account is irreversible. All training models, style profiles, and project metadata will be purged from our cluster.
                </p>
                <button className="px-6 py-2.5 bg-red-600/10 border border-red-600/20 text-red-600 text-[12px] font-bold tracking-widest uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all duration-500">
                    Purge Account
                </button>
            </div>
        </div>
    );
}
