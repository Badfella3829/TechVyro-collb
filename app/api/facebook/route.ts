import { NextResponse } from 'next/server'

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
}

export async function GET() {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  const pageId = process.env.FACEBOOK_PAGE_ID

  if (!token || !pageId) {
    return NextResponse.json(
      { error: 'Facebook credentials not configured' },
      { status: 500 }
    )
  }

  try {
    const pageFields = 'id,name,username,fan_count,followers_count,picture.width(300),about,link'
    const pageUrl = `https://graph.facebook.com/v23.0/${pageId}?fields=${pageFields}&access_token=${token}`

    const postFields = 'id,message,story,created_time,permalink_url,full_picture,attachments{type,media,url,title},reactions.summary(true),comments.summary(true),shares'
    const postsUrl = `https://graph.facebook.com/v23.0/${pageId}/posts?fields=${postFields}&limit=50&access_token=${token}`

    const [pageRes, postsRes] = await Promise.all([
      fetch(pageUrl, { next: { revalidate: 3600 } }),
      fetch(postsUrl, { next: { revalidate: 3600 } }),
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
    if (posts.length > 0) {
      const totalReactions = posts.reduce((s, p) => s + (p.reactions?.summary?.total_count || 0), 0)
      const totalComments = posts.reduce((s, p) => s + (p.comments?.summary?.total_count || 0), 0)
      avgReactions = Math.round(totalReactions / posts.length)
      avgComments = Math.round(totalComments / posts.length)
      if (followers > 0) {
        avgEngagement = ((avgReactions + avgComments) / followers) * 100
      }
    }

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
      computed: {
        avgReactions,
        avgComments,
        avgEngagement: Number(avgEngagement.toFixed(2)),
        postCount: posts.length,
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
