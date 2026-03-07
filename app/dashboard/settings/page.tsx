'use client';

import { Bell, Gear, ShieldCheck } from '@phosphor-icons/react';

const SETTINGS_GROUPS = [
  {
    title: 'Preferences',
    icon: Gear,
    items: ['Desktop defaults', 'Export preferences', 'Project behavior'],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: ['Processing updates', 'Product announcements', 'Billing reminders'],
  },
  {
    title: 'Security',
    icon: ShieldCheck,
    items: ['Account access', 'Connected devices', 'Support verification'],
  },
];

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-light text-black">Settings</h1>
        <p className="mt-2 text-lg font-light text-black/60">
          A place for account preferences, notification controls, and desktop defaults.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {SETTINGS_GROUPS.map((group) => {
          const Icon = group.icon;

          return (
            <div key={group.title} className="rounded-3xl border border-black/7 bg-black/[0.02] p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-black">{group.title}</h2>
              <ul className="mt-4 space-y-3 text-sm text-black/60">
                {group.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
