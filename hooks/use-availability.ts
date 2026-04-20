"use client"

import { useEffect, useState } from 'react'

export interface AvailabilityData {
  bookedDates: string[]
  tentativeDates: string[]
  totals: { booked: number; tentative: number }
}

export function useAvailability() {
  const [data, setData] = useState<AvailabilityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/availability', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed')
        const json = (await res.json()) as AvailabilityData
        if (!cancelled) setData(json)
      } catch (e) {
        if (!cancelled) setError(String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
