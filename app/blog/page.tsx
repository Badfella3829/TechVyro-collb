import Link from 'next/link'
import { Calendar, ArrowRight, BookOpen } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'

export const metadata = { 
  title: 'Blog | TechVyro',
  description: 'Practical guides for brands collaborating with creators, plus behind-the-scenes from TechVyro.'
}

export default function BlogIndex() {
  return (
    <main className="relative min-h-screen">
      <ClientEffects />
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 grid-pattern-subtle opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">Blog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Creator <span className="gradient-text">Playbooks</span> &amp; Insights
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Practical guides for brands collaborating with creators, plus behind-the-scenes from TechVyro.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6">
            {BLOG_POSTS.map((p, idx) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group block glass-card border border-border/30 rounded-2xl p-6 sm:p-8 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <Calendar className="h-3 w-3" />
                  <time dateTime={p.date}>{new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                  <span>·</span>
                  <span>{p.readMinutes} min read</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors mb-2">{p.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold mt-4 text-primary">
                  Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
          
          {/* Newsletter CTA */}
          <div className="mt-12 glass border border-border/50 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Want more insights?</h3>
              <p className="text-muted-foreground text-sm mb-4">Subscribe to get new articles delivered to your inbox.</p>
              <Link href="/#newsletter" className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                Subscribe to Newsletter
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
