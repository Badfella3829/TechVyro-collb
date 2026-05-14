import { NextResponse } from 'next/server'
import { getInstagramToken, maybeRefreshInstagramToken } from '@/lib/token-store'

export const revalidate = 3600

type IGAccount = {
  username: string
  followers_count: number
  media_count: number
  profile_picture_url?: string
  biography?: string
  name?: string
}

type IGMedia = {
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

// Demo data for development/preview when credentials aren't configured
function getDemoData() {
  return {
    account: {
      username: 'techvyro_official',
      followers_count: 15400,
      media_count: 287,
      profile_picture_url: 'https://images.unsplash.com/photo-1611339555312-e607c04352fa?w=200&h=200&fit=crop',
      name: 'TechVyro',
      biography: 'Digital marketing & tech growth experts. Scaling brands across YouTube, Instagram & Facebook.',
    },
    media: Array.from({ length: 50 }, (_, i) => ({
      id: `demo-${i}`,
      media_type: i % 3 === 0 ? 'VIDEO' : 'IMAGE',
      media_product_type: i % 3 === 0 ? 'REELS' : 'FEED',
      media_url: `https://images.unsplash.com/photo-${[1572635148220, 1561070791, 1460925895917, 1552664730, 1633356715].at(i % 5)}-w=500&h=500&fit=crop`,
      thumbnail_url: `https://images.unsplash.com/photo-${[1572635148220, 1561070791, 1460925895917, 1552664730, 1633356715].at(i % 5)}-w=500&h=500&fit=crop`,
      permalink: `https://instagram.com/p/demo-${i}`,
      caption: `Demo post #${i + 1} - Check our latest insights on digital marketing trends!`,
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      like_count: Math.floor(Math.random() * 2000) + 300,
      comments_count: Math.floor(Math.random() * 150) + 20,
      view_count: Math.floor(Math.random() * 50000) + 5000,
    })),
    computed: {
      avgLikes: 850,
      avgComments: 62,
      avgEngagement: 5.67,
      totalViews: 1250000,
    },
    fetchedAt: new Date().toISOString(),
    isDemoData: true,
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const forceRefresh = url.searchParams.has('refresh') || url.searchParams.has('_t')
  
  try {
    // Auto-extend the long-lived token if it's nearing expiry (>50 days old).
    // This makes the IG token effectively permanent as long as the API is hit at least once every ~10 days.
    await maybeRefreshInstagramToken()
    const token = await getInstagramToken()
    const userId = process.env.INSTAGRAM_USER_ID

    if (!token || !userId) {
      console.warn('[instagram-api] Credentials not configured, using demo data. To use real Instagram data, add INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN.')
      // Return demo data in development
      return NextResponse.json(getDemoData())
    }

    const accountFields = 'username,followers_count,media_count,profile_picture_url,biography,name'
    const accountUrl = `https://graph.instagram.com/v23.0/${userId}?fields=${accountFields}&access_token=${token}`
    const mediaFields = 'id,media_type,media_product_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count,view_count'
    const mediaUrl = `https://graph.instagram.com/v23.0/${userId}/media?fields=${mediaFields}&limit=50&access_token=${token}`

    const [accountRes, mediaRes] = await Promise.all([
      fetch(accountUrl, forceRefresh ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
      fetch(mediaUrl, forceRefresh ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
    ])

    if (!accountRes.ok) {
      const text = await accountRes.text()
      console.error('[instagram-api] Account fetch failed:', accountRes.status, text)
      return NextResponse.json(
        { error: `Instagram API error: ${accountRes.status}. Token may be expired or invalid.`, details: text },
        { status: accountRes.status }
      )
    }

    const account: IGAccount = await accountRes.json()
    const mediaJson = mediaRes.ok ? await mediaRes.json() : { data: [] }
    const media: IGMedia[] = mediaJson.data || []

    let avgEngagement = 0
    let avgLikes = 0
    let avgComments = 0
    let totalViews = 0
    if (media.length > 0) {
      const totalLikes = media.reduce((s, m) => s + (m.like_count || 0), 0)
      const totalComments = media.reduce((s, m) => s + (m.comments_count || 0), 0)
      avgLikes = Math.round(totalLikes / media.length)
      avgComments = Math.round(totalComments / media.length)
      if (account.followers_count > 0) {
        avgEngagement = ((avgLikes + avgComments) / account.followers_count) * 100
      }

      // Fetch view insights for each REELS media (parallel)
      const reels = media.filter((m) => m.media_product_type === 'REELS')
      const insightResults = await Promise.allSettled(
        reels.map((m) =>
          fetch(
            `https://graph.instagram.com/v23.0/${m.id}/insights?metric=views&access_token=${token}`,
            { next: { revalidate: 3600 } }
          ).then((r) => (r.ok ? r.json() : null))
        )
      )
      let reelViews = 0
      insightResults.forEach((res, i) => {
        if (res.status === 'fulfilled' && res.value?.data) {
          const v = res.value.data.find((d: { name?: string }) => d.name === 'views')
          const count = v?.values?.[0]?.value || 0
          reelViews += count
          if (reels[i]) reels[i].view_count = count
        }
      })
      totalViews = reelViews
    }

    return NextResponse.json({
      account,
      media,
      computed: {
        avgLikes,
        avgComments,
        avgEngagement: Number(avgEngagement.toFixed(2)),
        totalViews,
      },
      fetchedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[instagram-api] Request failed:', err)
    return NextResponse.json(
      { error: 'Instagram API request failed', details: String(err) },
      { status: 500 }
    )
  }
}
