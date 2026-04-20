"use client"

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

export function RefreshButton({ endpoint }: { endpoint: string }) {
  const [refreshing, setRefreshing] = useState(false)

  const refresh = async () => {
    setRefreshing(true)
    try {
      const url = endpoint.includes('?') ? `${endpoint}&_t=${Date.now()}` : `${endpoint}?_t=${Date.now()}`
      await fetch(url, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } })
    } catch {}
    setTimeout(() => {
      window.location.reload()
    }, 600)
  }

  return (
    <button
      onClick={refresh}
      disabled={refreshing}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium glass border border-border/60 hover:border-primary/50 rounded-lg transition-colors disabled:opacity-60"
      aria-label="Refresh data"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
      {refreshing ? 'Refreshing…' : 'Refresh now'}
    </button>
  )
}
