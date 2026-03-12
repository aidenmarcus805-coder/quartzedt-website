import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Comprehensive documentation and technical details for the Quartz Editor AI video editing platform.',
  openGraph: {
    title: 'Documentation | Quartz Editor',
    description: 'Comprehensive documentation and technical details for the Quartz Editor AI video editing platform.',
    url: 'https://quartzeditor.com/docs',
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
