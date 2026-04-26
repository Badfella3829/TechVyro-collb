import { NextResponse } from 'next/server'
import { getFacebookToken } from '@/lib/token-store'

export const revalidate = 3600

type FBPage = {
  id: string
  name: string
  username?: string
  fan_count?: number
  followers_count?: number
  picture?: { data: { url: string } }
  about?: string
  link?: string
}

type FBPost = {
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
  insights?: {
    data?: Array<{
      name?: string
      values?: Array<{ value?: number }>
    }>
  }
}

export async function GET(req: Request) {
  const _u = new URL(req.url); const forceRefresh = _u.searchParams.has("refresh") || _u.searchParams.has("_t");
  // Prefer the never-expiring page token saved via /admin's Token Manager (falls back to env var).
  const token = await getFacebookToken()
  const pageId = process.env.FACEBOOK_PAGE_ID

  if (!token || !pageId) {
    // Return placeholder data when credentials not configured
    return NextResponse.json({
      page: {
        id: '',
        name: 'TechVyro',
        username: 'techvyro',
        followers_count: 0,
        profile_picture_url: '/images/techvyro-icon.jpg',
        about: 'Tech Content Creator',
        link: 'https://www.facebook.com/techvyro',
      },
      posts: [],
      videos: [],
      computed: {
        avgReactions: 0,
        avgComments: 0,
        avgEngagement: 0,
        postCount: 0,
        totalViews: 0,
      },
      fetchedAt: new Date().toISOString(),
      isPlaceholder: true,
    })
  }

  try {
    const pageFields = 'id,name,username,fan_count,followers_count,picture.width(300),about,link'
    const pageUrl = `https://graph.facebook.com/v23.0/${pageId}?fields=${pageFields}&access_token=${token}`

    const postFields = 'id,message,story,created_time,permalink_url,full_picture,attachments{type,media,url,title,subattachments},reactions.summary(true),comments.summary(true),shares'
    const postsUrl = `https://graph.facebook.com/v23.0/${pageId}/posts?fields=${postFields}&limit=50&access_token=${token}`

    const [pageRes, postsRes] = await Promise.all([
      fetch(pageUrl, forceRefresh ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
      fetch(postsUrl, forceRefresh ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
    ])

    if (!pageRes.ok) {
      const text = await pageRes.text()
      return NextResponse.json(
        { error: 'Facebook page fetch failed', details: text },
        { status: pageRes.status }
      )
    }

    const page: FBPage = await pageRes.json()
    const postsJson = postsRes.ok ? await postsRes.json() : { data: [] }
    const posts: FBPost[] = postsJson.data || []

    const followers = page.followers_count || page.fan_count || 0

    let avgReactions = 0
    let avgComments = 0
    let avgEngagement = 0
    let totalViews = 0
    if (posts.length > 0) {
      const totalReactions = posts.reduce((s, p) => s + (p.reactions?.summary?.total_count || 0), 0)
      const totalComments = posts.reduce((s, p) => s + (p.comments?.summary?.total_count || 0), 0)
      avgReactions = Math.round(totalReactions / posts.length)
      avgComments = Math.round(totalComments / posts.length)
      if (followers > 0) {
        avgEngagement = ((avgReactions + avgComments) / followers) * 100
      }
    }

    // Fetch video list with view counts (works without read_insights)
    let videos: Array<{
      id: string
      views?: number
      length?: number
      description?: string
      title?: string
      picture?: string
      permalink_url?: string
      created_time?: string
    }> = []
    try {
      const videosUrl = `https://graph.facebook.com/v23.0/${pageId}/videos?fields=id,views,length,description,title,picture,permalink_url,created_time&limit=100&access_token=${token}`
      const vRes = await fetch(videosUrl, forceRefresh ? { cache: "no-store" } : { next: { revalidate: 3600 } })
      if (vRes.ok) {
        const vJson = await vRes.json()
        videos = vJson.data || []
        totalViews = videos.reduce((s, v) => s + (v.views || 0), 0)
      }
    } catch {}

    return NextResponse.json({
      page: {
        id: page.id,
        name: page.name,
        username: page.username,
        followers_count: followers,
        profile_picture_url: page.picture?.data?.url,
        about: page.about,
        link: page.link || `https://www.facebook.com/${page.username || page.id}`,
      },
      posts,
      videos,
      computed: {
        avgReactions,
        avgComments,
        avgEngagement: Number(avgEngagement.toFixed(2)),
        postCount: posts.length,
        totalViews,
      },
      fetchedAt: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Facebook API request failed', details: String(err) },
      { status: 500 }
    )
  }
}
