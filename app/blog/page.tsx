import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { BLOG_POSTS, getBlogCategories } from '@/lib/blog-data'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'
import { BlogExplorer } from '@/components/blog/blog-explorer'

export const metadata = {
  title: 'Blog',
  description:
    'Practical guides for brands collaborating with creators, plus behind-the-scenes from TechVyro.',
}

export default function BlogIndex() {
  const categories = getBlogCategories(BLOG_POSTS)

  return (
    <main className="relative min-h-screen">
      <ClientEffects />
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-10 sm:pt-40 sm:pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 grid-pattern-subtle opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
              Blog
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Creator <span className="gradient-text">Playbooks</span> &amp; Insights
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Practical guides for brands collaborating with creators, plus behind-the-scenes from TechVyro.
          </p>
        </div>
      </section>

      {/* Searchable & Filterable Blog Posts Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <BlogExplorer posts={BLOG_POSTS} categories={categories} />

          {/* Newsletter CTA */}
          <div className="mt-12 glass border border-border/50 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Want more insights?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Subscribe to get new articles delivered to your inbox.
              </p>
              <Link
                href="/#newsletter"
                className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
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
