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
            role="switch"
            aria-checked={enabled}
            className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${enabled ? 'bg-black' : 'bg-black/15'}`}
        >
            <span
                className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'}`}
            />
        </button>
    );
}

function SettingRow({ title, description, enabled, onToggle }: {
    title: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex items-center justify-between gap-6 py-4">
            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-black">{title}</p>
                <p className="text-[13px] text-black/40 mt-0.5">{description}</p>
            </div>
            <Toggle enabled={enabled} onToggle={onToggle} />
        </div>
    );
}

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        productUpdates: true,
        betaFeatures: false,
        desktopNotifications: false,
        marketingEmails: false,
    });

    const toggle = (key: keyof typeof settings) =>
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="max-w-2xl py-10">
            <div className="mb-10">
                <h1 className="text-[28px] font-semibold tracking-tight text-black mb-1">Settings</h1>
                <p className="text-black/40 text-[14px]">Manage your preferences and account security.</p>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-black/[0.05] flex items-center gap-2.5">
                    <Bell weight="fill" className="w-4 h-4 text-black/40" />
                    <h2 className="text-[13.5px] font-semibold text-black">Notifications</h2>
                </div>
                <div className="px-6 divide-y divide-black/[0.04]">
                    <SettingRow
                        title="Email Notifications"
                        description="Receive workflow completion and status alerts via email."
                        enabled={settings.emailNotifications}
                        onToggle={() => toggle('emailNotifications')}
                    />
                    <SettingRow
                        title="Product Updates"
                        description="Get notified about new features and Quartz releases."
                        enabled={settings.productUpdates}
                        onToggle={() => toggle('productUpdates')}
                    />
                    <SettingRow
                        title="Desktop Notifications"
                        description="Push notifications when your desktop app finishes processing."
                        enabled={settings.desktopNotifications}
                        onToggle={() => toggle('desktopNotifications')}
                    />
                    <SettingRow
                        title="Marketing Emails"
                        description="Occasional tips, case studies, and community updates."
                        enabled={settings.marketingEmails}
                        onToggle={() => toggle('marketingEmails')}
                    />
                </div>
            </div>

            {/* Access & Beta */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-black/[0.05] flex items-center gap-2.5">
                    <Flask weight="fill" className="w-4 h-4 text-black/40" />
                    <h2 className="text-[13.5px] font-semibold text-black">Early Access</h2>
                </div>
                <div className="px-6 divide-y divide-black/[0.04]">
                    <SettingRow
                        title="Beta Features"
                        description="Get early access to experimental tools like auto-captions and Smart Reel generation."
                        enabled={settings.betaFeatures}
                        onToggle={() => toggle('betaFeatures')}
                    />
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-black/[0.05] flex items-center gap-2.5">
                    <Lock weight="fill" className="w-4 h-4 text-black/40" />
                    <h2 className="text-[13.5px] font-semibold text-black">Security</h2>
                </div>
                <div className="px-6 divide-y divide-black/[0.04]">
                    <div className="flex items-center justify-between gap-6 py-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium text-black">Password</p>
                            <p className="text-[13px] text-black/40 mt-0.5">Change your account password.</p>
                        </div>
                        <button className="px-4 py-2 text-[13px] font-medium border border-black/10 rounded-xl hover:bg-black/[0.03] transition-colors text-black/60 hover:text-black">
                            Update
                        </button>
                    </div>
                    <div className="flex items-center justify-between gap-6 py-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium text-black">Two-Factor Authentication</p>
                            <p className="text-[13px] text-black/40 mt-0.5">Add an extra layer of security to your account.</p>
                        </div>
                        <span className="px-3 py-1.5 text-[12px] font-medium bg-black/[0.04] text-black/40 rounded-lg">Coming Soon</span>
                    </div>
                    <div className="flex items-center justify-between gap-6 py-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium text-black">Active Sessions</p>
                            <p className="text-[13px] text-black/40 mt-0.5">View and revoke access from other devices.</p>
                        </div>
                        <button className="px-4 py-2 text-[13px] font-medium border border-black/10 rounded-xl hover:bg-black/[0.03] transition-colors text-black/60 hover:text-black">
                            Manage
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/60 rounded-2xl border border-red-100/80 overflow-hidden">
                <div className="px-6 py-4 border-b border-red-100/60">
                    <h2 className="text-[13.5px] font-semibold text-red-900">Danger Zone</h2>
                </div>
                <div className="px-6 py-5 flex items-center justify-between gap-6">
                    <div>
                        <p className="text-[14px] font-medium text-red-900">Delete Account</p>
                        <p className="text-[13px] text-red-700/60 mt-0.5 max-w-sm">
                            Permanently remove all your data, subscriptions, and desktop access. This cannot be undone.
                        </p>
                    </div>
                    <button className="flex-shrink-0 px-4 py-2 text-[13px] font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all shadow-sm">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
