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

// Realistic demo data when credentials aren't configured
function getYouTubeDemoData() {
  const videoTitles = [
    'iPhone 16 Pro Max Complete Review - Is It Worth It?',
    'MacBook Pro M4 vs M3 - Real World Performance Test',
    'Best Budget Smartphones Under 15000 in 2024',
    'Galaxy S24 Ultra Camera Deep Dive',
    'iPad Pro M4 - The Ultimate Tablet?',
    'AirPods Pro 3 Leaked Features',
    'OnePlus 13 First Impressions',
    'Best Wireless Earbuds 2024',
    'Pixel 9 Pro vs iPhone 16 Pro Camera Comparison',
    'Gaming Laptop Buying Guide 2024',
    'Apple Watch Ultra 3 Everything We Know',
    'Samsung Galaxy Fold 6 Durability Test',
    'Best Power Banks for Travel',
    'Xiaomi 14 Ultra Camera Review',
    'Tech Gadgets You NEED in 2024',
    'iPhone 16 Hidden Features',
    'Best Monitors for Productivity',
    'Realme GT 6 Gaming Review',
    'Nothing Phone 3 Leaks',
    'Smart Home Setup Tour 2024',
  ]
  
  return {
    channel: {
      id: 'demo-channel',
      title: 'TechVyro',
      description: 'Your go-to source for tech reviews, comparisons, and the latest gadget news. We help you make informed tech decisions.',
      customUrl: '@TechVyro',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop',
      subscribers: 287000,
      totalViews: 45200000,
      videoCount: 342,
      link: 'https://www.youtube.com/@TechVyro',
    },
    videos: videoTitles.map((title, i) => ({
      id: `demo-video-${i}`,
      title,
      description: `In this video we explore ${title.toLowerCase()}. Don't forget to like, subscribe and hit the bell icon!`,
      publishedAt: new Date(Date.now() - i * 3 * 86400000).toISOString(),
      thumbnail: `https://images.unsplash.com/photo-${[1611162617474, 1585792180666, 1517336714731, 1563203369, 1592899677].at(i % 5)}-w=640&h=360&fit=crop`,
      views: Math.floor(Math.random() * 800000) + 50000,
      likes: Math.floor(Math.random() * 25000) + 2000,
      comments: Math.floor(Math.random() * 1500) + 100,
      duration: i % 4 === 0 ? Math.floor(Math.random() * 55) + 15 : Math.floor(Math.random() * 900) + 180,
      permalink: `https://youtube.com/watch?v=demo-${i}`,
      isShort: i % 4 === 0,
    })),
    computed: {
      avgViews: 185000,
      avgLikes: 8500,
      avgEngagement: 4.82,
    },
    fetchedAt: new Date().toISOString(),
    isDemoData: true,
  }
}

export async function GET(req: Request) {
  const _u = new URL(req.url); const forceRefresh = _u.searchParams.has("refresh") || _u.searchParams.has("_t");
  const apiKey = process.env.YOUTUBE_API_KEY
  const channelId = process.env.YOUTUBE_CHANNEL_ID

  if (!apiKey || !channelId) {
    console.warn('[youtube-api] Credentials not configured, using demo data')
    return NextResponse.json(getYouTubeDemoData())
  }

  try {
    const cacheOptions = forceRefresh ? { cache: "no-store" as const } : { next: { revalidate: 3600 } }
    
    // Fetch channel and search in parallel for faster loading
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=viewCount&maxResults=20&type=video&key=${apiKey}`
    
    const [channelRes, searchRes] = await Promise.all([
      fetch(channelUrl, cacheOptions),
      fetch(searchUrl, cacheOptions),
    ])

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

    const searchJson = searchRes.ok ? await searchRes.json() : { items: [] }
    const videoIds: string[] = (searchJson.items || []).map((it: { id: { videoId: string } }) => it.id.videoId).filter(Boolean)

    let videos: YTVideo[] = []
    if (videoIds.length > 0) {
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(',')}&key=${apiKey}`
      const videosRes = await fetch(videosUrl, cacheOptions)
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

    const response = NextResponse.json({
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
    
    // Add cache headers for faster subsequent loads
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200')
    return response
  } catch (err) {
    console.error('[v0] YouTube API error:', err)
    return NextResponse.json(
      { error: 'YouTube API request failed', details: String(err) },
      { status: 500 }
    )
  }
}
