"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Search, Tag, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { filterBlogPosts, type BlogCategory, type BlogPost } from '@/lib/blog-data'

interface BlogExplorerProps {
  posts: BlogPost[]
  categories: BlogCategory[]
}

export function BlogExplorer({ posts, categories }: BlogExplorerProps) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filtered = useMemo(
    () => filterBlogPosts(posts, query, selectedCategory),
    [posts, query, selectedCategory]
  )

  const hasActiveFilters = query.trim().length > 0 || selectedCategory !== 'All'

  return (
    <div className="space-y-8">
      {/* Search + Category Filter Bar */}
      <div className="glass border border-border/50 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, tactics, or tags (e.g. Reels, ROI, Unboxing)..."
            aria-label="Search blog articles"
            className="pl-10 pr-10 bg-background/60 h-11"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
            {(['All', ...categories] as string[]).map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={active}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all min-h-[34px]',
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background/40 text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <span className="text-xs text-muted-foreground font-mono">
            Showing {filtered.length} of {posts.length} articles
          </span>
        </div>
      </div>

      {/* Articles list */}
      {filtered.length === 0 ? (
        <div className="glass border border-dashed border-border/60 rounded-2xl p-10 text-center space-y-3">
          <p className="text-base font-semibold text-foreground">No matching articles found</p>
          <p className="text-sm text-muted-foreground">
            Try a different search keyword or reset the category filter.
          </p>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery('')
                setSelectedCategory('All')
              }}
            >
              Reset filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filtered.map((p, idx) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block glass-card border border-border/30 rounded-2xl p-6 sm:p-8 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all hover:-translate-y-1"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                  {p.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={p.date}>
                    {new Date(p.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {p.readMinutes} min read
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors mb-2">
                {p.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {p.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md bg-muted/40 text-muted-foreground border border-border/40"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Read article{' '}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
