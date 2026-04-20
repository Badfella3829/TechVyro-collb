import { NextResponse } from 'next/server'

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

export async function GET(req: Request) {
  const url = new URL(req.url)
  const forceRefresh = url.searchParams.has('refresh') || url.searchParams.has('_t')
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!token || !userId) {
    return NextResponse.json(
      { error: 'Instagram credentials not configured' },
      { status: 500 }
    )
  }

  try {
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
      return NextResponse.json(
        { error: 'Instagram account fetch failed', details: text },
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
    return NextResponse.json(
      { error: 'Instagram API request failed', details: String(err) },
      { status: 500 }
    )
  }
}
