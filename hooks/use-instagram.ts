"use client"

import { useEffect, useState } from 'react'

export type InstagramMedia = {
  id: string
  media_type: string
  media_product_type?: string
  media_url?: string
  thumbnail_url?: string
  permalink: string
  caption?: string
  timestamp: string
  like_count?: number
  comments_count?: number
  view_count?: number
}

export type InstagramData = {
  account: {
    username: string
    followers_count: number
    media_count: number
    profile_picture_url?: string
    biography?: string
    name?: string
  }
  media: InstagramMedia[]
  computed: {
    avgLikes: number
    avgComments: number
    avgEngagement: number
    totalViews: number
  }
  fetchedAt: string
}

export function useInstagram() {
  const [data, setData] = useState<InstagramData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/instagram')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        if (json.error) throw new Error(json.error)
        setData(json as InstagramData)
      })
      .catch((err) => {
        if (!cancelled) setError(String(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
