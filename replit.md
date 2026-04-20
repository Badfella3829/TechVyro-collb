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

## Notes
- Vercel Analytics is included but only activates in `NODE_ENV=production`
- `metadataBase` warning is expected in dev; set it in `app/layout.tsx` for production OG images
- Images are unoptimized (configured in `next.config.mjs`)
