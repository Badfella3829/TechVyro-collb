"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  Search,
  Tag,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  filterCaseStudies,
  type CaseStudyCategory,
  type CaseStudyItem,
} from '@/lib/case-studies-data'

const ICON_MAP = {
  zap: Zap,
  target: Target,
  briefcase: Briefcase,
  users: Users,
} as const

interface CaseStudiesExplorerProps {
  studies: CaseStudyItem[]
  categories: CaseStudyCategory[]
}

export function CaseStudiesExplorer({ studies, categories }: CaseStudiesExplorerProps) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filtered = useMemo(
    () => filterCaseStudies(studies, query, selectedCategory),
    [studies, query, selectedCategory]
  )

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
            placeholder="Search playbooks by goal, channel, or tactic (e.g. Launch, Unboxing, CAC)..."
            aria-label="Search case studies"
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
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter playbooks by category">
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
            {filtered.length} of {studies.length} playbooks
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass border border-dashed border-border/60 rounded-2xl p-10 text-center space-y-3">
          <p className="font-semibold text-foreground">No matching playbooks found</p>
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
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {filtered.map((c, idx) => {
            const Icon = ICON_MAP[c.iconName]
            return (
              <Link
                key={c.slug}
                href={`/case-studies/${c.slug}`}
                className="group relative glass-card border border-border/30 rounded-2xl p-6 sm:p-8 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30">
                        {c.category}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary mb-2">
                    <TrendingUp className="h-3 w-3" /> {c.metric}
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {c.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {c.summary}
                  </p>
                </div>

                <div className="relative space-y-3 pt-3 border-t border-border/30">
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-muted/40 text-muted-foreground"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Read playbook &amp; impact chart{' '}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
