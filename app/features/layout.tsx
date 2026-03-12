import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore the powerful AI features of Quartz Editor: Intelligent Culling, Audio Sync, and Seamless Export.',
  openGraph: {
    title: 'Features | Quartz Editor',
    description: 'Explore the powerful AI features of Quartz Editor: Intelligent Culling, Audio Sync, and Seamless Export.',
    url: 'https://quartzeditor.com/features',
  },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
