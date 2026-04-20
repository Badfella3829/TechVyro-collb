# TechVyro - Tech Content Creator Portfolio

## Overview
Portfolio/landing site for TechVyro, India's premier tech content creator. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and shadcn/ui components.

## Stack
- **Framework**: Next.js 16.2.0 (Turbopack dev server)
- **React**: 19
- **Styling**: Tailwind CSS v4, tw-animate-css
- **UI Components**: Radix UI primitives via shadcn/ui
- **3D**: React Three Fiber + Three.js
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Package Manager**: pnpm

## Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - UI and feature components (hero, navigation, packages, portfolio, testimonials, etc.)
- `hooks/` - Custom React hooks
- `lib/` - Utility functions
- `public/` - Static assets (images, videos)
- `styles/` - Global styles

## Running the App
The dev server runs on port 5000 via the "Start application" workflow:
```
pnpm run dev   # next dev -p 5000 -H 0.0.0.0
pnpm run build # next build
pnpm run start # next start -p 5000 -H 0.0.0.0
```

## Social Media Integrations
Three live social platforms power Stats and Portfolio sections with real data:

### Instagram (@techvyro)
- Route: `app/api/instagram/route.ts`, hook: `hooks/use-instagram.ts`
- Secrets: `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID` (17841477897296650)
- Pulls account stats (24,755 followers, 216 posts) + media (top 24 by likes+comments)
- Token expires in 60 days — regenerate via Meta Graph API Explorer

### Facebook (TechVyro Page)
- Route: `app/api/facebook/route.ts`, hook: `hooks/use-facebook.ts`
- Secrets: `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID` (900912436441260)
- Pulls page stats (14,349 followers) + 50 posts with reactions/comments/shares
- Page is NPE (New Pages Experience) — must query page directly, not via /me/accounts
- Token expires in 60 days

### YouTube (@techvyro)
- Route: `app/api/youtube/route.ts`, hook: `hooks/use-youtube.ts`
- Secrets: `YOUTUBE_API_KEY` (Google Cloud), `YOUTUBE_CHANNEL_ID` (UCWZiZ6zovp7MZWkA0eJmGRA)
- Uses YouTube Data API v3 — channels + search (order=viewCount) + videos endpoints
- 2,440 subscribers, 349,597 total views, 54 videos
- Detects Shorts via ISO 8601 duration ≤ 60s
- API key is permanent (no expiry); free tier = 10,000 units/day

### Stats Section (`components/stats/stats-section.tsx`)
- Total Followers = IG + FB + YT subscribers combined
- YouTube Views card shows total channel views
- Total Content = IG posts + YT videos
- Platform breakdown: 3 cards (pink IG, blue FB, red YT)

### Portfolio Section (`components/portfolio/portfolio-section.tsx`)
- Two-row tabs: Platform (All/IG/FB/YT) + Type (Top/Reels-Shorts/Posts-Long Videos)
- Unified item cards with platform-colored badges, rank badges for top 3
- Sort score: views (YT) or (likes+comments)*10 (IG/FB) for cross-platform ranking
- Detail modal shows views/likes/comments/shares as available

## Notes
- Vercel Analytics is included but only activates in `NODE_ENV=production`
- `metadataBase` warning is expected in dev; set it in `app/layout.tsx` for production OG images
- Images are unoptimized (configured in `next.config.mjs`)
- Plain `<img>` tags used for social CDN thumbnails (avoids next/image remotePatterns config)
