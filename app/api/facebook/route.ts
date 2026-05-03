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
    return NextResponse.json(
      { error: 'Facebook credentials not configured' },
      { status: 500 }
    )
  }

  try {
    const cacheOptions = forceRefresh ? { cache: "no-store" as const } : { next: { revalidate: 3600 } }
    
    const pageFields = 'id,name,username,fan_count,followers_count,picture.width(300),about,link'
    const pageUrl = `https://graph.facebook.com/v23.0/${pageId}?fields=${pageFields}&access_token=${token}`

    const postFields = 'id,message,story,created_time,permalink_url,full_picture,attachments{type,media,url,title,subattachments},reactions.summary(true),comments.summary(true),shares'
    const postsUrl = `https://graph.facebook.com/v23.0/${pageId}/posts?fields=${postFields}&limit=50&access_token=${token}`
    
    const videosUrl = `https://graph.facebook.com/v23.0/${pageId}/videos?fields=id,views,length,description,title,picture,permalink_url,created_time&limit=100&access_token=${token}`

    // Fetch all 3 in parallel for faster loading
    const [pageRes, postsRes, videosRes] = await Promise.all([
      fetch(pageUrl, cacheOptions),
      fetch(postsUrl, cacheOptions),
      fetch(videosUrl, cacheOptions),
    ])

    // Check all responses for errors
    if (!pageRes.ok) {
      let errorDetails = ''
      try {
        const errorJson = await pageRes.json()
        errorDetails = JSON.stringify(errorJson)
        // Check for token expiration
        if (errorJson?.error?.code === 190 || errorJson?.error?.message?.includes('expired')) {
          return NextResponse.json(
            { error: 'Facebook token expired. Please refresh it in Admin panel.', details: errorDetails },
            { status: 401 }
          )
        }
      } catch {
        errorDetails = await pageRes.text()
      }
      return NextResponse.json(
        { error: 'Facebook page fetch failed', details: errorDetails },
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

    // Parse video data from parallel fetch
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
    if (videosRes.ok) {
      const vJson = await videosRes.json()
      videos = vJson.data || []
      totalViews = videos.reduce((s, v) => s + (v.views || 0), 0)
    }

    const response = NextResponse.json({
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
    
    // Add cache headers for faster subsequent loads
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200')
    return response
  } catch (err) {
    return NextResponse.json(
      { error: 'Facebook API request failed', details: String(err) },
      { status: 500 }
    )
  }
}
