"use client"

import { useEffect, useState } from 'react'
import { Inbox, RefreshCw, Trash2, MessageCircle, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Lead = {
  id: string
  source: string
  status: 'new' | 'contacted' | 'booked' | 'closed' | 'lost'
  email: string
  name?: string
  phone?: string
  brand?: string
  budget?: string
  package?: string
  notes?: string
  createdAt: string
}

const STATUSES: Lead['status'][] = ['new', 'contacted', 'booked', 'closed', 'lost']
const STATUS_COLORS: Record<Lead['status'], string> = {
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  contacted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  booked: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  closed: 'bg-green-500/15 text-green-400 border-green-500/30',
  lost: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export function LeadsTable({ token }: { token: string }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | Lead['status']>('all')

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setLeads(json.leads || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (token) fetchLeads() }, [token])

  const updateStatus = async (id: string, status: Lead['status']) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)))
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    })
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this lead?')) return
    setLeads((ls) => ls.filter((l) => l.id !== id))
    await fetch(`/api/leads?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  }

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.status === filter)
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: leads.filter((l) => l.status === s).length }), {} as Record<Lead['status'], number>)

  return (
    <Card className="glass border-border/50">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Leads CRM</h2>
            <span className="text-xs text-muted-foreground">({leads.length} total)</span>
          </div>
          <Button size="sm" variant="outline" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1 rounded-full border ${filter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}
          >
            All ({leads.length})
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1 rounded-full border capitalize ${filter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}
            >
              {s} ({counts[s] || 0})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground">No leads yet.</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((l) => (
              <div key={l.id} className="border border-border/50 rounded-xl p-3 sm:p-4 hover:border-primary/40 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm truncate">{l.name || l.brand || l.email}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[l.status]}`}>{l.status}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{l.source}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {l.email}{l.phone ? ` · ${l.phone}` : ''}{l.budget ? ` · ${l.budget}` : ''}{l.package ? ` · ${l.package}` : ''}
                    </div>
                    {l.notes && <div className="text-xs text-muted-foreground mt-1 italic">{l.notes}</div>}
                    <div className="text-[10px] text-muted-foreground mt-1">{new Date(l.createdAt).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a href={`mailto:${l.email}`} className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center hover:border-primary" title="Email">
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                    {l.phone && (
                      <a href={`https://wa.me/${l.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center hover:border-primary" title="WhatsApp">
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value as Lead['status'])}
                      className="text-xs px-2 py-1 rounded-md border border-border/60 bg-background"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => remove(l.id)} className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center hover:border-red-500 hover:text-red-500" title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
