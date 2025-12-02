import type { Metadata } from "next"; // Import the Metadata type from next
import { Inter } from "next/font/google";
import "./globals.css"; // Import global CSS

// Load the Inter font with CSS variables
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Define metadata (SEO info) for your site
export const metadata: Metadata = {
  title: "AUTO CUT — AI Wedding Videographer Editor",
  description: "AI-powered video editing engineered for wedding videographers. Edit less. Create more.",
};

// RootLayout component
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children} {/* Render the children passed to the layout */}
      </body>
    </html>
  );
}
