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
  media_url?: string
  thumbnail_url?: string
  permalink: string
  caption?: string
  timestamp: string
  like_count?: number
  comments_count?: number
}

export async function GET() {
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
    const mediaFields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count'
    const mediaUrl = `https://graph.instagram.com/v23.0/${userId}/media?fields=${mediaFields}&limit=12&access_token=${token}`

    const [accountRes, mediaRes] = await Promise.all([
      fetch(accountUrl, { next: { revalidate: 3600 } }),
      fetch(mediaUrl, { next: { revalidate: 3600 } }),
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
    if (media.length > 0) {
      const totalLikes = media.reduce((s, m) => s + (m.like_count || 0), 0)
      const totalComments = media.reduce((s, m) => s + (m.comments_count || 0), 0)
      avgLikes = Math.round(totalLikes / media.length)
      avgComments = Math.round(totalComments / media.length)
      if (account.followers_count > 0) {
        avgEngagement = ((avgLikes + avgComments) / account.followers_count) * 100
      }
    }

    return NextResponse.json({
      account,
      media,
      computed: {
        avgLikes,
        avgComments,
        avgEngagement: Number(avgEngagement.toFixed(2)),
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
