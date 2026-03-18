import type { Metadata } from 'next';
import { Syne, Playfair_Display, Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './components/AuthProvider';
import { ScrollToTopOnLoad } from './components/ScrollToTopOnLoad';
import { SmoothScroll } from './components/SmoothScroll';
import { cn } from "@/lib/utils";

const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  variable: '--font-script',
  subsets: ['latin'],
  display: 'swap',
  style: ['italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://quartzeditor.com'), // Replace with actual production URL if different
  title: {
    default: 'Quartz Editor — AI Video Editing for Wedding Filmmakers',
    template: '%s | Quartz Editor'
  },
  description: 'AI-powered precision editing that transforms hours of wedding footage into cinematic stories. Automate ingest, culling, sync, and assembly. Edit less. Create more.',
  keywords: ['AI video editing', 'wedding video editor', 'multicam sync', 'automated video editing', 'wedding filmmakers', 'premiere pro plugin', 'davinci resolve plugin', 'autocut', 'video culling software'],
  authors: [{ name: 'Quartz Editor' }],
  creator: 'Quartz Editor',
  publisher: 'Quartz Editor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Quartz Editor — AI Video Editing for Wedding Filmmakers',
    description: 'AI-powered precision editing that transforms hours of wedding footage into cinematic stories. Automate ingest, culling, sync, and assembly.',
    url: 'https://quartzeditor.com',
    siteName: 'Quartz Editor',
    images: [
      {
        url: '/og-image.jpg', // Should add an OG image to public/ later
        width: 1200,
        height: 630,
        alt: 'Quartz Editor Interface',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quartz Editor — AI Video Editing for Wedding Filmmakers',
    description: 'AI-powered precision editing that transforms hours of wedding footage into cinematic stories. Edit less. Create more.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/cutlineLogo.png', type: 'image/png' }],
    apple: [{ url: '/cutlineLogo.png', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://quartzeditor.com/#website',
        url: 'https://quartzeditor.com',
        name: 'Quartz Editor',
        description: 'AI-powered precision editing that transforms hours of wedding footage into cinematic stories.',
        publisher: {
          '@id': 'https://quartzeditor.com/#organization'
        }
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://quartzeditor.com/#software',
        name: 'Quartz Editor',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Windows, macOS',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        description: 'AI-powered precision editing that transforms hours of wedding footage into cinematic stories.',
        url: 'https://quartzeditor.com'
      },
      {
        '@type': 'Organization',
        '@id': 'https://quartzeditor.com/#organization',
        name: 'Quartz Editor',
        url: 'https://quartzeditor.com',
        logo: 'https://quartzeditor.com/cutlineLogo.png'
      }
    ]
  };

  return (
    <html lang="en" className={cn(syne.variable, playfair.variable, "font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ScrollToTopOnLoad />
          <SmoothScroll />
          {children}
        </AuthProvider>
        <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
      </body>
    </html>
  );
}
