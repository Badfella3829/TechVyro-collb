import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'

export const metadata = { title: 'Blog' }

export default function BlogIndex() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Blog</p>
          <h1 className="text-3xl sm:text-4xl font-bold">Creator playbooks &amp; brand insights</h1>
          <p className="text-sm text-muted-foreground mt-3">
            Practical guides for brands collaborating with creators, plus behind-the-scenes from TechVyro.
          </p>
        </div>

        <div className="space-y-4">
          {BLOG_POSTS.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block glass border border-border/50 rounded-2xl p-5 sm:p-6 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <Calendar className="h-3 w-3" />
                <time dateTime={p.date}>{new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                <span>·</span>
                <span>{p.readMinutes} min read</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">{p.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">{p.excerpt}</p>
              <div className="inline-flex items-center gap-1 text-sm font-semibold mt-3 text-primary">
                Read article <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
