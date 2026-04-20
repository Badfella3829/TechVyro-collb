import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600

type Insights = {
  ok: boolean
  source: 'facebook-page-insights' | 'unavailable'
  totalFans?: number
  countries?: { code: string; count: number }[]
  cities?: { name: string; count: number }[]
  gender?: { label: string; count: number }[]
  ageGender?: { bucket: string; count: number }[]
  fetchedAt: string
  note?: string
}

async function fbInsight(metric: string, period = 'lifetime'): Promise<any | null> {
  const id = process.env.FACEBOOK_PAGE_ID
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  if (!id || !token) return null
  try {
    const url = `https://graph.facebook.com/v21.0/${id}/insights/${metric}?period=${period}&access_token=${encodeURIComponent(token)}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function topEntries(obj: Record<string, number>, n: number) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n)
}

export async function GET() {
  const fans = await fbInsight('page_fans')
  if (!fans) {
    return NextResponse.json<Insights>({
      ok: false,
      source: 'unavailable',
      fetchedAt: new Date().toISOString(),
      note: 'Facebook Page tokens not configured or insights API unavailable.',
    })
  }
  const totalFans = fans?.data?.[0]?.values?.slice(-1)?.[0]?.value as number | undefined

  const [country, city, gender, ageGender] = await Promise.all([
    fbInsight('page_fans_country'),
    fbInsight('page_fans_city'),
    fbInsight('page_fans_gender_age'),
    fbInsight('page_fans_gender_age'),
  ])

  const out: Insights = { ok: true, source: 'facebook-page-insights', fetchedAt: new Date().toISOString(), totalFans }

  const countryVals = country?.data?.[0]?.values?.slice(-1)?.[0]?.value as Record<string, number> | undefined
  if (countryVals && typeof countryVals === 'object') {
    out.countries = topEntries(countryVals, 8).map(([code, count]) => ({ code, count }))
  }
  const cityVals = city?.data?.[0]?.values?.slice(-1)?.[0]?.value as Record<string, number> | undefined
  if (cityVals && typeof cityVals === 'object') {
    out.cities = topEntries(cityVals, 8).map(([name, count]) => ({ name, count }))
  }
  const ageVals = ageGender?.data?.[0]?.values?.slice(-1)?.[0]?.value as Record<string, number> | undefined
  if (ageVals && typeof ageVals === 'object') {
    out.ageGender = topEntries(ageVals, 12).map(([bucket, count]) => ({ bucket, count }))
    const m = Object.entries(ageVals).filter(([k]) => k.startsWith('M.')).reduce((s, [, v]) => s + v, 0)
    const f = Object.entries(ageVals).filter(([k]) => k.startsWith('F.')).reduce((s, [, v]) => s + v, 0)
    const u = Object.entries(ageVals).filter(([k]) => k.startsWith('U.')).reduce((s, [, v]) => s + v, 0)
    out.gender = [
      { label: 'Male', count: m },
      { label: 'Female', count: f },
      { label: 'Unknown', count: u },
    ].filter((g) => g.count > 0)
  }

  return NextResponse.json(out)
}
