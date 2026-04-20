import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { WhatsAppButton } from '@/components/floating/whatsapp-button'
import { ExitIntentPopup } from '@/components/exit-intent/exit-intent-popup'
import { VisitorCounter } from '@/components/visitor-counter/visitor-counter'
import { PageTransition } from '@/components/page-transition/page-transition'
import { CookieConsent } from '@/components/cookie-consent/cookie-consent'
import { BottomNav } from '@/components/mobile-nav/bottom-nav'
import { personJsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/json-ld'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://techvyro.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TechVyro | Tech Content Creator & Brand Collaborations',
    template: '%s | TechVyro',
  },
  description: "TechVyro - India's Premier Tech Content Creator. Specializing in tech reviews, unboxings, and brand collaborations. Let's create content that converts.",
  keywords: ['tech content creator', 'brand collaborations', 'tech reviews', 'influencer', 'TechVyro', 'YouTube', 'Instagram', 'Akansh Chahal'],
  authors: [{ name: 'Akansh Chahal' }],
  creator: 'TechVyro',
  manifest: '/manifest.webmanifest',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'TechVyro',
    title: 'TechVyro | Tech Content Creator & Brand Collaborations',
    description: "India's Premier Tech Content Creator. Let's create content that converts.",
    images: [
      {
        url: '/images/techvyro-icon.jpg',
        width: 1200,
        height: 630,
        alt: 'TechVyro Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechVyro | Tech Content Creator',
    description: "India's Premier Tech Content Creator. Let's create content that converts.",
    images: ['/images/techvyro-icon.jpg'],
    creator: '@techvyro',
  },
  icons: {
    icon: '/images/techvyro-icon.jpg',
    apple: '/images/techvyro-icon.jpg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-1.5 focus:rounded">
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div id="main-content"><PageTransition>{children}</PageTransition></div>
          <WhatsAppButton />
          <ExitIntentPopup />
          <VisitorCounter />
          <CookieConsent />
          <BottomNav />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
