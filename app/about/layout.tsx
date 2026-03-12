import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Built by filmmakers. For filmmakers. Turn weeks of wedding video editing work into days.',
  openGraph: {
    title: 'About Us | Quartz Editor',
    description: 'Built by filmmakers. For filmmakers. Turn weeks of wedding video editing work into days.',
    url: 'https://quartzeditor.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
