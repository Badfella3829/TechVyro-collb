"use client"

import { useEffect, useState } from 'react'

export type FacebookPost = {
  id: string
  message?: string
  story?: string
  created_time: string
  permalink_url?: string
  full_picture?: string
  attachments?: {
    data: Array<{
      type?: string
      media?: { image?: { src?: string } }
      url?: string
      title?: string
    }>
  }
  reactions?: { summary?: { total_count?: number } }
  comments?: { summary?: { total_count?: number } }
  shares?: { count?: number }
}

export type FacebookVideo = {
  id: string
  views?: number
  length?: number
  description?: string
  title?: string
  picture?: string
  permalink_url?: string
  created_time?: string
}

export type FacebookData = {
  page: {
    id: string
    name: string
    username?: string
    followers_count: number
    profile_picture_url?: string
    about?: string
    link: string
  }
  posts: FacebookPost[]
  videos?: FacebookVideo[]
  computed: {
    avgReactions: number
    avgComments: number
    avgEngagement: number
    postCount: number
    totalViews: number
  }
  fetchedAt: string
}

export function useFacebook() {
  const [data, setData] = useState<FacebookData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/facebook')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        if (json.error) throw new Error(json.error)
        setData(json as FacebookData)
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
