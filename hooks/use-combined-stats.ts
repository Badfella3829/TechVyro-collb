"use client"

// Static stats — no live API calls. Edit these numbers anytime to match real figures.

const IG_FOLLOWERS = 420000
const FB_FOLLOWERS = 180000
const YT_SUBS = 250000

const IG_MEDIA_COUNT = 640
const FB_POST_COUNT = 380
const YT_VIDEO_COUNT = 210

const IG_TOTAL_VIEWS = 48000000
const FB_TOTAL_VIEWS = 22000000
const YT_TOTAL_VIEWS = 95000000

const IG_AVG_LIKES = 38000
const IG_AVG_ENGAGEMENT = 9.1
const FB_AVG_ENGAGEMENT = 6.7
const YT_AVG_ENGAGEMENT = 7.4

const ig = {
  account: { followers_count: IG_FOLLOWERS, media_count: IG_MEDIA_COUNT, username: 'techvyro' },
  computed: {
    totalViews: IG_TOTAL_VIEWS,
    avgViews: Math.round(IG_TOTAL_VIEWS / IG_MEDIA_COUNT),
    avgLikes: IG_AVG_LIKES,
    avgEngagement: IG_AVG_ENGAGEMENT,
  },
  posts: [] as unknown[],
  fetchedAt: Date.now(),
}

const fb = {
  page: { followers_count: FB_FOLLOWERS, link: 'https://facebook.com/techvyroclips' },
  posts: [] as unknown[],
  computed: {
    postCount: FB_POST_COUNT,
    totalViews: FB_TOTAL_VIEWS,
    avgViews: Math.round(FB_TOTAL_VIEWS / FB_POST_COUNT),
    avgEngagement: FB_AVG_ENGAGEMENT,
  },
  fetchedAt: Date.now(),
}

const yt = {
  channel: { subscribers: YT_SUBS, videoCount: YT_VIDEO_COUNT, totalViews: YT_TOTAL_VIEWS, link: 'https://youtube.com/@techvyro' },
  videos: [] as unknown[],
  computed: {
    avgViews: Math.round(YT_TOTAL_VIEWS / YT_VIDEO_COUNT),
    avgEngagement: YT_AVG_ENGAGEMENT,
  },
  fetchedAt: Date.now(),
}

export function useCombinedStats() {
  const totalFollowers = IG_FOLLOWERS + FB_FOLLOWERS + YT_SUBS
  const totalContent = IG_MEDIA_COUNT + FB_POST_COUNT + YT_VIDEO_COUNT
  const totalViews = IG_TOTAL_VIEWS + FB_TOTAL_VIEWS + YT_TOTAL_VIEWS

  return {
    ig,
    fb,
    yt,
    loading: false,
    ready: true,
    totals: {
      followers: totalFollowers,
      content: totalContent,
      youtubeViews: YT_TOTAL_VIEWS,
      igViews: IG_TOTAL_VIEWS,
      fbViews: FB_TOTAL_VIEWS,
      totalViews,
      igFollowers: IG_FOLLOWERS,
      fbFollowers: FB_FOLLOWERS,
      ytSubs: YT_SUBS,
      igPosts: IG_MEDIA_COUNT,
      fbPosts: FB_POST_COUNT,
      ytVideos: YT_VIDEO_COUNT,
    },
  }
}

export function formatBig(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}
