import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Space_Grotesk, JetBrains_Mono, Cormorant_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { SmoothScroll } from '@/components/effects/smooth-scroll'
import { WhatsAppButton } from '@/components/floating/whatsapp-button'
import { ExitIntentPopup } from '@/components/exit-intent/exit-intent-popup'
import { VisitorCounter } from '@/components/visitor-counter/visitor-counter'
import { PageTransition } from '@/components/page-transition/page-transition'
import { CookieConsent } from '@/components/cookie-consent/cookie-consent'
import { BottomNav } from '@/components/mobile-nav/bottom-nav'
import { BrandScene } from '@/components/3d/brand-scene'
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

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://techvyro.in'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TechVyro | Tech Content Creator & Brand Collaborations',
    template: '%s | TechVyro',
  },
  description: "TechVyro - India's Premier Tech Content Creator. Specializing in tech reviews, unboxings, and brand collaborations. Let's create content that converts.",
  keywords: ['tech content creator', 'brand collaborations', 'tech reviews', 'influencer', 'TechVyro', 'YouTube', 'Instagram', 'TechVyro Team'],
  authors: [{ name: 'TechVyro Team' }],
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
        url: '/images/techvyro-logo-new.jpg',
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
    images: ['/images/techvyro-logo-new.jpg'],
    creator: '@techvyro',
  },
  icons: {
    icon: '/images/techvyro-logo-new.jpg',
    apple: '/images/techvyro-logo-new.jpg',
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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${cormorant.variable} bg-background`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Meta Pixel Code */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        {/* Google Tag (gtag.js) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0">
        {/* Structured data (JSON-LD) — rendered via next/script for crawlers */}
        <Script id="ld-person" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} />
        <Script id="ld-organization" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-1.5 focus:rounded">
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <BrandScene />
          <SmoothScroll>
            <div id="main-content"><PageTransition>{children}</PageTransition></div>
            <WhatsAppButton />
            <ExitIntentPopup />
            <VisitorCounter />
            <CookieConsent />
            <BottomNav />
          </SmoothScroll>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
