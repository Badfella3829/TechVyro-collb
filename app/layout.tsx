import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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

export const metadata: Metadata = {
  title: 'TechVyro | Tech Content Creator & Brand Collaborations',
  description: 'TechVyro - India\'s Premier Tech Content Creator. Specializing in tech reviews, unboxings, and brand collaborations. Let\'s create content that converts.',
  keywords: ['tech content creator', 'brand collaborations', 'tech reviews', 'influencer', 'TechVyro', 'YouTube', 'Instagram'],
  authors: [{ name: 'TechVyro' }],
  creator: 'TechVyro',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://techvyro.com',
    siteName: 'TechVyro',
    title: 'TechVyro | Tech Content Creator & Brand Collaborations',
    description: 'India\'s Premier Tech Content Creator. Let\'s create content that converts.',
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
    description: 'India\'s Premier Tech Content Creator. Let\'s create content that converts.',
    images: ['/images/techvyro-icon.jpg'],
  },
  icons: {
    icon: '/images/techvyro-icon.jpg',
    apple: '/images/techvyro-icon.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0ff',
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
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
