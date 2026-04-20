"use client"

import { useState, useEffect, useCallback } from 'react'
import { Calendar, Check, Trash2, Plus, LogOut, Loader2, AlertCircle, RefreshCw } from 'lucide-react'

type Booking = {
  id: string
  date: string
  status: 'booked' | 'tentative'
  brandName: string
  contactName: string
  email: string
  phone?: string
  reference: string
  collabType?: string
  notes?: string
  confirmedAt?: string
  confirmationSent?: boolean
  createdAt: string
}

const PASSWORD_KEY = 'techvyro:admin-key'

export default function AdminAvailabilityPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'warn' | 'error'; text: string } | null>(null)

  // Add-form state
  const [showAdd, setShowAdd] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newBrand, setNewBrand] = useState('')
  const [newContact, setNewContact] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newStatus, setNewStatus] = useState<'booked' | 'tentative'>('booked')

  const fetchBookings = useCallback(async (key: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/availability', {
        headers: { Authorization: `Bearer ${key}` },
        cache: 'no-store',
      })
      if (res.status === 401) {
        setError('Wrong password')
        setAuthed(false)
        try { localStorage.removeItem(PASSWORD_KEY) } catch {}
        return
      }
      const data = await res.json()
      setBookings(data.bookings || [])
      setAuthed(true)
      try { localStorage.setItem(PASSWORD_KEY, key) } catch {}
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  // Restore password from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PASSWORD_KEY)
      if (saved) {
        setPassword(saved)
        fetchBookings(saved)
      }
    } catch {}
  }, [fetchBookings])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim()) fetchBookings(password.trim())
  }

  const handleLogout = () => {
    setAuthed(false)
    setPassword('')
    setBookings([])
    try { localStorage.removeItem(PASSWORD_KEY) } catch {}
  }

  const mutate = async (
    body: Record<string, unknown>,
    optimisticId?: string
  ): Promise<Record<string, unknown> | null> => {
    setPendingId(optimisticId || null)
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed')
      await fetchBookings(password)
      return data
    } catch (e) {
      setError(String(e))
      return null
    } finally {
      setPendingId(null)
    }
  }

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(t)
  }, [toast])

  const handleConfirm = async (b: Booking) => {
    const data = await mutate({ action: 'update', id: b.id, status: 'booked' }, b.id)
    if (!data) return
    const conf = (data as { confirmation?: { sent: boolean; mode?: string; skipped?: boolean; reason?: string; error?: string } }).confirmation
    if (!conf) {
      setToast({ type: 'success', text: `Confirmed booking for ${b.brandName}.` })
    } else if (conf.sent) {
      setToast({
        type: 'success',
        text: conf.mode === 'template'
          ? `Confirmed! Sent "hello_world" template to ${b.brandName} (Meta requires templates for cold outreach). They can reply to open a 24h window.`
          : `Confirmed! WhatsApp confirmation sent to ${b.brandName}.`,
      })
    } else if (conf.skipped) {
      setToast({ type: 'warn', text: `Confirmed, but no WhatsApp sent: ${conf.reason}` })
    } else {
      setToast({ type: 'error', text: `Confirmed, but WhatsApp failed: ${conf.error}` })
    }
  }
  const handleMakeTentative = (b: Booking) =>
    mutate({ action: 'update', id: b.id, status: 'tentative' }, b.id)
  const handleRemove = (b: Booking) => {
    if (!confirm(`Remove booking for ${b.brandName} on ${b.date}?`)) return
    mutate({ action: 'remove', id: b.id }, b.id)
  }
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDate || !newBrand || !newContact || !newEmail) return
    mutate({
      action: 'add',
      date: newDate,
      status: newStatus,
      brandName: newBrand,
      contactName: newContact,
      email: newEmail,
      reference: `MANUAL-${Date.now().toString(36).toUpperCase()}`,
    }).then(() => {
      setNewDate(''); setNewBrand(''); setNewContact(''); setNewEmail('')
      setShowAdd(false)
    })
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 space-y-4">
          <div className="text-center mb-4">
            <Calendar className="h-10 w-10 text-primary mx-auto mb-2" />
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your admin password</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none text-sm"
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    )
  }

  const tentativeCount = bookings.filter((b) => b.status === 'tentative').length
  const bookedCount = bookings.filter((b) => b.status === 'booked').length

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Availability Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {bookedCount} confirmed • {tentativeCount} tentative • {bookings.length} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchBookings(password)}
              disabled={loading}
              className="px-3 py-2 rounded-lg border border-border hover:bg-card text-sm flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowAdd((v) => !v)}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Manual
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg border border-border hover:bg-card text-sm flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        {toast && (
          <div className={`mb-4 p-3 rounded-lg border text-sm flex items-start gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : toast.type === 'warn'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {toast.type === 'success' ? <Check className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
            <span className="flex-1">{toast.text}</span>
            <button onClick={() => setToast(null)} className="text-xs opacity-70 hover:opacity-100">×</button>
          </div>
        )}

        {/* Add form */}
        {showAdd && (
          <form onSubmit={handleAdd} className="mb-6 p-4 sm:p-5 rounded-xl border border-border bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)} className="px-3 py-2 rounded-lg bg-background border border-border text-sm" />
            <input required placeholder="Brand name" value={newBrand} onChange={(e) => setNewBrand(e.target.value)} className="px-3 py-2 rounded-lg bg-background border border-border text-sm" />
            <input required placeholder="Contact name" value={newContact} onChange={(e) => setNewContact(e.target.value)} className="px-3 py-2 rounded-lg bg-background border border-border text-sm" />
            <input required type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="px-3 py-2 rounded-lg bg-background border border-border text-sm" />
            <div className="flex gap-2">
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as 'booked' | 'tentative')} className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm">
                <option value="booked">Booked</option>
                <option value="tentative">Tentative</option>
              </select>
              <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Add</button>
            </div>
          </form>
        )}

        {/* Bookings table */}
        {bookings.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No bookings yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Inquiries with a start date will appear here as tentative
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-card">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Ref</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((b) => {
                  const busy = pendingId === b.id
                  return (
                    <tr key={b.id} className="hover:bg-card/50">
                      <td className="px-4 py-3 font-medium whitespace-nowrap">{b.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          b.status === 'booked'
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {b.status === 'booked' ? 'Booked' : 'Tentative'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{b.brandName}</td>
                      <td className="px-4 py-3">
                        <div>{b.contactName}</div>
                        <a href={`mailto:${b.email}`} className="text-xs text-primary hover:underline block">{b.email}</a>
                        {b.phone ? (
                          <a href={`https://wa.me/${b.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline">📱 {b.phone}</a>
                        ) : (
                          <span className="text-xs text-muted-foreground/60 italic">no phone</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{b.collabType || '—'}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{b.reference}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === 'tentative' ? (
                            <button
                              onClick={() => handleConfirm(b)}
                              disabled={busy}
                              title="Confirm booking"
                              className="px-2.5 py-1.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs flex items-center gap-1 disabled:opacity-50"
                            >
                              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                              Confirm
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMakeTentative(b)}
                              disabled={busy}
                              title="Move back to tentative"
                              className="px-2.5 py-1.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 text-xs disabled:opacity-50"
                            >
                              Tentative
                            </button>
                          )}
                          <button
                            onClick={() => handleRemove(b)}
                            disabled={busy}
                            title="Remove booking"
                            className="p-1.5 rounded-md border border-border hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
