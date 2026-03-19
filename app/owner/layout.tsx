import React from 'react';
import Shell from './components/Shell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quartz Editor Owner Dashboard',
  description: 'Manage your Quartz Editor instance.',
};

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Shell>
      {children}
    </Shell>
  );
}
