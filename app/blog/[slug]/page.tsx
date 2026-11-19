import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'
import { ReadingProgress } from '@/components/blog/reading-progress'

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return { title: 'Article' }
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => (a.category === post.category ? -1 : b.category === post.category ? 1 : 0))
    .slice(0, 2)

  return (
    <main className="relative min-h-screen">
      <ReadingProgress label={`Reading progress for ${post.title}`} />
      <ClientEffects />
      <Navbar />

      <article className="container mx-auto max-w-3xl pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All articles
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </time>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readMinutes} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-border/50">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-muted/40 text-muted-foreground border border-border/40"
            >
              <Tag className="h-3 w-3 text-primary" />
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-invert max-w-none space-y-5 text-[15px] sm:text-base leading-relaxed text-muted-foreground">
          {post.body.map((block, i) => {
            if (block.type === 'h2') {
              return (
                <h2 key={i} className="text-xl sm:text-2xl font-bold text-foreground mt-8">
                  {block.text}
                </h2>
              )
            }
            if (block.type === 'list') {
              return (
                <ul key={i} className="list-disc pl-5 space-y-2">
                  {block.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              )
            }
            return <p key={i}>{block.text}</p>
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 glass border border-primary/30 rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-base font-semibold text-foreground">
            Want this kind of strategy for your brand?
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Build a custom quote or send your campaign brief in under 2 minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Link
              href="/#quote-builder"
              className="inline-block px-5 py-2.5 rounded-lg border border-primary/40 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
            >
              Build Custom Quote
            </Link>
            <Link
              href="/#contact"
              className="inline-block px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Start a collaboration →
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-lg font-bold mb-4">Related Playbooks</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/blog/${rel.slug}`}
                className="group glass border border-border/40 hover:border-primary/40 rounded-xl p-5 transition-all"
              >
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  {rel.category}
                </span>
                <h4 className="font-bold text-base mt-1.5 group-hover:text-primary transition-colors">
                  {rel.title}
                </h4>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3">
                  Read next <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
