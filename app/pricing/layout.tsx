import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for wedding filmmakers. Get full access to our AI video editing engine.',
  openGraph: {
    title: 'Pricing | Quartz Editor',
    description: 'Simple, transparent pricing for wedding filmmakers. Get full access to our AI video editing engine.',
    url: 'https://quartzeditor.com/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
