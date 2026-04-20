import { NextResponse } from 'next/server'

export const revalidate = 3600

type YTChannel = {
  id: string
  snippet: {
    title: string
    description?: string
    customUrl?: string
    thumbnails?: { high?: { url: string }; medium?: { url: string }; default?: { url: string } }
  }
  statistics: {
    viewCount: string
    subscriberCount: string
    videoCount: string
  }
}

type YTVideo = {
  id: string
  snippet: {
    title: string
    description?: string
    publishedAt: string
    thumbnails?: { high?: { url: string }; medium?: { url: string }; maxres?: { url: string } }
  }
  statistics: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
  contentDetails?: {
    duration?: string
  }
}

function parseDuration(iso?: string): number | null {
  if (!iso) return null
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return null
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  return h * 3600 + m * 60 + s
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY
  const channelId = process.env.YOUTUBE_CHANNEL_ID

  if (!apiKey || !channelId) {
    return NextResponse.json(
      { error: 'YouTube credentials not configured' },
      { status: 500 }
    )
  }

  try {
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`
    const channelRes = await fetch(channelUrl, { next: { revalidate: 3600 } })

    if (!channelRes.ok) {
      const text = await channelRes.text()
      return NextResponse.json(
        { error: 'YouTube channel fetch failed', details: text },
        { status: channelRes.status }
      )
    }

    const channelJson = await channelRes.json()
    const channel: YTChannel = channelJson.items?.[0]
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    // Get most popular videos via search (ordered by viewCount)
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=viewCount&maxResults=20&type=video&key=${apiKey}`
    const searchRes = await fetch(searchUrl, { next: { revalidate: 3600 } })
    const searchJson = searchRes.ok ? await searchRes.json() : { items: [] }
    const videoIds: string[] = (searchJson.items || []).map((it: { id: { videoId: string } }) => it.id.videoId).filter(Boolean)

    let videos: YTVideo[] = []
    if (videoIds.length > 0) {
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(',')}&key=${apiKey}`
      const videosRes = await fetch(videosUrl, { next: { revalidate: 3600 } })
      if (videosRes.ok) {
        const videosJson = await videosRes.json()
        videos = videosJson.items || []
      }
    }

    const subscribers = parseInt(channel.statistics.subscriberCount) || 0
    const totalViews = parseInt(channel.statistics.viewCount) || 0
    const videoCount = parseInt(channel.statistics.videoCount) || 0

    let avgViews = 0
    let avgLikes = 0
    let avgEngagement = 0
    if (videos.length > 0) {
      const totalV = videos.reduce((s, v) => s + parseInt(v.statistics.viewCount || '0'), 0)
      const totalL = videos.reduce((s, v) => s + parseInt(v.statistics.likeCount || '0'), 0)
      const totalC = videos.reduce((s, v) => s + parseInt(v.statistics.commentCount || '0'), 0)
      avgViews = Math.round(totalV / videos.length)
      avgLikes = Math.round(totalL / videos.length)
      if (subscribers > 0) {
        avgEngagement = ((totalL + totalC) / videos.length / subscribers) * 100
      }
    }

    return NextResponse.json({
      channel: {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        customUrl: channel.snippet.customUrl,
        thumbnail: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
        subscribers,
        totalViews,
        videoCount,
        link: channel.snippet.customUrl
          ? `https://www.youtube.com/${channel.snippet.customUrl}`
          : `https://www.youtube.com/channel/${channel.id}`,
      },
      videos: videos.map((v) => {
        const dur = parseDuration(v.contentDetails?.duration)
        return {
          id: v.id,
          title: v.snippet.title,
          description: v.snippet.description,
          publishedAt: v.snippet.publishedAt,
          thumbnail: v.snippet.thumbnails?.maxres?.url || v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.medium?.url,
          views: parseInt(v.statistics.viewCount || '0'),
          likes: parseInt(v.statistics.likeCount || '0'),
          comments: parseInt(v.statistics.commentCount || '0'),
          duration: dur,
          permalink: `https://www.youtube.com/watch?v=${v.id}`,
          isShort: dur !== null && dur > 0 && dur <= 60,
        }
      }),
      computed: {
        avgViews,
        avgLikes,
        avgEngagement: Number(avgEngagement.toFixed(2)),
      },
      fetchedAt: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'YouTube API request failed', details: String(err) },
      { status: 500 }
    )
  }
}
