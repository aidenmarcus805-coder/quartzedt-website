import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help and support for Quartz Editor. Contact our team or browse our FAQs to resolve any editing issues.',
  openGraph: {
    title: 'Support | Quartz Editor',
    description: 'Get help and support for Quartz Editor. Contact our team or browse our FAQs to resolve any editing issues.',
    url: 'https://quartzeditor.com/support',
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
