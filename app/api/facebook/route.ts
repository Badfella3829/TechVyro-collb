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

// Demo data for development/preview when credentials aren't configured
function getFacebookDemoData() {
  return {
    page: {
      id: 'demo-123',
      name: 'TechVyro Digital',
      username: 'techvyro',
      followers_count: 28500,
      profile_picture_url: 'https://images.unsplash.com/photo-1611339555312-e607c04352fa?w=300&h=300&fit=crop',
      about: 'Digital marketing agency specializing in YouTube, Instagram, and Facebook growth strategies.',
      link: 'https://www.facebook.com/techvyro',
    },
    posts: Array.from({ length: 50 }, (_, i) => ({
      id: `demo-post-${i}`,
      message: `Demo post #${i + 1} - Digital marketing strategies and insights from our team.`,
      created_time: new Date(Date.now() - i * 86400000).toISOString(),
      permalink_url: `https://facebook.com/techvyro/posts/${i}`,
      reactions: { summary: { total_count: Math.floor(Math.random() * 800) + 150 } },
      comments: { summary: { total_count: Math.floor(Math.random() * 120) + 20 } },
      shares: { count: Math.floor(Math.random() * 80) + 10 },
    })),
    videos: Array.from({ length: 50 }, (_, i) => ({
      id: `demo-video-${i}`,
      views: Math.floor(Math.random() * 150000) + 20000,
      length: Math.floor(Math.random() * 900) + 120,
      title: `Digital Marketing Tutorial #${i + 1}`,
      description: `Learn how to grow your business using digital marketing strategies. Part ${i + 1} in our series.`,
      picture: `https://images.unsplash.com/photo-${[1611339555312, 1560593676, 1552664730, 1633356715].at(i % 4)}-w=500&h=500&fit=crop`,
      permalink_url: `https://facebook.com/techvyro/videos/${i}`,
      created_time: new Date(Date.now() - i * 86400000).toISOString(),
    })),
    computed: {
      avgReactions: 420,
      avgComments: 68,
      avgEngagement: 4.83,
      postCount: 50,
      totalViews: 3250000,
    },
    fetchedAt: new Date().toISOString(),
    isDemoData: true,
  }
}

export async function GET(req: Request) {
  const _u = new URL(req.url)
  const forceRefresh = _u.searchParams.has("refresh") || _u.searchParams.has("_t")
  
  try {
    // Prefer the never-expiring page token saved via /admin's Token Manager (falls back to env var).
    const token = await getFacebookToken()
    const pageId = process.env.FACEBOOK_PAGE_ID

    if (!token || !pageId) {
      console.warn('[facebook-api] Credentials not configured, using demo data. To use real Facebook data, add FACEBOOK_PAGE_ID and Facebook token via Admin panel.')
      // Return demo data in development
      return NextResponse.json(getFacebookDemoData())
    }

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
          console.error('[facebook-api] Token expired:', errorJson)
          return NextResponse.json(
            { error: 'Facebook token expired. Please refresh it in Admin panel.', details: errorDetails },
            { status: 401 }
          )
        }
      } catch {
        errorDetails = await pageRes.text()
      }
      console.error('[facebook-api] Page fetch failed:', pageRes.status, errorDetails)
      return NextResponse.json(
        { error: `Facebook API error: ${pageRes.status}. Please check your token.`, details: errorDetails },
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
    console.error('[facebook-api] Request failed:', err)
    return NextResponse.json(
      { error: 'Facebook API request failed', details: String(err) },
      { status: 500 }
    )
  }
}
