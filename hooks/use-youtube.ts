"use client"

import { useEffect, useState } from 'react'

export type YouTubeVideo = {
  id: string
  title: string
  description?: string
  publishedAt: string
  thumbnail?: string
  views: number
  likes: number
  comments: number
  duration: number | null
  permalink: string
  isShort: boolean
}

export type YouTubeData = {
  channel: {
    id: string
    title: string
    description?: string
    customUrl?: string
    thumbnail?: string
    subscribers: number
    totalViews: number
    videoCount: number
    link: string
  }
  videos: YouTubeVideo[]
  computed: {
    avgViews: number
    avgLikes: number
    avgEngagement: number
  }
  fetchedAt: string
}

export function useYouTube() {
  const [data, setData] = useState<YouTubeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/youtube')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        if (json.error) throw new Error(json.error)
        setData(json as YouTubeData)
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
