import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'

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

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <article className="container mx-auto max-w-2xl">
        <Link href="/blog" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-3 w-3" /> All articles
        </Link>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3 w-3" />
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
          <span>·</span>
          <span>{post.readMinutes} min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-base text-muted-foreground mb-8">{post.excerpt}</p>
        <div className="prose prose-invert max-w-none space-y-5 text-[15px] leading-relaxed text-muted-foreground">
          {post.body.map((block, i) => {
            if (block.type === 'h2') return <h2 key={i} className="text-xl font-bold text-foreground mt-8">{block.text}</h2>
            if (block.type === 'list') return (
              <ul key={i} className="list-disc pl-5 space-y-1.5">
                {block.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            )
            return <p key={i}>{block.text}</p>
          })}
        </div>
        <div className="mt-12 glass border border-border/50 rounded-2xl p-5 text-center">
          <p className="text-sm text-muted-foreground">Want this kind of strategy for your brand?</p>
          <Link href="/contact" className="inline-block mt-3 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
            Start a collaboration →
          </Link>
        </div>
      </article>
    </main>
  )
}
