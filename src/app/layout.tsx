import type { Metadata } from 'next';
import { Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Anton Ahmad Susilo | QA Architect',
  description:
    'Quality Assurance Architect specializing in Financial & IT Systems. Building robust test automation and transitioning into AI Web Development.',
  keywords: [
    'QA Engineer',
    'Test Automation',
    'Katalon',
    'Next.js',
    'Portfolio',
  ],
  authors: [{ name: 'Anton Ahmad Susilo' }],
  openGraph: {
    title: 'Anton Ahmad Susilo | QA Architect',
    description: 'Architecting Reliability for Financial & IT Systems',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${jetbrains.variable} bg-paper text-ink antialiased overflow-x-hidden transition-colors duration-500`}
      >
        {children}
      </body>
    </html>
  );
}
