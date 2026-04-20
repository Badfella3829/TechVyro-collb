"use client"

import { useInstagram } from './use-instagram'
import { useFacebook } from './use-facebook'
import { useYouTube } from './use-youtube'

export function useCombinedStats() {
  const { data: ig, loading: igLoading } = useInstagram()
  const { data: fb, loading: fbLoading } = useFacebook()
  const { data: yt, loading: ytLoading } = useYouTube()

  const igFollowers = ig?.account.followers_count ?? 0
  const fbFollowers = fb?.page.followers_count ?? 0
  const ytSubs = yt?.channel.subscribers ?? 0
  const totalFollowers = igFollowers + fbFollowers + ytSubs

  const igPosts = ig?.account.media_count ?? 0
  const fbPosts = fb?.computed.postCount ?? fb?.posts.length ?? 0
  const ytVideos = yt?.channel.videoCount ?? 0
  const totalContent = igPosts + fbPosts + ytVideos

  const ytTotalViews = yt?.channel.totalViews ?? 0
  const igTotalViews = ig?.computed.totalViews ?? 0
  const fbTotalViews = fb?.computed.totalViews ?? 0
  const totalViews = ytTotalViews + igTotalViews + fbTotalViews

  const ready = !!ig && !!fb && !!yt
  const loading = igLoading || fbLoading || ytLoading

  return {
    ig,
    fb,
    yt,
    loading,
    ready,
    totals: {
      followers: totalFollowers,
      content: totalContent,
      youtubeViews: ytTotalViews,
      igViews: igTotalViews,
      fbViews: fbTotalViews,
      totalViews,
      igFollowers,
      fbFollowers,
      ytSubs,
      igPosts,
      fbPosts,
      ytVideos,
    },
  }
}

export function formatBig(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}
