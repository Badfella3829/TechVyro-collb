import Link from 'next/link'
import { Home, MessageCircle, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
      <div className="text-center max-w-md relative z-10">
        <div className="text-[120px] sm:text-[160px] font-bold gradient-text leading-none mb-2">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Yeh page kahin kho gaya 🤔</h1>
        <p className="text-muted-foreground mb-8">
          Ya to URL galat hai, ya page ab exist nahi karta. Chinta nahi —
          neeche ke options try karo!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" /> Home Page
          </Link>
          <a
            href="https://wa.me/919696094707"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Owner
          </a>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {[
            { href: '/analytics/instagram', label: 'Instagram Analytics' },
            { href: '/analytics/facebook', label: 'Facebook Analytics' },
            { href: '/analytics/youtube', label: 'YouTube Analytics' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="glass border border-border/40 hover:border-primary/40 px-3 py-2 rounded-lg flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
