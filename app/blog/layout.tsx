import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Updates, insights, and behind-the-scenes from the Quartz team.',
  openGraph: {
    title: 'Blog | Quartz Editor',
    description: 'Updates, insights, and behind-the-scenes from the Quartz team.',
    url: 'https://quartzeditor.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
