import { convertInrToUsd, formatCurrencyAmount, type Currency } from './pricing'

export interface QuoteCatalogItem {
  id: string
  name: string
  platform: 'YouTube' | 'Instagram' | 'Cross-Platform' | 'Add-On'
  description: string
  priceInr: number
  estViews: number
  turnaroundDays: number
  maxQty: number
  isAddon?: boolean
}

export const QUOTE_CATALOG: QuoteCatalogItem[] = [
  {
    id: 'yt-dedicated',
    name: 'Dedicated YouTube Video',
    platform: 'YouTube',
    description: '8–12 min deep-dive review, unboxing, or comparison video with pinned link.',
    priceInr: 25000,
    estViews: 110000,
    turnaroundDays: 6,
    maxQty: 5,
  },
  {
    id: 'yt-integration',
    name: 'YouTube Integrated Mention',
    platform: 'YouTube',
    description: '45–60 sec natural mid-roll brand shoutout inside an upcoming upload.',
    priceInr: 10000,
    estViews: 85000,
    turnaroundDays: 4,
    maxQty: 5,
  },
  {
    id: 'ig-reel',
    name: 'Instagram Reel (High-Reach)',
    platform: 'Instagram',
    description: '30–60 sec dynamic tech Reel optimized for Explore & viral shares.',
    priceInr: 8000,
    estViews: 140000,
    turnaroundDays: 3,
    maxQty: 10,
  },
  {
    id: 'yt-short',
    name: 'YouTube Short',
    platform: 'YouTube',
    description: 'Under 60s punchy vertical video for long-tail YouTube Shorts discovery.',
    priceInr: 8000,
    estViews: 95000,
    turnaroundDays: 3,
    maxQty: 10,
  },
  {
    id: 'ig-stories',
    name: 'Instagram Story Set (3 Frames)',
    platform: 'Instagram',
    description: 'Interactive poll/quiz stories with direct swipe-up link sticker.',
    priceInr: 3000,
    estViews: 28000,
    turnaroundDays: 1,
    maxQty: 10,
  },
  {
    id: 'ugc-pack',
    name: 'White-Label UGC Ad Cut',
    platform: 'Cross-Platform',
    description: 'Raw + edited high-converting ad creative for your paid Meta/YouTube ads.',
    priceInr: 12000,
    estViews: 0,
    turnaroundDays: 4,
    maxQty: 6,
  },
  {
    id: 'addon-usage',
    name: '90-Day Paid Ad Usage Rights',
    platform: 'Add-On',
    description: 'Full commercial whitelisting & paid amplification rights across channels.',
    priceInr: 7500,
    estViews: 0,
    turnaroundDays: 0,
    maxQty: 1,
    isAddon: true,
  },
  {
    id: 'addon-rush',
    name: '48-Hour Rush Priority Delivery',
    platform: 'Add-On',
    description: 'Priority shoot + edit slot for urgent product launches.',
    priceInr: 6000,
    estViews: 0,
    turnaroundDays: -2,
    maxQty: 1,
    isAddon: true,
  },
]

export type QuoteSelection = Record<string, number>

export interface QuoteSummaryLine {
  item: QuoteCatalogItem
  qty: number
  lineTotalInr: number
  lineViews: number
}

export interface QuoteSummary {
  lines: QuoteSummaryLine[]
  deliverableCount: number
  subtotalInr: number
  discountPercent: number
  discountAmountInr: number
  totalInr: number
  totalDisplay: string
  subtotalDisplay: string
  discountDisplay: string
  estimatedViews: number
  blendedCpmInr: number
  blendedCpmDisplay: string
  turnaroundDays: number
}

export const DEFAULT_QUOTE_SELECTION: QuoteSelection = {
  'yt-dedicated': 1,
  'ig-reel': 2,
  'ig-stories': 1,
}

export function calculateQuoteSummary(
  selection: QuoteSelection,
  currency: Currency = 'INR'
): QuoteSummary {
  const lines: QuoteSummaryLine[] = []
  let deliverableCount = 0
  let subtotalInr = 0
  let estimatedViews = 0
  let baseDays = 0
  let hasRush = false

  for (const item of QUOTE_CATALOG) {
    const rawQty = selection[item.id] ?? 0
    const qty = Math.max(0, Math.min(item.maxQty, Math.floor(rawQty)))
    if (qty <= 0) continue

    const lineTotalInr = item.priceInr * qty
    const lineViews = item.estViews * qty
    lines.push({ item, qty, lineTotalInr, lineViews })
    subtotalInr += lineTotalInr
    estimatedViews += lineViews

    if (!item.isAddon) {
      deliverableCount += qty
      baseDays = Math.max(baseDays, item.turnaroundDays) + (qty > 1 ? Math.min(qty - 1, 3) : 0)
    } else if (item.id === 'addon-rush') {
      hasRush = true
    }
  }

  let discountPercent = 0
  if (deliverableCount >= 5) {
    discountPercent = 15
  } else if (deliverableCount >= 3) {
    discountPercent = 10
  }

  const discountAmountInr = Math.round((subtotalInr * discountPercent) / 100)
  const totalInr = Math.max(0, subtotalInr - discountAmountInr)

  const blendedCpmInr =
    estimatedViews > 0 ? Math.round((totalInr / estimatedViews) * 1000) : 0

  const turnaroundDays =
    lines.length === 0 ? 0 : Math.max(2, hasRush ? Math.min(baseDays || 2, 2) : baseDays || 2)

  const fmt = (inr: number) =>
    formatCurrencyAmount(currency === 'USD' ? convertInrToUsd(inr) : inr, currency)

  const cpmAmount =
    currency === 'USD'
      ? Math.max(1, Math.round((blendedCpmInr / 84) * 10) / 10)
      : blendedCpmInr

  return {
    lines,
    deliverableCount,
    subtotalInr,
    discountPercent,
    discountAmountInr,
    totalInr,
    totalDisplay: fmt(totalInr),
    subtotalDisplay: fmt(subtotalInr),
    discountDisplay: fmt(discountAmountInr),
    estimatedViews,
    blendedCpmInr,
    blendedCpmDisplay:
      estimatedViews > 0
        ? currency === 'USD'
          ? `$${cpmAmount.toFixed(1)}`
          : `₹${blendedCpmInr.toLocaleString('en-IN')}`
        : '—',
    turnaroundDays,
  }
}

export function encodeQuoteToQuery(
  selection: QuoteSelection,
  currency: Currency,
  brandName = ''
): string {
  const params = new URLSearchParams()
  const pairs: string[] = []

  for (const item of QUOTE_CATALOG) {
    const qty = Math.max(0, Math.min(item.maxQty, Math.floor(selection[item.id] ?? 0)))
    if (qty > 0) {
      pairs.push(`${item.id}:${qty}`)
    }
  }

  if (pairs.length > 0) {
    params.set('qitems', pairs.join(','))
  }
  params.set('qcur', currency)
  const trimmedBrand = brandName.trim().slice(0, 80)
  if (trimmedBrand) {
    params.set('qbrand', trimmedBrand)
  }

  return params.toString()
}

export function decodeQuoteFromQuery(
  search: string | URLSearchParams
): { selection: QuoteSelection | null; currency: Currency; brandName: string } {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search
  const rawItems = params.get('qitems')
  const rawCur = params.get('qcur')
  const brandName = (params.get('qbrand') || '').trim().slice(0, 80)
  const currency: Currency = rawCur === 'USD' ? 'USD' : 'INR'

  if (!rawItems) {
    return { selection: null, currency, brandName }
  }

  const validMap = new Map(QUOTE_CATALOG.map((item) => [item.id, item]))
  const selection: QuoteSelection = {}

  for (const token of rawItems.split(',')) {
    const [id, qtyStr] = token.split(':')
    const item = validMap.get(id)
    const parsedQty = Number.parseInt(qtyStr, 10)
    if (item && Number.isFinite(parsedQty) && parsedQty > 0) {
      selection[id] = Math.min(item.maxQty, parsedQty)
    }
  }

  return {
    selection: Object.keys(selection).length > 0 ? selection : null,
    currency,
    brandName,
  }
}

export function formatViewsCompact(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(2)}M`
  if (views >= 1_000) return `${Math.round(views / 1_000)}K`
  return views.toString()
}
