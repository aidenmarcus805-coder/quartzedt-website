import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guide',
  description: 'Learn how to use Quartz Editor. Step-by-step guides for ingesting, syncing, culling, and exporting your wedding films.',
  openGraph: {
    title: 'User Guide | Quartz Editor',
    description: 'Learn how to use Quartz Editor. Step-by-step guides for ingesting, syncing, culling, and exporting your wedding films.',
    url: 'https://quartzeditor.com/guide',
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
