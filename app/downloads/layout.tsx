import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Download Quartz Editor for macOS and Windows. Experience the fastest AI wedding video editor.',
  openGraph: {
    title: 'Downloads | Quartz Editor',
    description: 'Download Quartz Editor for macOS and Windows. Experience the fastest AI wedding video editor.',
    url: 'https://quartzeditor.com/downloads',
  },
};

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
