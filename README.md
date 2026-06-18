# TechVyro

**India's Leading Tech Content Creator Platform**

A modern, high-performance portfolio and brand collaboration platform built with Next.js 16, featuring real-time social media analytics, stunning animations, and seamless brand partnership tools.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Badfella3829/TechVyro-collb)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0-blue)](https://v0.app)

---

## Features

### Core Features
- **Real-time Social Analytics** - Live stats from YouTube, Instagram, and Facebook APIs
- **Brand Collaboration Portal** - Streamlined inquiry and booking system
- **Media Kit Generator** - Dynamic, downloadable media kits for brands
- **Multi-language Support** - English and Hindi translations

### UI/UX Enhancements
- **Custom Cursor System** - 5 interactive cursor modes (Constellation, Fountain Pen, Particles, Crosshair, Orbital)
- **Lenis Smooth Scroll** - Buttery smooth scrolling experience
- **3D Particle Backgrounds** - React Three Fiber powered visuals
- **Magnetic Buttons & 3D Tilt Cards** - Interactive hover effects
- **Spotlight Effect** - Cursor-following ambient glow
- **Sound Effects System** - Optional interaction sounds with Web Audio API
- **Animated Loading Screen** - Particle system with progress animation
- **Testimonials Carousel** - Auto-sliding with 3D card flip transitions

### Performance
- **Optimized API Caching** - Parallel fetching with stale-while-revalidate
- **Image Optimization** - Next.js Image component with lazy loading
- **Code Splitting** - Automatic route-based code splitting

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **3D Graphics** | Three.js, React Three Fiber, Drei |
| **UI Components** | Radix UI, shadcn/ui |
| **State Management** | Zustand, SWR |
| **Forms** | React Hook Form, Zod |
| **Email** | Nodemailer |
| **Smooth Scroll** | Lenis |
| **Analytics** | Vercel Analytics |

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) / npm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Badfella3829/TechVyro-collb.git
cd TechVyro-collb

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://techvyro.com
OWNER_EMAIL=your-email@gmail.com

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxx

# Instagram API
INSTAGRAM_USER_ID=your_instagram_user_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token

# Facebook API
FACEBOOK_PAGE_ID=your_facebook_page_id
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_page_access_token
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_RECIPIENT_NUMBER=recipient_number
NEXT_PUBLIC_WHATSAPP_NUMBER=public_whatsapp_number

# Admin
ADMIN_PASSWORD=your_admin_password
```

---

## Project Structure

```
techvyro/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (YouTube, Instagram, Facebook, etc.)
│   ├── analytics/         # Analytics dashboard pages
│   ├── blog/              # Blog pages
│   ├── case-studies/      # Case study pages
│   └── ...
├── components/
│   ├── effects/           # Visual effects (cursor, spotlight, parallax)
│   ├── hero/              # Hero section components
│   ├── navigation/        # Navbar and navigation
│   ├── portfolio/         # Portfolio/work showcase
│   ├── services/          # Services grid
│   ├── testimonials/      # Testimonials carousel
│   ├── ui/                # Reusable UI components
│   └── ...
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── public/                # Static assets
```

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/youtube` | Fetch YouTube channel stats and videos |
| `GET /api/instagram` | Fetch Instagram profile and media |
| `GET /api/facebook` | Fetch Facebook page stats and posts |
| `POST /api/contact` | Handle contact form submissions |
| `POST /api/newsletter` | Newsletter subscriptions |
| `GET /api/media-kit` | Generate downloadable media kit |

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Custom Domain Setup

1. Add domain in Vercel: Settings > Domains
2. Configure DNS in your domain provider:
   - A Record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`

---

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is private and proprietary. All rights reserved.

---

## Contact

**TechVyro** - [@techvyro](https://instagram.com/techvyro)

Website: [https://techvyro.com](https://techvyro.in)

Email: techvyro@gmail.com

---

<p align="center">
  <a href="https://v0.app/chat/projects/prj_PIBEl2OhqTCvsLTKO9HolWM0BkQ5">
    <img src="https://img.shields.io/badge/Continue%20on-v0.app-black?style=for-the-badge" alt="Continue on v0" />
  </a>
</p>
