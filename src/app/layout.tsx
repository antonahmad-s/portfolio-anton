import type { Metadata, Viewport } from 'next';
import { Playfair_Display, JetBrains_Mono, Inter } from 'next/font/google';
import { Suspense } from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Analytics } from '@/components/analytics';
import './globals.css';

/* ========================================
   FONT OPTIMIZATION
   ======================================== */

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  preload: true,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: true, // Reduces CLS
});

const jetbrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  preload: true,
  fallback: ['Courier New', 'monospace'],
  adjustFontFallback: true,
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
});

/* ========================================
   SEO METADATA
   ======================================== */

export const metadata: Metadata = {
  metadataBase: new URL('https://antonahmad.dev'),
  title: {
    default: 'Anton Ahmad Susilo | QA Architect & AI Web Developer',
    template: '%s | Anton Ahmad Susilo',
  },
  description:
    'Quality Assurance Architect with 5+ years specializing in Financial & IT Systems. Expert in test automation (Katalon, Selenium), transitioning into AI-powered web development with Next.js 15 & React 19.',
  keywords: [
    'QA Engineer',
    'Test Automation',
    'Katalon Studio',
    'Selenium WebDriver',
    'Next.js 15',
    'React 19',
    'TypeScript',
    'AI Web Development',
    'Financial Systems Testing',
    'Portfolio',
  ],
  authors: [{ name: 'Anton Ahmad Susilo', url: 'https://antonahmad.dev' }],
  creator: 'Anton Ahmad Susilo',

  // Open Graph
  openGraph: {
    title: 'Anton Ahmad Susilo | QA Architect',
    description: 'Architecting Reliability for Financial & IT Systems',
    type: 'website',
    locale: 'en_US',
    siteName: 'Anton Ahmad Susilo Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anton Ahmad Susilo - QA Architect Portfolio',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Anton Ahmad Susilo | QA Architect',
    description: 'Architecting Reliability for Financial & IT Systems',
    creator: '@antonahmad',
    images: ['/og-image.png'],
  },

  // Robots
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

  // Manifest
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'var(--theme-light)' },
    { media: '(prefers-color-scheme: dark)', color: 'var(--theme-dark)' },
  ],
};

/* ========================================
   ROOT LAYOUT COMPONENT
   ======================================== */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch for faster resolution */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>

      <body
        className={`
          ${playfair.variable} 
          ${jetbrains.variable} 
          ${inter.variable}
          bg-paper 
          text-ink 
          font-mono
          antialiased 
          overflow-x-hidden 
          transition-colors 
          duration-500
          selection:bg-accent
          selection:text-paper
        `}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="anton-portfolio-theme"
        >
          {/* Skip to main content for screen readers */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-paper focus:rounded-md focus:outline-none focus:ring-2 focus:ring-accent-secondary"
          >
            Skip to main content
          </a>

          {/* Main Content */}
          <main id="main-content" className="relative">
            {children}
          </main>

          {/* Analytics - Only in production */}
          {process.env.NODE_ENV === 'production' && (
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
          )}

          {/* Noise texture overlay */}
          <div
            className="fixed inset-0 pointer-events-none z-50 bg-noise"
            style={{ opacity: 'var(--noise-opacity)' }}
            aria-hidden="true"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
