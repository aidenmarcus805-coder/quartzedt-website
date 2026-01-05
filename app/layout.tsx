import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';
import { ScrollToTopOnLoad } from './components/ScrollToTopOnLoad';
import { SmoothScroll } from './components/SmoothScroll';

const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'Quartz Editor — AI Video Editing for Wedding Filmmakers',
  description: 'AI-powered precision editing that transforms hours of wedding footage into cinematic stories. Edit less. Create more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ScrollToTopOnLoad />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
